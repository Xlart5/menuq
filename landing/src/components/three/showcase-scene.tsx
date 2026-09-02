"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, Sparkles } from "@react-three/drei";

import { DishPedestal } from "./dish-pedestal";

export default function ShowcaseScene({ emoji }: { emoji: string }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.3, 4.2], fov: 42 }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    >
      <fog attach="fog" args={["#09090b", 6, 12]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 5, 4]} intensity={55} color="#f6c95c" decay={1.6} />
      <pointLight position={[-4, 2, -3]} intensity={25} color="#ffffff" decay={1.8} />
      <group key={emoji}>
        <DishPedestal emoji={emoji} size={2.1} />
      </group>
      <Sparkles
        count={45}
        scale={[4.5, 3.5, 4.5]}
        size={2}
        speed={0.3}
        color="#f6c95c"
        opacity={0.65}
      />
      <ContactShadows
        position={[0, -1.02, 0]}
        opacity={0.5}
        scale={6}
        blur={2.6}
        far={3}
        color="#000000"
      />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.8}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.9}
      />
    </Canvas>
  );
}
