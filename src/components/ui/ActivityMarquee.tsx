"use client";

import { ActivityEvent, formatBid, formatSlotId } from "@/types";
import { Radio } from "lucide-react";

interface ActivityMarqueeProps {
  activities: ActivityEvent[];
  onSelectSlot: (slotId: number) => void;
}

export function ActivityMarquee({ activities, onSelectSlot }: ActivityMarqueeProps) {
  const hasRealBids = activities && activities.length > 0;
  const displayItems = hasRealBids ? [...activities, ...activities] : [];

  return (
    <div className="fixed top-[61px] left-0 right-0 z-20 flex items-center h-10 bg-[#0c0d16]/95 border-b border-zinc-800/80 backdrop-blur-md overflow-hidden select-none">
      {/* Live Badge Anchor */}
      <div className="flex items-center gap-2 px-4 h-full bg-[#131422] border-r border-zinc-800 z-10 shrink-0 shadow-lg">
        <Radio className={`w-3.5 h-3.5 ${hasRealBids ? "text-red-500 animate-pulse" : "text-emerald-400 animate-pulse"}`} />
        <span className="font-mono text-[11px] font-bold tracking-wider text-zinc-300 uppercase">
          LIVE FEED
        </span>
      </div>

      {/* Ticker Stream */}
      <div className="flex overflow-hidden w-full mask-gradient">
        {hasRealBids ? (
          <div className="animate-marquee flex items-center gap-8 py-1">
            {displayItems.map((act, index) => {
              const isMaster = act.slot_id === 1;

              return (
                <div
                  key={`${act.id}-${index}`}
                  onClick={() => onSelectSlot(act.slot_id)}
                  className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/40 cursor-pointer transition-all group shrink-0"
                >
                  <span className="text-xs">{isMaster ? "👑" : "🚨"}</span>

                  <span className="font-mono text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                    @{act.bidder_handle.replace(/^@/, "")}
                  </span>

                  <span className="text-xs text-zinc-400">
                    {act.prev_holder ? `outbid @${act.prev_holder}` : "claimed"}
                  </span>

                  <span
                    className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                      isMaster
                        ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                        : "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                    }`}
                  >
                    {formatSlotId(act.slot_id)}
                  </span>

                  <span className="text-xs text-zinc-500 font-mono">for</span>

                  <span
                    className={`font-mono text-xs font-black ${
                      isMaster ? "text-amber-400 glow-gold" : "text-emerald-400 glow-green"
                    }`}
                  >
                    {formatBid(act.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="animate-marquee flex items-center gap-12 py-1">
            {[1, 2].map((loopIdx) => (
              <div key={loopIdx} className="flex items-center gap-10 shrink-0">
                <span className="font-mono text-xs text-emerald-400 flex items-center gap-2 font-bold tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  DATABASE CONNECTED • REAL-TIME FEED ACTIVE
                </span>
                <span className="font-mono text-xs text-zinc-400">
                  ⚡ 12 SLOTS READY FOR AUCTION
                </span>
                <span className="font-mono text-xs text-amber-400 font-bold">
                  👑 MASTER NODE #01 AVAILABLE FROM $10.00
                </span>
                <span className="font-mono text-xs text-cyan-400">
                  🚀 BE THE FIRST FOUNDER TO CLAIM 3D REAL ESTATE
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
