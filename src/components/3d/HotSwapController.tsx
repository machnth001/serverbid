"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import gsap from "gsap";
import { Slot, HotSwapEvent } from "@/types";
import { SlotBlade } from "./SlotBlade";
import { MasterBlade } from "./MasterBlade";
import { SparkParticles } from "./ParticleEffect";
import { useAudio } from "@/hooks/useAudio";

interface HotSwapControllerProps {
  slots: Slot[];
  selectedSlotId: number | null;
  activeHotSwap: HotSwapEvent | null;
  onSlotClick: (slotId: number) => void;
  onSlotHover?: (slotId: number | null) => void;
  onFocusPositionChange?: (pos: [number, number, number] | null) => void;
}

export function HotSwapController({
  slots,
  selectedSlotId,
  activeHotSwap,
  onSlotClick,
  onSlotHover,
  onFocusPositionChange,
}: HotSwapControllerProps) {
  const { playSlide, playChunk, playAlarm } = useAudio();

  const [ejections, setEjections] = useState<Record<number, number>>({});
  const [sparkSlot, setSparkSlot] = useState<number | null>(null);
  const activeTimeline = useRef<gsap.core.Timeline | null>(null);

  // Play mechanical sliding sound when selecting a server blade
  const prevSelectedRef = useRef<number | null>(selectedSlotId);
  useEffect(() => {
    if (selectedSlotId && selectedSlotId !== prevSelectedRef.current) {
      playSlide();
      prevSelectedRef.current = selectedSlotId;
    }
  }, [selectedSlotId, playSlide]);

  // Compute exact physical 3D positions for all 12 slots inside the 42U rack
  const slotPositions = useMemo(() => {
    const positions: Record<number, [number, number, number]> = {};

    // Slot #1: Master Node 4U is positioned at top
    positions[1] = [0, 4.75, 0];

    // Slots #2 to #12: 2U standard blades spaced downward
    const startY = 3.3;
    const bladeSpacing = 0.88;

    for (let i = 2; i <= 12; i++) {
      const idx = i - 2;
      positions[i] = [0, startY - idx * bladeSpacing, 0];
    }

    return positions;
  }, []);

  // Update focus slot position for CameraController
  useEffect(() => {
    if (activeHotSwap) {
      const pos = slotPositions[activeHotSwap.slot_id];
      onFocusPositionChange?.(pos || null);
    } else if (selectedSlotId) {
      const pos = slotPositions[selectedSlotId];
      onFocusPositionChange?.(pos || null);
    } else {
      onFocusPositionChange?.(null);
    }
  }, [activeHotSwap, selectedSlotId, slotPositions, onFocusPositionChange]);

  // Execute fast, punchy, ultra-smooth Hot-Swap animation sequence
  useEffect(() => {
    if (!activeHotSwap) return;

    const targetSlotId = activeHotSwap.slot_id;
    const tracker = { z: 0 };

    // Kill any previous running timeline to avoid collisions
    if (activeTimeline.current) {
      activeTimeline.current.kill();
    }

    // 1. Play Outbid Alarm sound
    playAlarm();

    // 2. High-speed, ultra-smooth mechanical ejection & insertion timeline (~0.8s total)
    const tl = gsap.timeline({
      onComplete: () => {
        setEjections((prev) => ({ ...prev, [targetSlotId]: 0 }));
        setSparkSlot(null);
      },
    });

    activeTimeline.current = tl;

    // Fast mechanical ejection slide out (+1.8 units)
    tl.to(tracker, {
      z: 1.8,
      duration: 0.22,
      ease: "power2.out",
      onStart: () => {
        playSlide();
      },
      onUpdate: () => {
        setEjections((prev) => ({ ...prev, [targetSlotId]: tracker.z }));
      },
    });

    // Rapid mid-air swap pause
    tl.to({}, { duration: 0.08 });

    // Smooth mechanical insertion back into chassis (0.22s)
    tl.to(tracker, {
      z: 0,
      duration: 0.22,
      ease: "power2.inOut",
      onUpdate: () => {
        setEjections((prev) => ({ ...prev, [targetSlotId]: tracker.z }));
      },
      onComplete: () => {
        // Heavy mechanical locking CHUNK!
        playChunk();
        // Trigger spark burst
        setSparkSlot(targetSlotId);
      },
    });

    // Hold spark burst briefly (0.2s)
    tl.to({}, { duration: 0.2 });

    return () => {
      tl.kill();
    };
  }, [activeHotSwap, playAlarm, playSlide, playChunk]);

  return (
    <group>
      {slots.map((slot) => {
        const pos = slotPositions[slot.id] || [0, 0, 0];
        const isSelected = selectedSlotId === slot.id;
        const isHotSwapping = activeHotSwap?.slot_id === slot.id;
        const baseEjection = ejections[slot.id] || 0;
        // Selected server blade slides out slightly (subtle, clean tactile pop-out ~0.25 units)
        const selectionOffset = isSelected ? 0.25 : 0;
        const totalEjectionZ = baseEjection + selectionOffset;

        if (slot.id === 1) {
          return (
            <MasterBlade
              key={slot.id}
              slot={slot}
              position={pos}
              isSelected={isSelected}
              isHotSwapping={isHotSwapping}
              ejectionZ={totalEjectionZ}
              onClick={onSlotClick}
              onHover={onSlotHover}
            />
          );
        }

        return (
          <SlotBlade
            key={slot.id}
            slot={slot}
            position={pos}
            isSelected={isSelected}
            isHotSwapping={isHotSwapping}
            ejectionZ={totalEjectionZ}
            onClick={onSlotClick}
            onHover={onSlotHover}
          />
        );
      })}

      {/* Spark Particle Burst at the active slot */}
      {sparkSlot && slotPositions[sparkSlot] && (
        <SparkParticles
          active={true}
          position={slotPositions[sparkSlot]}
        />
      )}
    </group>
  );
}
