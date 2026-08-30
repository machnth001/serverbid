"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { DatacenterEnvironment } from "./Environment";
import { RackChassis } from "./RackChassis";
import { HotSwapController } from "./HotSwapController";
import { CameraController } from "./CameraController";
import { Slot, HotSwapEvent } from "@/types";

interface ServerRackSceneProps {
  slots: Slot[];
  selectedSlotId: number | null;
  activeHotSwap: HotSwapEvent | null;
  scrollY: number;
  onScrollYChange: (newY: number) => void;
  onSlotClick: (slotId: number) => void;
  onSlotHover?: (slotId: number | null) => void;
}

function SceneLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07070a] z-20">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
        <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-cyan-400/30 border-l-transparent animate-spin" />
        <div className="absolute inset-3 rounded-full border-2 border-t-amber-400 border-r-transparent border-b-amber-400/30 border-l-transparent animate-spin [animation-direction:reverse]" />
      </div>
      <p className="mt-6 font-mono text-xs uppercase tracking-widest text-cyan-400 glow-cyan animate-pulse">
        INITIALIZING SERVER RACK INFRASTRUCTURE...
      </p>
    </div>
  );
}

export default function ServerRackScene({
  slots,
  selectedSlotId,
  activeHotSwap,
  scrollY,
  onScrollYChange,
  onSlotClick,
  onSlotHover,
}: ServerRackSceneProps) {
  const [focusSlotPos, setFocusSlotPos] = useState<[number, number, number] | null>(null);

  return (
    <div className="relative w-full h-full select-none">
      <Suspense fallback={<SceneLoader />}>
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 3.2, 8.8], fov: 45 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          className="w-full h-full"
        >
          {/* Datacenter Room & Ground Reflection */}
          <DatacenterEnvironment />

          {/* 42U Matte Black Steel Enclosure with Side Panels & Rails */}
          <RackChassis />

          {/* 12 Server Blades + Hot-Swap Animation Orchestrator */}
          <HotSwapController
            slots={slots}
            selectedSlotId={selectedSlotId}
            activeHotSwap={activeHotSwap}
            onSlotClick={onSlotClick}
            onSlotHover={onSlotHover}
            onFocusPositionChange={setFocusSlotPos}
          />

          {/* Camera Navigator with Smooth Wheel Vertical Rack Scroll */}
          <CameraController
            focusSlotPosition={focusSlotPos}
            isCinematicFocus={!!activeHotSwap}
            scrollY={scrollY}
            onScrollYChange={onScrollYChange}
          />

          {/* Post-Processing Effects (Hyper-Realism & Glow) */}
          <EffectComposer enableNormalPass={false}>
            <Bloom
              luminanceThreshold={0.82}
              luminanceSmoothing={0.4}
              intensity={0.75}
              mipmapBlur
            />
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
            <Vignette eskil={false} offset={0.12} darkness={0.85} />
          </EffectComposer>
        </Canvas>
      </Suspense>
    </div>
  );
}
