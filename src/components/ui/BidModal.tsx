"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  X,
  Zap,
  AlertCircle,
  Loader2,
  Globe,
  AtSign,
  Image as ImageIcon,
  Sparkles,
  Upload,
  Trash2,
  Link as LinkIcon,
} from "lucide-react";
import { Slot, getMinimumBid, formatBid, formatSlotId } from "@/types";
import { useAudio } from "@/hooks/useAudio";

interface BidModalProps {
  slot: Slot | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BidModal({ slot, isOpen, onClose }: BidModalProps) {
  const { playClick } = useAudio();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const minBid = slot ? getMinimumBid(slot) : 5.0;
  const isMaster = slot?.id === 1;

  const [amount, setAmount] = useState<number>(minBid);
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [useCustomUrl, setUseCustomUrl] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [companyUrl, setCompanyUrl] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync min bid live whenever slot updates or modal opens
  useEffect(() => {
    if (slot && isOpen) {
      setAmount(getMinimumBid(slot));
      setError(null);
    }
  }, [slot, isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setError(null);
    }
  };

  // Process uploaded logo file to data URL
  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (PNG, JPG, SVG, WebP)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoPreview(result);
      setLogoUrl(result);
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setLogoUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slot) return;

    playClick();

    if (!name.trim()) {
      setError("Please enter your startup or company name");
      return;
    }
    if (!handle.trim()) {
      setError("Please enter your X / Twitter handle");
      return;
    }
    if (amount < minBid) {
      setError(`Minimum bid for this slot is ${formatBid(minBid)}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sanitizedHandle = handle.replace(/^@/, "").trim();

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot_id: slot.id,
          amount,
          bidder_info: {
            name: name.trim(),
            handle: sanitizedHandle,
            logo_url: logoUrl.trim(),
            company_url: companyUrl.trim(),
            description: description.trim(),
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkout_url) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      // Redirect to Dodo hosted checkout
      window.location.href = data.checkout_url;
    } catch (err: unknown) {
      console.error(err);
      setError((err as { message?: string }).message || "Payment checkout error. Try again.");
      setLoading(false);
    }
  };

  if (!slot) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in" />
        <Dialog.Content
          className={`fixed left-1/2 top-1/2 z-50 w-[92vw] sm:w-[500px] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-3xl p-6 sm:p-8 shadow-2xl border backdrop-blur-2xl transition-all max-h-[90vh] overflow-y-auto flex flex-col gap-6 ${
            isMaster
              ? "bg-[#100e07]/95 border-amber-500/50 shadow-amber-500/20"
              : "bg-[#080911]/95 border-cyan-500/40 shadow-cyan-500/20"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black shrink-0 ${
                  isMaster
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/40"
                    : "bg-cyan-500 text-black shadow-md shadow-cyan-500/40"
                }`}
              >
                {formatSlotId(slot.id)}
              </span>
              <div>
                <Dialog.Title className="font-black text-white text-lg leading-tight">
                  {isMaster ? "Claim Master Node #01" : `Hot-Swap Blade ${formatSlotId(slot.id)}`}
                </Dialog.Title>
                <Dialog.Description className="font-mono text-xs text-zinc-400 mt-1">
                  {slot.status === "empty"
                    ? "First bidder claims the slot"
                    : `Currently held by @${slot.current_holder?.handle || "anon"}`}
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors shrink-0"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs font-mono flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Bid Amount Section */}
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider font-semibold">
                  Your Bid Valuation (USD)
                </label>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  Minimum: {formatBid(minBid)}
                </span>
              </div>

              <div className="relative flex items-center">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xl font-black text-zinc-400 pointer-events-none select-none">
                  $
                </span>
                <input
                  type="number"
                  step="0.50"
                  min={minBid}
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full pl-11 pr-4 py-3 bg-zinc-900/90 border border-zinc-700/80 rounded-xl text-white font-mono text-xl font-black focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-colors"
                />
              </div>

              {/* Quick Increment Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {[minBid, minBid + 5, minBid + 15, minBid + 50].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setAmount(quick)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                      amount === quick
                        ? "bg-cyan-400 text-black font-bold shadow-md shadow-cyan-400/30"
                        : "bg-zinc-800/90 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    ${quick.toFixed(0)}
                  </button>
                ))}
              </div>
            </div>

            {/* Startup / Founder Info */}
            <div className="flex flex-col gap-4">
              {/* Company Name */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-zinc-300 font-medium">
                  Startup / Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme AI"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900/90 border border-zinc-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-colors"
                />
              </div>

              {/* Twitter Handle */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-zinc-300 font-medium flex items-center gap-1.5">
                  <AtSign className="w-3.5 h-3.5 text-cyan-400" />
                  X (Twitter) Handle *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-zinc-500 text-sm pointer-events-none select-none font-bold">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="yourhandle"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.replace(/^@/, ""))}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900/90 border border-zinc-700/80 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-colors"
                  />
                </div>
              </div>

              {/* Startup Pitch / Description */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-zinc-300 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Startup One-Line Pitch / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next-gen AI agents powering automated engineering pipelines."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={140}
                  className="w-full px-4 py-3 bg-zinc-900/90 border border-zinc-700/80 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-colors"
                />
              </div>

              {/* Logo Drag & Drop / Upload Section */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-zinc-300 font-medium flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                    Startup Logo
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseCustomUrl(!useCustomUrl)}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>{useCustomUrl ? "Use Drag & Drop" : "Paste URL instead"}</span>
                  </button>
                </div>

                {useCustomUrl ? (
                  <input
                    type="url"
                    placeholder="https://.../logo.png"
                    value={logoUrl}
                    onChange={(e) => {
                      setLogoUrl(e.target.value);
                      setLogoPreview(e.target.value);
                    }}
                    className="w-full px-4 py-3 bg-zinc-900/90 border border-zinc-700/80 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-colors"
                  />
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-full p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex items-center justify-center gap-3.5 ${
                      isDragging
                        ? "border-cyan-400 bg-cyan-500/10"
                        : "border-zinc-700/80 bg-zinc-900/60 hover:border-zinc-600 hover:bg-zinc-900/90"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {logoPreview ? (
                      <div className="flex items-center justify-between w-full px-2">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-10 h-10 rounded-lg object-cover border border-zinc-700 bg-zinc-800"
                          />
                          <span className="text-xs font-mono text-zinc-300 font-medium truncate max-w-[200px]">
                            Logo uploaded successfully
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveLogo();
                          }}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Remove logo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 py-1 text-center">
                        <Upload className="w-5 h-5 text-cyan-400" />
                        <p className="text-xs font-mono text-zinc-300 font-medium">
                          Drag & drop logo here, or <span className="text-cyan-400 underline">browse</span>
                        </p>
                        <p className="text-[10px] font-mono text-zinc-500">
                          PNG, JPG, SVG, WebP (Max 2MB)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Website URL */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-zinc-300 font-medium flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://yourstartup.com"
                  value={companyUrl}
                  onChange={(e) => setCompanyUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900/90 border border-zinc-700/80 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-colors"
                />
              </div>
            </div>

            {/* Action CTA Button with padding */}
            <div className="pt-3 pb-1">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-2xl font-mono text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 text-black transition-all shadow-xl active:scale-[0.98] ${
                  isMaster
                    ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:brightness-110 shadow-amber-500/25"
                    : "bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300 hover:brightness-110 shadow-cyan-500/25"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>INITIALIZING DODO CHECKOUT...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>PAY {formatBid(amount)} & HOT-SWAP BLADE</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
