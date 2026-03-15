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
  draggable: boolean;
  impact: number;
};

type Pulse = {
  startedAt: number;
  x: number;
  y: number;
};

type AttractorZone = {
  active: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
};

const defaultPalette: Palette = {
  accent: "rgba(13, 138, 110, 0.9)",
  accentGlow: "rgba(13, 138, 110, 0.24)",
  accentCore: "rgba(205, 255, 244, 0.92)",
  secondary: "rgba(36, 100, 216, 0.74)",
  secondaryGlow: "rgba(36, 100, 216, 0.18)",
  secondaryCore: "rgba(224, 238, 255, 0.86)",
  line: "rgba(23, 26, 35, 0.12)",
  field: "rgba(13, 138, 110, 0.14)",
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
    accent: toRgba(accent, 0.9, defaultPalette.accent),
    accentGlow: toRgba(accent, 0.24, defaultPalette.accentGlow),
    accentCore: toRgba(accent, 0.92, defaultPalette.accentCore),
    secondary: toRgba(secondary, 0.74, defaultPalette.secondary),
    secondaryGlow: toRgba(secondary, 0.18, defaultPalette.secondaryGlow),
    secondaryCore: toRgba(secondary, 0.86, defaultPalette.secondaryCore),
    line: toRgba(border, 0.14, defaultPalette.line),
    field: toRgba(accent, 0.15, defaultPalette.field),
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

function isInteractiveTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    Boolean(
      target.closest("a, button, input, textarea, select, label, summary")
    )
  );
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
    const shell = hero.parentElement;
    const palette = readPalette();

    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0, scale: 0 },
      positionIterations: 7,
      velocityIterations: 6,
      constraintIterations: 2,
    });

    const canDragMedia = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine)"
    );
    const { Bodies, Body, Composite, Engine, Events, Common, Vector } = Matter;
    const world = engine.world;
    const items: FieldBody[] = [];
    const pulses: Pulse[] = [];
    const bodyLookup = new Map<number, FieldBody>();
    let attractorZone: AttractorZone = {
      active: false,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    let animationFrame = 0;
    let lastFrame = performance.now();
    let width = 0;
    let height = 0;
    let dpr = 1;
    let dragTarget: FieldBody | null = null;
    let animationEnabled = true;

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

    const measureAttractor = () => {
      if (!shell) {
        attractorZone = {
          active: false,
          x: width * 0.74,
          y: height * 0.42,
          width: width * 0.26,
          height: height * 0.46,
        };
        return;
      }

      const target = shell.querySelector<HTMLElement>(
        '[data-gravity-attractor="capability-board"]'
      );
      const shellRect = shell.getBoundingClientRect();

      if (!target) {
        attractorZone = {
          active: false,
          x: width * 0.74,
          y: height * 0.42,
          width: width * 0.26,
          height: height * 0.46,
        };
        return;
      }

      const rect = target.getBoundingClientRect();
      attractorZone = {
        active: true,
        x: rect.left - shellRect.left + rect.width / 2,
        y: rect.top - shellRect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
      };
    };

    const addFieldBody = (item: FieldBody) => {
      items.push(item);
      bodyLookup.set(item.body.id, item);
      Composite.add(world, item.body);
    };

    const rebuildScene = () => {
      Composite.clear(world, false);
      bodyLookup.clear();
      items.length = 0;

      const compact = width < 900;
      const bodyCount = compact ? 10 : 15;
      const boundaryThickness = 160;
      const boundaries = [
        Bodies.rectangle(
          width / 2,
          -boundaryThickness / 2,
          width + boundaryThickness * 2,
          boundaryThickness,
          { isStatic: true }
        ),
        Bodies.rectangle(
          width / 2,
          height + boundaryThickness / 2,
          width + boundaryThickness * 2,
          boundaryThickness,
          { isStatic: true }
        ),
        Bodies.rectangle(
          -boundaryThickness / 2,
          height / 2,
          boundaryThickness,
          height + boundaryThickness * 2,
          { isStatic: true }
        ),
        Bodies.rectangle(
          width + boundaryThickness / 2,
          height / 2,
          boundaryThickness,
          height + boundaryThickness * 2,
          { isStatic: true }
        ),
      ];

      Composite.add(world, boundaries);

      for (let index = 0; index < bodyCount; index += 1) {
        const largeBody = index % 4 === 0;
        const radius = largeBody
          ? Common.random(compact ? 18 : 21, compact ? 24 : 30)
          : Common.random(compact ? 5.5 : 7, compact ? 10 : 14);
        const x = width * Common.random(0.44, 0.94);
        const y = height * Common.random(0.14, 0.9);
        const body = Bodies.circle(x, y, radius, {
          restitution: largeBody ? 0.94 : 0.98,
          friction: 0,
          frictionAir: compact ? 0.038 : 0.03,
          density: largeBody ? 0.00125 : 0.00082,
          slop: 0.08,
        });
        const colors = chooseFill(index, palette);

        Body.setVelocity(body, {
          x: Common.random(-1, 1),
          y: Common.random(-0.8, 0.8),
        });

        addFieldBody({
          body,
          home: { x, y },
          radius,
          fill: colors.fill,
          glow: colors.glow,
          core: colors.core,
          line: colors.line,
          phase: Common.random(0, TWO_PI),
          drift: Common.random(0.78, 1.18),
          draggable: largeBody,
          impact: 0,
        });
      }
    };

    const resize = () => {
      const bounds = hero.getBoundingClientRect();
      width = Math.max(Math.floor(bounds.width), 1);
      height = Math.max(Math.floor(bounds.height), 1);
      dpr = clamp(window.devicePixelRatio || 1, 1, 1.35);

      surface.width = Math.floor(width * dpr);
      surface.height = Math.floor(height * dpr);
      surface.style.width = `${width}px`;
      surface.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      measureAttractor();
      rebuildScene();
      render(performance.now());
    };

    const findDraggableTarget = (point: Matter.Vector): FieldBody | null => {
      let match: FieldBody | null = null;
      let nearest = Number.POSITIVE_INFINITY;

      items.forEach((item) => {
        if (!item.draggable) {
          return;
        }

        const distance =
          Matter.Vector.magnitude(Matter.Vector.sub(point, item.body.position)) -
          item.radius;

        if (distance < nearest && distance < 16) {
          nearest = distance;
          match = item;
        }
      });

      return match;
    };

    const updatePointer = (
      clientX: number,
      clientY: number,
      eventTime: number,
      allowPulse: boolean
    ) => {
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
      const deltaTime = pointer.lastTime
        ? Math.max(eventTime - pointer.lastTime, 16)
        : 16;

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
    };

    const handlePointerMove = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY, performance.now(), false);
    };

    const handlePointerDown = (event: PointerEvent) => {
      const interactive = isInteractiveTarget(event.target);
      const now = performance.now();

      updatePointer(event.clientX, event.clientY, now, !interactive);

      if (interactive || !canDragMedia.matches) {
        return;
      }

      const target = findDraggableTarget({ x: pointer.x, y: pointer.y });

      if (!target) {
        return;
      }

      dragTarget = target;
      target.impact = Math.max(target.impact, 0.62);
    };

    const releaseDrag = () => {
      if (!dragTarget) {
        return;
      }

      Body.setVelocity(dragTarget.body, {
        x: clamp(pointer.vx * 16, -3.6, 3.6),
        y: clamp(pointer.vy * 16, -3.3, 3.3),
      });
      dragTarget.impact = Math.max(dragTarget.impact, 0.76);
      dragTarget = null;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      releaseDrag();
    };

    const handleCollisionStart = (event: Matter.IEventCollision<Matter.Engine>) => {
      event.pairs.forEach((pair) => {
        const first = bodyLookup.get(pair.bodyA.id);
        const second = bodyLookup.get(pair.bodyB.id);

        if (first) {
          first.impact = Math.max(first.impact, 0.86);
        }

        if (second) {
          second.impact = Math.max(second.impact, 0.86);
        }
      });
    };

    const drawFieldGlow = () => {
      const originX = attractorZone.active ? attractorZone.x : width * 0.74;
      const originY = attractorZone.active ? attractorZone.y : height * 0.4;
      const gradient = ctx.createRadialGradient(
        originX,
        originY,
        0,
        originX,
        originY,
        Math.max(width, height) * 0.42
      );

      gradient.addColorStop(0, palette.field);
      gradient.addColorStop(0.34, "rgba(0, 0, 0, 0)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    const drawBoardAttractor = () => {
      if (!attractorZone.active) {
        return;
      }

      const gradient = ctx.createRadialGradient(
        attractorZone.x,
        attractorZone.y,
        0,
        attractorZone.x,
        attractorZone.y,
        Math.max(attractorZone.width, attractorZone.height) * 0.54
      );

      gradient.addColorStop(0, "rgba(255, 255, 255, 0.045)");
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.016)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(
        attractorZone.x,
        attractorZone.y,
        attractorZone.width * 0.36,
        attractorZone.height * 0.32,
        0,
        0,
        TWO_PI
      );
      ctx.fill();
    };

    const drawLinks = () => {
      for (let sourceIndex = 0; sourceIndex < items.length; sourceIndex += 1) {
        const source = items[sourceIndex];

        for (
          let targetIndex = sourceIndex + 1;
          targetIndex < items.length;
          targetIndex += 1
        ) {
          const target = items[targetIndex];
          const distance = Matter.Vector.magnitude(
            Matter.Vector.sub(source.body.position, target.body.position)
          );

          if (distance > 156) {
            continue;
          }

          const alpha = 0.1 * Math.pow(1 - distance / 156, 1.6);
          ctx.strokeStyle = toRgba(source.line, alpha, source.line);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(source.body.position.x, source.body.position.y);
          ctx.lineTo(target.body.position.x, target.body.position.y);
          ctx.stroke();
        }
      }
    };

    const drawPulse = (now: number) => {
      pulses.forEach((pulse) => {
        const age = now - pulse.startedAt;
        const progress = clamp(age / 760, 0, 1);
        const radius = 18 + progress * 160;

        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - progress)})`;
        ctx.lineWidth = 1.15 - progress * 0.55;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, radius, 0, TWO_PI);
        ctx.stroke();
      });
    };

    const drawPointerHalo = () => {
      if (!pointer.active) {
        return;
      }

      const halo = ctx.createRadialGradient(
        pointer.x,
        pointer.y,
        0,
        pointer.x,
        pointer.y,
        110
      );
      halo.addColorStop(0, "rgba(255, 255, 255, 0.12)");
      halo.addColorStop(0.32, "rgba(255, 255, 255, 0.06)");
      halo.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 110, 0, TWO_PI);
      ctx.fill();
    };

    const drawBodies = () => {
      items.forEach((item) => {
        const { x, y } = item.body.position;
        const energy = 1 + item.impact * 0.1;
        const glowRadius = item.radius * (3.25 + item.impact * 0.65);
        const glow = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);

        glow.addColorStop(0, item.core);
        glow.addColorStop(0.24, item.glow);
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, TWO_PI);
        ctx.fill();

        ctx.fillStyle = item.fill;
        ctx.beginPath();
        ctx.arc(x, y, item.radius * energy, 0, TWO_PI);
        ctx.fill();

        ctx.strokeStyle = toRgba(item.fill, 0.54 + item.impact * 0.12, item.fill);
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    };

    const applyBoardPull = (item: FieldBody, compact: boolean) => {
      if (!attractorZone.active || dragTarget === item) {
        return;
      }

      const towardBoard = Vector.sub(
        {
          x: attractorZone.x,
          y: attractorZone.y,
        },
        item.body.position
      );
      const normalizedX = towardBoard.x / Math.max(attractorZone.width * 0.84, 1);
      const normalizedY = towardBoard.y / Math.max(attractorZone.height * 0.76, 1);
      const distanceFactor = Math.sqrt(
        normalizedX * normalizedX + normalizedY * normalizedY
      );

      if (distanceFactor > 1.55) {
        return;
      }

      const magnitude = Math.max(Vector.magnitude(towardBoard), 1);
      const direction = Vector.mult(towardBoard, 1 / magnitude);
      const strength =
        Math.pow(1.55 - distanceFactor, 1.8) *
        (compact ? 0.000011 : 0.000013);

      Body.applyForce(
        item.body,
        item.body.position,
        Vector.mult(direction, strength * item.body.mass)
      );
    };

    const applyDrag = (item: FieldBody) => {
      if (dragTarget !== item) {
        return false;
      }

      const targetDelta = Vector.sub(
        {
          x: pointer.x,
          y: pointer.y,
        },
        item.body.position
      );

      Body.setVelocity(item.body, {
        x: item.body.velocity.x * 0.7,
        y: item.body.velocity.y * 0.7,
      });
      Body.applyForce(item.body, item.body.position, {
        x: targetDelta.x * 0.0001 * item.body.mass,
        y: targetDelta.y * 0.0001 * item.body.mass,
      });
      item.impact = Math.max(item.impact, 0.5);

      return true;
    };

    const applyForces = (now: number) => {
      const compact = width < 900;
      const pointerFresh = now - pointer.lastMovedAt < 180;

      if (!pointerFresh && !dragTarget) {
        pointer.active = false;
      }

      pointer.vx *= 0.9;
      pointer.vy *= 0.9;

      for (let pulseIndex = pulses.length - 1; pulseIndex >= 0; pulseIndex -= 1) {
        if (now - pulses[pulseIndex].startedAt > 760) {
          pulses.splice(pulseIndex, 1);
        }
      }

      items.forEach((item) => {
        item.impact *= 0.92;

        const dragged = applyDrag(item);
        const { body, home, drift, phase } = item;
        const homeOffset = Vector.sub(home, body.position);
        const homeDistance = Math.max(Vector.magnitude(homeOffset), 1);
        const homeDirection = Vector.mult(homeOffset, 1 / homeDistance);
        const anchorForce =
          (compact ? 0.000018 : 0.000016) * body.mass +
          homeDistance * 0.00000018 * body.mass;

        if (!dragged) {
          Body.applyForce(
            body,
            body.position,
            Vector.mult(homeDirection, anchorForce)
          );
        }

        Body.applyForce(body, body.position, {
          x: Math.cos(now * 0.0007 + phase) * drift * 0.0000039 * body.mass,
          y: Math.sin(now * 0.00082 + phase * 1.15) * drift * 0.0000034 * body.mass,
        });

        applyBoardPull(item, compact);

        if (pointer.active && dragTarget !== item) {
          const away = Vector.sub(body.position, {
            x: pointer.x,
            y: pointer.y,
          });
          const distance = Math.max(Vector.magnitude(away), 1);
          const influence = compact ? 132 : 176;

          if (distance < influence) {
            const falloff = Math.pow(1 - distance / influence, 1.65);
            const awayDirection = Vector.mult(away, 1 / distance);
            const repulseForce = falloff * (compact ? 0.0004 : 0.00052) * body.mass;
            const swipeForce = falloff * (compact ? 0.000045 : 0.00006) * body.mass;

            Body.applyForce(
              body,
              body.position,
              Vector.mult(awayDirection, repulseForce)
            );
            Body.applyForce(body, body.position, {
              x: pointer.vx * width * swipeForce,
              y: pointer.vy * height * swipeForce,
            });
          }
        }

        pulses.forEach((pulse) => {
          const age = now - pulse.startedAt;
          const radius = 18 + age * 0.21;
          const outward = Vector.sub(body.position, {
            x: pulse.x,
            y: pulse.y,
          });
          const distance = Math.max(Vector.magnitude(outward), 1);
          const shellDistance = Math.abs(distance - radius);

          if (shellDistance > 80) {
            return;
          }

          const shellStrength = Math.pow(1 - shellDistance / 80, 2.1);
          const outwardDirection = Vector.mult(outward, 1 / distance);

          Body.applyForce(
            body,
            body.position,
            Vector.mult(outwardDirection, shellStrength * 0.00062 * body.mass)
          );
        });
      });
    };

    function render(now: number) {
      ctx.clearRect(0, 0, width, height);
      drawFieldGlow();
      drawBoardAttractor();
      drawLinks();
      drawPulse(now);
      drawPointerHalo();
      drawBodies();
    }

    const stopLoop = () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    };

    const tick = (now: number) => {
      if (!animationEnabled) {
        animationFrame = 0;
        return;
      }

      const delta = Math.min(now - lastFrame, 20);
      lastFrame = now;
      applyForces(now);
      Engine.update(engine, delta);
      render(now);
      animationFrame = window.requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (!animationEnabled || animationFrame) {
        return;
      }

      lastFrame = performance.now();
      animationFrame = window.requestAnimationFrame(tick);
    };

    const handleDocumentVisibility = () => {
      animationEnabled = !document.hidden;

      if (animationEnabled) {
        render(performance.now());
        startLoop();
        return;
      }

      stopLoop();
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    const attractorTarget =
      shell?.querySelector<HTMLElement>('[data-gravity-attractor="capability-board"]') ??
      null;
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        animationEnabled = entry.isIntersecting && !document.hidden;

        if (animationEnabled) {
          render(performance.now());
          startLoop();
          return;
        }

        stopLoop();
      },
      {
        root: null,
        rootMargin: "220px 0px",
        threshold: 0,
      }
    );

    Events.on(engine, "collisionStart", handleCollisionStart);

    resize();
    resizeObserver.observe(hero);
    intersectionObserver.observe(hero);

    if (attractorTarget) {
      resizeObserver.observe(attractorTarget);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", releaseDrag, { passive: true });
    window.addEventListener("pointercancel", handlePointerLeave);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);
    document.addEventListener("visibilitychange", handleDocumentVisibility);

    startLoop();

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      stopLoop();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", releaseDrag);
      window.removeEventListener("pointercancel", handlePointerLeave);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleDocumentVisibility);
      Events.off(engine, "collisionStart", handleCollisionStart);
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
