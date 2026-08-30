"use client";
 
import * as Dialog from "@radix-ui/react-dialog";
import { X, Flame, ShieldAlert, Cpu, Share2 } from "lucide-react";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLegal?: (tab: "terms" | "privacy" | "refund" | "contact") => void;
}

export function HowItWorksModal({ isOpen, onClose, onOpenLegal }: HowItWorksModalProps) {
  const handleLegalClick = (tab: "terms" | "privacy" | "refund" | "contact", e: React.MouseEvent) => {
    if (onOpenLegal) {
      e.preventDefault();
      onClose();
      onOpenLegal(tab);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md animate-in fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-3xl p-6 md:p-8 shadow-2xl border border-cyan-500/40 bg-[#090a12]/95 backdrop-blur-2xl max-h-[90vh] overflow-y-auto flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Flame className="w-5 h-5" />
              </span>
              <div>
                <Dialog.Title className="text-xl font-black text-white tracking-tight">
                  GAME MECHANICS & RULES
                </Dialog.Title>
                <Dialog.Description className="font-mono text-xs text-zinc-400 mt-0.5">
                  The Global Tech Server Rack • King of the Hill Engine
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Rules List */}
          <div className="flex flex-col gap-3.5 font-mono text-xs">
            {/* Rule 1: Scarcity */}
            <div className="p-4.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Cpu className="w-4 h-4" />
                <span className="uppercase">1. Finite Real Estate (12 Slots Only)</span>
              </div>
              <p className="text-zinc-300 leading-relaxed font-sans text-xs">
                The datacenter chassis strictly houses <strong>12 physical slots</strong>. There will never be more. Every slot represents permanent live high-visibility advertising for founders and developers.
              </p>
            </div>

            {/* Rule 2: Master Node */}
            <div className="p-4.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <span>👑</span>
                <span className="uppercase">2. Slot #01 (The Master Node)</span>
              </div>
              <p className="text-zinc-300 leading-relaxed font-sans text-xs">
                Slot #1 is the double-height (4U) supercomputer tier with golden neon bezels and high-RPM dual intake fans. Starting bid: <strong>$10.00</strong>, min outbid step: <strong>+$2.00</strong>.
              </p>
            </div>

            {/* Rule 3: Outbid to Steal */}
            <div className="p-4.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <Flame className="w-4 h-4" />
                <span className="uppercase">3. The Outbid-to-Steal Rule</span>
              </div>
              <p className="text-zinc-300 leading-relaxed font-sans text-xs">
                No slot is permanent. Any user can outbid and immediately <strong>&ldquo;Hot-Swap&rdquo;</strong> an active blade in 3D by paying more than the active valuation. All purchases are non-refundable digital advertising.
              </p>
            </div>

            {/* Rule 4: Anti-Snipe */}
            <div className="p-4.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span className="uppercase">4. Anti-Snipe Protection</span>
              </div>
              <p className="text-zinc-300 leading-relaxed font-sans text-xs">
                Bids placed in the final 5 minutes trigger a grace period extension to prevent last-second bot sniping and build intense bidding wars.
              </p>
            </div>

            {/* Rule 5: Viral Loop */}
            <div className="p-4.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Share2 className="w-4 h-4" />
                <span className="uppercase">5. The Viral Social Loop on X</span>
              </div>
              <p className="text-zinc-300 leading-relaxed font-sans text-xs">
                Dynamic OpenGraph cards (<code>/api/og</code>) automatically render your blade in high-res 3D with your logo and valuation ready to be shared with the community.
              </p>
            </div>
          </div>

          {/* Legal and Compliance Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-400">
            <button onClick={(e) => handleLegalClick("terms", e)} className="hover:text-cyan-400 transition-colors underline cursor-pointer">Terms of Service</button>
            <span>•</span>
            <button onClick={(e) => handleLegalClick("privacy", e)} className="hover:text-cyan-400 transition-colors underline cursor-pointer">Privacy Policy</button>
            <span>•</span>
            <button onClick={(e) => handleLegalClick("refund", e)} className="hover:text-cyan-400 transition-colors underline cursor-pointer">Refund Policy</button>
            <span>•</span>
            <button onClick={(e) => handleLegalClick("contact", e)} className="hover:text-cyan-400 transition-colors underline cursor-pointer">Contact & Support</button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 transition-all shadow-xl active:scale-[0.98]"
          >
            I UNDERSTAND • ENTER THE RACK
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
