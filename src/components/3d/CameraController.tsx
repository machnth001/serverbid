"use client";

import { useEffect, useRef, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import gsap from "gsap";

interface CameraControllerProps {
  focusSlotPosition: [number, number, number] | null;
  isCinematicFocus: boolean;
  scrollY: number;
  onScrollYChange: (newY: number) => void;
}

export function CameraController({
  focusSlotPosition,
  isCinematicFocus,
  scrollY,
  onScrollYChange,
}: CameraControllerProps) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const currentTargetY = useRef(scrollY);
  const isAnimatingFocus = useRef(false);

  // Wheel listener for vertical scroll navigation through the 42U rack
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      if (isCinematicFocus || isAnimatingFocus.current) return;

      // Sensitivity factor
      const delta = e.deltaY * 0.006;
      // Invert delta: scrolling down moves camera down (decreases Y)
      const nextY = THREE.MathUtils.clamp(
        currentTargetY.current - delta,
        -4.6, // Bottom limit (Slot #12)
        3.8   // Top limit (Slot #01 Master Node with top breathing room)
      );

      currentTargetY.current = nextY;
      onScrollYChange(nextY);
    },
    [isCinematicFocus, onScrollYChange]
  );

  // Attach wheel listener to canvas dom element
  useEffect(() => {
    const dom = gl.domElement;
    dom.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      dom.removeEventListener("wheel", handleWheel);
    };
  }, [gl, handleWheel]);

  // Handle programmatic or cinematic slot focus
  useEffect(() => {
    if (!controlsRef.current) return;

    if (isCinematicFocus && focusSlotPosition) {
      isAnimatingFocus.current = true;
      const targetY = focusSlotPosition[1];
      const targetCameraZ = 5.2;
      const targetCameraY = targetY;

      gsap.to(camera.position, {
        x: 0.8,
        y: targetCameraY,
        z: targetCameraZ,
        duration: 1.2,
        ease: "power3.inOut",
        onComplete: () => {
          isAnimatingFocus.current = false;
        },
      });

      gsap.to(controlsRef.current.target, {
        x: 0,
        y: targetY,
        z: 0,
        duration: 1.2,
        ease: "power3.inOut",
        onUpdate: () => controlsRef.current?.update(),
      });

      currentTargetY.current = targetY;
      onScrollYChange(targetY);
    }
  }, [focusSlotPosition, isCinematicFocus, camera, onScrollYChange]);

  // Smooth lerp camera and target position along Y-axis during wheel scroll
  useFrame(() => {
    if (isCinematicFocus || isAnimatingFocus.current || !controlsRef.current) return;

    // Smoothly interpolate controls target Y
    const currentY = controlsRef.current.target.y;
    const targetY = currentTargetY.current;

    const diff = targetY - currentY;
    if (Math.abs(diff) > 0.001) {
      controlsRef.current.target.y += diff * 0.12;
      camera.position.y += diff * 0.12;
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      enableZoom={true}
      minDistance={4.0}
      maxDistance={15.0}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 1.8}
      minAzimuthAngle={-Math.PI / 2.2}
      maxAzimuthAngle={Math.PI / 2.2}
      target={[0, scrollY, 0]}
    />
  );
}
