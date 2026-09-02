"use client";

import { Environment, Float, Lightformer } from "@react-three/drei";

import { DishModel } from "./dish-models";

const gold = "#d4a942";
const goldLight = "#f6c95c";

export function DishPedestal({ id, scale = 1 }: { id: string; scale?: number }) {
  return (
    <group scale={scale}>
      {/* ambiente PBR generado localmente (sin descargas de red) */}
      <Environment resolution={64}>
        <Lightformer
          intensity={2.2}
          position={[0, 4, 3]}
          scale={[8, 4, 1]}
          color="#ffd98a"
          rotation={[0, 0, 0]}
        />
        <Lightformer
          intensity={1.2}
          position={[-4, 2, -2]}
          scale={[6, 3, 1]}
          color="#ffffff"
          rotation={[0, Math.PI / 2, 0]}
        />
        <Lightformer
          intensity={0.8}
          position={[0, -2, 4]}
          scale={[8, 2, 1]}
          color="#2b2b33"
          rotation={[0, 0, 0]}
        />
      </Environment>
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
      <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.55}>
        <group position={[0, 0.42, 0]} rotation={[0.12, 0.4, 0]}>
          <DishModel id={id} />
        </group>
      </Float>
      <mesh position={[0, 0.05, 0]}>
        <pointLight color={goldLight} intensity={14} distance={7} decay={2} />
      </mesh>
    </group>
  );
}
