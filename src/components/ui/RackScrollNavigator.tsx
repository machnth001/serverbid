"use client";

import { Slot, formatSlotId } from "@/types";
import { ChevronUp, ChevronDown, Crown } from "lucide-react";

interface RackScrollNavigatorProps {
  slots: Slot[];
  selectedSlotId: number | null;
  scrollY: number;
  onJumpToSlot: (slotId: number) => void;
}

export function RackScrollNavigator({
  slots,
  selectedSlotId,
  onJumpToSlot,
}: RackScrollNavigatorProps) {
  return (
    <div className="fixed left-4 top-32 z-20 hidden lg:flex flex-col items-center bg-[#0c0d16]/85 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-2 shadow-2xl">
      {/* Jump to Top Button */}
      <button
        onClick={() => onJumpToSlot(1)}
        title="Scroll to Top (Master Node #01)"
        className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors mb-1"
      >
        <ChevronUp className="w-4 h-4" />
      </button>

      {/* 12 Slot Ticks */}
      <div className="flex flex-col gap-1.5 py-1">
        {slots.map((slot) => {
          const isMaster = slot.id === 1;
          const isSelected = selectedSlotId === slot.id;
          const holder = slot.current_holder;

          return (
            <button
              key={slot.id}
              onClick={() => onJumpToSlot(slot.id)}
              title={`Slot ${formatSlotId(slot.id)}: ${holder?.name || "Vacant"} ($${slot.current_bid.toFixed(0)})`}
              className={`group relative flex items-center justify-center w-8 h-7 rounded-md font-mono text-[10px] font-bold transition-all ${
                isSelected
                  ? isMaster
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/50 scale-110"
                    : "bg-cyan-500 text-black shadow-md shadow-cyan-500/50 scale-110"
                  : isMaster
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                  : "bg-zinc-900/90 text-zinc-400 border border-zinc-800 hover:border-cyan-500/40 hover:text-cyan-300"
              }`}
            >
              {isMaster ? <Crown className="w-3.5 h-3.5" /> : formatSlotId(slot.id)}

              {/* Tooltip on hover */}
              <span className="pointer-events-none absolute left-full ml-3.5 px-2.5 py-1 rounded-lg bg-black/90 border border-zinc-700 text-xs font-mono text-white whitespace-nowrap opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all z-30 shadow-xl">
                <span className="font-bold text-cyan-400">
                  {formatSlotId(slot.id)}:
                </span>{" "}
                {holder ? holder.name : "Vacant"} (${slot.current_bid.toFixed(0)})
              </span>
            </button>
          );
        })}
      </div>

      {/* Jump to Bottom Button */}
      <button
        onClick={() => onJumpToSlot(12)}
        title="Scroll to Bottom (Slot #12)"
        className="p-1.5 rounded-lg text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors mt-1"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
}
