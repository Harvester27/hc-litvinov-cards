"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

export default function LitvinovThreeScene() {
  return (
    <div style={{ width: "100%", height: 600, borderRadius: 16, overflow: "hidden" }}>
      <Canvas camera={{ position: [8, 8, 8], fov: 45 }} shadows>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 12, 6]} intensity={0.9} castShadow />

        {/* Demo kostka (bude nahrazeno stadionem / domy) */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#0ea5e9" />
        </mesh>

        {/* Podlaha */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="#2c7a58" />
        </mesh>

        <OrbitControls enableDamping />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}


