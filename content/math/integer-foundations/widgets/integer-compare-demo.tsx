import { onCleanup, onMount } from "solid-js";

const MIN_VALUE = -10;
const MAX_VALUE = 10;
const STEP = 0.5;

function clampToStep(value: number) {
  const clamped = Math.max(MIN_VALUE, Math.min(MAX_VALUE, value));
  return Math.round(clamped / STEP) * STEP;
}

function relationSymbol(a: number, b: number) {
  if (a > b) return ">";
  if (a < b) return "<";
  return "=";
}

type DemoPalette = {
  canvasFill: string;
  distanceBand: string;
  positiveRay: string;
  negativeRay: string;
  axisLine: string;
  arrow: string;
  majorTick: string;
  minorTick: string;
  tickLabel: string;
  axisLabel: string;
  guideLine: string;
  absoluteLabelBg: string;
  absoluteLabelText: string;
  pointValueText: string;
  pointRing: string;
  pointA: string;
  pointB: string;
};

function resolvePalette(): DemoPalette {
  const explicitTheme = document.documentElement.getAttribute("data-theme");
  const isDark =
    explicitTheme === "dark" ||
    (explicitTheme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (isDark) {
    return {
      canvasFill: "#0f172a",
      distanceBand: "rgba(56, 189, 248, 0.8)",
      positiveRay: "#22d3ee",
      negativeRay: "#fda4af",
      axisLine: "#e2e8f0",
      arrow: "#f1f5f9",
      majorTick: "#e2e8f0",
      minorTick: "#94a3b8",
      tickLabel: "#f8fafc",
      axisLabel: "#cbd5e1",
      guideLine: "rgba(226, 232, 240, 0.65)",
      absoluteLabelBg: "rgba(15, 23, 42, 0.82)",
      absoluteLabelText: "#f8fafc",
      pointValueText: "#f8fafc",
      pointRing: "#0f172a",
      pointA: "#2dd4bf",
      pointB: "#f59e0b",
    };
  }

  return {
    canvasFill: "rgba(148, 163, 184, 0.08)",
    distanceBand: "rgba(14, 116, 144, 0.75)",
    positiveRay: "#0f766e",
    negativeRay: "#b91c1c",
    axisLine: "#334155",
    arrow: "#64748b",
    majorTick: "#475569",
    minorTick: "#94a3b8",
    tickLabel: "#475569",
    axisLabel: "#64748b",
    guideLine: "rgba(15, 23, 42, 0.25)",
    absoluteLabelBg: "rgba(255, 255, 255, 0.92)",
    absoluteLabelText: "#0f172a",
    pointValueText: "#0f172a",
    pointRing: "#ffffff",
    pointA: "#0f766e",
    pointB: "#b45309",
  };
}

function IntegerCompareDemo() {
  let rootRef: HTMLDivElement | undefined;
  let canvasRef: HTMLCanvasElement | undefined;
  let valueARef: HTMLSpanElement | undefined;
  let valueBRef: HTMLSpanElement | undefined;
  let relationRef: HTMLSpanElement | undefined;
  let distanceRef: HTMLSpanElement | undefined;

  onMount(() => {
    const canvas = canvasRef;
    if (!canvas) return;
    const ctxCandidate = canvas.getContext("2d");
    if (!(ctxCandidate instanceof CanvasRenderingContext2D)) return;
    const ctx: CanvasRenderingContext2D = ctxCandidate;
    const canvasEl: HTMLCanvasElement = canvas;

    let valueA = -2;
    let valueB = -5;
    let dragging: "a" | "b" | null = null;
    let dpr = window.devicePixelRatio || 1;
    let logicalWidth = 760;
    let logicalHeight = 260;

    const marginX = 40;
    const axisY = 164;
    const handleY = 98;

    const pxPerUnit = () => (logicalWidth - marginX * 2) / (MAX_VALUE - MIN_VALUE);
    const toScreenX = (value: number) => marginX + (value - MIN_VALUE) * pxPerUnit();
    const fromScreenX = (screenX: number) => MIN_VALUE + (screenX - marginX) / pxPerUnit();

    function drawArrowHead(x: number, y: number, direction: 1 | -1, color: string) {
      const size = 7;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - direction * size, y - size * 0.75);
      ctx.lineTo(x - direction * size, y + size * 0.75);
      ctx.closePath();
      ctx.fill();
    }

    function drawPoint(x: number, y: number, color: string, ringColor: string) {
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = ringColor;
      ctx.stroke();
    }

    function updateText() {
      if (valueARef) valueARef.textContent = valueA.toFixed(1);
      if (valueBRef) valueBRef.textContent = valueB.toFixed(1);
      if (relationRef) relationRef.textContent = relationSymbol(valueA, valueB);
      if (distanceRef) distanceRef.textContent = Math.abs(valueA - valueB).toFixed(1);
    }

    function draw() {
      const palette = resolvePalette();
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);

      ctx.fillStyle = palette.canvasFill;
      ctx.fillRect(0, 0, logicalWidth, logicalHeight);

      const xA = toScreenX(valueA);
      const xB = toScreenX(valueB);
      const xZero = toScreenX(0);
      const minX = Math.min(xA, xB);
      const maxX = Math.max(xA, xB);

      ctx.strokeStyle = palette.distanceBand;
      ctx.lineWidth = 9;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(minX, axisY);
      ctx.lineTo(maxX, axisY);
      ctx.stroke();

      const drawZeroRay = (value: number, x: number, y: number) => {
        if (value === 0) return;
        ctx.strokeStyle = value > 0 ? palette.positiveRay : palette.negativeRay;
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(xZero, y);
        ctx.lineTo(x, y);
        ctx.stroke();
      };

      drawZeroRay(valueA, xA, axisY - 12);
      drawZeroRay(valueB, xB, axisY + 12);

      ctx.strokeStyle = palette.axisLine;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(marginX - 12, axisY);
      ctx.lineTo(logicalWidth - marginX + 12, axisY);
      ctx.stroke();

      drawArrowHead(logicalWidth - marginX + 12, axisY, 1, palette.arrow);
      drawArrowHead(marginX - 12, axisY, -1, palette.arrow);

      for (let tick = MIN_VALUE; tick <= MAX_VALUE; tick += 1) {
        const x = toScreenX(tick);
        const major = tick % 2 === 0;

        ctx.strokeStyle = major ? palette.majorTick : palette.minorTick;
        ctx.lineWidth = major ? 1.5 : 1;
        ctx.beginPath();
        ctx.moveTo(x, axisY - (major ? 9 : 6));
        ctx.lineTo(x, axisY + (major ? 9 : 6));
        ctx.stroke();

        if (major) {
          ctx.font = "12px var(--mono, ui-monospace, monospace)";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillStyle = palette.tickLabel;
          ctx.fillText(String(tick), x, axisY + 11);
        }
      }

      ctx.font = "600 12px var(--font-sans, system-ui, sans-serif)";
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillStyle = palette.axisLabel;
      ctx.fillText("Number line", logicalWidth - marginX + 12, axisY - 12);

      ctx.strokeStyle = palette.guideLine;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(xA, handleY + 12);
      ctx.lineTo(xA, axisY - 12);
      ctx.moveTo(xB, handleY + 12);
      ctx.lineTo(xB, axisY - 12);
      ctx.stroke();
      ctx.setLineDash([]);

      drawPoint(xA, handleY, palette.pointA, palette.pointRing);
      drawPoint(xB, handleY, palette.pointB, palette.pointRing);

      const drawPointValue = (x: number, value: number) => {
        const text = value.toFixed(1);
        const y = handleY - 20;
        ctx.font = "700 12px var(--mono, ui-monospace, monospace)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = palette.pointValueText;
        ctx.fillText(text, x, y);
      };

      drawPointValue(xA, valueA);
      drawPointValue(xB, valueB);

      const absText = `|A - B| = ${Math.abs(valueA - valueB).toFixed(1)}`;
      const absX = (xA + xB) / 2;
      const absY = axisY - 30;
      ctx.font = "700 12px var(--mono, ui-monospace, monospace)";
      const absTextWidth = ctx.measureText(absText).width;
      ctx.fillStyle = palette.absoluteLabelBg;
      ctx.fillRect(absX - absTextWidth / 2 - 6, absY - 9, absTextWidth + 12, 18);
      ctx.fillStyle = palette.absoluteLabelText;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(absText, absX, absY);
      updateText();
    }

    function resize() {
      dpr = window.devicePixelRatio || 1;
      const rect = canvasEl.getBoundingClientRect();
      logicalWidth = Math.max(320, rect.width);
      logicalHeight = 260;

      canvasEl.width = Math.round(logicalWidth * dpr);
      canvasEl.height = Math.round(logicalHeight * dpr);
      canvasEl.style.height = `${logicalHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      draw();
    }

    function pickHandle(pointerX: number, pointerY: number) {
      const xA = toScreenX(valueA);
      const xB = toScreenX(valueB);
      const distA = Math.hypot(pointerX - xA, pointerY - handleY);
      const distB = Math.hypot(pointerX - xB, pointerY - handleY);
      if (distA <= 18 && distA <= distB) return "a";
      if (distB <= 18) return "b";
      return null;
    }

    function onPointerDown(event: PointerEvent) {
      const rect = canvasEl.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      dragging = pickHandle(x, y);
      if (!dragging) return;
      canvasEl.setPointerCapture(event.pointerId);
      canvasEl.style.cursor = "grabbing";
      event.preventDefault();
    }

    function onPointerMove(event: PointerEvent) {
      if (!dragging) {
        const rect = canvasEl.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        canvasEl.style.cursor = pickHandle(x, y) ? "grab" : "default";
        return;
      }
      const rect = canvasEl.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const next = clampToStep(fromScreenX(x));
      if (dragging === "a") {
        valueA = next;
      } else {
        valueB = next;
      }
      draw();
      event.preventDefault();
    }

    function onPointerEnd(event: PointerEvent) {
      if (dragging) {
        canvasEl.releasePointerCapture(event.pointerId);
      }
      dragging = null;
      canvasEl.style.cursor = "default";
    }

    function onResetClick() {
      valueA = -2;
      valueB = -5;
      draw();
    }

    const resetBtn = rootRef?.querySelector<HTMLButtonElement>("[data-compare-reset]");
    resetBtn?.addEventListener("click", onResetClick);

    canvasEl.addEventListener("pointerdown", onPointerDown);
    canvasEl.addEventListener("pointermove", onPointerMove);
    canvasEl.addEventListener("pointerup", onPointerEnd);
    canvasEl.addEventListener("pointercancel", onPointerEnd);
    window.addEventListener("resize", resize);

    const themeObserver = new MutationObserver(() => {
      draw();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemThemeChange = () => draw();
    darkQuery.addEventListener("change", onSystemThemeChange);

    resize();

    onCleanup(() => {
      resetBtn?.removeEventListener("click", onResetClick);
      canvasEl.removeEventListener("pointerdown", onPointerDown);
      canvasEl.removeEventListener("pointermove", onPointerMove);
      canvasEl.removeEventListener("pointerup", onPointerEnd);
      canvasEl.removeEventListener("pointercancel", onPointerEnd);
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();
      darkQuery.removeEventListener("change", onSystemThemeChange);
    });
  });

  return (
    <section class="math-widget integer-compare-demo" aria-labelledby="integer-compare-demo-title">
      <h3 id="integer-compare-demo-title" class="math-widget__title">
        Comparison demo: drag A and B on the number line
      </h3>
      <div class="math-widget__body" ref={rootRef}>
        <p class="math-widget__caption">
          Drag each point horizontally. The point farther right is greater. The highlighted segment
          shows absolute distance.
        </p>
        <canvas
          ref={canvasRef}
          class="integer-compare-demo__canvas"
          aria-label="Interactive number line for comparing integers"
        />
        <p class="integer-compare-demo__readout" aria-live="polite">
          A = <span ref={valueARef}>-2.0</span>, B = <span ref={valueBRef}>-5.0</span>, so A{" "}
          <span ref={relationRef}>{">"}</span> B and |A - B| ={" "}
          <span ref={distanceRef}>3.0</span>
        </p>
        <div class="integer-compare-demo__actions">
          <button
            type="button"
            class="scenario-demo__btn integer-compare-demo__reset-btn"
            data-compare-reset
            aria-label="Reset example"
            title="Reset example"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-reload">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
              <path d="M20 4v5h-5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default IntegerCompareDemo;
