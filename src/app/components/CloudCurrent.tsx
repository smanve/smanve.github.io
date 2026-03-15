"use client";

import Matter from "matter-js";
import { useEffect, useRef, useState } from "react";

type Palette = {
  accent: string;
  accentGlow: string;
  accentCore: string;
  secondary: string;
  secondaryGlow: string;
  secondaryCore: string;
  line: string;
  field: string;
};

type FieldBody = {
  body: Matter.Body;
  home: Matter.Vector;
  radius: number;
  fill: string;
  glow: string;
  core: string;
  line: string;
  phase: number;
  drift: number;
};

type Pulse = {
  startedAt: number;
  x: number;
  y: number;
};

const defaultPalette: Palette = {
  accent: "rgba(13, 138, 110, 0.88)",
  accentGlow: "rgba(13, 138, 110, 0.22)",
  accentCore: "rgba(199, 255, 241, 0.9)",
  secondary: "rgba(36, 100, 216, 0.72)",
  secondaryGlow: "rgba(36, 100, 216, 0.18)",
  secondaryCore: "rgba(219, 235, 255, 0.84)",
  line: "rgba(23, 26, 35, 0.12)",
  field: "rgba(13, 138, 110, 0.12)",
};

const TWO_PI = Math.PI * 2;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function toRgba(value: string, alpha: number, fallback: string) {
  const color = value.trim();

  if (!color) {
    return fallback;
  }

  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const normalized =
      hex.length === 3
        ? hex
            .split("")
            .map((part) => part + part)
            .join("")
        : hex;

    if (normalized.length !== 6) {
      return fallback;
    }

    const numeric = Number.parseInt(normalized, 16);
    const r = (numeric >> 16) & 255;
    const g = (numeric >> 8) & 255;
    const b = numeric & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const rgbMatch = color.match(/rgba?\(([^)]+)\)/i);
  if (rgbMatch) {
    const [r = "0", g = "0", b = "0"] = rgbMatch[1]
      .split(",")
      .map((part) => part.trim());

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return fallback;
}

function readPalette(): Palette {
  if (typeof window === "undefined") {
    return defaultPalette;
  }

  const styles = window.getComputedStyle(document.documentElement);
  const accent = styles.getPropertyValue("--accent").trim();
  const secondary = styles.getPropertyValue("--accent-secondary").trim();
  const border = styles.getPropertyValue("--border-strong").trim();

  return {
    accent: toRgba(accent, 0.88, defaultPalette.accent),
    accentGlow: toRgba(accent, 0.22, defaultPalette.accentGlow),
    accentCore: toRgba(accent, 0.9, defaultPalette.accentCore),
    secondary: toRgba(secondary, 0.72, defaultPalette.secondary),
    secondaryGlow: toRgba(secondary, 0.18, defaultPalette.secondaryGlow),
    secondaryCore: toRgba(secondary, 0.84, defaultPalette.secondaryCore),
    line: toRgba(border, 0.15, defaultPalette.line),
    field: toRgba(accent, 0.14, defaultPalette.field),
  };
}

function chooseFill(index: number, palette: Palette) {
  const useAccent = index % 3 !== 1;

  return {
    fill: useAccent ? palette.accent : palette.secondary,
    glow: useAccent ? palette.accentGlow : palette.secondaryGlow,
    core: useAccent ? palette.accentCore : palette.secondaryCore,
    line: palette.line,
  };
}

export default function CloudCurrent() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reduceMotion, setReduceMotion] = useState(true);
  const [themeKey, setThemeKey] = useState(0);

  useEffect(() => {
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncMotion = () => {
      setReduceMotion(motionMedia.matches);
    };

    syncMotion();

    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setThemeKey((current) => current + 1);
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    motionMedia.addEventListener("change", syncMotion);

    return () => {
      observer.disconnect();
      motionMedia.removeEventListener("change", syncMotion);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!container || !canvas || !context) {
      return;
    }

    const hero = container;
    const surface = canvas;
    const ctx = context;

    const engine = Matter.Engine.create({
      gravity: {
        x: 0,
        y: 0,
        scale: 0,
      },
      positionIterations: 8,
      velocityIterations: 7,
      constraintIterations: 2,
    });

    const { Bodies, Body, Composite, Engine, Common } = Matter;
    const world = engine.world;
    const items: FieldBody[] = [];
    const pulses: Pulse[] = [];
    const palette = readPalette();
    let animationFrame = 0;
    let lastFrame = performance.now();
    let width = 0;
    let height = 0;
    let dpr = 1;

    const pointer = {
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      lastMovedAt: 0,
      lastX: 0,
      lastY: 0,
      lastTime: 0,
    };

    function rebuildScene(nextWidth: number, nextHeight: number) {
      Composite.clear(world, false);
      items.length = 0;

      const compact = nextWidth < 900;
      const count = compact ? 15 : 22;
      const boundaryThickness = 180;
      const boundaries = [
        Bodies.rectangle(
          nextWidth / 2,
          -boundaryThickness / 2,
          nextWidth + boundaryThickness * 2,
          boundaryThickness,
          { isStatic: true }
        ),
        Bodies.rectangle(
          nextWidth / 2,
          nextHeight + boundaryThickness / 2,
          nextWidth + boundaryThickness * 2,
          boundaryThickness,
          { isStatic: true }
        ),
        Bodies.rectangle(
          -boundaryThickness / 2,
          nextHeight / 2,
          boundaryThickness,
          nextHeight + boundaryThickness * 2,
          { isStatic: true }
        ),
        Bodies.rectangle(
          nextWidth + boundaryThickness / 2,
          nextHeight / 2,
          boundaryThickness,
          nextHeight + boundaryThickness * 2,
          { isStatic: true }
        ),
      ];

      Composite.add(world, boundaries);

      for (let index = 0; index < count; index += 1) {
        const largeBody = index % 5 === 0;
        const radius = largeBody
          ? Common.random(compact ? 17 : 22, compact ? 24 : 34)
          : Common.random(compact ? 6 : 8, compact ? 12 : 16);
        const x = nextWidth * Common.random(0.45, 0.93);
        const y = nextHeight * Common.random(0.12, 0.88);
        const body = Bodies.circle(x, y, radius, {
          restitution: largeBody ? 0.94 : 0.98,
          friction: 0,
          frictionAir: compact ? 0.03 : 0.024,
          density: largeBody ? 0.0014 : 0.00085,
          slop: 0.08,
        });
        const colors = chooseFill(index, palette);

        Body.setVelocity(body, {
          x: Common.random(-1.4, 1.4),
          y: Common.random(-1.1, 1.1),
        });

        Composite.add(world, body);
        items.push({
          body,
          home: { x, y },
          radius,
          fill: colors.fill,
          glow: colors.glow,
          core: colors.core,
          line: colors.line,
          phase: Common.random(0, TWO_PI),
          drift: Common.random(0.82, 1.28),
        });
      }
    }

    function resize() {
      const bounds = hero.getBoundingClientRect();
      width = Math.max(Math.floor(bounds.width), 1);
      height = Math.max(Math.floor(bounds.height), 1);
      dpr = clamp(window.devicePixelRatio || 1, 1, 1.8);

      surface.width = Math.floor(width * dpr);
      surface.height = Math.floor(height * dpr);
      surface.style.width = `${width}px`;
      surface.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      rebuildScene(width, height);
    }

    function updatePointer(
      clientX: number,
      clientY: number,
      eventTime: number,
      allowPulse: boolean
    ) {
      const bounds = hero.getBoundingClientRect();
      const inside =
        clientX >= bounds.left &&
        clientX <= bounds.right &&
        clientY >= bounds.top &&
        clientY <= bounds.bottom;

      if (!inside) {
        pointer.active = false;
        return;
      }

      const x = clientX - bounds.left;
      const y = clientY - bounds.top;
      const deltaTime = pointer.lastTime ? Math.max(eventTime - pointer.lastTime, 16) : 16;

      pointer.vx = (x - pointer.lastX) / deltaTime;
      pointer.vy = (y - pointer.lastY) / deltaTime;
      pointer.x = x;
      pointer.y = y;
      pointer.lastX = x;
      pointer.lastY = y;
      pointer.lastTime = eventTime;
      pointer.lastMovedAt = eventTime;
      pointer.active = true;

      if (allowPulse) {
        pulses.push({
          startedAt: eventTime,
          x,
          y,
        });
      }
    }

    function handlePointerMove(event: PointerEvent) {
      updatePointer(event.clientX, event.clientY, performance.now(), false);
    }

    function handlePointerDown(event: PointerEvent) {
      updatePointer(event.clientX, event.clientY, performance.now(), true);
    }

    function handlePointerLeave() {
      pointer.active = false;
    }

    function drawFieldGlow(palette: Palette) {
      const gradient = ctx.createRadialGradient(
        width * 0.74,
        height * 0.4,
        0,
        width * 0.74,
        height * 0.4,
        Math.max(width, height) * 0.44
      );

      gradient.addColorStop(0, palette.field);
      gradient.addColorStop(0.42, "rgba(0, 0, 0, 0)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    function drawLinks() {
      for (let sourceIndex = 0; sourceIndex < items.length; sourceIndex += 1) {
        const source = items[sourceIndex];

        for (let targetIndex = sourceIndex + 1; targetIndex < items.length; targetIndex += 1) {
          const target = items[targetIndex];
          const distance = Matter.Vector.magnitude(
            Matter.Vector.sub(source.body.position, target.body.position)
          );

          if (distance > 150) {
            continue;
          }

          const alpha = 0.12 * Math.pow(1 - distance / 150, 1.6);

          ctx.strokeStyle = toRgba(source.line, alpha, source.line);
          ctx.lineWidth = distance < 68 ? 1.2 : 1;
          ctx.beginPath();
          ctx.moveTo(source.body.position.x, source.body.position.y);
          ctx.lineTo(target.body.position.x, target.body.position.y);
          ctx.stroke();
        }
      }
    }

    function drawPulse(now: number) {
      pulses.forEach((pulse) => {
        const age = now - pulse.startedAt;
        const progress = clamp(age / 820, 0, 1);
        const radius = 18 + progress * 180;

        ctx.strokeStyle = `rgba(255, 255, 255, ${0.11 * (1 - progress)})`;
        ctx.lineWidth = 1.4 - progress * 0.8;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, radius, 0, TWO_PI);
        ctx.stroke();
      });
    }

    function drawPointerHalo() {
      if (!pointer.active) {
        return;
      }

      const halo = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 120);
      halo.addColorStop(0, "rgba(255, 255, 255, 0.14)");
      halo.addColorStop(0.3, "rgba(255, 255, 255, 0.08)");
      halo.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 120, 0, TWO_PI);
      ctx.fill();
    }

    function drawBodies() {
      items.forEach((item) => {
        const { x, y } = item.body.position;
        const glowRadius = item.radius * 3.8;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);

        glow.addColorStop(0, item.core);
        glow.addColorStop(0.28, item.glow);
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, TWO_PI);
        ctx.fill();

        ctx.fillStyle = item.fill;
        ctx.beginPath();
        ctx.arc(x, y, item.radius, 0, TWO_PI);
        ctx.fill();

        ctx.strokeStyle = toRgba(item.fill, 0.62, item.fill);
        ctx.lineWidth = 1;
        ctx.stroke();

        const highlight = ctx.createRadialGradient(
          x - item.radius * 0.36,
          y - item.radius * 0.38,
          item.radius * 0.14,
          x,
          y,
          item.radius * 1.08
        );

        highlight.addColorStop(0, item.core);
        highlight.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = highlight;
        ctx.beginPath();
        ctx.arc(x, y, item.radius * 1.02, 0, TWO_PI);
        ctx.fill();
      });
    }

    function applyForces(now: number) {
      const compact = width < 900;
      const pointerFresh = now - pointer.lastMovedAt < 180;

      if (!pointerFresh) {
        pointer.active = false;
      }

      pointer.vx *= 0.92;
      pointer.vy *= 0.92;

      for (let pulseIndex = pulses.length - 1; pulseIndex >= 0; pulseIndex -= 1) {
        if (now - pulses[pulseIndex].startedAt > 820) {
          pulses.splice(pulseIndex, 1);
        }
      }

      items.forEach((item) => {
        const { body, home, drift, phase } = item;
        const homeOffset = Matter.Vector.sub(home, body.position);
        const homeDistance = Math.max(Matter.Vector.magnitude(homeOffset), 1);
        const homeDirection = Matter.Vector.mult(homeOffset, 1 / homeDistance);
        const anchorForce =
          (compact ? 0.000018 : 0.000015) * body.mass +
          homeDistance * 0.00000022 * body.mass;

        Body.applyForce(body, body.position, Matter.Vector.mult(homeDirection, anchorForce));

        Body.applyForce(body, body.position, {
          x: Math.cos(now * 0.00072 + phase) * drift * 0.0000044 * body.mass,
          y: Math.sin(now * 0.00084 + phase * 1.2) * drift * 0.0000037 * body.mass,
        });

        if (pointer.active) {
          const away = Matter.Vector.sub(body.position, {
            x: pointer.x,
            y: pointer.y,
          });
          const distance = Math.max(Matter.Vector.magnitude(away), 1);
          const influence = compact ? 140 : 180;

          if (distance < influence) {
            const falloff = Math.pow(1 - distance / influence, 1.7);
            const awayDirection = Matter.Vector.mult(away, 1 / distance);
            const repulseForce = falloff * (compact ? 0.00044 : 0.00056) * body.mass;
            const swipeForce = falloff * (compact ? 0.00005 : 0.000065) * body.mass;

            Body.applyForce(
              body,
              body.position,
              Matter.Vector.mult(awayDirection, repulseForce)
            );
            Body.applyForce(body, body.position, {
              x: pointer.vx * width * swipeForce,
              y: pointer.vy * height * swipeForce,
            });
          }
        }

        pulses.forEach((pulse) => {
          const age = now - pulse.startedAt;
          const radius = 20 + age * 0.24;
          const outward = Matter.Vector.sub(body.position, {
            x: pulse.x,
            y: pulse.y,
          });
          const distance = Math.max(Matter.Vector.magnitude(outward), 1);
          const shellDistance = Math.abs(distance - radius);

          if (shellDistance > 88) {
            return;
          }

          const shellStrength = Math.pow(1 - shellDistance / 88, 2.2);
          const outwardDirection = Matter.Vector.mult(outward, 1 / distance);

          Body.applyForce(
            body,
            body.position,
            Matter.Vector.mult(outwardDirection, shellStrength * 0.00072 * body.mass)
          );
        });
      });
    }

    function render(now: number) {
      ctx.clearRect(0, 0, width, height);
      drawFieldGlow(palette);
      drawLinks();
      drawPulse(now);
      drawPointerHalo();
      drawBodies();
    }

    function tick(now: number) {
      const delta = Math.min(now - lastFrame, 22);

      lastFrame = now;
      applyForces(now);
      Engine.update(engine, delta);
      render(now);
      animationFrame = window.requestAnimationFrame(tick);
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });

    resize();
    resizeObserver.observe(hero);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);

    animationFrame = window.requestAnimationFrame(tick);

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      Composite.clear(world, false);
      Engine.clear(engine);
    };
  }, [reduceMotion, themeKey]);

  if (reduceMotion) {
    return null;
  }

  return (
    <div ref={containerRef} className="ui-cloud-current" aria-hidden="true">
      <canvas ref={canvasRef} className="ui-cloud-current__surface" />
    </div>
  );
}
