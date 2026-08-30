import Link from "next/link";
import { ArrowLeft, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — bidserver.lol",
  description: "Refund and Cancellation Policy for digital advertising on bidserver.lol",
};

export default function RefundPage() {
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
              <RefreshCw className="w-6 h-6" />
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              REFUND & CANCELLATION POLICY
            </h1>
          </div>
          <p className="font-mono text-xs text-zinc-400">
            Last Updated: August 30, 2026 • Effective Immediately
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm leading-relaxed text-zinc-300 font-sans">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p>
              Please read carefully: Because <strong>bidserver.lol</strong> delivers digital advertising placements instantly upon payment, all transactions are subject to the terms below.
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="text-cyan-400">01.</span> Digital Nature of Service & General Policy
            </h2>
            <p>
              All purchases on <strong>bidserver.lol</strong> are for immediate, non-tangible digital advertising visibility on our 3D interactive server rack. Once a payment is completed and your blade is live on the server rack, the service is considered <strong>fully rendered and fulfilled</strong>.
            </p>
            <p>
              Therefore, <strong>all slot purchases, bids, and sponsorship fees are strictly non-refundable</strong> once hot-swapped into the rack.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="text-cyan-400">02.</span> King of the Hill & Outbidding
            </h2>
            <p>
              Our platform operates as an open, competitive king-of-the-hill billboard. If another participant places a higher bid and replaces your blade (&ldquo;Hot-Swap&rdquo;), this is an intended core mechanism of the game and <strong>does not qualify for a refund</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="text-cyan-400">03.</span> Exceptions & Technical Errors
            </h2>
            <p>
              We stand behind our platform and will gladly issue a <strong>100% full refund</strong> in the following verified circumstances:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
              <li><strong>Duplicate Billing:</strong> You were accidentally charged multiple times for the exact same single transaction due to a network glitch.</li>
              <li><strong>Fulfillment Failure:</strong> You completed payment, but an unresolvable server failure permanently prevented your blade from ever appearing on the rack.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="text-cyan-400">04.</span> How to Request a Refund
            </h2>
            <p>
              If you experience a technical billing issue, please email us within <strong>7 days</strong> of the transaction date with:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
              <li>Your checkout email address</li>
              <li>Dodo Payments transaction ID or receipt</li>
              <li>A brief description of the technical issue</li>
            </ul>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono mt-3 space-y-1">
              <p><strong className="text-white">Refund Contact:</strong> support@bidserver.lol</p>
              <p><strong className="text-white">Resolution Window:</strong> 3-5 business days via original payment method</p>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="pt-8 border-t border-zinc-800 flex flex-wrap gap-4 text-xs font-mono text-zinc-400">
          <Link href="/terms" className="hover:text-cyan-400 transition-colors">TERMS OF SERVICE</Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-cyan-400 transition-colors">PRIVACY POLICY</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-cyan-400 transition-colors">CONTACT US</Link>
        </div>
      </div>
    </main>
  );
}
