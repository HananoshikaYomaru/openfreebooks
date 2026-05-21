import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";

const G = 9.81;
const DURATION = 3;

type PhysicsState = {
  state: "Static" | "Moving";
  normalForce: number;
  maxStaticFriction: number;
  friction: number;
  netForce: number;
  acceleration: number;
  velocity: number;
  displacement: number;
};

function round(value: number, digits = 2) {
  const p = 10 ** digits;
  return Math.round(value * p) / p;
}

function format(value: number, unit = "") {
  const n = Math.abs(value) < 1e-9 ? 0 : round(value, 2);
  return `${Number.isInteger(n) ? n : n.toFixed(2)}${unit}`;
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
  width: number
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  const angle = Math.atan2(toY - fromY, toX - fromX);
  const head = 10;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - head * Math.cos(angle - Math.PI / 6),
    toY - head * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - head * Math.cos(angle + Math.PI / 6),
    toY - head * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
}

export default function ForceLab() {
  const [massKg, setMassKg] = createSignal(10);
  const [appliedForceN, setAppliedForceN] = createSignal(60);
  const [muStatic, setMuStatic] = createSignal(0.5);
  const [muKinetic, setMuKinetic] = createSignal(0.3);
  const [time, setTime] = createSignal(0);
  const [playing, setPlaying] = createSignal(false);

  let simCanvasRef: HTMLCanvasElement | undefined;
  let raf = 0;
  let lastTime = 0;
  let lastCanvasWidth = 0;
  let lastCanvasHeight = 0;

  const physicsAt = (t: number): PhysicsState => {
    const normalForce = massKg() * G;
    const maxStaticFriction = muStatic() * normalForce;
    const startsMoving = appliedForceN() > maxStaticFriction;

    if (!startsMoving) {
      return {
        state: "Static",
        normalForce,
        maxStaticFriction,
        friction: appliedForceN(),
        netForce: 0,
        acceleration: 0,
        velocity: 0,
        displacement: 0,
      };
    }

    const friction = muKinetic() * normalForce;
    const netForce = appliedForceN() - friction;
    const acceleration = netForce / massKg();
    return {
      state: "Moving",
      normalForce,
      maxStaticFriction,
      friction,
      netForce,
      acceleration,
      velocity: acceleration * t,
      displacement: 0.5 * acceleration * t * t,
    };
  };

  const current = createMemo(() => physicsAt(time()));

  const pause = () => {
    setPlaying(false);
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  const play = () => {
    if (time() >= DURATION) setTime(0);
    setPlaying(true);
    lastTime = 0;
    const step = (stamp: number) => {
      if (!playing()) return;
      if (!lastTime) lastTime = stamp;
      const dt = (stamp - lastTime) / 1000;
      lastTime = stamp;
      setTime((prev) => {
        const next = Math.min(DURATION, prev + dt);
        if (next >= DURATION) {
          setPlaying(false);
        }
        return next;
      });
      if (playing()) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };

  const reset = () => {
    pause();
    setTime(0);
  };

  createEffect(() => {
    const uk = muKinetic();
    const us = muStatic();
    if (uk > us) {
      setMuStatic(uk);
    }
  });

  createEffect(() => {
    const canvas = simCanvasRef;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(420, Math.floor(rect.width || 640));
    const height = 250;

    if (width !== lastCanvasWidth || height !== lastCanvasHeight) {
      lastCanvasWidth = width;
      lastCanvasHeight = height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.height = `${height}px`;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const p = current();
    const style = getComputedStyle(canvas);
    const bg = style.getPropertyValue("--force-canvas-bg").trim() || "#f8fafc";
    const grid = style.getPropertyValue("--force-canvas-grid").trim() || "#d7dde6";
    const ink = style.getPropertyValue("--force-canvas-ink").trim() || "#111827";

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const groundY = height - 58;
    const scalePxPerM = 26;
    const visualShift = p.displacement * scalePxPerM * 0.9;
    const gridSize = 28;
    const gridPhase = ((visualShift % gridSize) + gridSize) % gridSize;

    ctx.strokeStyle = grid;
    ctx.lineWidth = 1;
    for (let x = -gridPhase; x < width; x += gridSize) {
      const px = Math.round(x) + 0.5;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, groundY);
      ctx.stroke();
    }

    ctx.strokeStyle = ink;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    const toothWidth = 12;
    const toothHeight = 8;
    const toothPeriod = toothWidth * 2;
    const toothPhase = ((visualShift % toothPeriod) + toothPeriod) % toothPeriod;

    ctx.beginPath();
    let started = false;
    for (let i = -4; ; i++) {
      const x = i * toothWidth - toothPhase;
      if (x > width + toothWidth * 4) break;
      const y = i % 2 === 0 ? groundY : groundY + toothHeight;
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    const blockSize = Math.max(44, Math.min(86, 52 * Math.sqrt(massKg() / 10)));
    const blockX = width * 0.33;
    const blockY = groundY - blockSize;

    const grad = ctx.createLinearGradient(blockX, blockY, blockX + blockSize, blockY + blockSize);
    grad.addColorStop(0, "#ef4444");
    grad.addColorStop(1, "#b91c1c");
    ctx.fillStyle = grad;
    ctx.fillRect(blockX, blockY, blockSize, blockSize);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 3;
    ctx.strokeRect(blockX, blockY, blockSize, blockSize);

    const centerY = blockY + blockSize / 2;
    const maxForce = Math.max(30, appliedForceN(), p.friction);
    const pullLen = 40 + (appliedForceN() / maxForce) * 130;
    const fricLen = 40 + (p.friction / maxForce) * 130;

    drawArrow(
      ctx,
      blockX + blockSize,
      centerY - 12,
      blockX + blockSize + pullLen,
      centerY - 12,
      "#2563eb",
      4
    );
    drawArrow(ctx, blockX, centerY + 12, blockX - fricLen, centerY + 12, "#ef4444", 4);

    const vertLen = Math.max(24, Math.min(72, (massKg() * G) / 2.8));
    drawArrow(
      ctx,
      blockX + blockSize / 2,
      blockY,
      blockX + blockSize / 2,
      blockY - vertLen,
      "#06b6d4",
      2.5
    );
    drawArrow(
      ctx,
      blockX + blockSize / 2,
      blockY + blockSize,
      blockX + blockSize / 2,
      blockY + blockSize + vertLen,
      "#f97316",
      2.5
    );

    ctx.fillStyle = "#1e293b";
    ctx.font = "600 14px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("F", blockX + blockSize + pullLen + 8, centerY - 14);
    ctx.fillStyle = "#7f1d1d";
    ctx.fillText("f_fric", blockX - fricLen - 56, centerY + 8);

    ctx.fillStyle = "#164e63";
    ctx.font = "500 11px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`F_N ${p.normalForce.toFixed(0)} N`, blockX + blockSize / 2, blockY - vertLen - 8);
    ctx.fillStyle = "#7c2d12";
    ctx.fillText(
      `W ${p.normalForce.toFixed(0)} N`,
      blockX + blockSize / 2,
      blockY + blockSize + vertLen + 14
    );

    ctx.fillStyle = "#0f172a";
    ctx.font = "700 11px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${massKg().toFixed(1)} kg`, blockX + blockSize / 2, blockY + blockSize / 2 + 3);
  });

  onCleanup(() => {
    if (raf) cancelAnimationFrame(raf);
  });

  return (
    <section class="physics-widget force-lab" aria-labelledby="force-lab-title">
      <h2 id="force-lab-title" class="physics-widget__title">
        Force lab: animated friction simulation
      </h2>

      <div class="physics-widget__layout">
        <div class="physics-widget__section">
          <div class="physics-slider-row">
            <label for="force-lab-mass">
              <span>Mass</span>
              <span class="physics-value">{format(massKg(), " kg")}</span>
            </label>
            <input
              id="force-lab-mass"
              type="range"
              min={1}
              max={40}
              step={0.5}
              value={massKg()}
              onInput={(e) => {
                reset();
                setMassKg(Number(e.currentTarget.value));
              }}
            />
          </div>

          <div class="physics-slider-row">
            <label for="force-lab-applied">
              <span>Pull force</span>
              <span class="physics-value">{format(appliedForceN(), " N")}</span>
            </label>
            <input
              id="force-lab-applied"
              type="range"
              min={0}
              max={200}
              step={1}
              value={appliedForceN()}
              onInput={(e) => {
                reset();
                setAppliedForceN(Number(e.currentTarget.value));
              }}
            />
          </div>

          <div class="physics-slider-row">
            <label for="force-lab-us">
              <span>Static friction μs</span>
              <span class="physics-value">{format(muStatic())}</span>
            </label>
            <input
              id="force-lab-us"
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={muStatic()}
              onInput={(e) => {
                reset();
                setMuStatic(Number(e.currentTarget.value));
              }}
            />
          </div>

          <div class="physics-slider-row">
            <label for="force-lab-uk">
              <span>Kinetic friction μk</span>
              <span class="physics-value">{format(muKinetic())}</span>
            </label>
            <input
              id="force-lab-uk"
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={muKinetic()}
              onInput={(e) => {
                reset();
                setMuKinetic(Number(e.currentTarget.value));
              }}
            />
          </div>
        </div>

        <div class="physics-widget__section">
          <div class="force-lab__status-row">
            <span
              class="force-lab__state-pill"
              classList={{ "force-lab__state-pill--moving": current().state === "Moving" }}
            >
              {current().state === "Moving" ? "Moving / Sliding" : "Static State"}
            </span>
            <span class="force-lab__time">{format(time(), "s")} / 3.00s</span>
          </div>

          <div class="force-lab__diagram-wrap">
            <canvas
              ref={(el) => {
                simCanvasRef = el;
              }}
              class="force-lab__canvas"
            />
          </div>

          <div class="force-lab__timeline">
            <button
              type="button"
              class="force-lab__btn force-lab__btn--play"
              onClick={() => (playing() ? pause() : play())}
            >
              {playing() ? "Pause" : "Play"}
            </button>
            <button type="button" class="force-lab__btn" onClick={reset}>
              Reset
            </button>
            <input
              class="force-lab__scrubber"
              type="range"
              min={0}
              max={DURATION}
              step={0.01}
              value={time()}
              onInput={(e) => {
                pause();
                setTime(Number(e.currentTarget.value));
              }}
            />
          </div>

          <p class="force-lab__summary">
            <strong>Friction threshold:</strong> {format(current().maxStaticFriction, " N")}
            <br />
            <strong>Current friction:</strong> {format(current().friction, " N")}
            <br />
            <strong>Net force:</strong> {format(current().netForce, " N")}
            <br />
            <strong>Acceleration:</strong> {format(current().acceleration, " m s⁻²")}
            <br />
            <strong>Velocity:</strong> {format(current().velocity, " m s⁻¹")} · <strong>Displacement:</strong>{" "}
            {format(current().displacement, " m")}
          </p>
        </div>
      </div>
    </section>
  );
}
