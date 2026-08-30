import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileText, Globe, Server } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — bidserver.lol",
  description: "Terms of Service and Conditions for digital advertising on bidserver.lol",
};

export default function TermsPage() {
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
              <FileText className="w-6 h-6" />
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              TERMS OF SERVICE
            </h1>
          </div>
          <p className="font-mono text-xs text-zinc-400">
            Last Updated: August 30, 2026 • Effective Immediately
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm leading-relaxed text-zinc-300 font-sans">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="text-cyan-400">01.</span> Overview & Service Nature
            </h2>
            <p>
              Welcome to <strong>bidserver.lol</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By accessing our website, placing bids, or purchasing slot placements on the 3D server rack, you agree to be bound by these Terms of Service.
            </p>
            <p>
              <strong>bidserver.lol</strong> provides a real-time, interactive 3D digital advertising and sponsorship platform. Users pay to feature their company, brand name, website URL, and logo across 12 finite server blade slots in a competitive, king-of-the-hill bidding format.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="text-cyan-400">02.</span> Instant Digital Fulfillment & Delivery
            </h2>
            <p>
              All products sold on <strong>bidserver.lol</strong> are intangible digital advertising services. Upon successful payment verification via our payment processor (<strong>Dodo Payments</strong>), your server blade slot is <strong>immediately and automatically hot-swapped</strong> live into the 3D rack and database in real-time.
            </p>
            <p>
              No physical goods are shipped. Digital delivery confirmation is displayed on-screen instantly upon checkout completion.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="text-cyan-400">03.</span> King of the Hill & Outbid Mechanics
            </h2>
            <p>
              Purchasing or bidding on a slot grants live advertising presence for that slot. However, because our platform operates on an open outbid model, any third party may subsequently outbid and replace (&ldquo;hot-swap&rdquo;) your blade by paying a higher valuation.
            </p>
            <p>
              Placing a bid does not guarantee indefinite placement. You acknowledge that slot retention is tied to the competitive valuation of your chosen slot.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="text-cyan-400">04.</span> Acceptable Use & Content Guidelines
            </h2>
            <p>
              You agree that any brand name, logo, handle, or link submitted does not contain:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
              <li>Illegal, fraudulent, harassing, defamatory, or hateful content.</li>
              <li>Adult, sexually explicit, or NSFW imagery/text.</li>
              <li>Malware, phishing links, or deceptive URLs.</li>
              <li>Infringement upon third-party trademarks or copyrights.</li>
            </ul>
            <p className="text-zinc-400 text-xs mt-2">
              We reserve the right to remove or moderate any slot content violating these guidelines without prior notice or refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="text-cyan-400">05.</span> Payments & Merchant of Record
            </h2>
            <p>
              Payment processing and Merchant of Record services for <strong>bidserver.lol</strong> are provided by <strong>Dodo Payments</strong>. All transactions are securely encrypted and billed in US Dollars (USD).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="text-cyan-400">06.</span> Contact & Business Information
            </h2>
            <p>
              If you have any questions or legal inquiries regarding these Terms, please contact our support team at:
            </p>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono space-y-1">
              <p><strong className="text-white">Website:</strong> https://bidserver.lol</p>
              <p><strong className="text-white">Email:</strong> support@bidserver.lol</p>
              <p><strong className="text-white">Operating Location:</strong> Western Province, Sri Lanka</p>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="pt-8 border-t border-zinc-800 flex flex-wrap gap-4 text-xs font-mono text-zinc-400">
          <Link href="/privacy" className="hover:text-cyan-400 transition-colors">PRIVACY POLICY</Link>
          <span>•</span>
          <Link href="/refund" className="hover:text-cyan-400 transition-colors">REFUND POLICY</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-cyan-400 transition-colors">CONTACT US</Link>
        </div>
      </div>
    </main>
  );
}
