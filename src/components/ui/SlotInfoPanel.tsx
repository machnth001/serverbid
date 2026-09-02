"use client";

import { useState } from "react";
import {
  ExternalLink,
  X,
  ChevronRight,
  TrendingUp,
  Globe,
  AtSign,
  Crown,
  Sparkles,
  Flame,
} from "lucide-react";
import { Slot, formatBid, formatSlotId, getMinimumBid } from "@/types";
import { AntiSnipeTimer } from "./AntiSnipeTimer";

interface SlotInfoPanelProps {
  slot: Slot | null;
  onClose: () => void;
  onBidClick: (slot: Slot) => void;
}

export function SlotInfoPanel({ slot, onClose, onBidClick }: SlotInfoPanelProps) {
  if (!slot) return null;

  const isMaster = slot.id === 1;
  const holder = slot.current_holder;
  const hasHolder = holder && slot.status !== "empty";
  const minBid = getMinimumBid(slot);

  return (
    <aside className="fixed right-3 sm:right-6 md:right-8 top-28 md:top-32 z-20 w-[315px] sm:w-[340px] md:w-[355px] transition-all duration-300">
      <div
        className={`relative rounded-3xl overflow-hidden border backdrop-blur-2xl shadow-2xl p-5 sm:p-6 flex flex-col gap-4 transition-all ${
          isMaster
            ? "bg-[#100e07]/95 border-amber-500/50 shadow-amber-500/15"
            : "bg-[#080911]/95 border-cyan-500/40 shadow-cyan-500/15"
        }`}
      >
        {/* 1. TOP HEADER */}
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <span
              className={`px-2.5 py-1 rounded-xl font-mono text-xs font-black tracking-wider flex items-center gap-1.5 shrink-0 ${
                isMaster
                  ? "bg-amber-500 text-black shadow-md shadow-amber-500/40"
                  : "bg-cyan-500 text-black shadow-md shadow-cyan-500/40"
              }`}
            >
              {isMaster ? <Crown className="w-3.5 h-3.5" /> : null}
              {formatSlotId(slot.id)}
            </span>

            <div className="overflow-hidden">
              <h2
                className={`font-mono text-[11px] sm:text-xs font-black uppercase tracking-wider truncate ${
                  isMaster ? "text-amber-400 glow-gold" : "text-cyan-400 glow-cyan"
                }`}
              >
                {isMaster ? "4U MASTER NODE" : "2U SERVER BLADE"}
              </h2>
              <p className="text-[10px] sm:text-[11px] font-mono text-zinc-400 mt-0.5 truncate">
                {hasHolder ? "Contested Real Estate" : "Vacant Real Estate"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors shrink-0"
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Anti-Snipe Cooldown Banner (Only when active) */}
        {slot.bid_deadline && (
          <div className="w-full">
            <AntiSnipeTimer deadline={slot.bid_deadline} />
          </div>
        )}

        {/* 2. COMPANY DETAILS */}
        <div className="p-4 sm:p-4.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            <span className="flex items-center gap-1.5 text-zinc-300 font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              {hasHolder ? "STATUS" : "STATUS"}
            </span>
            <span className={`flex items-center gap-1 font-bold ${hasHolder ? "text-emerald-400" : "text-zinc-500"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${hasHolder ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`} />
              {hasHolder ? "ONLINE" : "VACANT"}
            </span>
          </div>

          {hasHolder ? (
            <div className="flex flex-col gap-3 pt-0.5">
              {/* Logo + Company Name + Twitter */}
              <div className="flex items-center gap-3">
                {holder.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={holder.logo_url}
                    alt={holder.name}
                    className="w-12 h-12 rounded-xl object-cover border border-zinc-700 bg-zinc-900 shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center font-black text-cyan-400 text-base font-mono shrink-0 shadow-md">
                    {holder.name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div className="overflow-hidden flex flex-col gap-0.5">
                  <h3 className="font-black text-white text-sm sm:text-base leading-tight truncate">
                    {holder.name}
                  </h3>
                  <a
                    href={`https://twitter.com/${holder.handle.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold transition-colors truncate"
                  >
                    <AtSign className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{holder.handle.replace(/^@/, "")}</span>
                  </a>
                </div>
              </div>

              {/* Website Link */}
              {holder.company_url && (
                <a
                  href={holder.company_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800/80 text-[11px] font-mono text-zinc-200 hover:text-cyan-300 transition-colors group"
                >
                  <span className="flex items-center gap-2 truncate">
                    <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{holder.company_url}</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform text-zinc-400 group-hover:text-cyan-300" />
                </a>
              )}
            </div>
          ) : (
            <div className="py-3 px-2 text-center flex flex-col gap-1">
              <p className="font-mono text-xs text-zinc-400">This slot is currently vacant.</p>
              <p className="text-xs font-bold text-cyan-400">
                Be the first to claim real estate!
              </p>
            </div>
          )}
        </div>

        {/* 3. STARTUP DESCRIPTION */}
        <div className="p-4 sm:p-4.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/70 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              STARTUP DESCRIPTION
            </span>
          </div>

          <p className="text-xs text-zinc-300 font-sans leading-relaxed">
            {hasHolder && holder.description
              ? holder.description
              : hasHolder
              ? "Accelerating the tech frontier with high-performance infrastructure and developer tooling."
              : "Claim this finite 3D slot to broadcast your startup pitch directly to the global tech community on X."}
          </p>
        </div>

        {/* 4. VALUATION & NEXT MIN OUTBID (ENLARGED) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 flex flex-col justify-between gap-1">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 truncate">
              Active Valuation
            </span>
            <span
              className={`block font-mono text-lg sm:text-xl font-black truncate ${
                isMaster ? "text-amber-400 glow-gold" : "text-emerald-400 glow-green"
              }`}
            >
              {formatBid(slot.current_bid)}
            </span>
          </div>

          <div
            className={`p-4 rounded-2xl border flex flex-col justify-between gap-1 shadow-lg transition-all ${
              isMaster
                ? "bg-amber-500/10 border-amber-500/50 shadow-amber-500/10"
                : "bg-cyan-500/10 border-cyan-500/50 shadow-cyan-500/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`block text-[11px] font-mono uppercase tracking-wider font-black truncate ${
                  isMaster ? "text-amber-300" : "text-cyan-300"
                }`}
              >
                MIN OUTBID
              </span>
            </div>
            <span
              className={`block font-mono text-xl sm:text-2xl font-black truncate ${
                isMaster ? "text-amber-400 glow-gold" : "text-cyan-400 glow-cyan"
              }`}
            >
              {formatBid(minBid)}
            </span>
          </div>
        </div>

        {/* 5. HOT-SWAP / OUTBID CTA ACTION BUTTON */}
        <button
          onClick={() => onBidClick(slot)}
          className={`w-full py-3.5 sm:py-4 px-4 rounded-2xl font-mono text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 text-black transition-all shadow-xl active:scale-[0.98] ${
            isMaster
              ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:brightness-110 shadow-amber-500/30"
              : "bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300 hover:brightness-110 shadow-cyan-500/30"
          }`}
        >
          <TrendingUp className="w-4 h-4 shrink-0" />
          <span className="truncate">
            {slot.status === "empty"
              ? `CLAIM SERVER FOR ${formatBid(minBid)}`
              : `HOT-SWAP FOR ${formatBid(minBid)}`}
          </span>
          <ChevronRight className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </aside>
  );
}
