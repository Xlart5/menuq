"use client";

import { Float } from "@react-three/drei";

import { EmojiSprite } from "./emoji-sprite";

const gold = "#d4a942";
const goldLight = "#f6c95c";

export function DishPedestal({
  emoji,
  size = 2.1,
}: {
  emoji: string;
  size?: number;
}) {
  return (
    <group>
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.95, 1.25, 0.35, 64]} />
        <meshStandardMaterial
          color="#1c1a17"
          metalness={0.85}
          roughness={0.35}
        />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <torusGeometry args={[1.1, 0.045, 16, 80]} />
        <meshStandardMaterial
          color={gold}
          metalness={0.95}
          roughness={0.15}
          emissive={gold}
          emissiveIntensity={0.25}
        />
      </mesh>
      <Float speed={1.6} rotationIntensity={0.55} floatIntensity={0.9}>
        <EmojiSprite emoji={emoji} scale={size} position={[0, 0.95, 0]} />
      </Float>
      <mesh position={[0, 0.05, 0]}>
        <pointLight color={goldLight} intensity={14} distance={7} decay={2} />
      </mesh>
    </group>
  );
}
