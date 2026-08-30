"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import confetti from "canvas-confetti";
import {
  X,
  Share2,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { formatSlotId } from "@/types";
import { useAudio } from "@/hooks/useAudio";

interface BragModalProps {
  slotId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function BragModal({ slotId, isOpen, onClose }: BragModalProps) {
  const { playSuccess } = useAudio();
  const [copied, setCopied] = useState(false);

  const formattedSlot = formatSlotId(slotId);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bidserver.lol";

  const tweetText = `Just racked my startup onto Slot ${formattedSlot} of bidserver.lol! 🚀 Try to pull my plug: ${siteUrl}`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}`;

  // Confetti explosion on open
  useEffect(() => {
    if (isOpen) {
      playSuccess();

      // Multi-stage confetti burst
      const end = Date.now() + 2.5 * 1000;
      const colors = ["#00d4ff", "#ffd700", "#00ff66", "#ffffff"];

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen, playSuccess]);

  const handleCopy = () => {
    navigator.clipboard.writeText(tweetText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl animate-in fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-2xl border border-emerald-500/40 bg-[#090b12]/95 backdrop-blur-2xl text-center">
          {/* Close button */}
          <Dialog.Close asChild>
            <button className="absolute right-4 top-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </Dialog.Close>

          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5 shadow-xl shadow-emerald-500/25 mb-4">
            <div className="w-full h-full bg-[#080b12] rounded-[14px] flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-emerald-400 animate-pulse" />
            </div>
          </div>

          <Dialog.Title className="text-2xl font-black text-white tracking-tight">
            BLADE HOT-SWAPPED! ⚡
          </Dialog.Title>

          <Dialog.Description className="font-mono text-xs text-zinc-400 mt-2">
            You are now live on Slot{" "}
            <span className="text-emerald-400 font-bold">{formattedSlot}</span> of
            The Global Server Rack.
          </Dialog.Description>

          {/* Viral Tweet Preview Box */}
          <div className="mt-5 p-4 rounded-xl bg-black/70 border border-zinc-800 text-left font-mono text-xs text-zinc-200 relative">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/80 text-[10px] text-zinc-500">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                VIRAL TWEET INTENT
              </span>
              <span>1-CLICK SHARE</span>
            </div>
            <p className="leading-relaxed text-zinc-300">
              &ldquo;Just racked my startup onto Slot {formattedSlot} of The Global
              Server Rack! 🚀 Try to pull my plug:{" "}
              <span className="text-cyan-400">{siteUrl}</span>&rdquo;
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            {/* Primary Tweet CTA */}
            <a
              href={tweetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-5 rounded-2xl font-mono text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 text-white bg-[#1d9bf0] hover:bg-[#1a8cd8] transition-all shadow-lg shadow-[#1d9bf0]/25 active:scale-[0.98]"
            >
              <Share2 className="w-4 h-4" />
              <span>BRAG ON X (TWITTER) 🚀</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>

            {/* Copy Tweet Text */}
            <button
              onClick={handleCopy}
              className="w-full py-3 px-4 rounded-xl font-mono text-xs text-zinc-300 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">COPIED TO CLIPBOARD!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY TWEET TEXT</span>
                </>
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
