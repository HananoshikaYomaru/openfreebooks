import { renderLatex } from "@ofb/katex";
import { createEffect, createMemo, createSignal, onCleanup, Show } from "solid-js";

const VIEW_SIZE = 400;
const UNIT = 20;
const ORIGIN = VIEW_SIZE / 2;
const X_RANGE = 10;
const AXIS_LABEL_STEP = 2;
const LINE_SAMPLE_STEP = 0.12;
const INTERSECTION_HIT_SCREEN = 28;
const LINE_HIT_SCREEN = 14;
const HOVER_RADIUS = 8;
const POINT_RADIUS = 5;

type GraphHover = {
  kind: "intersection" | "line1" | "line2";
  x: number;
  y: number;
  label: string;
  canvasX: number;
  canvasY: number;
};

type SystemKind = "unique" | "parallel" | "coincident";

type Preset = {
  id: string;
  label: string;
  m1: number;
  c1: number;
  m2: number;
  c2: number;
};

const PRESETS: Preset[] = [
  { id: "unique", label: "One solution", m1: 1, c1: 1, m2: -1, c2: 5 },
  { id: "parallel", label: "Parallel", m1: 2, c1: 1, m2: 2, c2: -3 },
  { id: "coincident", label: "Coincident", m1: 1, c1: 2, m2: 1, c2: 2 },
];

function round(n: number, digits = 2) {
  const p = 10 ** digits;
  return Math.round(n * p) / p;
}

function formatNum(n: number) {
  if (Number.isInteger(n)) return String(n);
  return round(n, 2).toString();
}

function formatCoord(x: number, y: number) {
  return `(${formatNum(x)}, ${formatNum(y)})`;
}

function toCanvasX(x: number) {
  return ORIGIN + x * UNIT;
}

function toCanvasY(y: number) {
  return ORIGIN - y * UNIT;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function pointerToCanvas(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = VIEW_SIZE / rect.width;
  const scaleY = VIEW_SIZE / rect.height;
  const px = (clientX - rect.left) * scaleX;
  const py = (clientY - rect.top) * scaleY;
  return { px, py };
}

function distPx(px1: number, py1: number, px2: number, py2: number) {
  return Math.hypot(px1 - px2, py1 - py2);
}

function canvasHitRadius(canvas: HTMLCanvasElement, screenRadius: number) {
  const rect = canvas.getBoundingClientRect();
  const scale = rect.width > 0 ? VIEW_SIZE / rect.width : 1;
  return screenRadius * scale;
}

function nearestLineHover(
  m: number,
  c: number,
  px: number,
  py: number
): { dist: number; x: number; y: number; canvasX: number; canvasY: number } | null {
  let bestX = 0;
  let bestY = 0;
  let bestDist = Infinity;

  for (let x = -X_RANGE; x <= X_RANGE; x += LINE_SAMPLE_STEP) {
    const y = m * x + c;
    if (y < -X_RANGE || y > X_RANGE) continue;
    const d = distPx(px, py, toCanvasX(x), toCanvasY(y));
    if (d < bestDist) {
      bestDist = d;
      bestX = x;
      bestY = y;
    }
  }

  if (!Number.isFinite(bestDist)) return null;

  return {
    dist: bestDist,
    x: bestX,
    y: bestY,
    canvasX: toCanvasX(bestX),
    canvasY: toCanvasY(bestY),
  };
}

function hitTestHover(
  canvas: HTMLCanvasElement,
  m1: number,
  c1: number,
  m2: number,
  c2: number,
  meet: { x: number; y: number } | null,
  px: number,
  py: number
): GraphHover | null {
  const intersectionRadius = canvasHitRadius(canvas, INTERSECTION_HIT_SCREEN);
  const lineRadius = canvasHitRadius(canvas, LINE_HIT_SCREEN);

  if (meet) {
    const cx = toCanvasX(meet.x);
    const cy = toCanvasY(meet.y);
    if (
      meet.x >= -X_RANGE &&
      meet.x <= X_RANGE &&
      meet.y >= -X_RANGE &&
      meet.y <= X_RANGE &&
      distPx(px, py, cx, cy) < intersectionRadius
    ) {
      return {
        kind: "intersection",
        x: meet.x,
        y: meet.y,
        label: "Intersection",
        canvasX: cx,
        canvasY: cy,
      };
    }
  }

  const near1 = nearestLineHover(m1, c1, px, py);
  const near2 = nearestLineHover(m2, c2, px, py);

  const candidates: Array<{ dist: number; hover: GraphHover }> = [];
  if (near1 && near1.dist < lineRadius) {
    candidates.push({
      dist: near1.dist,
      hover: {
        kind: "line1",
        x: near1.x,
        y: near1.y,
        label: "Line 1",
        canvasX: near1.canvasX,
        canvasY: near1.canvasY,
      },
    });
  }
  if (near2 && near2.dist < lineRadius) {
    candidates.push({
      dist: near2.dist,
      hover: {
        kind: "line2",
        x: near2.x,
        y: near2.y,
        label: "Line 2",
        canvasX: near2.canvasX,
        canvasY: near2.canvasY,
      },
    });
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => a.dist - b.dist);
  return candidates[0].hover;
}

function classify(m1: number, c1: number, m2: number, c2: number): SystemKind {
  if (Math.abs(m1 - m2) < 1e-9) {
    return Math.abs(c1 - c2) < 1e-9 ? "coincident" : "parallel";
  }
  return "unique";
}

function intersection(
  m1: number,
  c1: number,
  m2: number,
  c2: number
): { x: number; y: number } | null {
  const kind = classify(m1, c1, m2, c2);
  if (kind !== "unique") return null;
  const x = (c2 - c1) / (m1 - m2);
  const y = m1 * x + c1;
  return { x, y };
}

function readCanvasColors(canvas: HTMLCanvasElement) {
  const style = getComputedStyle(canvas);
  return {
    grid: style.getPropertyValue("--math-grid").trim() || "#e5e5e5",
    axis: style.getPropertyValue("--math-axis").trim() || "#a8a29e",
    line1: style.getPropertyValue("--math-curve").trim() || "#9a6b2e",
    line2: style.getPropertyValue("--math-line2").trim() || "#2563eb",
    intersection: style.getPropertyValue("--math-root").trim() || "#2563eb",
    bg: style.getPropertyValue("--math-canvas-bg").trim() || "#ffffff",
  };
}

function drawGraph(
  canvas: HTMLCanvasElement,
  m1: number,
  c1: number,
  m2: number,
  c2: number,
  point: { x: number; y: number } | null,
  hover: GraphHover | null
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = VIEW_SIZE * dpr;
  canvas.height = VIEW_SIZE * dpr;
  canvas.style.width = `${VIEW_SIZE}px`;
  canvas.style.height = `${VIEW_SIZE}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const colors = readCanvasColors(canvas);

  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, VIEW_SIZE, VIEW_SIZE);

  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 1;
  for (let i = -X_RANGE; i <= X_RANGE; i++) {
    ctx.beginPath();
    ctx.moveTo(toCanvasX(i), 0);
    ctx.lineTo(toCanvasX(i), VIEW_SIZE);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, toCanvasY(i));
    ctx.lineTo(VIEW_SIZE, toCanvasY(i));
    ctx.stroke();
  }

  ctx.strokeStyle = colors.axis;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ORIGIN, 0);
  ctx.lineTo(ORIGIN, VIEW_SIZE);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, ORIGIN);
  ctx.lineTo(VIEW_SIZE, ORIGIN);
  ctx.stroke();

  // Axis arrowheads
  const arrowSize = 8;
  ctx.fillStyle = colors.axis;
  // +x arrow
  ctx.beginPath();
  ctx.moveTo(VIEW_SIZE - 2, ORIGIN);
  ctx.lineTo(VIEW_SIZE - arrowSize - 2, ORIGIN - 4);
  ctx.lineTo(VIEW_SIZE - arrowSize - 2, ORIGIN + 4);
  ctx.closePath();
  ctx.fill();
  // +y arrow
  ctx.beginPath();
  ctx.moveTo(ORIGIN, 2);
  ctx.lineTo(ORIGIN - 4, arrowSize + 2);
  ctx.lineTo(ORIGIN + 4, arrowSize + 2);
  ctx.closePath();
  ctx.fill();

  // Graduations (ticks + labels)
  ctx.strokeStyle = colors.axis;
  ctx.fillStyle = colors.axis;
  ctx.lineWidth = 1;
  ctx.font = "11px IBM Plex Mono, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let i = -X_RANGE; i <= X_RANGE; i++) {
    const px = toCanvasX(i);
    const py = toCanvasY(i);
    if (i !== 0) {
      // x-axis ticks
      ctx.beginPath();
      ctx.moveTo(px, ORIGIN - 4);
      ctx.lineTo(px, ORIGIN + 4);
      ctx.stroke();
      if (i % AXIS_LABEL_STEP === 0) {
        ctx.fillText(String(i), px, ORIGIN + 8);
      }

      // y-axis ticks
      ctx.beginPath();
      ctx.moveTo(ORIGIN - 4, py);
      ctx.lineTo(ORIGIN + 4, py);
      ctx.stroke();
      if (i % AXIS_LABEL_STEP === 0) {
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(String(i), ORIGIN - 8, py);
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
      }
    }
  }

  // Axis labels
  ctx.fillStyle = colors.axis;
  ctx.font = "12px IBM Plex Mono, monospace";
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillText("x", VIEW_SIZE - 8, ORIGIN - 6);
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("y", ORIGIN + 6, 6);

  const drawLine = (
    m: number,
    c: number,
    color: string,
    width: number,
    active: boolean
  ) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = active ? width + 1.5 : width;
    ctx.lineCap = "round";
    ctx.beginPath();
    let started = false;
    for (let x = -X_RANGE; x <= X_RANGE; x += 0.1) {
      const y = m * x + c;
      if (y < -X_RANGE || y > X_RANGE) continue;
      const px = toCanvasX(x);
      const py = toCanvasY(y);
      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
  };

  drawLine(m1, c1, colors.line1, 3, hover?.kind === "line1");
  drawLine(m2, c2, colors.line2, 3, hover?.kind === "line2");

  const drawMarker = (cx: number, cy: number, fill: string, active: boolean) => {
    const r = active ? HOVER_RADIUS : POINT_RADIUS;
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    if (active) {
      ctx.strokeStyle = colors.bg;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  if (point && point.x >= -X_RANGE && point.x <= X_RANGE && point.y >= -X_RANGE && point.y <= X_RANGE) {
    const cx = toCanvasX(point.x);
    const cy = toCanvasY(point.y);
    const active = hover?.kind === "intersection";
    drawMarker(cx, cy, colors.intersection, active);
  }

  if (hover?.kind === "line1") {
    drawMarker(hover.canvasX, hover.canvasY, colors.line1, true);
  }
  if (hover?.kind === "line2") {
    drawMarker(hover.canvasX, hover.canvasY, colors.line2, true);
  }
}

function SliderRow(props: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  accentClass?: string;
  onInput: (v: number) => void;
}) {
  return (
    <div class="math-slider-row">
      <label class="math-slider-label" for={props.id}>
        <span>{props.label}</span>
        <span class="math-slider-value">{formatNum(props.value)}</span>
      </label>
      <input
        id={props.id}
        class={`math-slider ${props.accentClass ?? ""}`}
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onInput={(e) => props.onInput(Number(e.currentTarget.value))}
      />
    </div>
  );
}

function natureLabel(kind: SystemKind) {
  if (kind === "unique") return "Exactly one solution (lines intersect)";
  if (kind === "parallel") return "No solution (parallel lines)";
  return "Infinitely many solutions (coincident lines)";
}

function SimultaneousGraphExplorer() {
  const [m1, setM1] = createSignal(1);
  const [c1, setC1] = createSignal(1);
  const [m2, setM2] = createSignal(-1);
  const [c2, setC2] = createSignal(5);
  const [activePreset, setActivePreset] = createSignal<string | null>(null);
  const [hover, setHover] = createSignal<GraphHover | null>(null);
  const [tooltipPos, setTooltipPos] = createSignal({ left: 0, top: 0 });
  let canvasRef: HTMLCanvasElement | undefined;
  let wrapRef: HTMLDivElement | undefined;

  const kind = createMemo(() => classify(m1(), c1(), m2(), c2()));
  const meet = createMemo(() => intersection(m1(), c1(), m2(), c2()));

  const eq1Html = createMemo(() =>
    renderLatex(`y = ${formatNum(m1())}x + ${formatNum(c1())}`)
  );
  const eq2Html = createMemo(() =>
    renderLatex(`y = ${formatNum(m2())}x + ${formatNum(c2())}`)
  );

  const applyPreset = (p: Preset) => {
    setM1(p.m1);
    setC1(p.c1);
    setM2(p.m2);
    setC2(p.c2);
    setActivePreset(p.id);
  };

  const onSliderChange = (setter: (v: number) => void) => (v: number) => {
    setActivePreset(null);
    setter(v);
  };

  const redraw = () => {
    if (canvasRef) {
      drawGraph(canvasRef, m1(), c1(), m2(), c2(), meet(), hover());
    }
  };

  createEffect(() => {
    m1();
    c1();
    m2();
    c2();
    meet();
    hover();
    redraw();
  });

  const updateTooltipPosition = (clientX: number, clientY: number) => {
    if (!wrapRef) return;
    const rect = wrapRef.getBoundingClientRect();
    const pad = 12;
    let left = clientX - rect.left + pad;
    let top = clientY - rect.top - pad;
    const maxLeft = rect.width - 140;
    const maxTop = rect.height - 48;
    left = clamp(left, pad, maxLeft);
    top = clamp(top, pad, maxTop);
    setTooltipPos({ left, top });
  };

  createEffect(() => {
    const canvas = canvasRef;
    if (!canvas) return;

    const onMove = (e: PointerEvent) => {
      const { px, py } = pointerToCanvas(canvas, e.clientX, e.clientY);
      const hit = hitTestHover(canvas, m1(), c1(), m2(), c2(), meet(), px, py);
      setHover(hit);
      if (hit) {
        updateTooltipPosition(e.clientX, e.clientY);
        canvas.setAttribute("aria-label", `${hit.label} at ${formatCoord(hit.x, hit.y)}`);
      } else {
        canvas.setAttribute(
          "aria-label",
          "Graph of two lines. Hover a line or intersection to read coordinates."
        );
      }
    };

    const onLeave = () => {
      setHover(null);
      canvas.setAttribute(
        "aria-label",
        "Graph of two lines. Hover a line or intersection to read coordinates."
      );
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onMove);

    onCleanup(() => {
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onMove);
    });
  });

  return (
    <section class="math-widget sim-graph" aria-labelledby="sim-graph-title">
      <h2 id="sim-graph-title" class="math-widget__title">
        Simultaneous equations graph explorer
      </h2>

      <div class="math-widget__layout">
        <div class="math-widget__controls">
          <div class="sim-graph__presets" role="group" aria-label="Presets">
            {PRESETS.map((p) => (
              <button
                type="button"
                class="sim-graph__preset-btn"
                classList={{ "sim-graph__preset-btn--active": activePreset() === p.id }}
                onClick={() => applyPreset(p)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div class="math-widget__equation-box" aria-live="polite">
            <p class="math-widget__equation-label">Line 1</p>
            <div class="math-widget__equation" innerHTML={eq1Html()} />
          </div>
          <div class="math-widget__equation-box sim-graph__eq2-box" aria-live="polite">
            <p class="math-widget__equation-label">Line 2</p>
            <div class="math-widget__equation" innerHTML={eq2Html()} />
          </div>

          <p class="sim-graph__line-heading">Line 1 (y = m₁x + c₁)</p>
          <SliderRow
            id="sim-m1"
            label="Slope m₁"
            value={m1()}
            min={-4}
            max={4}
            step={0.5}
            accentClass="math-slider--a"
            onInput={onSliderChange(setM1)}
          />
          <SliderRow
            id="sim-c1"
            label="Intercept c₁"
            value={c1()}
            min={-8}
            max={8}
            step={1}
            accentClass="math-slider--b"
            onInput={onSliderChange(setC1)}
          />

          <p class="sim-graph__line-heading">Line 2 (y = m₂x + c₂)</p>
          <SliderRow
            id="sim-m2"
            label="Slope m₂"
            value={m2()}
            min={-4}
            max={4}
            step={0.5}
            accentClass="math-slider--c"
            onInput={onSliderChange(setM2)}
          />
          <SliderRow
            id="sim-c2"
            label="Intercept c₂"
            value={c2()}
            min={-8}
            max={8}
            step={1}
            onInput={onSliderChange(setC2)}
          />

          <div
            class="math-widget__delta-panel sim-graph__status"
            classList={{
              "sim-graph__status--unique": kind() === "unique",
              "sim-graph__status--parallel": kind() === "parallel",
              "sim-graph__status--coincident": kind() === "coincident",
            }}
            aria-live="polite"
          >
            <h3 class="math-widget__delta-title">System</h3>
            <p class="math-widget__delta-nature">{natureLabel(kind())}</p>
            <Show when={meet()}>
              {(p) => (
                <p class="math-widget__delta-roots">
                  Intersection at {formatCoord(p().x, p().y)}
                </p>
              )}
            </Show>
          </div>
        </div>

        <figure class="math-widget__graph">
          <div
            class="math-widget__canvas-wrap"
            ref={(el) => {
              wrapRef = el;
            }}
          >
            <canvas
              ref={(el) => {
                canvasRef = el;
              }}
              class="math-widget__canvas"
              classList={{ "math-widget__canvas--active": !!hover() }}
              width={VIEW_SIZE}
              height={VIEW_SIZE}
              role="img"
              aria-label="Graph of two lines. Hover a line or intersection to read coordinates."
            />
            <Show when={hover()}>
              {(h) => (
                <div
                  class="math-graph-tooltip"
                  classList={{
                    [`math-graph-tooltip--${h().kind}`]: true,
                  }}
                  role="status"
                  aria-live="polite"
                  style={{
                    left: `${tooltipPos().left}px`,
                    top: `${tooltipPos().top}px`,
                  }}
                >
                  <span class="math-graph-tooltip__label">{h().label}</span>
                  <span class="math-graph-tooltip__coords">{formatCoord(h().x, h().y)}</span>
                </div>
              )}
            </Show>
          </div>
          <figcaption class="math-widget__caption">
            Hover a line to read coordinates along it; near an intersection the cursor snaps to the
            solution point. Grid: −10 to 10 on both axes.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export default SimultaneousGraphExplorer;
