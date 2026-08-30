"use client";

import { useMemo } from "react";

export function RackChassis() {
  const rackWidth = 4.8; // Expanded width for commanding server presence
  const rackHeight = 12.8;
  const rackDepth = 3.2;

  const railWidth = 0.2;
  const railDepth = 0.24;

  // Compute 42U marking ticks
  const uMarkers = useMemo(() => {
    const markers = [];
    const step = (rackHeight - 1.2) / 42;
    for (let i = 0; i < 42; i++) {
      const y = -rackHeight / 2 + 0.6 + i * step;
      markers.push(y);
    }
    return markers;
  }, [rackHeight]);

  // Compute 12 blade slide-rails along the side interior
  const bladeRails = useMemo(() => {
    const rails = [];
    // Slot 1 at top
    rails.push({ id: 1, y: 4.75, height: 1.6 });
    // Slots 2-12
    const startY = 3.3;
    const spacing = 0.88;
    for (let i = 2; i <= 12; i++) {
      rails.push({ id: i, y: startY - (i - 2) * spacing, height: 0.76 });
    }
    return rails;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* 4 Heavy Steel Structural Posts */}
      {/* Front Left */}
      <mesh position={[-rackWidth / 2 + railWidth / 2, 0, rackDepth / 2 - railDepth / 2]} castShadow receiveShadow>
        <boxGeometry args={[railWidth, rackHeight, railDepth]} />
        <meshStandardMaterial color="#1c1e28" metalness={0.92} roughness={0.25} />
      </mesh>
      {/* Front Right */}
      <mesh position={[rackWidth / 2 - railWidth / 2, 0, rackDepth / 2 - railDepth / 2]} castShadow receiveShadow>
        <boxGeometry args={[railWidth, rackHeight, railDepth]} />
        <meshStandardMaterial color="#1c1e28" metalness={0.92} roughness={0.25} />
      </mesh>
      {/* Back Left */}
      <mesh position={[-rackWidth / 2 + railWidth / 2, 0, -rackDepth / 2 + railDepth / 2]} castShadow receiveShadow>
        <boxGeometry args={[railWidth, rackHeight, railDepth]} />
        <meshStandardMaterial color="#14151e" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* Back Right */}
      <mesh position={[rackWidth / 2 - railWidth / 2, 0, -rackDepth / 2 + railDepth / 2]} castShadow receiveShadow>
        <boxGeometry args={[railWidth, rackHeight, railDepth]} />
        <meshStandardMaterial color="#14151e" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Heavy Steel Top Canopy with Dual Exhaust Fans */}
      <group position={[0, rackHeight / 2 + 0.1, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[rackWidth + 0.25, 0.28, rackDepth + 0.25]} />
          <meshStandardMaterial color="#222534" metalness={0.94} roughness={0.2} />
        </mesh>
        {/* Top Fan Grille 1 */}
        <mesh position={[-1.2, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.6, 32]} />
          <meshBasicMaterial color="#00d4ff" />
        </mesh>
        {/* Top Fan Grille 2 */}
        <mesh position={[1.2, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.6, 32]} />
          <meshBasicMaterial color="#00d4ff" />
        </mesh>
      </group>

      {/* Bottom Heavy Steel Base Footing with Levelling Casters */}
      <group position={[0, -rackHeight / 2 - 0.2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[rackWidth + 0.4, 0.4, rackDepth + 0.4]} />
          <meshStandardMaterial color="#14151e" metalness={0.95} roughness={0.2} />
        </mesh>
        {/* Yellow/Black Warning Hazard Stripes along footing */}
        <mesh position={[0, 0, rackDepth / 2 + 0.21]}>
          <boxGeometry args={[rackWidth + 0.3, 0.08, 0.02]} />
          <meshStandardMaterial color="#ffd700" metalness={0.4} roughness={0.4} />
        </mesh>
      </group>

      {/* LEFT SIDE WALL ASSEMBLY */}
      <group position={[-rackWidth / 2, 0, 0]}>
        {/* Main Solid Outer Steel Side Panel with Beveled Rim */}
        <mesh position={[-0.04, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, rackHeight - 0.15, rackDepth - 0.1]} />
          <meshStandardMaterial color="#181a26" metalness={0.88} roughness={0.35} />
        </mesh>

        {/* Side Panel Inset Accent Sheet (Brushed Metal) */}
        <mesh position={[-0.09, 0, 0]}>
          <boxGeometry args={[0.02, rackHeight - 0.8, rackDepth - 0.6]} />
          <meshStandardMaterial color="#202332" metalness={0.92} roughness={0.2} />
        </mesh>

        {/* Side Hexagonal Ventilation Louver Rows */}
        {[-3.5, -1.2, 1.2, 3.5].map((yOffset, i) => (
          <mesh key={i} position={[-0.105, yOffset, 0]}>
            <boxGeometry args={[0.015, 1.4, rackDepth - 1.0]} />
            <meshStandardMaterial color="#090a10" metalness={0.95} roughness={0.6} wireframe />
          </mesh>
        ))}

        {/* Side Industrial Cable Management Harness (Internal Fiber Trays) */}
        <mesh position={[0.2, 0, 0]}>
          <boxGeometry args={[0.08, rackHeight - 0.6, 0.3]} />
          <meshStandardMaterial color="#0d0e14" metalness={0.8} roughness={0.5} />
        </mesh>

        {/* Vertical Blue/Cyan Fiber Cable Bundle glowing inside */}
        <mesh position={[0.2, 0, 0.1]}>
          <cylinderGeometry args={[0.04, 0.04, rackHeight - 1.0, 16]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* RIGHT SIDE WALL ASSEMBLY */}
      <group position={[rackWidth / 2, 0, 0]}>
        {/* Main Solid Outer Steel Side Panel with Beveled Rim */}
        <mesh position={[0.04, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, rackHeight - 0.15, rackDepth - 0.1]} />
          <meshStandardMaterial color="#181a26" metalness={0.88} roughness={0.35} />
        </mesh>

        {/* Side Panel Inset Accent Sheet (Brushed Metal) */}
        <mesh position={[0.09, 0, 0]}>
          <boxGeometry args={[0.02, rackHeight - 0.8, rackDepth - 0.6]} />
          <meshStandardMaterial color="#202332" metalness={0.92} roughness={0.2} />
        </mesh>

        {/* Side Hexagonal Ventilation Louver Rows */}
        {[-3.5, -1.2, 1.2, 3.5].map((yOffset, i) => (
          <mesh key={i} position={[0.105, yOffset, 0]}>
            <boxGeometry args={[0.015, 1.4, rackDepth - 1.0]} />
            <meshStandardMaterial color="#090a10" metalness={0.95} roughness={0.6} wireframe />
          </mesh>
        ))}

        {/* Side Industrial Cable Management Harness (Internal Fiber Trays) */}
        <mesh position={[-0.2, 0, 0]}>
          <boxGeometry args={[0.08, rackHeight - 0.6, 0.3]} />
          <meshStandardMaterial color="#0d0e14" metalness={0.8} roughness={0.5} />
        </mesh>

        {/* Vertical Orange/Gold Fiber Cable Bundle glowing inside */}
        <mesh position={[-0.2, 0, 0.1]}>
          <cylinderGeometry args={[0.04, 0.04, rackHeight - 1.0, 16]} />
          <meshStandardMaterial color="#ffaa00" emissive="#ff8800" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Internal Telescopic Slide Rails for all 12 Blade Slots */}
      {bladeRails.map((rail) => (
        <group key={rail.id} position={[0, rail.y, 0]}>
          {/* Left Slide Rail Runner (Silver Stainless Steel) */}
          <mesh position={[-rackWidth / 2 + 0.14, 0, 0]}>
            <boxGeometry args={[0.06, 0.08, rackDepth - 0.4]} />
            <meshStandardMaterial color="#c5cad6" metalness={0.96} roughness={0.15} />
          </mesh>
          {/* Right Slide Rail Runner (Silver Stainless Steel) */}
          <mesh position={[rackWidth / 2 - 0.14, 0, 0]}>
            <boxGeometry args={[0.06, 0.08, rackDepth - 0.4]} />
            <meshStandardMaterial color="#c5cad6" metalness={0.96} roughness={0.15} />
          </mesh>
        </group>
      ))}

      {/* Heavy Backplate Enclosure with Cable Pass-throughs */}
      <mesh position={[0, 0, -rackDepth / 2 + 0.05]} castShadow receiveShadow>
        <boxGeometry args={[rackWidth - 0.1, rackHeight - 0.2, 0.08]} />
        <meshStandardMaterial color="#10121a" metalness={0.9} roughness={0.4} />
      </mesh>

      {/* Vertical Cyan Neon Light Strips along front chassis posts */}
      <mesh position={[-rackWidth / 2 + 0.04, 0, rackDepth / 2 + 0.02]}>
        <boxGeometry args={[0.03, rackHeight - 0.4, 0.03]} />
        <meshBasicMaterial color="#00d4ff" />
      </mesh>
      <mesh position={[rackWidth / 2 - 0.04, 0, rackDepth / 2 + 0.02]}>
        <boxGeometry args={[0.03, rackHeight - 0.4, 0.03]} />
        <meshBasicMaterial color="#00d4ff" />
      </mesh>

      {/* Rear Amber Indicator Beacons on Back Corners */}
      <mesh position={[-rackWidth / 2 + 0.04, 0, -rackDepth / 2 - 0.02]}>
        <boxGeometry args={[0.03, rackHeight - 0.4, 0.03]} />
        <meshBasicMaterial color="#ff9900" />
      </mesh>
      <mesh position={[rackWidth / 2 - 0.04, 0, -rackDepth / 2 - 0.02]}>
        <boxGeometry args={[0.03, rackHeight - 0.4, 0.03]} />
        <meshBasicMaterial color="#ff9900" />
      </mesh>

      {/* Top Header Plate "THE GLOBAL SERVER RACK // 42U" */}
      <mesh position={[0, rackHeight / 2 - 0.25, rackDepth / 2 + 0.05]}>
        <boxGeometry args={[rackWidth - 0.4, 0.4, 0.06]} />
        <meshStandardMaterial color="#1c1e2b" metalness={0.95} roughness={0.2} />
      </mesh>

      {/* Rack U-marking indicators along front mounting vertical strips */}
      {uMarkers.map((y, idx) => (
        <group key={idx} position={[0, y, rackDepth / 2 + 0.03]}>
          <mesh position={[-rackWidth / 2 + 0.14, 0, 0]}>
            <boxGeometry args={[0.06, 0.02, 0.015]} />
            <meshStandardMaterial color="#4a4d60" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[rackWidth / 2 - 0.14, 0, 0]}>
            <boxGeometry args={[0.06, 0.02, 0.015]} />
            <meshStandardMaterial color="#4a4d60" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
