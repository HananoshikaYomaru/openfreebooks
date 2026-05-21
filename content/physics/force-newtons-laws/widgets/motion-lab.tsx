import { createMemo, createSignal } from "solid-js";

const PLOT_W = 520;
const PLOT_H = 280;
const PAD_X = 48;
const PAD_Y = 24;
const MAX_TIME = 12;

function round(value: number, digits = 2) {
  const p = 10 ** digits;
  return Math.round(value * p) / p;
}

function format(value: number, unit = "") {
  const n = round(value, 2);
  return `${Number.isInteger(n) ? n : n.toFixed(2)}${unit}`;
}

function normalize(value: number, min: number, max: number) {
  if (Math.abs(max - min) < 1e-9) return 0.5;
  return (value - min) / (max - min);
}

export default function MotionLab() {
  const [initialVelocity, setInitialVelocity] = createSignal(2);
  const [acceleration, setAcceleration] = createSignal(1.2);
  const [time, setTime] = createSignal(6);

  const finalVelocity = createMemo(
    () => initialVelocity() + acceleration() * time()
  );
  const displacement = createMemo(
    () => initialVelocity() * time() + 0.5 * acceleration() * time() * time()
  );

  const samples = createMemo(() => {
    const points = [];
    for (let t = 0; t <= MAX_TIME; t += 0.2) {
      const v = initialVelocity() + acceleration() * t;
      const s = initialVelocity() * t + 0.5 * acceleration() * t * t;
      points.push({ t, v, s });
    }
    return points;
  });

  const yRange = createMemo(() => {
    const allV = samples().map((p) => p.v);
    const allS = samples().map((p) => p.s);
    const min = Math.min(...allV, ...allS, 0);
    const max = Math.max(...allV, ...allS, 0);
    return { min, max };
  });

  const toX = (t: number) =>
    PAD_X + (t / MAX_TIME) * (PLOT_W - PAD_X * 2);
  const toY = (y: number) =>
    PAD_Y + (1 - normalize(y, yRange().min, yRange().max)) * (PLOT_H - PAD_Y * 2);

  const velocityPath = createMemo(
    () =>
      samples()
        .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(p.t)} ${toY(p.v)}`)
        .join(" ")
  );

  const displacementPath = createMemo(
    () =>
      samples()
        .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(p.t)} ${toY(p.s)}`)
        .join(" ")
  );

  return (
    <section class="physics-widget motion-lab" aria-labelledby="motion-lab-title">
      <h2 id="motion-lab-title" class="physics-widget__title">
        Motion lab: velocity-time and displacement-time
      </h2>

      <div class="physics-widget__layout">
        <div class="physics-widget__section">
          <div class="physics-slider-row">
            <label for="motion-lab-u">
              <span>Initial velocity u</span>
              <span class="physics-value">{format(initialVelocity(), " m s⁻¹")}</span>
            </label>
            <input
              id="motion-lab-u"
              type="range"
              min={-8}
              max={16}
              step={0.2}
              value={initialVelocity()}
              onInput={(e) => setInitialVelocity(Number(e.currentTarget.value))}
            />
          </div>

          <div class="physics-slider-row">
            <label for="motion-lab-a">
              <span>Acceleration a</span>
              <span class="physics-value">{format(acceleration(), " m s⁻²")}</span>
            </label>
            <input
              id="motion-lab-a"
              type="range"
              min={-6}
              max={6}
              step={0.1}
              value={acceleration()}
              onInput={(e) => setAcceleration(Number(e.currentTarget.value))}
            />
          </div>

          <div class="physics-slider-row">
            <label for="motion-lab-t">
              <span>Elapsed time t</span>
              <span class="physics-value">{format(time(), " s")}</span>
            </label>
            <input
              id="motion-lab-t"
              type="range"
              min={0}
              max={MAX_TIME}
              step={0.1}
              value={time()}
              onInput={(e) => setTime(Number(e.currentTarget.value))}
            />
          </div>

          <div class="motion-lab__stats">
            <div class="motion-lab__stat">
              <span class="motion-lab__stat-label">v = u + at</span>
              <span class="motion-lab__stat-value">{format(finalVelocity(), " m s⁻¹")}</span>
            </div>
            <div class="motion-lab__stat">
              <span class="motion-lab__stat-label">s = ut + 1/2at²</span>
              <span class="motion-lab__stat-value">{format(displacement(), " m")}</span>
            </div>
            <div class="motion-lab__stat">
              <span class="motion-lab__stat-label">Direction now</span>
              <span class="motion-lab__stat-value">
                {finalVelocity() > 0 ? "right" : finalVelocity() < 0 ? "left" : "instant rest"}
              </span>
            </div>
          </div>
        </div>

        <div class="physics-widget__section">
          <svg
            class="motion-lab__plot"
            viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
            role="img"
            aria-label="Velocity-time and displacement-time graph"
          >
            <rect x="0" y="0" width={PLOT_W} height={PLOT_H} fill="transparent" />
            <line
              x1={PAD_X}
              y1={PLOT_H - PAD_Y}
              x2={PLOT_W - PAD_X}
              y2={PLOT_H - PAD_Y}
              stroke="var(--line)"
            />
            <line
              x1={PAD_X}
              y1={PAD_Y}
              x2={PAD_X}
              y2={PLOT_H - PAD_Y}
              stroke="var(--line)"
            />
            <line
              x1={toX(time())}
              y1={PAD_Y}
              x2={toX(time())}
              y2={PLOT_H - PAD_Y}
              stroke="color-mix(in srgb, var(--soft-ink) 55%, transparent)"
              stroke-dasharray="4 4"
            />
            <path d={velocityPath()} fill="none" stroke="#0ea5e9" stroke-width="3" />
            <path d={displacementPath()} fill="none" stroke="#f59e0b" stroke-width="3" />
            <circle cx={toX(time())} cy={toY(finalVelocity())} r="4" fill="#0ea5e9" />
            <circle cx={toX(time())} cy={toY(displacement())} r="4" fill="#f59e0b" />
            <text x={PLOT_W - PAD_X + 4} y={PLOT_H - PAD_Y + 4} font-size="12" fill="var(--soft-ink)">
              t
            </text>
            <text x={PAD_X - 18} y={PAD_Y - 4} font-size="12" fill="var(--soft-ink)">
              y
            </text>
          </svg>
          <p class="motion-lab__legend" aria-hidden="true">
            <span class="motion-lab__legend-line motion-lab__legend-line--velocity">velocity</span>
            <span class="motion-lab__legend-line motion-lab__legend-line--position">displacement</span>
          </p>
        </div>
      </div>
    </section>
  );
}
