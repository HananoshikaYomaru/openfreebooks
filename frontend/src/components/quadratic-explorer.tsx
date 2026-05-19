import katex from "katex";
import { createEffect, createMemo, createSignal, onCleanup, Show } from "solid-js";

const VIEW_SIZE = 400;
const UNIT = 20;
const ORIGIN = VIEW_SIZE / 2;
const X_RANGE = 10;
/** Target size on screen (CSS pixels), scaled into canvas space in hitTestHover. */
const VERTEX_HIT_SCREEN = 28;
const ROOT_HIT_SCREEN = 22;
const CURVE_HIT_SCREEN = 14;
const HOVER_RADIUS = 8;
const POINT_RADIUS = 5;
const CURVE_SAMPLE_STEP = 0.15;

type PointKind = "vertex" | "root" | "curve";

type GraphHover = {
  kind: PointKind;
  x: number;
  y: number;
  label: string;
  canvasX: number;
  canvasY: number;
};

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

function discriminant(a: number, b: number, c: number) {
  return b * b - 4 * a * c;
}

function computeRoots(a: number, b: number, c: number, delta: number) {
  if (delta < 0 || Math.abs(a) < 1e-9) return [] as number[];
  if (delta === 0) return [-b / (2 * a)];
  const sqrtDelta = Math.sqrt(delta);
  return [(-b + sqrtDelta) / (2 * a), (-b - sqrtDelta) / (2 * a)];
}

function natureOfRoots(delta: number) {
  if (delta > 0) return "Two distinct real roots";
  if (delta === 0) return "One repeated real root (equal roots)";
  return "No real roots";
}

function renderLatex(latex: string) {
  return katex.renderToString(latex, { throwOnError: false, strict: "ignore" });
}

function readCanvasColors(canvas: HTMLCanvasElement) {
  const style = getComputedStyle(canvas);
  return {
    grid: style.getPropertyValue("--math-grid").trim() || "#e5e5e5",
    axis: style.getPropertyValue("--math-axis").trim() || "#a8a29e",
    curve: style.getPropertyValue("--math-curve").trim() || "#9a6b2e",
    vertex: style.getPropertyValue("--math-vertex").trim() || "#4a6b4a",
    root: style.getPropertyValue("--math-root").trim() || "#2563eb",
    bg: style.getPropertyValue("--math-canvas-bg").trim() || "#ffffff",
  };
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
  const x = (px - ORIGIN) / UNIT;
  const y = -(py - ORIGIN) / UNIT;
  return { px, py, x, y };
}

function distPx(px1: number, py1: number, px2: number, py2: number) {
  return Math.hypot(px1 - px2, py1 - py2);
}

function canvasHitRadius(canvas: HTMLCanvasElement, screenRadius: number) {
  const rect = canvas.getBoundingClientRect();
  const scale = rect.width > 0 ? VIEW_SIZE / rect.width : 1;
  return screenRadius * scale;
}

function nearestCurveHover(
  a: number,
  b: number,
  c: number,
  px: number,
  py: number
): { hover: GraphHover; dist: number } | null {
  let bestX = 0;
  let bestY = 0;
  let bestDist = Infinity;

  for (let x = -X_RANGE; x <= X_RANGE; x += CURVE_SAMPLE_STEP) {
    const y = a * x * x + b * x + c;
    const d = distPx(px, py, toCanvasX(x), toCanvasY(y));
    if (d < bestDist) {
      bestDist = d;
      bestX = x;
      bestY = y;
    }
  }

  if (!Number.isFinite(bestDist)) return null;

  const cx = toCanvasX(bestX);
  const cy = toCanvasY(bestY);
  return {
    dist: bestDist,
    hover: {
      kind: "curve",
      x: bestX,
      y: bestY,
      label: "On curve",
      canvasX: cx,
      canvasY: cy,
    },
  };
}

function hitTestHover(
  canvas: HTMLCanvasElement,
  a: number,
  b: number,
  c: number,
  rootXs: number[],
  px: number,
  py: number
): GraphHover | null {
  const vertexRadius = canvasHitRadius(canvas, VERTEX_HIT_SCREEN);
  const rootRadius = canvasHitRadius(canvas, ROOT_HIT_SCREEN);
  const curveRadius = canvasHitRadius(canvas, CURVE_HIT_SCREEN);

  if (Math.abs(a) > 1e-9) {
    const vx = -b / (2 * a);
    const vy = a * vx * vx + b * vx + c;
    const cx = toCanvasX(vx);
    const cy = toCanvasY(vy);
    const d = distPx(px, py, cx, cy);
    if (d < vertexRadius) {
      return {
        kind: "vertex",
        x: vx,
        y: vy,
        label: "Vertex",
        canvasX: cx,
        canvasY: cy,
      };
    }
  }

  for (const root of rootXs) {
    const cx = toCanvasX(root);
    const cy = toCanvasY(0);
    const d = distPx(px, py, cx, cy);
    if (d < rootRadius) {
      return {
        kind: "root",
        x: root,
        y: 0,
        label: "Root",
        canvasX: cx,
        canvasY: cy,
      };
    }
  }

  const curve = nearestCurveHover(a, b, c, px, py);
  if (curve && curve.dist < curveRadius) {
    return curve.hover;
  }

  return null;
}

function drawGraph(
  canvas: HTMLCanvasElement,
  a: number,
  b: number,
  c: number,
  rootXs: number[],
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

  ctx.strokeStyle = colors.curve;
  ctx.lineWidth = hover?.kind === "curve" ? 3.5 : 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  let started = false;
  for (let x = -X_RANGE; x <= X_RANGE; x += 0.25) {
    const y = a * x * x + b * x + c;
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

  const drawMarker = (
    cx: number,
    cy: number,
    fill: string,
    active: boolean
  ) => {
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

  if (Math.abs(a) > 1e-9) {
    const vx = -b / (2 * a);
    const vy = a * vx * vx + b * vx + c;
    if (vx >= -X_RANGE && vx <= X_RANGE && vy >= -X_RANGE && vy <= X_RANGE) {
      const cx = toCanvasX(vx);
      const cy = toCanvasY(vy);
      const active = hover?.kind === "vertex";
      drawMarker(cx, cy, colors.vertex, active);
    }
  }

  for (const root of rootXs) {
    if (root >= -X_RANGE && root <= X_RANGE) {
      const cx = toCanvasX(root);
      const cy = toCanvasY(0);
      const active = hover?.kind === "root" && Math.abs(hover.x - root) < 1e-6;
      drawMarker(cx, cy, colors.root, active);
    }
  }

  if (hover?.kind === "curve") {
    drawMarker(hover.canvasX, hover.canvasY, colors.curve, true);
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

export function QuadraticExplorer() {
  const [a, setA] = createSignal(1);
  const [b, setB] = createSignal(0);
  const [c, setC] = createSignal(-4);
  const [hover, setHover] = createSignal<GraphHover | null>(null);
  const [tooltipPos, setTooltipPos] = createSignal({ left: 0, top: 0 });
  let canvasRef: HTMLCanvasElement | undefined;
  let wrapRef: HTMLDivElement | undefined;

  const aSafe = createMemo(() => {
    const v = a();
    if (v === 0) return a() > 0 ? 1 : -1;
    return v;
  });

  const delta = createMemo(() => discriminant(aSafe(), b(), c()));
  const nature = createMemo(() => natureOfRoots(delta()));
  const rootValues = createMemo(() => computeRoots(aSafe(), b(), c(), delta()));

  const equationHtml = createMemo(() =>
    renderLatex(`y = ${formatNum(aSafe())}x^2 + ${formatNum(b())}x + ${formatNum(c())}`)
  );

  const deltaHtml = createMemo(() => {
    const av = aSafe();
    const bv = b();
    const cv = c();
    const d = delta();
    const tone = d > 0 ? "pos" : d < 0 ? "neg" : "zero";
    return {
      html: renderLatex(`\\Delta = ${formatNum(bv)}^2 - 4(${formatNum(av)})(${formatNum(cv)}) = ${formatNum(d)}`),
      tone,
    };
  });

  const handleAChange = (raw: number) => {
    if (raw === 0) {
      setA(a() > 0 ? -1 : 1);
      return;
    }
    setA(raw);
  };

  const redraw = () => {
    if (canvasRef) {
      drawGraph(canvasRef, aSafe(), b(), c(), rootValues(), hover());
    }
  };

  createEffect(() => {
    aSafe();
    b();
    c();
    rootValues();
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
      const hit = hitTestHover(canvas, aSafe(), b(), c(), rootValues(), px, py);
      setHover(hit);
      if (hit) {
        updateTooltipPosition(e.clientX, e.clientY);
        canvas.setAttribute("aria-label", `${hit.label} at ${formatCoord(hit.x, hit.y)}`);
      } else {
        canvas.setAttribute(
          "aria-label",
          `Graph of y equals ${formatNum(aSafe())} x squared plus ${formatNum(b())} x plus ${formatNum(c())}. Hover for coordinates.`
        );
      }
    };

    const onLeave = () => {
      setHover(null);
      canvas.setAttribute(
        "aria-label",
        `Graph of y equals ${formatNum(aSafe())} x squared plus ${formatNum(b())} x plus ${formatNum(c())}. Hover for coordinates.`
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
    <section class="math-widget" aria-labelledby="quadratic-explorer-title">
      <h2 id="quadratic-explorer-title" class="math-widget__title">
        Quadratic parabola &amp; discriminant explorer
      </h2>

      <div class="math-widget__layout">
        <div class="math-widget__controls">
          <div class="math-widget__equation-box" aria-live="polite">
            <p class="math-widget__equation-label">Equation</p>
            <div class="math-widget__equation" innerHTML={equationHtml()} />
          </div>

          <SliderRow
            id="coef-a"
            label="Value of a (cannot be 0)"
            value={a()}
            min={-5}
            max={5}
            step={1}
            accentClass="math-slider--a"
            onInput={handleAChange}
          />
          <SliderRow
            id="coef-b"
            label="Value of b"
            value={b()}
            min={-10}
            max={10}
            step={1}
            accentClass="math-slider--b"
            onInput={setB}
          />
          <SliderRow
            id="coef-c"
            label="Value of c"
            value={c()}
            min={-10}
            max={10}
            step={1}
            accentClass="math-slider--c"
            onInput={setC}
          />

          <div class="math-widget__delta-panel" aria-live="polite">
            <h3 class="math-widget__delta-title">Discriminant (Δ)</h3>
            <div
              class="math-widget__delta-formula"
              classList={{ [`math-widget__delta-formula--${deltaHtml().tone}`]: true }}
              innerHTML={deltaHtml().html}
            />
            <p class="math-widget__delta-nature">{nature()}</p>
            <Show when={rootValues().length > 0}>
              <p class="math-widget__delta-roots">
                Roots at x ≈ {rootValues().map((r) => formatNum(r)).join(", ")}
              </p>
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
              aria-label={`Graph of y equals ${formatNum(aSafe())} x squared plus ${formatNum(b())} x plus ${formatNum(c())}. Hover for coordinates.`}
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
            Hover the curve, vertex (green), or roots (blue) to read coordinates. Grid: x and y from
            −10 to 10.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
