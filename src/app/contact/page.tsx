import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Clock, ShieldAlert, MessageSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Support — bidserver.lol",
  description: "Get in touch with the bidserver.lol team for support, partnerships, or billing inquiries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#07070a] text-zinc-200 overflow-y-auto px-4 py-12 md:py-16 selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO SERVER RACK</span>
        </Link>

        {/* Header */}
        <div className="border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Mail className="w-6 h-6" />
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              CONTACT & SUPPORT
            </h1>
          </div>
          <p className="font-mono text-xs text-zinc-400">
            We are here to help with billing inquiries, technical support, and partnership requests.
          </p>
        </div>

        {/* Support Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* Email Support */}
          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Mail className="w-4 h-4" />
                <span className="uppercase">General & Billing Support</span>
              </div>
              <p className="text-zinc-400 font-sans text-xs">
                For questions about your slot, payment verification, or billing issues.
              </p>
            </div>
            <a
              href="mailto:support@bidserver.lol"
              className="px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-center font-bold transition-all"
            >
              support@bidserver.lol
            </a>
          </div>

          {/* Response Window */}
          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Clock className="w-4 h-4" />
                <span className="uppercase">Support Hours & SLA</span>
              </div>
              <p className="text-zinc-400 font-sans text-xs">
                Our support team operates 7 days a week. We strive to answer all tickets promptly.
              </p>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-center font-bold">
              Response Time: 24 - 48 Hours
            </div>
          </div>
        </div>

        {/* Business Location & Compliance */}
        <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-3 font-sans text-xs text-zinc-300">
          <div className="flex items-center gap-2 text-white font-mono font-bold text-sm">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Operational Location</span>
          </div>
          <p className="leading-relaxed">
            <strong>bidserver.lol</strong> is an independent digital project operated from Sri Lanka. Digital payment processing is securely managed by <strong>Dodo Payments</strong> as Merchant of Record globally.
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="pt-8 border-t border-zinc-800 flex flex-wrap gap-4 text-xs font-mono text-zinc-400">
          <Link href="/terms" className="hover:text-cyan-400 transition-colors">TERMS OF SERVICE</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-cyan-400 transition-colors">PRIVACY POLICY</Link>
          <span>•</span>
          <Link href="/refund" className="hover:text-cyan-400 transition-colors">REFUND POLICY</Link>
        </div>
      </div>
    </main>
  );
}
