"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, Sparkles } from "@react-three/drei";

import { DishPedestal } from "./dish-pedestal";

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.35, 4.6], fov: 42 }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    >
      <fog attach="fog" args={["#09090b", 6, 12]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 6, 4]} intensity={60} color="#f6c95c" decay={1.6} />
      <pointLight position={[-4, 2, -3]} intensity={30} color="#ffffff" decay={1.8} />
      <DishPedestal id="costillas" />
      <Sparkles count={70} scale={[5, 4, 5]} size={2.4} speed={0.35} color="#f6c95c" opacity={0.7} />
      <ContactShadows position={[0, -1.02, 0]} opacity={0.5} scale={7} blur={2.6} far={3} color="#000000" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.4}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.9}
      />
    </Canvas>
  );
}
