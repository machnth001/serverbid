import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — bidserver.lol",
  description: "Privacy Policy and Data Protection standards for bidserver.lol",
};

export default function PrivacyPage() {
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
              <Lock className="w-6 h-6" />
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              PRIVACY POLICY
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
              <span className="text-cyan-400">01.</span> Information We Collect
            </h2>
            <p>
              When you purchase or configure an advertising slot on <strong>bidserver.lol</strong>, we collect:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
              <li><strong>Public Advertising Data:</strong> Company / Brand name, website destination URL, Twitter / X handle, and brand logo URL.</li>
              <li><strong>Contact & Transaction Data:</strong> Email address provided during checkout for delivery confirmations and receipt generation.</li>
              <li><strong>Technical Data:</strong> Anonymized usage data, IP address, and browser cookies necessary for web functionality and abuse prevention.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="text-cyan-400">02.</span> Payment Data Security
            </h2>
            <p>
              We do <strong>not</strong> collect, store, or process raw credit card or banking information on our servers. All payment transactions are handled directly by our certified Merchant of Record, <strong>Dodo Payments</strong>, using PCI-DSS compliant 256-bit SSL encryption.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="text-cyan-400">03.</span> How We Use Your Information
            </h2>
            <p>
              The information we collect is strictly used to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
              <li>Render and display your digital advertising blade on the 3D server rack.</li>
              <li>Generate dynamic social sharing cards and OpenGraph previews.</li>
              <li>Send transaction receipts and critical slot status updates.</li>
              <li>Ensure compliance with acceptable use policies and prevent fraud.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="text-cyan-400">04.</span> Data Sharing & Third Parties
            </h2>
            <p>
              We do not sell, rent, or trade your personal data. We only share necessary data with trusted service providers:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
              <li><strong>Dodo Payments:</strong> For secure payment checkout and billing.</li>
              <li><strong>Supabase:</strong> For cloud database hosting and real-time synchronization.</li>
              <li><strong>Vercel:</strong> For cloud hosting and edge network delivery.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="text-cyan-400">05.</span> Your Rights & Inquiries
            </h2>
            <p>
              You have the right to request deletion or modification of your public slot metadata at any time. For any data inquiries, contact us at:
            </p>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono space-y-1">
              <p><strong className="text-white">Email:</strong> support@bidserver.lol</p>
              <p><strong className="text-white">Response Time:</strong> Within 24-48 hours</p>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="pt-8 border-t border-zinc-800 flex flex-wrap gap-4 text-xs font-mono text-zinc-400">
          <Link href="/terms" className="hover:text-cyan-400 transition-colors">TERMS OF SERVICE</Link>
          <span>•</span>
          <Link href="/refund" className="hover:text-cyan-400 transition-colors">REFUND POLICY</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-cyan-400 transition-colors">CONTACT US</Link>
        </div>
      </div>
    </main>
  );
}
