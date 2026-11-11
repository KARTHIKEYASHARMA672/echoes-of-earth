"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { EarthScene } from "@/components/scenes/EarthScene";
import type { ChapterKey } from "@/lib/chapters";

type SceneCanvasProps = {
  activeKey: ChapterKey;
  progress: number;
  mouse: { x: number; y: number };
};

export function SceneCanvas({ activeKey, progress, mouse }: SceneCanvasProps) {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="false">
      <Canvas
        camera={{ position: [0, 0, 6.8], fov: 48, near: 0.1, far: 100 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.domElement.setAttribute("role", "img");
          gl.domElement.setAttribute(
            "aria-label",
            "Interactive cinematic 3D Earth with atmospheric particles reacting to scroll and pointer movement."
          );
        }}
      >
        <Suspense fallback={null}>
          <EarthScene activeKey={activeKey} progress={progress} mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  );
}
