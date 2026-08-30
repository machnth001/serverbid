"use client";

import { Volume2, VolumeX, HelpCircle, Flame, Share2, Server } from "lucide-react";
import { formatBid } from "@/types";

interface HeaderProps {
  totalValuation: number;
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenHowItWorks: () => void;
  onQuickBid: () => void;
}

export function Header({
  totalValuation,
  isMuted,
  onToggleSound,
  onOpenHowItWorks,
  onQuickBid,
}: HeaderProps) {
  const handleShare = () => {
    const text = encodeURIComponent(
      "The Global Tech Server Rack is live on bidserver.lol! 12 finite slots. King of the hill hot-swap advertising. Try to pull my plug: https://bidserver.lol 🔥🚀"
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 md:px-8 py-3.5 bg-[#07070a]/80 backdrop-blur-xl border-b border-zinc-800/80">
      {/* Brand Identity / Logo */}
      <div className="flex items-center gap-3 select-none">
        <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/25">
          <div className="w-full h-full bg-[#080910] rounded-[10px] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent opacity-50" />
            <Server className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="flex items-center font-mono font-black text-base sm:text-lg md:text-xl tracking-tight leading-none">
              <span className="text-white">bid</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">server</span>
              <span className="text-emerald-400">.lol</span>
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          </div>
          <p className="text-[11px] font-mono text-zinc-400 hidden sm:block mt-0.5">
            12 Finite Slots • Realtime Hot-Swap Advertising
          </p>
        </div>
      </div>

      {/* Center Valuation Gauge */}
      <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/30 shadow-lg shadow-amber-500/5">
        <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
        <div className="flex items-baseline gap-1.5">
          <span className="text-[11px] font-mono font-medium text-zinc-400 uppercase">
            Total Rack Valuation:
          </span>
          <span className="font-mono font-black text-amber-400 text-sm glow-gold">
            {formatBid(totalValuation)}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          title={isMuted ? "Unmute audio" : "Mute audio"}
          className={`p-2.5 rounded-xl border transition-all ${
            isMuted
              ? "bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
              : "bg-cyan-500/20 border-cyan-400 text-cyan-300 hover:bg-cyan-500/30 shadow-md shadow-cyan-500/20"
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* How It Works */}
        <button
          onClick={onOpenHowItWorks}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-bold text-zinc-200 bg-zinc-800/90 hover:bg-zinc-700 hover:text-white border border-zinc-600/80 rounded-xl transition-all shadow-sm"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">RULES</span>
        </button>

        {/* Share on X */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-bold text-zinc-200 bg-zinc-800/90 hover:bg-zinc-700 hover:text-white border border-zinc-600/80 rounded-xl transition-all shadow-sm"
        >
          <Share2 className="w-4 h-4 text-emerald-400" />
          <span className="hidden md:inline">SHARE</span>
        </button>

        {/* Primary Outbid CTA (High-Visibility Neon Button) */}
        <button
          onClick={onQuickBid}
          className="relative group overflow-hidden px-4.5 sm:px-5 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-black text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:brightness-110 hover:shadow-cyan-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-cyan-500/30 border border-cyan-200/50"
        >
          <span className="relative z-10 flex items-center gap-2">
            <span className="text-sm">⚡</span>
            <span>CLAIM A SLOT</span>
          </span>
          <div className="absolute inset-0 bg-white/25 translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
        </button>
      </div>
    </header>
  );
}
