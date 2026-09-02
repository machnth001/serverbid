"use client";

import { useEffect, useState, useRef } from "react";
import { Users, Activity } from "lucide-react";

interface VisitorStats {
  totalVisitors: number;
  activeNow: number;
}

export function VisitorCounter() {
  const [stats, setStats] = useState<VisitorStats>({
    totalVisitors: 0,
    activeNow: 1,
  });
  const [hasRecorded, setHasRecorded] = useState(false);
  const sessionIdRef = useRef<string>("");

  useEffect(() => {
    // Generate or retrieve persistent unique session ID for this browser tab/device
    let sid = "";
    try {
      sid = sessionStorage.getItem("bidserver_sess_id") || "";
      if (!sid) {
        sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        sessionStorage.setItem("bidserver_sess_id", sid);
      }
    } catch {
      sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    }
    sessionIdRef.current = sid;

    // Check if user already counted in this browser session
    const isFirstVisitInSession = !sessionStorage.getItem("bidserver_visit_counted");

    // Record visitor on page load
    fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: sid,
        isNewVisit: isFirstVisitInSession,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.totalVisitors === "number") {
          setStats({
            totalVisitors: data.totalVisitors,
            activeNow: data.activeNow || 1,
          });
          setHasRecorded(true);
          try {
            sessionStorage.setItem("bidserver_visit_counted", "true");
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        // fallback
      });

    // Periodic heartbeat / refresh every 40 seconds
    const interval = setInterval(() => {
      fetch("/api/visitors")
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.totalVisitors === "number") {
            setStats({
              totalVisitors: data.totalVisitors,
              activeNow: data.activeNow || 1,
            });
          }
        })
        .catch(() => {});
    }, 40000);

    return () => clearInterval(interval);
  }, []);

  // Format large numbers with commas
  const formattedTotal = stats.totalVisitors > 0
    ? stats.totalVisitors.toLocaleString()
    : "128+";

  return (
    <div className="fixed bottom-3.5 left-3.5 sm:bottom-4 sm:left-4 z-30 select-none pointer-events-auto">
      <div className="group flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#080911]/90 backdrop-blur-xl border border-zinc-800/90 shadow-xl shadow-black/50 hover:border-cyan-500/40 transition-all duration-200">
        {/* Pulsing Live Traffic Beacon */}
        <div className="relative flex items-center justify-center w-2.5 h-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </div>

        {/* Live Visitor Stats */}
        <div className="flex items-center gap-1.5 font-mono text-[11px] sm:text-xs">
          <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="font-black text-white tracking-wide">
            {formattedTotal}
          </span>
          <span className="text-zinc-400 uppercase text-[10px] sm:text-[11px] font-medium hidden xs:inline">
            VISITORS
          </span>
        </div>

        {/* Active Online Indicator Badge */}
        <div className="hidden sm:flex items-center gap-1 pl-1.5 border-l border-zinc-800 text-[10px] font-mono text-emerald-400">
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span className="font-bold">{stats.activeNow} online</span>
        </div>
      </div>
    </div>
  );
}
