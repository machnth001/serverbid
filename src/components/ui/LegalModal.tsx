"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, FileText, Lock, RefreshCw, Mail, ShieldCheck, MapPin, Clock, AlertCircle } from "lucide-react";

export type LegalTab = "terms" | "privacy" | "refund" | "contact";

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: LegalTab;
  onClose: () => void;
}

export function LegalModal({ isOpen, initialTab = "terms", onClose }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  // Sync initial tab when opened
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md animate-in fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-3xl p-5 sm:p-7 shadow-2xl border border-cyan-500/40 bg-[#090a12]/95 backdrop-blur-2xl max-h-[88vh] flex flex-col gap-5 text-zinc-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 shrink-0">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <Dialog.Title className="text-lg sm:text-xl font-black text-white tracking-tight">
                  LEGAL & COMPLIANCE
                </Dialog.Title>
                <Dialog.Description className="font-mono text-xs text-zinc-400">
                  bidserver.lol • Platform Policies & Terms
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Tab Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs shrink-0">
            <button
              onClick={() => setActiveTab("terms")}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border transition-all ${
                activeTab === "terms"
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20 font-bold"
                  : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>TERMS</span>
            </button>

            <button
              onClick={() => setActiveTab("privacy")}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border transition-all ${
                activeTab === "privacy"
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20 font-bold"
                  : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>PRIVACY</span>
            </button>

            <button
              onClick={() => setActiveTab("refund")}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border transition-all ${
                activeTab === "refund"
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20 font-bold"
                  : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>REFUNDS</span>
            </button>

            <button
              onClick={() => setActiveTab("contact")}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border transition-all ${
                activeTab === "contact"
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20 font-bold"
                  : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>CONTACT</span>
            </button>
          </div>

          {/* Tab Contents (Scrollable Container) */}
          <div className="overflow-y-auto pr-1 text-xs sm:text-sm leading-relaxed text-zinc-300 space-y-4 max-h-[55vh]">
            {/* TERMS TAB */}
            {activeTab === "terms" && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
                  <h3 className="font-mono font-bold text-cyan-400 uppercase text-xs">
                    01. Service Nature & 3D Advertising
                  </h3>
                  <p>
                    <strong>bidserver.lol</strong> provides an interactive 3D digital advertising billboard. Users pay to feature their brand name, logo, and link across 12 finite server blade slots in a king-of-the-hill bidding format.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
                  <h3 className="font-mono font-bold text-cyan-400 uppercase text-xs">
                    02. Instant Digital Fulfillment
                  </h3>
                  <p>
                    All purchases are strictly digital advertising services. Upon successful payment verification via <strong>Dodo Payments</strong>, your slot is instantly and automatically hot-swapped into the 3D server rack. No physical goods are delivered.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
                  <h3 className="font-mono font-bold text-cyan-400 uppercase text-xs">
                    03. Outbid Mechanics (King of the Hill)
                  </h3>
                  <p>
                    Purchasing a slot does not guarantee permanent placement. Any user may subsequently outbid and replace your active blade by paying a higher valuation.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
                  <h3 className="font-mono font-bold text-cyan-400 uppercase text-xs">
                    04. Acceptable Content
                  </h3>
                  <p>
                    Submitted content must not contain adult/NSFW media, fraud, malware, or defamatory material. Violating slots will be moderated without refund.
                  </p>
                </div>
              </div>
            )}

            {/* PRIVACY TAB */}
            {activeTab === "privacy" && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
                  <h3 className="font-mono font-bold text-cyan-400 uppercase text-xs">
                    01. Information Collected
                  </h3>
                  <p>
                    We collect public slot branding (Company Name, URL, Logo URL, X Handle) and checkout email for transaction receipts.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
                  <h3 className="font-mono font-bold text-cyan-400 uppercase text-xs">
                    02. Payment Security
                  </h3>
                  <p>
                    We never store payment card or banking details. All transactions are securely processed by <strong>Dodo Payments</strong> using PCI-DSS compliant 256-bit SSL encryption.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
                  <h3 className="font-mono font-bold text-cyan-400 uppercase text-xs">
                    03. Third-Party Infrastructure
                  </h3>
                  <p>
                    Data is securely handled by trusted providers: Dodo Payments (Payments), Supabase (Database), and Vercel (Hosting). We never sell user data.
                  </p>
                </div>
              </div>
            )}

            {/* REFUND TAB */}
            {activeTab === "refund" && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    All purchases are digital advertising placements rendered immediately on the live server rack.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
                  <h3 className="font-mono font-bold text-cyan-400 uppercase text-xs">
                    01. Non-Refundable Policy
                  </h3>
                  <p>
                    Because slot visibility and social sharing benefits are fulfilled instantly upon payment, all sponsorship and outbid fees are strictly non-refundable once live.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
                  <h3 className="font-mono font-bold text-cyan-400 uppercase text-xs">
                    02. Billing Error Guarantees
                  </h3>
                  <p>
                    If you experience duplicate charges or unresolvable fulfillment technical errors, we will issue a <strong>100% full refund</strong> within 3-5 business days upon contacting support.
                  </p>
                </div>
              </div>
            )}

            {/* CONTACT TAB */}
            {activeTab === "contact" && (
              <div className="space-y-4 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold">
                      <Mail className="w-4 h-4" />
                      <span>SUPPORT EMAIL</span>
                    </div>
                    <a
                      href="mailto:support@bidserver.lol"
                      className="block p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-center font-bold"
                    >
                      support@bidserver.lol
                    </a>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <Clock className="w-4 h-4" />
                      <span>RESPONSE TIME</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-center font-bold">
                      24 - 48 Hours
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-white font-mono font-bold">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>Operational Base</span>
                  </div>
                  <p className="text-zinc-400">
                    Western Province, Sri Lanka • Digital Billing via Dodo Payments (Global MoR)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 transition-all shadow-xl active:scale-[0.98] shrink-0"
          >
            CLOSE
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
