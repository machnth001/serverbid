"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface SparkParticlesProps {
  active: boolean;
  position: [number, number, number];
}

export function SparkParticles({ active, position }: SparkParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 75;

  const [positions, velocities, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = position[0] + (Math.random() - 0.5) * 4.0;
      pos[i * 3 + 1] = position[1] + (Math.random() - 0.5) * 0.6;
      pos[i * 3 + 2] = position[2] + 1.2;

      vel[i * 3] = (Math.random() - 0.5) * 4;
      vel[i * 3 + 1] = Math.random() * 5 + 1;
      vel[i * 3 + 2] = Math.random() * 3 + 1;

      // Cyan / Gold / Green sparks
      const palette = [
        [0.0, 0.83, 1.0], // cyan
        [1.0, 0.84, 0.0], // gold
        [0.0, 1.0, 0.4],  // green
      ];
      const color = palette[Math.floor(Math.random() * palette.length)];
      cols[i * 3] = color[0];
      cols[i * 3 + 1] = color[1];
      cols[i * 3 + 2] = color[2];
    }
    return [pos, vel, cols];
  }, [position, active]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !active) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      posAttr.array[i * 3] += velocities[i * 3] * delta;
      posAttr.array[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      posAttr.array[i * 3 + 2] += velocities[i * 3 + 2] * delta;

      // Gravity pull
      velocities[i * 3 + 1] -= 9.8 * delta;
    }
    posAttr.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
