"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

interface AntiSnipeTimerProps {
  deadline: string | null;
  onExpire?: () => void;
}

export function AntiSnipeTimer({ deadline, onExpire }: AntiSnipeTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (!deadline) {
      setTimeLeft(null);
      return;
    }

    const checkTime = () => {
      const diff = new Date(deadline).getTime() - Date.now();

      // Only show anti-snipe if countdown is active and within a 10-minute window
      if (diff <= 0 || diff > 10 * 60 * 1000) {
        setTimeLeft(null);
        if (diff <= 0) onExpire?.();
        return;
      }

      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      setTimeLeft(
        `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      );

      setIsUrgent(diff < 120000); // Under 2 minutes
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [deadline, onExpire]);

  if (!timeLeft) return null;

  return (
    <div
      className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border backdrop-blur-md transition-all ${
        isUrgent
          ? "bg-red-950/80 border-red-500 text-red-300 box-glow-red animate-pulse"
          : "bg-amber-950/60 border-amber-500/50 text-amber-300 shadow-md"
      }`}
    >
      <ShieldAlert className={`w-4 h-4 shrink-0 ${isUrgent ? "text-red-400" : "text-amber-400"}`} />
      <div className="flex flex-col">
        <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 leading-none">
          Anti-Snipe Protection Active
        </span>
        <span className="font-mono text-xs font-black tracking-widest leading-tight mt-0.5">
          {timeLeft} GRACE PERIOD COOLDOWN
        </span>
      </div>
    </div>
  );
}
