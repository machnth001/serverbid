import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Server-side fallback in-memory cache for fast response and resilience
let memoryVisitorCount = 128;
const activeSessions = new Map<string, number>();

// Clean up stale active sessions every 60 seconds
function cleanActiveSessions() {
  const cutoff = Date.now() - 2 * 60 * 1000; // 2 minutes window
  for (const [id, lastSeen] of activeSessions.entries()) {
    if (lastSeen < cutoff) {
      activeSessions.delete(id);
    }
  }
}

export async function GET() {
  cleanActiveSessions();

  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("site_stats")
      .select("value")
      .eq("key", "total_visitors")
      .maybeSingle();

    if (data && typeof data.value === "number") {
      memoryVisitorCount = Math.max(memoryVisitorCount, data.value);
    }
  } catch {
    // Graceful fallback to memory count
  }

  const activeNow = Math.max(1, activeSessions.size);

  return NextResponse.json({
    totalVisitors: memoryVisitorCount,
    activeNow,
  });
}

export async function POST(req: NextRequest) {
  cleanActiveSessions();

  let body: { sessionId?: string; isNewVisit?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const sessionId =
    body.sessionId ||
    req.headers.get("x-forwarded-for") ||
    req.headers.get("user-agent") ||
    `sess-${Date.now()}`;

  activeSessions.set(sessionId, Date.now());

  const isNewVisit = body.isNewVisit !== false;

  if (isNewVisit) {
    memoryVisitorCount += 1;

    try {
      const admin = createAdminClient();

      // Read current value from DB
      const { data } = await admin
        .from("site_stats")
        .select("value")
        .eq("key", "total_visitors")
        .maybeSingle();

      const nextVal = data ? Number(data.value) + 1 : memoryVisitorCount;
      memoryVisitorCount = nextVal;

      await admin.from("site_stats").upsert({
        key: "total_visitors",
        value: nextVal,
        updated_at: new Date().toISOString(),
      });
    } catch {
      // Graceful fallback to memory storage
    }
  }

  const activeNow = Math.max(1, activeSessions.size);

  return NextResponse.json({
    totalVisitors: memoryVisitorCount,
    activeNow,
    success: true,
  });
}
