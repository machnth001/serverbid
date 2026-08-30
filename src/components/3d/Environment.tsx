"use client";

import { MeshReflectorMaterial } from "@react-three/drei";

export function DatacenterEnvironment() {
  return (
    <group>
      {/* Ambient Lighting for base visibility on all sides */}
      <ambientLight intensity={0.65} color="#181c28" />

      {/* Main Overhead Cool Key Light */}
      <directionalLight
        position={[5, 14, 8]}
        intensity={1.2}
        color="#e0e8f5"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Left Side Rim / Fill Light (Cyan Glow for Left Panel) */}
      <pointLight
        position={[-6, 2, 2]}
        intensity={3.2}
        distance={18}
        color="#00d4ff"
      />

      {/* Right Side Warm Rim / Fill Light (Highlights Right Panel) */}
      <pointLight
        position={[6, 1, 2]}
        intensity={2.8}
        distance={18}
        color="#ffaa00"
      />

      {/* Rear Backlight to separate rack from back wall */}
      <pointLight
        position={[0, 3, -4]}
        intensity={2.0}
        distance={12}
        color="#3b82f6"
      />

      {/* Top Gold Spotlight focused on Master Node #01 */}
      <spotLight
        position={[0, 9, 5]}
        target-position={[0, 4.5, 0]}
        intensity={4.0}
        distance={14}
        angle={0.6}
        penumbra={0.8}
        color="#ffd700"
      />

      {/* Floor with industrial metallic grid and reflections */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -7.0, 0]}
        receiveShadow
      >
        <planeGeometry args={[60, 60]} />
        <MeshReflectorMaterial
          blur={[300, 150]}
          resolution={1024}
          mirror={0.55}
          mixBlur={0.8}
          mixStrength={1.5}
          roughness={0.5}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0f111a"
          metalness={0.85}
        />
      </mesh>

      {/* Floor Yellow Safety Boundary Box around server rack */}
      <group position={[0, -6.98, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Front Line */}
        <mesh position={[0, -2.8, 0]}>
          <planeGeometry args={[6, 0.1]} />
          <meshBasicMaterial color="#ffd700" />
        </mesh>
        {/* Back Line */}
        <mesh position={[0, 2.8, 0]}>
          <planeGeometry args={[6, 0.1]} />
          <meshBasicMaterial color="#ffd700" />
        </mesh>
        {/* Left Line */}
        <mesh position={[-3, 0, 0]}>
          <planeGeometry args={[0.1, 5.6]} />
          <meshBasicMaterial color="#ffd700" />
        </mesh>
        {/* Right Line */}
        <mesh position={[3, 0, 0]}>
          <planeGeometry args={[0.1, 5.6]} />
          <meshBasicMaterial color="#ffd700" />
        </mesh>
      </group>

      {/* Datacenter Back Grid Wall */}
      <mesh position={[0, 0, -9]}>
        <planeGeometry args={[60, 36]} />
        <meshStandardMaterial
          color="#0a0c14"
          roughness={0.85}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}
