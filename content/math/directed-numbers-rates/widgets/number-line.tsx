import { renderLatex, renderMathInContainer } from "@ofb/katex";
import { createEffect, createMemo, createSignal } from "solid-js";

const MIN = -10;
const MAX = 10;
const WIDTH = 400;
const PAD = 28;
const PLOT = WIDTH - 2 * PAD;

function formatNum(n: number) {
  if (Number.isInteger(n)) return String(n);
  return (Math.round(n * 100) / 100).toString();
}

function toX(value: number) {
  const t = (value - MIN) / (MAX - MIN);
  return PAD + t * PLOT;
}

function NumberLine() {
  const [a, setA] = createSignal(3);
  const [b, setB] = createSignal(-2);
  let canvasRef: HTMLCanvasElement | undefined;
  const sum = createMemo(() => a() + b());

  const equationHtml = createMemo(() =>
    renderLatex(`${formatNum(a())} + (${formatNum(b())}) = ${formatNum(sum())}`)
  );

  const redraw = () => {
    const canvas = canvasRef;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const h = 120;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = WIDTH * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const style = getComputedStyle(canvas);
    const grid = style.getPropertyValue("--math-grid").trim() || "#e5e5e5";
    const axis = style.getPropertyValue("--math-axis").trim() || "#a8a29e";
    const curve = style.getPropertyValue("--math-curve").trim() || "#9a6b2e";
    const root = style.getPropertyValue("--math-root").trim() || "#2563eb";
    const vertex = style.getPropertyValue("--math-vertex").trim() || "#4a6b4a";
    const bg = style.getPropertyValue("--math-canvas-bg").trim() || "#ffffff";

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, WIDTH, h);

    const y = h / 2;
    ctx.strokeStyle = grid;
    ctx.lineWidth = 1;
    for (let v = MIN; v <= MAX; v++) {
      const x = toX(v);
      ctx.beginPath();
      ctx.moveTo(x, y - 4);
      ctx.lineTo(x, y + 4);
      ctx.stroke();
    }

    ctx.strokeStyle = axis;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(PAD, y);
    ctx.lineTo(WIDTH - PAD, y);
    ctx.stroke();

    ctx.fillStyle = axis;
    ctx.font = "10px IBM Plex Mono, monospace";
    ctx.textAlign = "center";
    for (let v = MIN; v <= MAX; v += 2) {
      ctx.fillText(String(v), toX(v), y + 18);
    }

    const drawTick = (value: number, color: string, radius: number) => {
      const x = toX(value);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const av = a();
    const bv = b();
    const sv = sum();

    drawTick(av, root, 6);
    drawTick(bv, vertex, 6);
    drawTick(sv, curve, 7);

    ctx.strokeStyle = curve;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(toX(av), y);
    ctx.lineTo(toX(sv), y);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  createEffect(() => {
    a();
    b();
    sum();
    redraw();
  });

  return (
    <section class="math-widget" aria-labelledby="number-line-title">
      <h2 id="number-line-title" class="math-widget__title">Number-line addition</h2>
      <div class="math-widget__body">
        <div class="math-widget__controls">
          <div class="scenario-demo__control">
            <label class="scenario-demo__label" for="nl-a">
              <span>First number a</span>
              <span class="scenario-demo__value">{formatNum(a())}</span>
            </label>
            <input
              id="nl-a"
              class="scenario-demo__slider"
              type="range"
              min={MIN}
              max={MAX}
              step={1}
              value={a()}
              onInput={(e) => setA(Number(e.currentTarget.value))}
            />
          </div>
          <div class="scenario-demo__control">
            <label class="scenario-demo__label" for="nl-b">
              <span>Second number b</span>
              <span class="scenario-demo__value">{formatNum(b())}</span>
            </label>
            <input
              id="nl-b"
              class="scenario-demo__slider"
              type="range"
              min={MIN}
              max={MAX}
              step={1}
              value={b()}
              onInput={(e) => setB(Number(e.currentTarget.value))}
            />
          </div>
        </div>
        <div class="math-widget__formula" innerHTML={equationHtml()} aria-live="polite" />
        <figure class="math-widget__figure">
          <canvas
            ref={(el) => {
              canvasRef = el;
              redraw();
            }}
            class="math-widget__canvas"
            width={WIDTH}
            height={120}
            role="img"
            aria-label={`Number line showing ${formatNum(a())} plus ${formatNum(b())} equals ${formatNum(sum())}`}
          />
          <figcaption
            class="math-widget__caption"
            ref={(el) => {
              if (el) renderMathInContainer(el);
            }}
          >
            Blue: \(a\). Green: \(b\). Gold: sum \(a+b\). Dashed segment shows the move from \(a\) to
            \(a+b\).
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export default NumberLine;
