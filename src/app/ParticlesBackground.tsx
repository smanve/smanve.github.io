// src/app/ParticlesBackground.tsx
"use client";

import { useCallback } from "react";
import { loadFull } from "tsparticles";
import Particles from "react-particles";
import ParticlesConfig from "particles.json";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  return (
    // Put the canvas behind everything and make it ignore pointer events
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          ...(ParticlesConfig as any),
          // important: we position the canvas ourselves
          fullScreen: { enable: false },
          background: { color: "transparent" },
        }}
      />
    </div>
  );
}
