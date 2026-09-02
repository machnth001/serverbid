"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Slot, formatBid, formatSlotId } from "@/types";

interface MasterBladeProps {
  slot: Slot;
  position: [number, number, number];
  isSelected: boolean;
  isHotSwapping: boolean;
  ejectionZ: number;
  onClick: (slotId: number) => void;
  onHover?: (slotId: number | null) => void;
}

export function MasterBlade({
  slot,
  position,
  isSelected,
  isHotSwapping,
  ejectionZ,
  onClick,
  onHover,
}: MasterBladeProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [canvasTexture, setCanvasTexture] = useState<THREE.CanvasTexture | null>(null);

  const fan1Ref = useRef<THREE.Group>(null);
  const fan2Ref = useRef<THREE.Group>(null);

  const bladeWidth = 4.3;
  const bladeHeight = 1.72; // 4U Double-Height Master Unit
  const bladeDepth = 2.8;

  // Generate dynamic 2D canvas texture for Master Node (2048x768)
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 768;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const isMaster = slot.id === 1;
    const holder = slot.current_holder;
    const hasHolder = holder && slot.status !== "empty";

    // Main Columns Y and Height
    const boxY = 110;
    const boxHeight = 440;
    const boxRadius = 20;

    const renderCanvas = (loadedImg?: HTMLImageElement) => {
      // Background gradient (Dark golden obsidian)
      const bgGrad = ctx.createLinearGradient(0, 0, 2048, 768);
      bgGrad.addColorStop(0, "#141006");
      bgGrad.addColorStop(0.5, "#221a08");
      bgGrad.addColorStop(1, "#100c04");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 2048, 768);

      // Glowing Gold Top Banner
      ctx.fillStyle = "rgba(255, 215, 0, 0.16)";
      ctx.fillRect(0, 0, 2048, 85);

      ctx.fillStyle = "#ffd700";
      ctx.font = "900 32px monospace";
      ctx.fillText("👑 APEX MASTER NODE // HIGHEST VALUATION TIER // 4U SUPERCOMPUTER", 50, 55);

      // ---------------------------------------------------------
      // 1. LEFT COLUMN: POSITION #01 BADGE
      // ---------------------------------------------------------
      const badgeX = 45;
      const badgeWidth = 230;

      ctx.fillStyle = "rgba(255, 215, 0, 0.22)";
      ctx.strokeStyle = "#ffd700";
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.roundRect(badgeX, boxY, badgeWidth, boxHeight, boxRadius);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "center";
      const badgeCenterX = badgeX + badgeWidth / 2;

      ctx.fillStyle = "#ffd700";
      ctx.font = "bold 34px monospace";
      ctx.fillText("MASTER", badgeCenterX, 185);

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 120px sans-serif";
      ctx.fillText("#01", badgeCenterX, 345);

      ctx.fillStyle = "#ffd700";
      ctx.font = "bold 26px monospace";
      ctx.fillText("42U APEX", badgeCenterX, 465);

      // ---------------------------------------------------------
      // 2. CENTER COLUMN: REIGNING BRAND WITH LOGO
      // ---------------------------------------------------------
      const brandX = 305;
      const brandWidth = 1160;

      ctx.fillStyle = "rgba(255, 215, 0, 0.1)";
      ctx.strokeStyle = isHotSwapping ? "#ff0055" : "#ffd700";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(brandX, boxY, brandWidth, boxHeight, boxRadius);
      ctx.fill();
      ctx.stroke();

      if (hasHolder) {
        // Master Startup Logo Box
        const logoX = brandX + 45;
        const logoY = boxY + 65;
        const logoSize = 310;
        const logoRadius = 20;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(logoX, logoY, logoSize, logoSize, logoRadius);
        ctx.clip();

        if (loadedImg) {
          ctx.drawImage(loadedImg, logoX, logoY, logoSize, logoSize);
        } else {
          const monoGrad = ctx.createLinearGradient(logoX, logoY, logoX + logoSize, logoY + logoSize);
          monoGrad.addColorStop(0, "#2c230e");
          monoGrad.addColorStop(1, "#151106");
          ctx.fillStyle = monoGrad;
          ctx.fillRect(logoX, logoY, logoSize, logoSize);

          ctx.fillStyle = "#ffd700";
          ctx.font = "900 120px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(
            holder.name.slice(0, 2).toUpperCase(),
            logoX + logoSize / 2,
            logoY + logoSize / 2 + 42
          );
        }
        ctx.restore();

        // Golden Glowing Logo Bezel
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(logoX, logoY, logoSize, logoSize, logoRadius);
        ctx.stroke();

        const textX = logoX + logoSize + 45;
        ctx.textAlign = "left";

        // Verification Pill
        ctx.fillStyle = "rgba(255, 215, 0, 0.25)";
        ctx.beginPath();
        ctx.roundRect(textX, 150, 420, 48, 12);
        ctx.fill();

        ctx.fillStyle = "#ffd700";
        ctx.font = "bold 24px monospace";
        ctx.fillText("👑 REIGNING KING OF THE RACK", textX + 20, 183);

        // Company Name
        ctx.fillStyle = "#f3f4f6";
        ctx.font = "900 78px sans-serif";
        const displayName =
          holder.name.length > 16 ? holder.name.slice(0, 16) + "…" : holder.name;
        ctx.fillText(displayName, textX, 290);

        // Twitter Handle
        ctx.fillStyle = "#ffd700";
        ctx.font = "bold 52px monospace";
        ctx.fillText(`@${holder.handle.replace(/^@/, "")}`, textX, 375);

        // Status Indicator
        ctx.fillStyle = isHotSwapping ? "#ff0055" : "#00ff66";
        ctx.font = "bold 26px monospace";
        ctx.fillText(
          isHotSwapping
            ? "⚡ HOT-SWAP TAKEOVER IN PROGRESS..."
            : "● ONLINE // 100% HEALTH",
          textX,
          455
        );
      } else {
        ctx.textAlign = "left";
        ctx.fillStyle = "#ffd700";
        ctx.font = "900 76px sans-serif";
        ctx.fillText("UNCLAIMED MASTER NODE", brandX + 50, 280);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 40px monospace";
        ctx.fillText("CLICK TO BECOME KING OF THE RACK →", brandX + 50, 380);
      }

      // ---------------------------------------------------------
      // 3. RIGHT COLUMN: VALUATION CONTAINER
      // ---------------------------------------------------------
      const valX = 1495;
      const valWidth = 508;

      ctx.fillStyle = "rgba(0, 0, 0, 0.88)";
      ctx.strokeStyle = "#ffd700";
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.roundRect(valX, boxY, valWidth, boxHeight, boxRadius);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "center";
      const valCenterX = valX + valWidth / 2;

      ctx.fillStyle = "#ffd700";
      ctx.font = "bold 26px monospace";
      ctx.fillText("CURRENT VALUATION", valCenterX, 175);

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 96px sans-serif";
      ctx.fillText(formatBid(slot.current_bid), valCenterX, 295);

      // Prominent Large Min Outbid Pill
      ctx.fillStyle = "rgba(255, 215, 0, 0.2)";
      ctx.strokeStyle = "#ffd700";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(valX + 30, 370, valWidth - 60, 80, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffd700";
      ctx.font = "900 38px monospace";
      ctx.fillText("MIN OUTBID: +$2.00", valCenterX, 424);

      // ---------------------------------------------------------
      // BOTTOM FAN & INTAKE GRILLE
      // ---------------------------------------------------------
      ctx.strokeStyle = "rgba(255, 215, 0, 0.35)";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(45, 575, 1958, 155);

      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255, 215, 0, 0.85)";
      ctx.font = "bold 22px monospace";
      ctx.fillText(
        "DUAL HIGH-RPM TURBO FANS [24,000 RPM] • LIQUID NITROGEN COOLING LOOP ONLINE • 800V DC POWER",
        1024,
        705
      );

      // Clean Outer Gold Glowing Border
      ctx.strokeStyle = "#ffd700";
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, 2040, 760);
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
  }, [slot, isHotSwapping]);

  // Smooth physical slide-out on selection & High-RPM Fan spinning in useFrame
  useFrame((_, delta) => {
    if (meshRef.current) {
      const targetZ =
        position[2] + ejectionZ + (isSelected && !isHotSwapping ? 0.75 : 0);
      meshRef.current.position.z = THREE.MathUtils.damp(
        meshRef.current.position.z,
        targetZ,
        14,
        delta
      );
    }

    if (fan1Ref.current) {
      fan1Ref.current.rotation.z += delta * (isHotSwapping ? 30 : 18);
    }
    if (fan2Ref.current) {
      fan2Ref.current.rotation.z -= delta * (isHotSwapping ? 30 : 18);
    }
  });

  return (
    <group
      ref={meshRef}
      position={[position[0], position[1], position[2]]}
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
      {/* 4U Main Supercomputer Chassis with Gold/Titanium Finish */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[bladeWidth, bladeHeight, bladeDepth]} />
        <meshStandardMaterial
          color={hovered || isSelected ? "#302914" : "#1a160a"}
          metalness={0.95}
          roughness={0.22}
          emissive="#ffd700"
          emissiveIntensity={isSelected ? 0.35 : hovered ? 0.2 : 0.08}
        />
      </mesh>

      {/* Side Slide Rails (Gold Anodized Heavy Duty Runners) */}
      <mesh position={[-bladeWidth / 2 - 0.02, 0, 0]} castShadow>
        <boxGeometry args={[0.04, 0.18, bladeDepth - 0.2]} />
        <meshStandardMaterial color="#ffd700" metalness={0.98} roughness={0.15} />
      </mesh>
      <mesh position={[bladeWidth / 2 + 0.02, 0, 0]} castShadow>
        <boxGeometry args={[0.04, 0.18, bladeDepth - 0.2]} />
        <meshStandardMaterial color="#ffd700" metalness={0.98} roughness={0.15} />
      </mesh>

      {/* Front CanvasTexture Plate */}
      {canvasTexture && (
        <mesh position={[0, 0, bladeDepth / 2 + 0.005]}>
          <planeGeometry args={[bladeWidth - 0.12, bladeHeight - 0.08]} />
          <meshBasicMaterial map={canvasTexture} transparent />
        </mesh>
      )}

      {/* Clean Perimeter Glowing Gold Border Frame (No diagonals/cross) */}
      <mesh position={[0, bladeHeight / 2 + 0.01, bladeDepth / 2 + 0.012]}>
        <boxGeometry args={[bladeWidth + 0.04, 0.03, 0.02]} />
        <meshBasicMaterial color="#ffd700" />
      </mesh>
      <mesh position={[0, -bladeHeight / 2 - 0.01, bladeDepth / 2 + 0.012]}>
        <boxGeometry args={[bladeWidth + 0.04, 0.03, 0.02]} />
        <meshBasicMaterial color="#ffd700" />
      </mesh>
      <mesh position={[-bladeWidth / 2 - 0.01, 0, bladeDepth / 2 + 0.012]}>
        <boxGeometry args={[0.03, bladeHeight + 0.04, 0.02]} />
        <meshBasicMaterial color="#ffd700" />
      </mesh>
      <mesh position={[bladeWidth / 2 + 0.01, 0, bladeDepth / 2 + 0.012]}>
        <boxGeometry args={[0.03, bladeHeight + 0.04, 0.02]} />
        <meshBasicMaterial color="#ffd700" />
      </mesh>

      {/* Dual Heavy-Duty Locking Handles */}
      <mesh position={[-bladeWidth / 2 + 0.08, 0, bladeDepth / 2 + 0.12]}>
        <boxGeometry args={[0.09, bladeHeight * 0.75, 0.2]} />
        <meshStandardMaterial color="#ffd700" metalness={0.98} roughness={0.15} />
      </mesh>
      <mesh position={[bladeWidth / 2 - 0.08, 0, bladeDepth / 2 + 0.12]}>
        <boxGeometry args={[0.09, bladeHeight * 0.75, 0.2]} />
        <meshStandardMaterial color="#ffd700" metalness={0.98} roughness={0.15} />
      </mesh>

      {/* 3D Turbo Intake Fan #1 (Left) */}
      <group position={[-1.3, -bladeHeight / 2 + 0.32, bladeDepth / 2 + 0.02]}>
        <mesh>
          <ringGeometry args={[0.18, 0.22, 32]} />
          <meshBasicMaterial color="#ffd700" />
        </mesh>
        <group ref={fan1Ref}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
              <boxGeometry args={[0.03, 0.36, 0.01]} />
              <meshStandardMaterial color="#2d2d3a" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
        </group>
      </group>

      {/* 3D Turbo Intake Fan #2 (Right) */}
      <group position={[1.3, -bladeHeight / 2 + 0.32, bladeDepth / 2 + 0.02]}>
        <mesh>
          <ringGeometry args={[0.18, 0.22, 32]} />
          <meshBasicMaterial color="#ffd700" />
        </mesh>
        <group ref={fan2Ref}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
              <boxGeometry args={[0.03, 0.36, 0.01]} />
              <meshStandardMaterial color="#2d2d3a" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
