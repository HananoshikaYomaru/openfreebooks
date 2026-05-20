import { renderLatex } from "@ofb/katex";
import { createEffect, createMemo, createSignal, For, onCleanup, Show } from "solid-js";
import { computeRoots, discriminant, formatNum } from "../../../../frontend/src/lib/math-graph";

const HORIZONTAL_SPEED = 12;

function SliderRow(props: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  disabled?: boolean;
  onInput: (v: number) => void;
}) {
  const display = () =>
    props.unit ? `${formatNum(props.value)} ${props.unit}` : formatNum(props.value);

  return (
    <div class="scenario-demo__control">
      <label class="scenario-demo__label" for={props.id}>
        <span>{props.label}</span>
        <span class="scenario-demo__value">{display()}</span>
      </label>
      <input
        id={props.id}
        class="scenario-demo__slider"
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        disabled={props.disabled}
        onInput={(e) => props.onInput(Number(e.currentTarget.value))}
      />
    </div>
  );
}

export function ProjectileDemo() {
  const [v0y, setV0y] = createSignal(20);
  const [g, setG] = createSignal(10);
  const [h0, setH0] = createSignal(0);
  const [t, setT] = createSignal(0);
  const [playing, setPlaying] = createSignal(false);

  let canvasRef: HTMLCanvasElement | undefined;
  let rafId: number | undefined;
  let playStart = 0;

  const heightAt = (time: number) => h0() + v0y() * time - 0.5 * g() * time * time;
  const distanceAt = (time: number) => HORIZONTAL_SPEED * time;

  const landingTime = createMemo(() => {
    const a = -0.5 * g();
    const d = discriminant(a, v0y(), h0());
    const roots = computeRoots(a, v0y(), h0(), d);
    const positive = roots.filter((r) => r > 0.01);
    if (positive.length > 0) return Math.max(...positive);
    return Math.max(2, (2 * v0y()) / g());
  });

  const maxX = createMemo(() => distanceAt(landingTime()) * 1.1 + 5);
  const maxY = createMemo(() => {
    const peak = h0() + (v0y() * v0y()) / (2 * g());
    return Math.max(peak * 1.15, h0() + 2, 5);
  });

  const drawScene = (time: number) => {
    const canvas = canvasRef;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 400;
    const h = 240;
    const pad = { l: 36, r: 12, t: 12, b: 28 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const mx = maxX();
    const my = maxY();

    const toX = (x: number) => pad.l + (x / mx) * plotW;
    const toY = (y: number) => pad.t + plotH - (y / my) * plotH;

    ctx.fillStyle = getComputedStyle(canvas).getPropertyValue("--math-canvas-bg").trim() || "#fff";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = getComputedStyle(canvas).getPropertyValue("--math-grid").trim() || "#e5e5e5";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (my * i) / 4;
      const py = toY(y);
      ctx.beginPath();
      ctx.moveTo(pad.l, py);
      ctx.lineTo(w - pad.r, py);
      ctx.stroke();
    }

    ctx.strokeStyle = getComputedStyle(canvas).getPropertyValue("--math-axis").trim() || "#a8a29e";
    ctx.lineWidth = 2;
    const groundY = toY(0);
    ctx.beginPath();
    ctx.moveTo(pad.l, groundY);
    ctx.lineTo(w - pad.r, groundY);
    ctx.stroke();

    ctx.strokeStyle = getComputedStyle(canvas).getPropertyValue("--math-curve").trim() || "#9a6b2e";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const steps = 80;
    const tEnd = landingTime();
    for (let i = 0; i <= steps; i++) {
      const ti = (tEnd * i) / steps;
      const px = toX(distanceAt(ti));
      const py = toY(Math.max(0, heightAt(ti)));
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    const bx = distanceAt(time);
    const by = heightAt(time);
    const cx = toX(bx);
    const cy = toY(Math.max(0, by));

    ctx.fillStyle = getComputedStyle(canvas).getPropertyValue("--math-curve").trim() || "#9a6b2e";
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = getComputedStyle(canvas).getPropertyValue("--muted").trim() || "#767676";
    ctx.font = "11px IBM Plex Mono, monospace";
    ctx.fillText("x (m)", w / 2 - 12, h - 6);
    ctx.save();
    ctx.translate(10, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("h (m)", 0, 0);
    ctx.restore();
  };

  const stopPlayback = () => {
    if (rafId !== undefined) {
      cancelAnimationFrame(rafId);
      rafId = undefined;
    }
    setPlaying(false);
  };

  const startPlayback = () => {
    stopPlayback();
    setT(0);
    setPlaying(true);
    playStart = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - playStart) / 1000;
      const tEnd = landingTime();
      if (elapsed >= tEnd) {
        setT(tEnd);
        drawScene(tEnd);
        stopPlayback();
        return;
      }
      setT(elapsed);
      drawScene(elapsed);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
  };

  createEffect(() => {
    v0y();
    g();
    h0();
    t();
    if (!playing()) drawScene(t());
  });

  onCleanup(() => stopPlayback());

  return (
    <section
      class="scenario-demo scenario-demo--projectile"
      aria-label="Projectile motion interactive example"
    >
      <div class="scenario-demo__stage">
        <canvas
          ref={(el) => {
            canvasRef = el;
            drawScene(0);
          }}
          class="projectile-scenario__canvas"
          width={400}
          height={240}
          role="img"
          aria-label="Side view of projectile path with horizontal and vertical position"
        />
        <p class="scenario-demo__live" aria-live="polite">
          t = {formatNum(t())} s · x = {formatNum(distanceAt(t()))} m · h ={" "}
          {formatNum(Math.max(0, heightAt(t())))} m
        </p>
        <p class="scenario-demo__note scenario-demo__note--muted">
          Horizontal speed is fixed at {HORIZONTAL_SPEED} m/s. Height follows
          \(h = h_0 + v_0 t - \frac{1}{2}gt^2\).
        </p>
      </div>
      <div class="scenario-demo__panel">
        <div class="scenario-demo__controls">
          <SliderRow
            id="projectile-v0"
            label="Launch speed (vertical) v₀"
            value={v0y()}
            min={5}
            max={35}
            step={1}
            unit="m/s"
            disabled={playing()}
            onInput={setV0y}
          />
          <SliderRow
            id="projectile-g"
            label="Gravity g"
            value={g()}
            min={5}
            max={15}
            step={0.5}
            unit="m/s²"
            disabled={playing()}
            onInput={setG}
          />
          <SliderRow
            id="projectile-h0"
            label="Start height h₀"
            value={h0()}
            min={0}
            max={15}
            step={1}
            unit="m"
            disabled={playing()}
            onInput={setH0}
          />
        </div>
        <div class="scenario-demo__actions">
          <button
            type="button"
            class="scenario-demo__btn scenario-demo__btn--primary"
            onClick={() => (playing() ? stopPlayback() : startPlayback())}
          >
            {playing() ? "Stop" : "Start"}
          </button>
          <button
            type="button"
            class="scenario-demo__btn"
            disabled={playing()}
            onClick={() => {
              stopPlayback();
              setT(0);
              drawScene(0);
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}

const PROFIT_PRICE_MIN = 5;
const PROFIT_PRICE_MAX = 20;
/** Π(p) = -2p² + 40p - 150 with Q(p) = 40 - 2p and fixed cost C = $150 */
const PROFIT_OPTIMAL_PRICE = 10;
const PROFIT_FIXED_COST = 150;

const demandQuantity = (price: number) => Math.max(0, 40 - 2 * price);
const demandPrice = (quantity: number) => Math.max(0, (40 - quantity) / 2);
const profitAtPrice = (price: number) => -2 * price * price + 40 * price - 150;
const revenueAtQ = (q: number) => q * demandPrice(q);
const costAtQ = (_q: number) => PROFIT_FIXED_COST;
const profitAtQ = (q: number) => revenueAtQ(q) - costAtQ(q);

function drawProfitChart(
  canvas: HTMLCanvasElement,
  price: number,
  quantity: number,
  revenue: number,
  cost: number,
  profit: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = 400;
  const h = 240;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const bg = getComputedStyle(canvas).getPropertyValue("--math-canvas-bg").trim() || "#fff";
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const pad = { l: 44, r: 44, t: 20, b: 40 };
  const plotW = w - pad.l - pad.r;
  const plotH = h - pad.t - pad.b;

  const qMax = 42;
  const pMax = 22;
  let dollarMin = -120;
  let dollarMax = 420;
  for (let q = 0; q <= 40; q += 1) {
    dollarMin = Math.min(dollarMin, profitAtQ(q), revenueAtQ(q));
    dollarMax = Math.max(dollarMax, profitAtQ(q), revenueAtQ(q), costAtQ(q));
  }
  const dollarSpan = dollarMax - dollarMin || 1;

  const toX = (q: number) => pad.l + (q / qMax) * plotW;
  const toPriceY = (p: number) => pad.t + plotH - (p / pMax) * plotH;
  const toDollarY = (d: number) => pad.t + plotH - ((d - dollarMin) / dollarSpan) * plotH;

  const grid = getComputedStyle(canvas).getPropertyValue("--math-grid").trim() || "#e5e5e5";
  const axis = getComputedStyle(canvas).getPropertyValue("--math-axis").trim() || "#a8a29e";
  const ink = getComputedStyle(canvas).getPropertyValue("--ink").trim() || "#1a1a1a";
  const muted = getComputedStyle(canvas).getPropertyValue("--muted").trim() || "#767676";

  ctx.strokeStyle = grid;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const py = pad.t + (plotH * i) / 4;
    ctx.beginPath();
    ctx.moveTo(pad.l, py);
    ctx.lineTo(w - pad.r, py);
    ctx.stroke();
  }

  ctx.strokeStyle = axis;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad.l, pad.t);
  ctx.lineTo(pad.l, h - pad.b);
  ctx.lineTo(w - pad.r, h - pad.b);
  ctx.stroke();

  const drawCurve = (
    fn: (q: number) => number,
    toY: (v: number) => number,
    color: string,
    width = 2,
    dash: number[] = []
  ) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const q = (40 * i) / 80;
      const px = toX(q);
      const py = toY(fn(q));
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  };

  drawCurve(demandPrice, toPriceY, getComputedStyle(canvas).getPropertyValue("--math-root").trim() || "#2563eb", 2.5);
  drawCurve(revenueAtQ, toDollarY, "#4a6b4a", 2);
  drawCurve(costAtQ, toDollarY, "#a8a29e", 2);
  drawCurve(
    profitAtQ,
    toDollarY,
    getComputedStyle(canvas).getPropertyValue("--math-curve").trim() || "#9a6b2e",
    2.5
  );

  const qOpt = demandQuantity(PROFIT_OPTIMAL_PRICE);
  const pxOpt = toX(qOpt);
  const pyOptP = toPriceY(PROFIT_OPTIMAL_PRICE);
  const pyOptPi = toDollarY(profitAtQ(qOpt));
  ctx.fillStyle = getComputedStyle(canvas).getPropertyValue("--success").trim() || "#2a7d52";
  ctx.beginPath();
  ctx.arc(pxOpt, pyOptP, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(pxOpt, pyOptPi, 5, 0, Math.PI * 2);
  ctx.fill();

  const qx = toX(quantity);
  const py = toPriceY(price);
  const pRev = toDollarY(revenue);
  const pCost = toDollarY(cost);
  const pProfit = toDollarY(profit);

  ctx.strokeStyle = muted;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(qx, pad.t);
  ctx.lineTo(qx, h - pad.b);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = getComputedStyle(canvas).getPropertyValue("--math-root").trim() || "#2563eb";
  ctx.beginPath();
  ctx.arc(qx, py, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#4a6b4a";
  ctx.beginPath();
  ctx.arc(qx, pRev, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#a8a29e";
  ctx.beginPath();
  ctx.arc(qx, pCost, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = getComputedStyle(canvas).getPropertyValue("--math-curve").trim() || "#9a6b2e";
  ctx.beginPath();
  ctx.arc(qx, pProfit, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = "10px IBM Plex Mono, monospace";
  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.fillText("Quantity Q (books)", w / 2, h - 6);

  ctx.save();
  ctx.translate(12, h / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.fillText("Price P ($)", 0, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(w - 10, h / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.fillStyle = muted;
  ctx.fillText("$ (R, C, Π)", 0, 0);
  ctx.restore();

  ctx.font = "9px IBM Plex Mono, monospace";
  ctx.textAlign = "left";
  const legendX = pad.l + 6;
  let legendY = pad.t + 6;
  const legend = [
    { color: getComputedStyle(canvas).getPropertyValue("--math-root").trim() || "#2563eb", label: "Demand" },
    { color: "#4a6b4a", label: "Revenue" },
    { color: "#a8a29e", label: "Cost" },
    { color: getComputedStyle(canvas).getPropertyValue("--math-curve").trim() || "#9a6b2e", label: "Profit Π" },
  ];
  for (const item of legend) {
    ctx.fillStyle = item.color;
    ctx.fillRect(legendX, legendY, 10, 3);
    ctx.fillStyle = ink;
    ctx.fillText(item.label, legendX + 14, legendY + 4);
    legendY += 14;
  }
}

export function ProfitDemo() {
  const [price, setPrice] = createSignal(10);
  let canvasRef: HTMLCanvasElement | undefined;

  const quantity = createMemo(() => demandQuantity(price()));
  const revenue = createMemo(() => price() * quantity());
  const cost = createMemo(() => costAtQ(quantity()));
  const profit = createMemo(() => revenue() - cost());
  const atOptimum = createMemo(() => Math.abs(price() - PROFIT_OPTIMAL_PRICE) < 0.26);

  const formulaHtml = createMemo(() => renderLatex(`\\Pi = -2p^2 + 40p - 150`));

  const redraw = () => {
    if (!canvasRef) return;
    drawProfitChart(
      canvasRef,
      price(),
      quantity(),
      revenue(),
      cost(),
      profit()
    );
  };

  createEffect(() => {
    price();
    quantity();
    revenue();
    cost();
    profit();
    redraw();
  });

  return (
    <section
      class="scenario-demo scenario-demo--profit"
      aria-label="Profit and pricing interactive example"
    >
      <div class="scenario-demo__stage scenario-demo__stage--wide">
        <p class="profit-scenario__scenario">
          A textbook shop sets price <strong>${formatNum(price())}</strong>. Higher price means
          lower demand: <strong>{formatNum(quantity())}</strong> books sold (demand curve). Revenue,
          cost, and profit Π are read off the curves at that quantity.
        </p>
        <canvas
          ref={(el) => {
            canvasRef = el;
            redraw();
          }}
          class="profit-scenario__canvas"
          width={400}
          height={240}
          role="img"
          aria-label="Demand, revenue, cost, and profit curves with quantity on the horizontal axis"
        />
        <SliderRow
          id="profit-price"
          label="Price per book P"
          value={price()}
          min={PROFIT_PRICE_MIN}
          max={PROFIT_PRICE_MAX}
          step={0.5}
          unit="$"
          onInput={setPrice}
        />
      </div>
      <div class="scenario-demo__panel">
        <div class="scenario-demo__formula" aria-live="polite">
          <p class="scenario-demo__formula-label">Profit model</p>
          <div class="scenario-demo__formula-math" innerHTML={formulaHtml()} />
        </div>
        <div class="scenario-demo__stats">
          <div class="scenario-demo__stat">
            <span class="scenario-demo__stat-label">Books sold</span>
            <span class="scenario-demo__stat-value">{formatNum(quantity())}</span>
          </div>
          <div class="scenario-demo__stat">
            <span class="scenario-demo__stat-label">Revenue</span>
            <span class="scenario-demo__stat-value">${formatNum(revenue())}</span>
          </div>
          <div class="scenario-demo__stat">
            <span class="scenario-demo__stat-label">Cost</span>
            <span class="scenario-demo__stat-value">${formatNum(cost())}</span>
          </div>
          <div class="scenario-demo__stat scenario-demo__stat--highlight">
            <span class="scenario-demo__stat-label">Profit Π</span>
            <span class="scenario-demo__stat-value">${formatNum(profit())}</span>
          </div>
        </div>
        <p
          class="profit-scenario__optimum"
          classList={{ "profit-scenario__optimum--on": atOptimum() }}
          role="status"
          aria-live="polite"
        >
          {atOptimum()
            ? `Maximum profit at P = $${formatNum(PROFIT_OPTIMAL_PRICE)} (Q = ${formatNum(demandQuantity(PROFIT_OPTIMAL_PRICE))}, Π = $${formatNum(profitAtPrice(PROFIT_OPTIMAL_PRICE))}).`
            : "Profit is positive between break-even prices P = $5 and P = $15. Drag toward the peak of the gold curve."}
        </p>
        <p class="scenario-demo__note scenario-demo__note--muted">
          Blue: demand (P vs Q). Green, gray, gold: revenue, cost, and profit in dollars (right
          scale).
        </p>
      </div>
    </section>
  );
}

export function AreaDemo() {
  const [perimeter, setPerimeter] = createSignal(20);
  const [widthUnits, setWidthUnits] = createSignal(5);
  const [dragging, setDragging] = createSignal(false);

  let gridRef: HTMLDivElement | undefined;

  const halfP = createMemo(() => Math.round(perimeter() / 2));
  const lengthUnits = createMemo(() => halfP() - widthUnits());
  const area = createMemo(() => widthUnits() * lengthUnits());
  const maxArea = createMemo(() => {
    const h = halfP();
    let best = 0;
    for (let w = 1; w < h; w += 1) {
      best = Math.max(best, w * (h - w));
    }
    return best;
  });
  const isMax = createMemo(() => area() === maxArea());

  const clampWidth = (w: number, h: number) =>
    Math.max(1, Math.min(h - 1, Math.round(w)));

  const widthFromPointer = (clientX: number) => {
    const grid = gridRef;
    if (!grid) return widthUnits();
    const h = halfP();
    const bounds = grid.getBoundingClientRect();
    const cell = bounds.width / h;
    const col = Math.floor((clientX - bounds.left) / cell) + 1;
    return clampWidth(col, h);
  };

  const onCornerPointerDown = (e: PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
    setWidthUnits(widthFromPointer(e.clientX));

    const onMove = (ev: PointerEvent) => setWidthUnits(widthFromPointer(ev.clientX));
    const onUp = () => {
      setDragging(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const changePerimeter = (p: number) => {
    const newHalf = Math.round(p / 2);
    const oldHalf = halfP();
    const ratio = oldHalf > 0 ? widthUnits() / oldHalf : 0.5;
    setPerimeter(p);
    setWidthUnits(clampWidth(Math.round(ratio * newHalf), newHalf));
  };

  createEffect(() => {
    const h = halfP();
    const clamped = clampWidth(widthUnits(), h);
    if (widthUnits() !== clamped) setWidthUnits(clamped);
  });

  return (
    <section
      class="scenario-demo scenario-demo--area"
      aria-label="Fixed perimeter area interactive example"
    >
      <div class="scenario-demo__stage">
        <div class="area-scenario__garden">
          <p class="area-scenario__fence-label">
            Each square is 1 m. Perimeter P = {perimeter()} m (fixed while resizing). Drag the
            corner — snaps to whole metres.
          </p>
          <div
            class="area-scenario__grid-wrap"
            ref={gridRef}
            style={{ "--grid-units": String(halfP()) }}
          >
            <div class="area-scenario__grid" role="img" aria-hidden="true">
              <For each={Array.from({ length: halfP() * halfP() })}>
                {() => <span class="area-scenario__cell" />}
              </For>
            </div>
            <div
              class="area-scenario__rect"
              classList={{
                "area-scenario__rect--max": isMax(),
                "area-scenario__rect--dragging": dragging(),
              }}
              style={{
                width: `calc(${widthUnits()} * var(--cell-size))`,
                height: `calc(${lengthUnits()} * var(--cell-size))`,
              }}
            >
              <span class="area-scenario__dim area-scenario__dim--w">
                w = {widthUnits()} m
              </span>
              <span class="area-scenario__dim area-scenario__dim--l">
                ℓ = {lengthUnits()} m
              </span>
              <button
                type="button"
                class="area-scenario__corner"
                aria-label="Resize rectangle; perimeter stays fixed"
                onPointerDown={onCornerPointerDown}
              />
            </div>
          </div>
          <p class="scenario-demo__live" aria-live="polite">
            2w + 2ℓ = {perimeter()} m · w + ℓ = {halfP()} m
          </p>
        </div>
        <SliderRow
          id="area-perimeter"
          label="Set fence perimeter P"
          value={perimeter()}
          min={12}
          max={40}
          step={2}
          unit="m"
          disabled={dragging()}
          onInput={changePerimeter}
        />
      </div>
      <div class="scenario-demo__panel">
        <div class="scenario-demo__formula" aria-live="polite">
          <p class="scenario-demo__formula-label">Area model</p>
          <div
            class="scenario-demo__formula-math"
            innerHTML={renderLatex(
              `A = w(\\tfrac{${perimeter()}}{2} - w) = ${widthUnits()} \\times ${lengthUnits()} = ${area()}`
            )}
          />
        </div>
        <div class="scenario-demo__stats">
          <div class="scenario-demo__stat scenario-demo__stat--highlight">
            <span class="scenario-demo__stat-label">Area A</span>
            <span class="scenario-demo__stat-value">{area()} m²</span>
          </div>
          <div class="scenario-demo__stat">
            <span class="scenario-demo__stat-label">Largest possible</span>
            <span class="scenario-demo__stat-value">{maxArea()} m²</span>
          </div>
        </div>
        <p
          class="area-scenario__badge area-scenario__badge--panel"
          classList={{ "area-scenario__badge--visible": isMax() }}
          role="status"
          aria-live="polite"
        >
          {isMax()
            ? `Maximum area on this grid — ${widthUnits()} m × ${lengthUnits()} m (A = ${area()} m²).`
            : "\u00a0"}
        </p>
      </div>
    </section>
  );
}
