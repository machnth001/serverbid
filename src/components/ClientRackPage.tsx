"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useRealtimeSlots } from "@/hooks/useRealtimeSlots";
import { useAudio } from "@/hooks/useAudio";
import { Header } from "@/components/ui/Header";
import { ActivityMarquee } from "@/components/ui/ActivityMarquee";
import { SlotInfoPanel } from "@/components/ui/SlotInfoPanel";
import { BidModal } from "@/components/ui/BidModal";
import { BragModal } from "@/components/ui/BragModal";
import { HowItWorksModal } from "@/components/ui/HowItWorksModal";
import { RackScrollNavigator } from "@/components/ui/RackScrollNavigator";
import { Slot, ActivityEvent } from "@/types";

// Dynamic import of 3D Scene with SSR disabled
const ServerRackScene = dynamic(
  () => import("@/components/3d/ServerRackScene"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07070a] z-10">
        <div className="w-16 h-16 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
        <p className="mt-4 font-mono text-xs text-cyan-400 uppercase tracking-widest animate-pulse">
          INITIALIZING 3D DATACENTER ENGINE...
        </p>
      </div>
    ),
  }
);

// Map slot ID to 3D Y coordinate
function getSlotYCoordinate(slotId: number): number {
  if (slotId === 1) return 3.4; // Slot 1 Master Node
  const startY = 2.8;
  const spacing = 0.88;
  return Math.max(-4.6, startY - (slotId - 2) * spacing);
}

interface ClientRackPageProps {
  initialSlots?: Slot[];
  initialActivities?: ActivityEvent[];
}

function MainContent({ initialSlots, initialActivities }: ClientRackPageProps) {
  const searchParams = useSearchParams();
  const { isMuted, toggleSound } = useAudio();

  const {
    slots,
    selectedSlot,
    selectedSlotId,
    setSelectedSlotId,
    activeHotSwap,
    activities,
    totalValuation,
    simulateOutbid,
  } = useRealtimeSlots(initialSlots, initialActivities);

  // Vertical rack scroll state (Initial Y focused on Slot #1 with top space)
  const [scrollY, setScrollY] = useState<number>(3.2);

  // Modals state
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isBragModalOpen, setIsBragModalOpen] = useState(false);
  const [bragSlotId, setBragSlotId] = useState<number>(1);
  const [isInfoPanelVisible, setIsInfoPanelVisible] = useState(true);

  // Check URL params for post-checkout redirection (?payment=success&slot=X)
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const slotParam = searchParams.get("slot");

    if (paymentStatus === "success" && slotParam) {
      const slotNum = parseInt(slotParam, 10);
      if (!isNaN(slotNum)) {
        setBragSlotId(slotNum);
        setIsBragModalOpen(true);
      }
    }
  }, [searchParams]);

  // Jump camera directly to specific slot
  const handleJumpToSlot = useCallback(
    (slotId: number) => {
      setSelectedSlotId(slotId);
      setIsInfoPanelVisible(true);
      const targetY = getSlotYCoordinate(slotId);
      setScrollY(targetY);
    },
    [setSelectedSlotId]
  );

  const handleSlotClick = (slotId: number) => {
    setSelectedSlotId(slotId);
    setIsInfoPanelVisible(true);
  };

  const handleOpenBidForSlot = (slot: Slot) => {
    setSelectedSlotId(slot.id);
    setIsBidModalOpen(true);
  };

  const handleQuickBid = () => {
    setIsBidModalOpen(true);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#07070a] select-none">
      {/* Top Cyberpunk Header (61px high) */}
      <Header
        totalValuation={totalValuation}
        isMuted={isMuted}
        onToggleSound={toggleSound}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onQuickBid={handleQuickBid}
      />

      {/* Realtime Outbid Marquee Ticker (40px high, top: 61px) */}
      <ActivityMarquee
        activities={activities}
        onSelectSlot={handleJumpToSlot}
      />

      {/* 3D Datacenter Viewport (Takes exact space below Header + Marquee) */}
      <div className="absolute top-[101px] left-0 right-0 bottom-0 overflow-hidden">
        <ServerRackScene
          slots={slots}
          selectedSlotId={selectedSlotId}
          activeHotSwap={activeHotSwap}
          scrollY={scrollY}
          onScrollYChange={setScrollY}
          onSlotClick={handleSlotClick}
        />
      </div>

      {/* Left Slot Minimap Elevator */}
      <RackScrollNavigator
        slots={slots}
        selectedSlotId={selectedSlotId}
        scrollY={scrollY}
        onJumpToSlot={handleJumpToSlot}
      />

      {/* Floating Slot Info HUD Panel */}
      {isInfoPanelVisible && selectedSlot && (
        <SlotInfoPanel
          slot={selectedSlot}
          onClose={() => setIsInfoPanelVisible(false)}
          onBidClick={handleOpenBidForSlot}
        />
      )}

      {/* Bid / Checkout Modal */}
      <BidModal
        slot={selectedSlot}
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
      />

      {/* Post-Checkout Viral Brag Modal */}
      <BragModal
        slotId={bragSlotId}
        isOpen={isBragModalOpen}
        onClose={() => setIsBragModalOpen(false)}
      />

      {/* Rules and Game Mechanics Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </main>
  );
}

export function ClientRackPage(props: ClientRackPageProps) {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex items-center justify-center bg-[#07070a]">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
        </div>
      }
    >
      <MainContent {...props} />
    </Suspense>
  );
}
