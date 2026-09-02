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
  const { playSlide } = useAudio();

  const [sparkSlot, setSparkSlot] = useState<number | null>(null);

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

  // Execute clean, punchy mechanical sound & focus on live swap
  useEffect(() => {
    if (!activeHotSwap) return;

    const targetSlotId = activeHotSwap.slot_id;
    playSlide();

    // Subtle spark burst highlight at the swapped slot
    setSparkSlot(targetSlotId);
    const timer = setTimeout(() => {
      setSparkSlot(null);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [activeHotSwap, playSlide]);

  return (
    <group>
      {slots.map((slot) => {
        const pos = slotPositions[slot.id] || [0, 0, 0];
        const isSelected = selectedSlotId === slot.id;
        const isHotSwapping = activeHotSwap?.slot_id === slot.id;
        // Subtle tactile protrusion on selection (~0.14 units)
        const totalEjectionZ = isSelected ? 0.14 : 0;

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
