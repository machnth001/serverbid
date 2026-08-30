"use client";

import { useState } from "react";
import { Play, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

interface DemoControlsProps {
  onSimulateOutbid: (slotId: number) => void;
  selectedSlotId: number | null;
}

export function DemoControls({
  onSimulateOutbid,
  selectedSlotId,
}: DemoControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-6 z-30 flex flex-col items-end">
      {isOpen && (
        <div className="mb-2.5 p-4 rounded-2xl bg-[#0e0f18]/95 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl space-y-3 font-mono text-xs w-64 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-[11px] font-bold text-cyan-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              HOT-SWAP SIMULATOR
            </span>
          </div>

          <p className="text-[10px] text-zinc-400 font-sans">
            Test the 3D blade ejection, camera zoom, sound FX, and spark particle lock without a credit card:
          </p>

          <div className="space-y-2">
            <button
              onClick={() => onSimulateOutbid(1)}
              className="w-full py-2 px-3 rounded-lg font-mono text-[11px] font-bold bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 flex items-center justify-between transition-colors"
            >
              <span>👑 Hot-Swap Master #01</span>
              <Play className="w-3 h-3 fill-current" />
            </button>

            <button
              onClick={() => onSimulateOutbid(selectedSlotId && selectedSlotId !== 1 ? selectedSlotId : 4)}
              className="w-full py-2 px-3 rounded-lg font-mono text-[11px] font-bold bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 flex items-center justify-between transition-colors"
            >
              <span>⚡ Hot-Swap Slot #{String(selectedSlotId && selectedSlotId !== 1 ? selectedSlotId : 4).padStart(2, "0")}</span>
              <Play className="w-3 h-3 fill-current" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full font-mono text-xs font-bold bg-zinc-900/90 hover:bg-zinc-800 border border-cyan-500/30 text-cyan-400 backdrop-blur-md shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>SIMULATE HOT-SWAP</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
