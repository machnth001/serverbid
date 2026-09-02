"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Slot, BidHistoryItem, HotSwapEvent, ActivityEvent } from "@/types";

// Empty fallback slots (1-12) used only while loading or if DB is totally fresh
function getEmptySlots(): Slot[] {
  return Array.from({ length: 12 }, (_, i) => {
    const id = i + 1;
    return {
      id,
      tier: id === 1 ? "master" : "blade",
      current_bid: 0,
      current_holder: null,
      bid_deadline: null,
      status: "empty",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });
}

export function useRealtimeSlots(
  initialSlots?: Slot[],
  initialActivities?: ActivityEvent[]
) {
  const [slots, setSlots] = useState<Slot[]>(() => {
    if (initialSlots && initialSlots.length > 0) return initialSlots;
    return getEmptySlots();
  });

  const [activeHotSwap, setActiveHotSwap] = useState<HotSwapEvent | null>(null);
  const [hotSwapQueue, setHotSwapQueue] = useState<HotSwapEvent[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>(() => {
    return initialActivities || [];
  });
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(1);
  const isProcessingQueue = useRef(false);

  // Trigger instant slot swap sequence
  const triggerHotSwap = useCallback(
    (slotId: number, newSlot: Slot, previousHolder = null) => {
      // 1. Immediately update slots state with the new slot data!
      setSlots((prevSlots) => {
        const next = prevSlots.map((s) =>
          s.id === newSlot.id ? newSlot : s
        );
        return next.sort((a, b) => a.id - b.id);
      });

      setSelectedSlotId(slotId);

      const event: HotSwapEvent = {
        slot_id: slotId,
        new_slot: newSlot,
        previous_holder: previousHolder,
      };

      setActiveHotSwap(event);

      // Add to activity ticker
      if (newSlot.current_holder) {
        const newAct: ActivityEvent = {
          id: `act-${Date.now()}-${Math.random()}`,
          slot_id: slotId,
          bidder_name: newSlot.current_holder.name,
          bidder_handle: newSlot.current_holder.handle,
          prev_holder: previousHolder ? (previousHolder as { name: string }).name : undefined,
          amount: newSlot.current_bid,
          created_at: new Date().toISOString(),
        };
        setActivities((prev) => [newAct, ...prev.slice(0, 29)]);
      }

      // Reset active hot swap flag after a brief smooth transition
      setTimeout(() => {
        setActiveHotSwap(null);
      }, 400);
    },
    []
  );

  // Connect to Supabase Realtime & Fetch Initial Data from Database
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl === "your_supabase_project_url") {
      return;
    }

    const supabase = createClient();

    const fetchInitialData = async () => {
      try {
        const { data: slotsData, error: slotsError } = await supabase
          .from("slots")
          .select("*")
          .order("id", { ascending: true });

        if (!slotsError && slotsData && slotsData.length > 0) {
          setSlots(slotsData as Slot[]);
        }

        const { data: histData, error: histError } = await supabase
          .from("bid_history")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(30);

        if (!histError && histData) {
          setActivities(
            histData.map((b) => ({
              id: b.id,
              slot_id: b.slot_id,
              bidder_name: b.bidder_name,
              bidder_handle: b.bidder_handle,
              amount: Number(b.amount) || 0,
              created_at: b.created_at,
            }))
          );
        }
      } catch (err) {
        console.warn("Supabase initial fetch error:", err);
      }
    };

    fetchInitialData();

    // 2. Realtime WebSocket Subscription
    const channel = supabase
      .channel("slots-realtime")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "slots" },
        (payload) => {
          const updatedSlot = payload.new as Slot;
          const oldSlot = payload.old as Slot;

          setSlots((prevSlots) => {
            const next = prevSlots.map((s) =>
              s.id === updatedSlot.id ? updatedSlot : s
            );
            return next.sort((a, b) => a.id - b.id);
          });

          // Trigger hot swap animation for the slot that received the new hot bid
          if (updatedSlot.status === "hot") {
            triggerHotSwap(
              updatedSlot.id,
              updatedSlot,
              oldSlot?.current_holder as null
            );
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bid_history" },
        (payload) => {
          const newBid = payload.new as BidHistoryItem;
          setActivities((prev) => [
            {
              id: newBid.id,
              slot_id: newBid.slot_id,
              bidder_name: newBid.bidder_name,
              bidder_handle: newBid.bidder_handle,
              amount: Number(newBid.amount) || 0,
              created_at: newBid.created_at,
            },
            ...prev.slice(0, 29),
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [triggerHotSwap]);

  const refetchSlots = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: slotsData } = await supabase
        .from("slots")
        .select("*")
        .order("id", { ascending: true });

      if (slotsData && slotsData.length > 0) {
        setSlots(slotsData as Slot[]);
      }
    } catch (e) {
      console.warn("Error refetching slots:", e);
    }
  }, []);

  // Outbid simulation helper for testing (cascades descending across 12 slots)
  const simulateOutbid = useCallback(
    (
      slotId: number,
      customBidder?: {
        name: string;
        handle: string;
        logo_url: string;
        company_url: string;
        description?: string;
      }
    ) => {
      const current = slots.find((s) => s.id === slotId) || slots[0];
      const step = current.tier === "master" ? 25 : 15;
      const newBidAmount = (current.current_bid || 0) + step;

      const randomNames = [
        {
          name: "Supermaven AI",
          handle: "supermaven",
          url: "https://supermaven.com",
          desc: "The fastest generative code completion engine in the world.",
        },
        {
          name: "Cursor IDE",
          handle: "cursor_ai",
          url: "https://cursor.sh",
          desc: "AI-first code editor built for engineers to build software 10x faster.",
        },
        {
          name: "v0.dev",
          handle: "v0",
          url: "https://v0.dev",
          desc: "Generative UI system by Vercel for building React components with AI.",
        },
        {
          name: "Vercel",
          handle: "vercel",
          url: "https://vercel.com",
          desc: "The Frontend Cloud platform empowering developers to build fast web apps.",
        },
        {
          name: "Linear",
          handle: "linear",
          url: "https://linear.app",
          desc: "The purpose-built tool for modern software teams and issue tracking.",
        },
        {
          name: "Supabase",
          handle: "supabase",
          url: "https://supabase.com",
          desc: "The open source Firebase alternative with Postgres and Realtime.",
        },
      ];

      const picked =
        customBidder ||
        randomNames[Math.floor(Math.random() * randomNames.length)];

      const cleanHandle = (h?: string) =>
        (h || "").toLowerCase().replace(/^@/, "").trim();
      const newCleanHandle = cleanHandle(picked.handle);

      const newHolder = {
        name: picked.name,
        handle: newCleanHandle,
        logo_url:
          (picked as { logo_url?: string }).logo_url ||
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
        company_url:
          (picked as { url?: string; company_url?: string }).url ||
          (picked as { company_url?: string }).company_url ||
          "https://x.com",
        description:
          (picked as { desc?: string; description?: string }).desc ||
          (picked as { description?: string }).description ||
          "Accelerating the modern web with real-time intelligence.",
        bid_at: new Date().toISOString(),
      };

      // Collect all active entries (excluding if same company upgrades)
      const activeEntries = slots
        .filter(
          (s) =>
            s.status !== "empty" &&
            s.current_holder &&
            cleanHandle(s.current_holder.handle) !== newCleanHandle
        )
        .map((s) => ({
          holder: s.current_holder!,
          amount: Number(s.current_bid),
          bid_deadline: s.bid_deadline,
          isNew: false,
        }));

      activeEntries.push({
        holder: newHolder,
        amount: newBidAmount,
        bid_deadline: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        isNew: true,
      });

      // Sort strictly in descending order of amount
      activeEntries.sort((a, b) => {
        if (b.amount !== a.amount) return b.amount - a.amount;
        return (
          new Date(b.holder.bid_at || 0).getTime() -
          new Date(a.holder.bid_at || 0).getTime()
        );
      });

      let targetAssignedId = slotId;
      const updatedSlots: Slot[] = [];

      for (let i = 0; i < 12; i++) {
        const id = i + 1;
        const tier: "master" | "blade" = id === 1 ? "master" : "blade";
        const old = slots.find((s) => s.id === id);

        if (i < activeEntries.length && i < 12) {
          const entry = activeEntries[i];
          if (entry.isNew) {
            targetAssignedId = id;
          }
          updatedSlots.push({
            id,
            tier,
            current_bid: entry.amount,
            current_holder: entry.holder,
            status: entry.isNew ? "hot" : "active",
            bid_deadline: entry.bid_deadline,
            created_at: old?.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        } else {
          updatedSlots.push({
            id,
            tier,
            current_bid: 0,
            current_holder: null,
            status: "empty",
            bid_deadline: null,
            created_at: old?.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }

      setSlots(updatedSlots);
      const targetSlot =
        updatedSlots.find((s) => s.id === targetAssignedId) || updatedSlots[0];
      triggerHotSwap(targetAssignedId, targetSlot, current.current_holder as null);
    },
    [slots, triggerHotSwap]
  );

  const selectedSlot = slots.find((s) => s.id === selectedSlotId) || slots[0];
  const totalValuation = slots.reduce((sum, s) => sum + (s.current_bid || 0), 0);

  return {
    slots,
    selectedSlot,
    selectedSlotId,
    setSelectedSlotId,
    activeHotSwap,
    activities,
    totalValuation,
    simulateOutbid,
    triggerHotSwap,
    refetchSlots,
  };
}
