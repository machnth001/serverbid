"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Slot, formatBid, formatSlotId } from "@/types";

interface SlotBladeProps {
  slot: Slot;
  position: [number, number, number];
  isSelected: boolean;
  isHotSwapping: boolean;
  ejectionZ: number;
  onClick: (slotId: number) => void;
  onHover?: (slotId: number | null) => void;
}

export function SlotBlade({
  slot,
  position,
  isSelected,
  isHotSwapping,
  ejectionZ,
  onClick,
  onHover,
}: SlotBladeProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [canvasTexture, setCanvasTexture] = useState<THREE.CanvasTexture | null>(null);

  const bladeWidth = 4.3;
  const bladeHeight = 0.82;
  const bladeDepth = 2.8;

  // Generate dynamic 2D canvas texture with aligned columns & Startup Logo (2048x384)
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 384;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const isMaster = slot.id === 1;
    const holder = slot.current_holder;
    const hasHolder = holder && slot.status !== "empty";

    // Global Y and Height for all 3 columns
    const boxY = 36;
    const boxHeight = 312;
    const boxRadius = 16;

    const renderCanvas = (loadedImg?: HTMLImageElement) => {
      // Background gradient (Dark titanium steel)
      const bgGrad = ctx.createLinearGradient(0, 0, 2048, 0);
      bgGrad.addColorStop(0, "#0a0b12");
      bgGrad.addColorStop(0.5, "#151724");
      bgGrad.addColorStop(1, "#0a0b12");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 2048, 384);

      // Subtle technical grid lines
      ctx.strokeStyle = "rgba(0, 212, 255, 0.06)";
      ctx.lineWidth = 1.5;
      for (let x = 0; x < 2048; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 384);
        ctx.stroke();
      }

      // ---------------------------------------------------------
      // 1. LEFT COLUMN: POSITION / SLOT NUMBER BADGE
      // ---------------------------------------------------------
      const badgeX = 45;
      const badgeWidth = 220;

      ctx.fillStyle = isMaster ? "rgba(255, 215, 0, 0.16)" : "rgba(0, 212, 255, 0.14)";
      ctx.strokeStyle = isMaster ? "#ffd700" : "#00d4ff";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.roundRect(badgeX, boxY, badgeWidth, boxHeight, boxRadius);
      ctx.fill();
      ctx.stroke();

      // Text: SLOT
      ctx.fillStyle = isMaster ? "#ffd700" : "#00d4ff";
      ctx.font = "bold 28px monospace";
      ctx.textAlign = "center";
      ctx.fillText(isMaster ? "MASTER" : "SLOT", badgeX + badgeWidth / 2, 95);

      // Text: #02
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 96px sans-serif";
      ctx.fillText(formatSlotId(slot.id), badgeX + badgeWidth / 2, 220);

      // Text: 2U TIER
      ctx.fillStyle = "#9ca3af";
      ctx.font = "bold 22px monospace";
      ctx.fillText("2U BLADE", badgeX + badgeWidth / 2, 295);

      // ---------------------------------------------------------
      // 2. CENTER COLUMN: BRAND DETAILS WITH STARTUP LOGO
      // ---------------------------------------------------------
      const brandX = 295;
      const brandWidth = 1170;

      ctx.fillStyle = hasHolder
        ? "rgba(0, 212, 255, 0.07)"
        : "rgba(255, 255, 255, 0.02)";
      ctx.strokeStyle = isHotSwapping
        ? "#ff0055"
        : isSelected
        ? "#00d4ff"
        : hasHolder
        ? "rgba(0, 212, 255, 0.45)"
        : "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(brandX, boxY, brandWidth, boxHeight, boxRadius);
      ctx.fill();
      ctx.stroke();

      if (hasHolder) {
        // Logo Container
        const logoX = brandX + 35;
        const logoY = boxY + 46;
        const logoSize = 220;
        const logoRadius = 14;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(logoX, logoY, logoSize, logoSize, logoRadius);
        ctx.clip();

        if (loadedImg) {
          ctx.drawImage(loadedImg, logoX, logoY, logoSize, logoSize);
        } else {
          // Fallback Cyber Monogram Pill
          const monoGrad = ctx.createLinearGradient(logoX, logoY, logoX + logoSize, logoY + logoSize);
          monoGrad.addColorStop(0, "#1a1f33");
          monoGrad.addColorStop(1, "#0d111e");
          ctx.fillStyle = monoGrad;
          ctx.fillRect(logoX, logoY, logoSize, logoSize);

          ctx.fillStyle = "#00d4ff";
          ctx.font = "900 80px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(
            holder.name.slice(0, 2).toUpperCase(),
            logoX + logoSize / 2,
            logoY + logoSize / 2 + 28
          );
        }
        ctx.restore();

        // Logo Cyber Glowing Rim
        ctx.strokeStyle = isHotSwapping ? "#ff0055" : "rgba(0, 212, 255, 0.8)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(logoX, logoY, logoSize, logoSize, logoRadius);
        ctx.stroke();

        // Text positioning next to the logo
        const textX = logoX + logoSize + 40;
        ctx.textAlign = "left";

        // Top Tag
        ctx.fillStyle = isHotSwapping ? "#ff0055" : "#00ff66";
        ctx.font = "bold 24px monospace";
        ctx.fillText(
          isHotSwapping
            ? "● HOT-SWAP TAKEOVER IN PROGRESS..."
            : "● ACTIVE TENANT // 100% HEALTH",
          textX,
          105
        );

        // Company Name
        ctx.fillStyle = "#f3f4f6";
        ctx.font = "900 70px sans-serif";
        const displayName =
          holder.name.length > 18 ? holder.name.slice(0, 18) + "…" : holder.name;
        ctx.fillText(displayName, textX, 195);

        // Twitter Handle
        ctx.fillStyle = "#00d4ff";
        ctx.font = "bold 44px monospace";
        ctx.fillText(`@${holder.handle.replace(/^@/, "")}`, textX, 275);
      } else {
        // Vacant Slot State
        ctx.textAlign = "left";
        ctx.fillStyle = "#6b7280";
        ctx.font = "bold 60px sans-serif";
        ctx.fillText("VACANT BLADE SLOT", brandX + 50, 175);

        ctx.fillStyle = "#00d4ff";
        ctx.font = "bold 34px monospace";
        ctx.fillText("CLICK TO CLAIM REAL ESTATE ON THE RACK →", brandX + 50, 260);
      }

      // ---------------------------------------------------------
      // 3. RIGHT COLUMN: VALUATION CONTAINER
      // ---------------------------------------------------------
      const valX = 1495;
      const valWidth = 508;

      ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
      ctx.strokeStyle = isMaster ? "#ffd700" : "#00ff66";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.roundRect(valX, boxY, valWidth, boxHeight, boxRadius);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "center";
      const valCenterX = valX + valWidth / 2;

      // Valuation Header
      ctx.fillStyle = "#9ca3af";
      ctx.font = "bold 24px monospace";
      ctx.fillText("VALUATION", valCenterX, 95);

      // Valuation Amount
      ctx.fillStyle = isMaster ? "#ffd700" : "#00ff66";
      ctx.font = "900 84px sans-serif";
      ctx.fillText(formatBid(slot.current_bid), valCenterX, 205);

      // Minimum Outbid Step
      ctx.fillStyle = "#9ca3af";
      ctx.font = "24px monospace";
      ctx.fillText("MIN OUTBID: +$1.00", valCenterX, 285);

      // Outer perimeter neon border
      ctx.strokeStyle = isMaster ? "#ffd700" : "rgba(0, 212, 255, 0.4)";
      ctx.lineWidth = 5;
      ctx.strokeRect(3, 3, 2042, 378);
    };

    // Initial render with monogram
    renderCanvas();

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    setCanvasTexture(texture);

    // If holder has a logo image, asynchronously load and repaint
    if (hasHolder && holder.logo_url) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        renderCanvas(img);
        texture.needsUpdate = true;
      };
      img.src = holder.logo_url;
    }

    return () => {
      texture.dispose();
    };
  }, [slot, isHotSwapping, isSelected]);

  // LED blink animation
  const ledRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ledRef.current) return;
    const t = clock.getElapsedTime();
    if (isHotSwapping) {
      const flash = Math.sin(t * 25) > 0 ? 2.5 : 0.2;
      (ledRef.current.material as THREE.MeshBasicMaterial).color.setHex(0xff0055);
      ledRef.current.scale.setScalar(1 + flash * 0.2);
    } else if (slot.status === "hot") {
      const pulse = 0.8 + Math.sin(t * 6) * 0.4;
      (ledRef.current.material as THREE.MeshBasicMaterial).color.setHex(0x00d4ff);
      ledRef.current.scale.setScalar(pulse);
    } else {
      const heartbeat = 0.9 + Math.sin(t * 2) * 0.15;
      (ledRef.current.material as THREE.MeshBasicMaterial).color.setHex(0x00ff66);
      ledRef.current.scale.setScalar(heartbeat);
    }
  });

  const isMaster = slot.id === 1;

  return (
    <group
      ref={meshRef}
      position={[position[0], position[1], position[2] + ejectionZ]}
      onClick={(e) => {
        e.stopPropagation();
        onClick(slot.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover?.(slot.id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover?.(null);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Main Server Blade Body Chassis */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[bladeWidth, bladeHeight, bladeDepth]} />
        <meshStandardMaterial
          color={hovered || isSelected ? "#262b3d" : "#171924"}
          metalness={0.92}
          roughness={0.28}
          emissive={
            isSelected
              ? isMaster
                ? "#ffd700"
                : "#00d4ff"
              : hovered
              ? "#00d4ff"
              : "#000000"
          }
          emissiveIntensity={isSelected ? 0.25 : hovered ? 0.15 : 0}
        />
      </mesh>

      {/* Side Slide Rails on the Blade */}
      <mesh position={[-bladeWidth / 2 - 0.02, 0, 0]} castShadow>
        <boxGeometry args={[0.04, 0.12, bladeDepth - 0.2]} />
        <meshStandardMaterial color="#d0d5e2" metalness={0.98} roughness={0.15} />
      </mesh>
      <mesh position={[bladeWidth / 2 + 0.02, 0, 0]} castShadow>
        <boxGeometry args={[0.04, 0.12, bladeDepth - 0.2]} />
        <meshStandardMaterial color="#d0d5e2" metalness={0.98} roughness={0.15} />
      </mesh>

      {/* Top Cover Ventilation Rows */}
      <mesh position={[0, bladeHeight / 2 + 0.005, 0]}>
        <boxGeometry args={[bladeWidth - 0.4, 0.01, bladeDepth - 0.6]} />
        <meshStandardMaterial color="#0e1017" metalness={0.9} roughness={0.6} wireframe />
      </mesh>

      {/* Front Face Texture Panel */}
      {canvasTexture && (
        <mesh position={[0, 0, bladeDepth / 2 + 0.005]}>
          <planeGeometry args={[bladeWidth - 0.12, bladeHeight - 0.06]} />
          <meshBasicMaterial map={canvasTexture} transparent />
        </mesh>
      )}

      {/* Clean Perimeter Glowing Frame on Active/Selected */}
      {(isSelected || isHotSwapping || slot.status === "hot") && (
        <group position={[0, 0, bladeDepth / 2 + 0.012]}>
          <mesh position={[0, bladeHeight / 2, 0]}>
            <boxGeometry args={[bladeWidth + 0.02, 0.02, 0.01]} />
            <meshBasicMaterial color={isHotSwapping ? "#ff0055" : isMaster ? "#ffd700" : "#00d4ff"} />
          </mesh>
          <mesh position={[0, -bladeHeight / 2, 0]}>
            <boxGeometry args={[bladeWidth + 0.02, 0.02, 0.01]} />
            <meshBasicMaterial color={isHotSwapping ? "#ff0055" : isMaster ? "#ffd700" : "#00d4ff"} />
          </mesh>
          <mesh position={[-bladeWidth / 2, 0, 0]}>
            <boxGeometry args={[0.02, bladeHeight, 0.01]} />
            <meshBasicMaterial color={isHotSwapping ? "#ff0055" : isMaster ? "#ffd700" : "#00d4ff"} />
          </mesh>
          <mesh position={[bladeWidth / 2, 0, 0]}>
            <boxGeometry args={[0.02, bladeHeight, 0.01]} />
            <meshBasicMaterial color={isHotSwapping ? "#ff0055" : isMaster ? "#ffd700" : "#00d4ff"} />
          </mesh>
        </group>
      )}

      {/* Left Handle Bracket */}
      <mesh position={[-bladeWidth / 2 + 0.08, 0, bladeDepth / 2 + 0.1]}>
        <boxGeometry args={[0.08, bladeHeight * 0.75, 0.18]} />
        <meshStandardMaterial color="#606474" metalness={0.95} roughness={0.18} />
      </mesh>

      {/* Right Handle Bracket */}
      <mesh position={[bladeWidth / 2 - 0.08, 0, bladeDepth / 2 + 0.1]}>
        <boxGeometry args={[0.08, bladeHeight * 0.75, 0.18]} />
        <meshStandardMaterial color="#606474" metalness={0.95} roughness={0.18} />
      </mesh>

      {/* Status LED Bulb */}
      <mesh
        ref={ledRef}
        position={[-bladeWidth / 2 + 0.24, bladeHeight / 2 - 0.16, bladeDepth / 2 + 0.03]}
      >
        <sphereGeometry args={[0.038, 16, 16]} />
        <meshBasicMaterial color={isHotSwapping ? "#ff0055" : isMaster ? "#ffd700" : "#00ff66"} />
      </mesh>

      {/* Activity LED */}
      <mesh position={[-bladeWidth / 2 + 0.35, bladeHeight / 2 - 0.16, bladeDepth / 2 + 0.03]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshBasicMaterial color="#00d4ff" />
      </mesh>

      {/* Rear High-Speed Connectors */}
      <mesh position={[0, 0, -bladeDepth / 2 - 0.04]}>
        <boxGeometry args={[bladeWidth * 0.6, bladeHeight * 0.5, 0.08]} />
        <meshStandardMaterial color="#ffaa00" metalness={0.95} roughness={0.2} />
      </mesh>
    </group>
  );
}
