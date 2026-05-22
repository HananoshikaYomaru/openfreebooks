import { renderLatex } from "@ofb/katex";
import { createMemo, createSignal, onCleanup, onMount } from "solid-js";

type Point = { x: number; y: number };

const MIN = -10;
const MAX = 10;
const STEP = 0.5;

function snap(value: number) {
  const clamped = Math.max(MIN, Math.min(MAX, value));
  return Math.round(clamped / STEP) * STEP;
}

function pointDistance(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function PlaneRelationsDemo() {
  let canvasRef: HTMLCanvasElement | undefined;

  const [pointA, setPointA] = createSignal<Point>({ x: -6, y: -2 });
  const [pointB, setPointB] = createSignal<Point>({ x: 5, y: 4 });
  const [width, setWidth] = createSignal(760);
  const [themeTick, setThemeTick] = createSignal(0);

  const dx = createMemo(() => pointB().x - pointA().x);
  const dy = createMemo(() => pointB().y - pointA().y);
  const midpoint = createMemo(() => ({
    x: (pointA().x + pointB().x) / 2,
    y: (pointA().y + pointB().y) / 2,
  }));
  const distance = createMemo(() => pointDistance(pointA(), pointB()));
  const slopeText = createMemo(() =>
    dx() === 0 ? "undefined (vertical line)" : (dy() / dx()).toFixed(2)
  );

  const formulaLatex = createMemo(() => {
    if (dx() === 0) {
      return `\\Delta x=0,\\;\\Delta y=${dy().toFixed(1)},\\;AB=${distance().toFixed(2)},\\;m\\text{ is undefined}`;
    }
    return `\\Delta x=${dx().toFixed(1)},\\;\\Delta y=${dy().toFixed(1)},\\;AB=${distance().toFixed(
      2
    )},\\;m=\\frac{\\Delta y}{\\Delta x}=${slopeText()}`;
  });

  onMount(() => {
    const canvas = canvasRef;
    if (!canvas) return;
    const ctxCandidate = canvas.getContext("2d");
    if (!(ctxCandidate instanceof CanvasRenderingContext2D)) return;
    const ctx = ctxCandidate;
    const canvasEl: HTMLCanvasElement = canvas;

    let dpr = window.devicePixelRatio || 1;
    const logicalHeight = 430;
    let dragging: "a" | "b" | null = null;

    const margin = { left: 60, right: 34, top: 26, bottom: 64 };
    const graphWidth = () => width() - margin.left - margin.right;
    const graphHeight = () => logicalHeight - margin.top - margin.bottom;

    const toX = (x: number) => margin.left + ((x - MIN) / (MAX - MIN)) * graphWidth();
    const toY = (y: number) => margin.top + ((MAX - y) / (MAX - MIN)) * graphHeight();
    const fromX = (x: number) => MIN + ((x - margin.left) / graphWidth()) * (MAX - MIN);
    const fromY = (y: number) => MAX - ((y - margin.top) / graphHeight()) * (MAX - MIN);

    function drawArrow(x: number, y: number, direction: "x" | "y") {
      ctx.beginPath();
      if (direction === "x") {
        ctx.moveTo(x, y);
        ctx.lineTo(x - 9, y - 5);
        ctx.lineTo(x - 9, y + 5);
      } else {
        ctx.moveTo(x, y);
        ctx.lineTo(x - 5, y + 9);
        ctx.lineTo(x + 5, y + 9);
      }
      ctx.closePath();
      ctx.fill();
    }

    function drawPoint(point: Point, color: string, label: string) {
      const x = toX(point.x);
      const y = toY(point.y);
      ctx.beginPath();
      ctx.arc(x, y, 7.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      ctx.font = "700 12px var(--mono, ui-monospace, monospace)";
      ctx.fillStyle = color;
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      ctx.fillText(`${label}(${point.x.toFixed(1)}, ${point.y.toFixed(1)})`, x + 8, y - 7);
    }

    function draw() {
      themeTick();
      const explicitTheme = document.documentElement.getAttribute("data-theme");
      const isDark =
        explicitTheme === "dark" ||
        (explicitTheme !== "light" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      const palette = isDark
        ? {
            bg: "#0f172a",
            grid: "rgba(148, 163, 184, 0.28)",
            axis: "#f8fafc",
            axisText: "#e2e8f0",
            segment: "#38bdf8",
            helper: "#f59e0b",
            midpoint: "#a78bfa",
            pointA: "#34d399",
            pointB: "#fda4af",
          }
        : {
            bg: "rgba(148, 163, 184, 0.08)",
            grid: "rgba(100, 116, 139, 0.24)",
            axis: "#0f172a",
            axisText: "#334155",
            segment: "#0369a1",
            helper: "#b45309",
            midpoint: "#7c3aed",
            pointA: "#0f766e",
            pointB: "#be123c",
          };

      ctx.clearRect(0, 0, width(), logicalHeight);
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, width(), logicalHeight);

      ctx.lineWidth = 1;
      ctx.strokeStyle = palette.grid;
      for (let n = MIN; n <= MAX; n += 1) {
        const x = toX(n);
        const y = toY(n);
        ctx.beginPath();
        ctx.moveTo(x, margin.top);
        ctx.lineTo(x, margin.top + graphHeight());
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(margin.left + graphWidth(), y);
        ctx.stroke();
      }

      const axisX = toY(0);
      const axisY = toX(0);
      ctx.strokeStyle = palette.axis;
      ctx.fillStyle = palette.axis;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(margin.left, axisX);
      ctx.lineTo(margin.left + graphWidth() + 12, axisX);
      ctx.stroke();
      drawArrow(margin.left + graphWidth() + 12, axisX, "x");

      ctx.beginPath();
      ctx.moveTo(axisY, margin.top + graphHeight());
      ctx.lineTo(axisY, margin.top - 12);
      ctx.stroke();
      drawArrow(axisY, margin.top - 12, "y");

      ctx.font = "12px var(--mono, ui-monospace, monospace)";
      ctx.fillStyle = palette.axisText;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      for (let n = MIN; n <= MAX; n += 2) {
        const x = toX(n);
        ctx.fillText(String(n), x, axisX + 8);
      }

      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      for (let n = MIN; n <= MAX; n += 2) {
        if (n === 0) continue;
        const y = toY(n);
        ctx.fillText(String(n), axisY - 8, y);
      }

      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("x", margin.left + graphWidth() + 18, axisX);
      ctx.fillText("y", axisY + 10, margin.top - 12);

      const a = pointA();
      const b = pointB();
      const m = midpoint();

      ctx.strokeStyle = palette.segment;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(toX(a.x), toY(a.y));
      ctx.lineTo(toX(b.x), toY(b.y));
      ctx.stroke();

      ctx.strokeStyle = palette.helper;
      ctx.setLineDash([6, 5]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(toX(a.x), toY(a.y));
      ctx.lineTo(toX(b.x), toY(a.y));
      ctx.lineTo(toX(b.x), toY(b.y));
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = "600 12px var(--mono, ui-monospace, monospace)";
      ctx.fillStyle = palette.helper;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(`Δx = ${dx().toFixed(1)}`, (toX(a.x) + toX(b.x)) / 2, toY(a.y) - 4);
      ctx.save();
      ctx.translate(toX(b.x) + 8, (toY(a.y) + toY(b.y)) / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(`Δy = ${dy().toFixed(1)}`, 0, 0);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(toX(m.x), toY(m.y), 6, 0, Math.PI * 2);
      ctx.fillStyle = palette.midpoint;
      ctx.fill();
      ctx.fillStyle = palette.midpoint;
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      ctx.fillText(`M(${m.x.toFixed(1)}, ${m.y.toFixed(1)})`, toX(m.x) + 8, toY(m.y) - 8);

      drawPoint(a, palette.pointA, "A");
      drawPoint(b, palette.pointB, "B");
    }

    function resize() {
      dpr = window.devicePixelRatio || 1;
      const rect = canvasEl.getBoundingClientRect();
      const nextWidth = Math.max(320, rect.width);
      setWidth(nextWidth);
      canvasEl.width = Math.round(nextWidth * dpr);
      canvasEl.height = Math.round(logicalHeight * dpr);
      canvasEl.style.height = `${logicalHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      draw();
    }

    function hitTest(clientX: number, clientY: number) {
      const rect = canvasEl.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const distA = Math.hypot(x - toX(pointA().x), y - toY(pointA().y));
      const distB = Math.hypot(x - toX(pointB().x), y - toY(pointB().y));
      if (distA <= 14 && distA <= distB) return "a";
      if (distB <= 14) return "b";
      return null;
    }

    function onPointerDown(event: PointerEvent) {
      dragging = hitTest(event.clientX, event.clientY);
      if (!dragging) return;
      canvasEl.setPointerCapture(event.pointerId);
      canvasEl.style.cursor = "grabbing";
      event.preventDefault();
    }

    function onPointerMove(event: PointerEvent) {
      if (!dragging) {
        const hit = hitTest(event.clientX, event.clientY);
        canvasEl.style.cursor = hit ? "grab" : "default";
        return;
      }
      const rect = canvasEl.getBoundingClientRect();
      const x = snap(fromX(event.clientX - rect.left));
      const y = snap(fromY(event.clientY - rect.top));
      if (dragging === "a") {
        setPointA({ x, y });
      } else {
        setPointB({ x, y });
      }
      draw();
      event.preventDefault();
    }

    function onPointerEnd(event: PointerEvent) {
      if (dragging) canvasEl.releasePointerCapture(event.pointerId);
      dragging = null;
      canvasEl.style.cursor = "default";
    }

    const onResize = () => resize();
    const themeObserver = new MutationObserver(() => {
      setThemeTick((v) => v + 1);
      draw();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    canvasEl.addEventListener("pointerdown", onPointerDown);
    canvasEl.addEventListener("pointermove", onPointerMove);
    canvasEl.addEventListener("pointerup", onPointerEnd);
    canvasEl.addEventListener("pointercancel", onPointerEnd);
    window.addEventListener("resize", onResize);
    resize();

    onCleanup(() => {
      themeObserver.disconnect();
      canvasEl.removeEventListener("pointerdown", onPointerDown);
      canvasEl.removeEventListener("pointermove", onPointerMove);
      canvasEl.removeEventListener("pointerup", onPointerEnd);
      canvasEl.removeEventListener("pointercancel", onPointerEnd);
      window.removeEventListener("resize", onResize);
    });
  });

  return (
    <section class="math-widget coord-plane-demo" aria-labelledby="coord-plane-demo-title">
      <h3 id="coord-plane-demo-title" class="math-widget__title">
        Coordinate relations demo
      </h3>
      <div class="math-widget__body">
        <p class="math-widget__caption">
          Drag A and B. The graph shows \( \Delta x \), \( \Delta y \), segment length, midpoint, and
          slope from the same picture.
        </p>
        <canvas
          ref={canvasRef}
          class="coord-plane-demo__canvas"
          aria-label="Interactive coordinate plane with draggable points"
        />
        <p class="coord-plane-demo__readout" innerHTML={renderLatex(formulaLatex())} aria-live="polite" />
        <p class="coord-plane-demo__summary">
          Midpoint \(M\): ({midpoint().x.toFixed(1)}, {midpoint().y.toFixed(1)}) · Slope \(m\):{" "}
          {slopeText()}
        </p>
      </div>
    </section>
  );
}

export default PlaneRelationsDemo;
