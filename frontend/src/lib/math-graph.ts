export const VIEW_SIZE = 400;
const PAD = 36;

export type GraphBounds = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export type GraphColors = {
  grid: string;
  axis: string;
  curve: string;
  marker: string;
  root: string;
  bg: string;
};

export function formatNum(n: number, digits = 2) {
  if (Number.isInteger(n)) return String(n);
  const p = 10 ** digits;
  return String(Math.round(n * p) / p);
}

export function discriminant(a: number, b: number, c: number) {
  return b * b - 4 * a * c;
}

export function computeRoots(a: number, b: number, c: number, delta: number) {
  if (delta < 0 || Math.abs(a) < 1e-9) return [] as number[];
  if (delta === 0) return [-b / (2 * a)];
  const sqrtDelta = Math.sqrt(delta);
  return [(-b + sqrtDelta) / (2 * a), (-b - sqrtDelta) / (2 * a)].sort((x, y) => x - y);
}

export function natureOfRoots(delta: number) {
  if (delta > 0) return "Two distinct real roots";
  if (delta === 0) return "One repeated real root";
  return "No real roots";
}

export function readGraphColors(canvas: HTMLCanvasElement): GraphColors {
  const style = getComputedStyle(canvas);
  return {
    grid: style.getPropertyValue("--math-grid").trim() || "#e5e5e5",
    axis: style.getPropertyValue("--math-axis").trim() || "#a8a29e",
    curve: style.getPropertyValue("--math-curve").trim() || "#9a6b2e",
    marker: style.getPropertyValue("--math-vertex").trim() || "#4a6b4a",
    root: style.getPropertyValue("--math-root").trim() || "#2563eb",
    bg: style.getPropertyValue("--math-canvas-bg").trim() || "#ffffff",
  };
}

function toCanvasX(x: number, bounds: GraphBounds) {
  const w = VIEW_SIZE - PAD * 2;
  return PAD + ((x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * w;
}

function toCanvasY(y: number, bounds: GraphBounds) {
  const h = VIEW_SIZE - PAD * 2;
  return VIEW_SIZE - PAD - ((y - bounds.yMin) / (bounds.yMax - bounds.yMin)) * h;
}

function niceStep(span: number) {
  const raw = span / 5;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  if (norm < 1.5) return mag;
  if (norm < 3.5) return 2 * mag;
  if (norm < 7.5) return 5 * mag;
  return 10 * mag;
}

export function drawGraph(
  canvas: HTMLCanvasElement,
  bounds: GraphBounds,
  fn: (x: number) => number,
  options?: {
    roots?: number[];
    highlightX?: number;
    highlightLabel?: string;
    xLabel?: string;
    yLabel?: string;
  }
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = VIEW_SIZE * dpr;
  canvas.height = VIEW_SIZE * dpr;
  canvas.style.width = `${VIEW_SIZE}px`;
  canvas.style.height = `${VIEW_SIZE}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const colors = readGraphColors(canvas);

  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, VIEW_SIZE, VIEW_SIZE);

  const xStep = niceStep(bounds.xMax - bounds.xMin);
  const yStep = niceStep(bounds.yMax - bounds.yMin);

  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 1;
  for (let x = Math.ceil(bounds.xMin / xStep) * xStep; x <= bounds.xMax; x += xStep) {
    const px = toCanvasX(x, bounds);
    ctx.beginPath();
    ctx.moveTo(px, PAD);
    ctx.lineTo(px, VIEW_SIZE - PAD);
    ctx.stroke();
  }
  for (let y = Math.ceil(bounds.yMin / yStep) * yStep; y <= bounds.yMax; y += yStep) {
    const py = toCanvasY(y, bounds);
    ctx.beginPath();
    ctx.moveTo(PAD, py);
    ctx.lineTo(VIEW_SIZE - PAD, py);
    ctx.stroke();
  }

  const xZero = toCanvasX(0, bounds);
  const yZero = toCanvasY(0, bounds);
  if (0 >= bounds.xMin && 0 <= bounds.xMax) {
    ctx.strokeStyle = colors.axis;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(xZero, PAD);
    ctx.lineTo(xZero, VIEW_SIZE - PAD);
    ctx.stroke();
  }
  if (0 >= bounds.yMin && 0 <= bounds.yMax) {
    ctx.strokeStyle = colors.axis;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(PAD, yZero);
    ctx.lineTo(VIEW_SIZE - PAD, yZero);
    ctx.stroke();
  }

  ctx.strokeStyle = colors.curve;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  const samples = 120;
  let started = false;
  for (let i = 0; i <= samples; i++) {
    const x = bounds.xMin + ((bounds.xMax - bounds.xMin) * i) / samples;
    const y = fn(x);
    const px = toCanvasX(x, bounds);
    const py = toCanvasY(y, bounds);
    if (!started) {
      ctx.moveTo(px, py);
      started = true;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();

  const drawDot = (x: number, y: number, fill: string, radius = 6) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(toCanvasX(x, bounds), toCanvasY(y, bounds), radius, 0, Math.PI * 2);
    ctx.fill();
  };

  for (const root of options?.roots ?? []) {
    if (root >= bounds.xMin && root <= bounds.xMax) {
      drawDot(root, 0, colors.root);
    }
  }

  if (options?.highlightX !== undefined) {
    const hx = options.highlightX;
    const hy = fn(hx);
    if (hx >= bounds.xMin && hx <= bounds.xMax && hy >= bounds.yMin && hy <= bounds.yMax) {
      drawDot(hx, hy, colors.marker, 7);
    }
  }

  ctx.fillStyle = colors.axis;
  ctx.font = "11px IBM Plex Mono, monospace";
  ctx.textAlign = "center";
  if (options?.xLabel) {
    ctx.fillText(options.xLabel, VIEW_SIZE / 2, VIEW_SIZE - 10);
  }
  if (options?.yLabel) {
    ctx.save();
    ctx.translate(12, VIEW_SIZE / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(options.yLabel, 0, 0);
    ctx.restore();
  }
}
