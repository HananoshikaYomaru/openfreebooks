import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Clock,
  Color,
  NormalBlending,
  PerspectiveCamera,
  Plane,
  Points,
  Raycaster,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { resolveTheme, type ThemeChoice } from "../theme";

const DESKTOP_COUNT = 150000;
const MOBILE_COUNT = 45000;
const MORPH_MAX = 4;
const SHAPE_SCALE = 0.8;
const GROUND_Y = -4;
const BRANCH_MIN_Y = -1.25;

type ShapeColors = [number, number, number];

type ThemePalette = {
  layers: ShapeColors;
  sphere: ShapeColors;
  cube: ShapeColors;
  helix: ShapeColors;
  treeTrunk: ShapeColors;
  treeFoliage: ShapeColors;
  clear: string;
  glow: number;
  particleAlpha: number;
  colorBoost: number;
  pointScale: number;
  colorJitter: number;
};

const LIGHT_PALETTE: ThemePalette = {
  layers: [0.44, 0.28, 0.05],
  sphere: [0.58, 0.34, 0.02],
  cube: [0.03, 0.34, 0.16],
  helix: [0.34, 0.44, 0.06],
  treeTrunk: [0.4, 0.26, 0.08],
  treeFoliage: [0.06, 0.36, 0.18],
  clear: "#f5f4f1",
  glow: 0.72,
  particleAlpha: 1,
  colorBoost: 1.45,
  pointScale: 1.35,
  colorJitter: 0.04,
};

const DARK_PALETTE: ThemePalette = {
  layers: [0.82, 0.7, 0.48],
  sphere: [0.85, 0.58, 0.22],
  cube: [0.28, 0.78, 0.46],
  helix: [0.62, 0.82, 0.34],
  treeTrunk: [0.62, 0.42, 0.16],
  treeFoliage: [0.18, 0.62, 0.32],
  clear: "#1a1917",
  glow: 0.82,
  particleAlpha: 0.78,
  colorBoost: 1,
  pointScale: 1,
  colorJitter: 0.12,
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isMobileTier() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function hasFinePointer() {
  return window.matchMedia("(pointer: fine)").matches;
}

function getPalette(theme: ThemeChoice): ThemePalette {
  return theme === "dark" ? DARK_PALETTE : LIGHT_PALETTE;
}

function getPaperColor(): Color {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--paper").trim();
  return new Color(value || LIGHT_PALETTE.clear);
}

function setColor(arr: Float32Array, index: number, rgb: ShapeColors, jitter = 0.12) {
  arr[index * 3] = rgb[0] + (Math.random() - 0.5) * jitter;
  arr[index * 3 + 1] = rgb[1] + (Math.random() - 0.5) * jitter;
  arr[index * 3 + 2] = rgb[2] + (Math.random() - 0.5) * jitter;
}

function scalePositions(positions: Float32Array, scale: number) {
  for (let i = 0; i < positions.length; i += 1) {
    positions[i] *= scale;
  }
}

function generateLayers(count: number, positions: Float32Array, colors: Float32Array, rgb: ShapeColors) {
  const layerCount = 14;
  for (let i = 0; i < count; i += 1) {
    const layerIndex = Math.floor(Math.random() * layerCount);
    const layerY = (layerIndex / (layerCount - 1)) * 12 - 6;
    positions[i * 3] = (Math.random() - 0.5) * 9;
    positions[i * 3 + 1] = layerY + (Math.random() - 0.5) * 0.18;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    setColor(colors, i, rgb, 0.06);
  }
  scalePositions(positions, SHAPE_SCALE);
}

function generateSphere(count: number, positions: Float32Array, colors: Float32Array, rgb: ShapeColors) {
  for (let i = 0; i < count; i += 1) {
    const phi = Math.acos(-1 + (2 * i) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;
    const radius = 5 + (Math.random() - 0.5) * 0.5;
    positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
    positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    setColor(colors, i, rgb, 0.1);
  }
  scalePositions(positions, SHAPE_SCALE);
}

function generateCube(count: number, positions: Float32Array, colors: Float32Array, rgb: ShapeColors) {
  for (let i = 0; i < count; i += 1) {
    let x = (Math.random() - 0.5) * 10;
    let y = (Math.random() - 0.5) * 10;
    let z = (Math.random() - 0.5) * 10;
    const axis = Math.floor(Math.random() * 3);
    const sign = Math.random() > 0.5 ? 1 : -1;
    if (axis === 0) x = 5 * sign;
    else if (axis === 1) y = 5 * sign;
    else z = 5 * sign;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    setColor(colors, i, rgb, 0.1);
  }
  scalePositions(positions, SHAPE_SCALE);
}

function generateHelix(count: number, positions: Float32Array, colors: Float32Array, rgb: ShapeColors) {
  for (let i = 0; i < count; i += 1) {
    const t = (i / count) * Math.PI * 20;
    const radius = 3;
    const offset = (Math.random() - 0.5) * 1.5;
    const arm = i % 2 === 0 ? 0 : Math.PI;
    positions[i * 3] = (radius + offset) * Math.cos(t + arm);
    positions[i * 3 + 1] = (t / (Math.PI * 20)) * 14 - 7;
    positions[i * 3 + 2] = (radius + offset) * Math.sin(t + arm);
    setColor(colors, i, rgb, 0.1);
  }
  scalePositions(positions, SHAPE_SCALE);
}

function setColorExact(arr: Float32Array, index: number, r: number, g: number, b: number) {
  arr[index * 3] = r;
  arr[index * 3 + 1] = g;
  arr[index * 3 + 2] = b;
}

type TreeBranch = {
  sx: number;
  sy: number;
  sz: number;
  cx: number;
  cy: number;
  cz: number;
  ex: number;
  ey: number;
  ez: number;
  length: number;
  thickStart: number;
  thickEnd: number;
  isTerminal: boolean;
};

/** Volume proxy for even density: longer / thicker segments get more particles. */
function segmentParticleWeight(length: number, thickStart: number, thickEnd: number) {
  const avgThick = (thickStart + thickEnd) * 0.5;
  return Math.max(0.001, length * avgThick * avgThick);
}

function branchParticleWeight(branch: TreeBranch) {
  return segmentParticleWeight(branch.length, branch.thickStart, branch.thickEnd);
}

function rootParticleWeight(segment: RootSegment) {
  return segmentParticleWeight(segment.length, segment.thickStart, segment.thickEnd);
}

function buildWeightCdf<T>(items: T[], weight: (item: T) => number) {
  const cdf: number[] = [];
  let total = 0;
  for (const item of items) {
    total += weight(item);
    cdf.push(total);
  }
  return { cdf, total };
}

function pickWeighted<T>(items: T[], cdf: number[], total: number) {
  const target = Math.random() * total;
  let lo = 0;
  let hi = cdf.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (cdf[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return items[lo];
}

type RootSegment = {
  sx: number;
  sz: number;
  ex: number;
  ez: number;
  bend: number;
  length: number;
  thickStart: number;
  thickEnd: number;
  depth: number;
};

function evalBezier(
  sx: number,
  sy: number,
  sz: number,
  cx: number,
  cy: number,
  cz: number,
  ex: number,
  ey: number,
  ez: number,
  t: number
) {
  const omt = 1 - t;
  return {
    x: omt * omt * sx + 2 * omt * t * cx + t * t * ex,
    y: omt * omt * sy + 2 * omt * t * cy + t * t * ey,
    z: omt * omt * sz + 2 * omt * t * cz + t * t * ez,
  };
}

function trunkSurface(h: number, theta: number) {
  const y = GROUND_Y + h * 4.5;
  const baseR = 0.8;
  const flare = Math.exp(-h * 15) * 2;
  const taper = 1 - h * 0.6;
  let radius = (baseR + flare) * taper;
  const ridges = Math.abs(Math.sin(theta * 8)) * 0.12 + Math.sin(theta * 15) * 0.05;
  radius += ridges * (1 - Math.min(1, flare * 0.5));
  const bendX = Math.sin(y * 0.6) * 0.3;
  const bendZ = Math.cos(y * 0.4) * 0.3;
  return {
    x: bendX + radius * Math.cos(theta),
    y,
    z: bendZ + radius * Math.sin(theta),
    radius,
    bendX,
    bendZ,
  };
}

function depositTrunkParticle(
  positions: Float32Array,
  colors: Float32Array,
  isFlower: Float32Array,
  index: number,
  h: number,
  theta: number,
  palette: ThemePalette,
  radialJitter = 1
) {
  const surface = trunkSurface(h, theta);
  const jitter = (Math.random() - 0.5) * 0.08 * radialJitter;
  positions[index * 3] = surface.x + Math.cos(theta) * jitter;
  positions[index * 3 + 1] = surface.y + (Math.random() - 0.5) * 0.04;
  positions[index * 3 + 2] = surface.z + Math.sin(theta) * jitter;
  setColor(colors, index, palette.treeTrunk, 0.06);
  isFlower[index] = 0;
}

function generateDetailedTree(
  count: number,
  positions: Float32Array,
  colors: Float32Array,
  isFlower: Float32Array,
  palette: ThemePalette
) {
  const landCount = Math.floor(count * (30000 / 150000));
  const rootCount = Math.floor(count * (15000 / 150000));
  const trunkCount = Math.floor(count * (6000 / 150000));
  const branchParticleCount = Math.floor(count * (43000 / 150000));
  const junctionBudget = Math.floor(count * (7000 / 150000));
  const flowerPlotCount = Math.max(120, Math.floor(count * (1000 / 150000)));

  let pIdx = 0;

  for (let i = 0; i < landCount && pIdx < count; i += 1, pIdx += 1) {
    const r = 10 * Math.sqrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    positions[pIdx * 3] = r * Math.cos(theta);
    positions[pIdx * 3 + 1] = GROUND_Y;
    positions[pIdx * 3 + 2] = r * Math.sin(theta);
    setColor(colors, pIdx, palette.treeFoliage, 0.03);
    isFlower[pIdx] = 0;
  }

  const rootSegments: RootSegment[] = [];

  function addRootSegment(
    sx: number,
    sz: number,
    angle: number,
    length: number,
    thickStart: number,
    depth: number,
    maxDepth: number
  ) {
    const curve = (Math.random() - 0.5) * length * (0.18 + depth * 0.04);
    const ex = sx + Math.cos(angle) * length;
    const ez = sz + Math.sin(angle) * length;
    const thickEnd = Math.max(0.018, thickStart * (0.42 + Math.random() * 0.15));
    rootSegments.push({ sx, sz, ex, ez, bend: curve, length, thickStart, thickEnd, depth });

    if (depth >= maxDepth) return;

    const childCount = depth === 1 ? 2 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 2);
    for (let child = 0; child < childCount; child += 1) {
      const spawnT = 0.42 + Math.random() * 0.46;
      const mx = sx + (ex - sx) * spawnT;
      const mz = sz + (ez - sz) * spawnT;
      const childAngle = angle + (child - (childCount - 1) / 2) * (0.38 + Math.random() * 0.42);
      addRootSegment(
        mx,
        mz,
        childAngle,
        length * (0.45 + Math.random() * 0.34),
        thickStart * (1 - spawnT) + thickEnd * spawnT,
        depth + 1,
        maxDepth
      );
    }
  }

  const primaryRoots = 26;
  for (let i = 0; i < primaryRoots; i += 1) {
    const angle = (i / primaryRoots) * Math.PI * 2 + (Math.random() - 0.5) * 0.16;
    const rootFlare = 0.28 + Math.random() * 0.28;
    addRootSegment(
      Math.cos(angle) * rootFlare,
      Math.sin(angle) * rootFlare,
      angle,
      4.8 + Math.random() * 3.8,
      0.42 + Math.random() * 0.24,
      1,
      3 + Math.floor(Math.random() * 2)
    );
  }

  const rootPick = buildWeightCdf(rootSegments, rootParticleWeight);

  for (let i = 0; i < rootCount && pIdx < count; i += 1, pIdx += 1) {
    const segment = pickWeighted(rootSegments, rootPick.cdf, rootPick.total);
    const t = Math.pow(Math.random(), 0.82);
    const omt = 1 - t;
    const midX = (segment.sx + segment.ex) * 0.5 + Math.cos(Math.atan2(segment.ez - segment.sz, segment.ex - segment.sx) + Math.PI / 2) * segment.bend;
    const midZ = (segment.sz + segment.ez) * 0.5 + Math.sin(Math.atan2(segment.ez - segment.sz, segment.ex - segment.sx) + Math.PI / 2) * segment.bend;
    const centerX = omt * omt * segment.sx + 2 * omt * t * midX + t * t * segment.ex;
    const centerZ = omt * omt * segment.sz + 2 * omt * t * midZ + t * t * segment.ez;
    const tangentX = 2 * omt * (midX - segment.sx) + 2 * t * (segment.ex - midX);
    const tangentZ = 2 * omt * (midZ - segment.sz) + 2 * t * (segment.ez - midZ);
    const tangentLen = Math.sqrt(tangentX * tangentX + tangentZ * tangentZ) || 1;
    const normalX = -tangentZ / tangentLen;
    const normalZ = tangentX / tangentLen;
    const thick = (segment.thickStart * (1 - t) + segment.thickEnd * t) * (1 - Math.random() * 0.35);
    const spread = (Math.random() - 0.5) * thick;

    positions[pIdx * 3] = centerX + normalX * spread;
    positions[pIdx * 3 + 1] = GROUND_Y + 0.012;
    positions[pIdx * 3 + 2] = centerZ + normalZ * spread;
    setColor(colors, pIdx, palette.treeTrunk, 0.05);
    isFlower[pIdx] = 0;
  }

  for (let i = 0; i < flowerPlotCount && pIdx < count - 10; i += 1) {
    const r = 2.5 + Math.random() * 7;
    const theta = Math.random() * Math.PI * 2;
    const fx = r * Math.cos(theta);
    const fz = r * Math.sin(theta);
    const fh = 0.35 + Math.random() * 0.55;
    const flowerVariant = Math.floor(Math.random() * 3);
    const flowerColors: [number, number, number][] = [
      [0.95, 0.14, 0.2], // red
      [0.72, 0.2, 0.98], // purple
      [1, 0.88, 0.14], // yellow
    ];
    const stemSegments = 8;

    for (let j = 0; j < stemSegments; j += 1) {
      positions[pIdx * 3] = fx;
      positions[pIdx * 3 + 1] = GROUND_Y + (j / stemSegments) * fh;
      positions[pIdx * 3 + 2] = fz;
      setColor(colors, pIdx, palette.treeFoliage, 0.03);
      isFlower[pIdx] = 0;
      pIdx += 1;
    }

    positions[pIdx * 3] = fx;
    positions[pIdx * 3 + 1] = GROUND_Y + fh;
    positions[pIdx * 3 + 2] = fz;
    const [fr, fg, fb] = flowerColors[flowerVariant];
    setColorExact(colors, pIdx, fr, fg, fb);
    // 1 = red, 2 = purple, 3 = yellow (0 = not a flower)
    isFlower[pIdx] = flowerVariant + 1;
    pIdx += 1;
  }

  for (let i = 0; i < trunkCount && pIdx < count; i += 1, pIdx += 1) {
    const h = Math.random();
    const theta = Math.random() * Math.PI * 2;
    depositTrunkParticle(positions, colors, isFlower, pIdx, h, theta, palette);
  }

  const branches: TreeBranch[] = [];
  const terminalBranches: TreeBranch[] = [];
  const junctions: Array<{ h: number; theta: number; thick: number }> = [];

  function generateBranch(
    sx: number,
    sy: number,
    sz: number,
    dirX: number,
    dirY: number,
    dirZ: number,
    length: number,
    thickStart: number,
    depth: number,
    maxDepth: number
  ) {
    const isTerminal = depth >= maxDepth;
    const droop = Math.max(0, depth - 1) * 0.06;
    const ex = sx + dirX * length;
    const ey = Math.max(sy + (dirY - droop) * length, BRANCH_MIN_Y + depth * 0.08);
    const ez = sz + dirZ * length;
    const cx = sx + dirX * length * 0.45;
    const cy = Math.max(sy + dirY * length * 0.45 + 0.5 / depth, Math.max(sy, ey) + 0.12);
    const cz = sz + dirZ * length * 0.45;
    const thickEnd = Math.max(0.04, thickStart * 0.42);
    const branch: TreeBranch = {
      sx,
      sy,
      sz,
      cx,
      cy,
      cz,
      ex,
      ey,
      ez,
      length,
      thickStart,
      thickEnd,
      isTerminal,
    };
    branches.push(branch);
    if (isTerminal) terminalBranches.push(branch);

    if (!isTerminal) {
      const numChildren = depth === 1 ? 2 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 3);
      for (let c = 0; c < numChildren; c += 1) {
        const spawnT = 0.35 + Math.random() * 0.55;
        const pos = evalBezier(sx, sy, sz, cx, cy, cz, ex, ey, ez, spawnT);
        const omt = 1 - spawnT;
        let tanX = 2 * omt * (cx - sx) + 2 * spawnT * (ex - cx);
        let tanY = 2 * omt * (cy - sy) + 2 * spawnT * (ey - cy);
        let tanZ = 2 * omt * (cz - sz) + 2 * spawnT * (ez - cz);
        const tanLen = Math.sqrt(tanX * tanX + tanY * tanY + tanZ * tanZ) || 1;
        tanX /= tanLen;
        tanY /= tanLen;
        tanZ /= tanLen;
        const spread = 0.55 + depth * 0.25;
        let cDirX = tanX + (Math.random() - 0.5) * spread;
        let cDirY = tanY + (Math.random() - 0.5) * spread;
        let cDirZ = tanZ + (Math.random() - 0.5) * spread;
        cDirY = Math.max(cDirY, depth <= 2 ? 0.18 : -0.05);
        const cLen = Math.sqrt(cDirX * cDirX + cDirY * cDirY + cDirZ * cDirZ);
        cDirX /= cLen;
        cDirY /= cLen;
        cDirZ /= cLen;
        const cLength = length * (0.62 + Math.random() * 0.28);
        const cThick = thickStart * (1 - spawnT) + thickEnd * spawnT;
        generateBranch(pos.x, pos.y, pos.z, cDirX, cDirY, cDirZ, cLength, cThick * 0.88, depth + 1, maxDepth);
      }
    }
  }

  const numMainBranches = 12 + Math.floor(Math.random() * 6);
  for (let i = 0; i < numMainBranches; i += 1) {
    const theta = (i / numMainBranches) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
    const h = 0.62 + Math.random() * 0.34;
    const surface = trunkSurface(h, theta);
    const normalX = Math.cos(theta);
    const normalZ = Math.sin(theta);
    const embeddedDepth = Math.min(surface.radius * 0.5, 0.38);
    const sx = surface.x - normalX * embeddedDepth;
    const sy = surface.y;
    const sz = surface.z - normalZ * embeddedDepth;

    let dirX = normalX * 1.15;
    let dirY = 0.78 + Math.random() * 0.5;
    let dirZ = normalZ * 1.15;
    const dirLen = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ) || 1;
    dirX /= dirLen;
    dirY /= dirLen;
    dirZ /= dirLen;

    const length = 2.0 + Math.random() * 2.1;
    const thickStart = Math.max(0.2, surface.radius * 0.9);
    junctions.push({ h, theta, thick: thickStart });
    const targetMaxDepth = 2 + Math.floor(Math.random() * 3);
    generateBranch(sx, sy, sz, dirX, dirY, dirZ, length, thickStart, 1, targetMaxDepth);
  }

  const junctionParticles = Math.max(8, Math.floor(junctionBudget / Math.max(junctions.length, 1)));
  for (const junction of junctions) {
    for (let j = 0; j < junctionParticles && pIdx < count; j += 1, pIdx += 1) {
      const h = junction.h + (Math.random() - 0.5) * 0.055;
      const theta = junction.theta + (Math.random() - 0.5) * 0.72;
      const surface = trunkSurface(h, theta);
      const normalX = Math.cos(junction.theta);
      const normalZ = Math.sin(junction.theta);
      const collar = (Math.random() - 0.5) * junction.thick;
      const bridge = Math.random() * Math.min(surface.radius * 0.85, 0.75);
      positions[pIdx * 3] = surface.x - normalX * bridge + Math.cos(theta) * collar * 0.45;
      positions[pIdx * 3 + 1] = surface.y + (Math.random() - 0.5) * junction.thick * 0.45;
      positions[pIdx * 3 + 2] = surface.z - normalZ * bridge + Math.sin(theta) * collar * 0.45;
      setColor(colors, pIdx, palette.treeTrunk, 0.06);
      isFlower[pIdx] = 0;
    }
  }

  const branchOrange: ShapeColors = palette.helix;
  const branchOrangeTip: ShapeColors = palette.sphere;
  const branchPick = buildWeightCdf(branches, branchParticleWeight);
  const terminalPick =
    terminalBranches.length > 0 ? buildWeightCdf(terminalBranches, branchParticleWeight) : null;

  for (let i = 0; i < branchParticleCount && pIdx < count; i += 1, pIdx += 1) {
    const b = pickWeighted(branches, branchPick.cdf, branchPick.total);
    const t =
      Math.random() < 0.45
        ? Math.pow(Math.random(), 2.2) * 0.35
        : 0.15 + Math.random() * 0.85;
    const pos = evalBezier(b.sx, b.sy, b.sz, b.cx, b.cy, b.cz, b.ex, b.ey, b.ez, t);
    const thick = b.thickStart * (1 - t) + b.thickEnd * t;
    const ringTheta = Math.random() * Math.PI * 2;
    positions[pIdx * 3] = pos.x + thick * Math.cos(ringTheta);
    positions[pIdx * 3 + 1] = pos.y + thick * Math.sin(ringTheta) * 0.35;
    positions[pIdx * 3 + 2] = pos.z + thick * Math.sin(ringTheta);
    setColor(colors, pIdx, b.isTerminal ? branchOrangeTip : branchOrange, 0.08);
    isFlower[pIdx] = 0;
  }

  while (pIdx < count) {
    if (!terminalPick) break;
    const b = pickWeighted(terminalBranches, terminalPick.cdf, terminalPick.total);
    const t = Math.pow(Math.random(), 0.6);
    const pos = evalBezier(b.sx, b.sy, b.sz, b.cx, b.cy, b.cz, b.ex, b.ey, b.ez, t);
    const angle = Math.random() * Math.PI * 2;
    const spread = Math.random() * 1.8;
    const droop = spread * (0.15 + Math.random() * 0.15) + Math.random() * 0.1;
    positions[pIdx * 3] = pos.x + Math.cos(angle) * spread;
    positions[pIdx * 3 + 1] = pos.y - droop;
    positions[pIdx * 3 + 2] = pos.z + Math.sin(angle) * spread;
    setColor(colors, pIdx, palette.treeFoliage, 0.1);
    isFlower[pIdx] = 0;
    pIdx += 1;
  }

  scalePositions(positions, SHAPE_SCALE);
}

function fillShapeColors(
  geometry: BufferGeometry,
  palette: ThemePalette,
  count: number
) {
  const col0 = geometry.getAttribute("col0") as BufferAttribute;
  const col1 = geometry.getAttribute("col1") as BufferAttribute;
  const col2 = geometry.getAttribute("col2") as BufferAttribute;
  const col3 = geometry.getAttribute("col3") as BufferAttribute;

  for (let i = 0; i < count; i += 1) {
    setColor(col0.array as Float32Array, i, palette.layers, palette.colorJitter);
    setColor(col1.array as Float32Array, i, palette.sphere, palette.colorJitter);
    setColor(col2.array as Float32Array, i, palette.cube, palette.colorJitter);
    setColor(col3.array as Float32Array, i, palette.helix, palette.colorJitter);
  }

  col0.needsUpdate = true;
  col1.needsUpdate = true;
  col2.needsUpdate = true;
  col3.needsUpdate = true;
}

const vertexShader = `
  attribute vec3 pos0;
  attribute vec3 col0;
  attribute vec3 pos1;
  attribute vec3 col1;
  attribute vec3 pos2;
  attribute vec3 col2;
  attribute vec3 pos3;
  attribute vec3 col3;
  attribute vec3 pos4;
  attribute vec3 col4;
  attribute float aIsFlower;

  uniform float uMorph;
  uniform float uTime;
  uniform vec3 uMouse;
  uniform float uPixelRatio;
  uniform float uMouseEnabled;
  uniform float uGlow;
  uniform float uPointScale;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vFlowerGlint;

  void main() {
    vFlowerGlint = 0.0;
    float m = clamp(uMorph, 0.0, ${MORPH_MAX}.0);
    float t = fract(m);
    float ease = t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;

    vec3 finalPos;
    vec3 finalCol;

    if (m < 1.0) {
      finalPos = mix(pos0, pos1, ease);
      finalCol = mix(col0, col1, ease);
    } else if (m < 2.0) {
      t = m - 1.0;
      ease = t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
      finalPos = mix(pos1, pos2, ease);
      finalCol = mix(col1, col2, ease);
    } else if (m < 3.0) {
      t = m - 2.0;
      ease = t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
      finalPos = mix(pos2, pos3, ease);
      finalCol = mix(col2, col3, ease);
    } else {
      t = clamp(m - 3.0, 0.0, 1.0);
      ease = t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
      finalPos = mix(pos3, pos4, ease);
      finalCol = mix(col3, col4, ease);
    }

    float treeInfluence = 0.0;
    if (m > 3.0) treeInfluence = clamp(m - 3.0, 0.0, 1.0);

    if (treeInfluence > 0.0) {
      if (finalPos.y > -2.0) {
        float swayInfluence = clamp((finalPos.y + 2.0) / 8.0, 0.0, 1.0) * treeInfluence;
        finalPos.x += sin(uTime * 1.2 + finalPos.y) * 0.25 * swayInfluence;
        finalPos.z += cos(uTime * 1.5 + finalPos.x) * 0.25 * swayInfluence;
      }

      if (aIsFlower > 0.5) {
        float flowerKind = floor(aIsFlower + 0.1);
        float phase = uTime * 7.0 + pos4.x * 19.0 + pos4.z * 14.0 + flowerKind * 2.4;
        float twinkle = 0.5 + 0.5 * sin(phase);
        float sparkle = pow(max(0.0, sin(phase * 3.1)), 10.0);
        float shimmer = 0.5 + twinkle * 0.45 + sparkle * 1.1;

        finalPos.y += twinkle * 0.28 * treeInfluence;
        finalCol *= shimmer;
        finalCol += vec3(1.0, 0.96, 0.88) * sparkle * 1.35 * treeInfluence;
        vFlowerGlint = (sparkle * 0.95 + twinkle * 0.35) * treeInfluence;
      } else {
        vFlowerGlint = 0.0;
      }
    } else {
      vFlowerGlint = 0.0;
    }

    float sphereInfluence = max(0.0, 1.0 - abs(m - 1.0));
    if (sphereInfluence > 0.0) {
      float breathing = sin(uTime * 1.5) * 0.5;
      float shockTime = fract(uTime * 0.15);
      float shockRadius = shockTime * 20.0;
      float distFromCenter = length(finalPos);
      float shock = smoothstep(2.0, 0.0, abs(distFromCenter - shockRadius));
      vec3 dir = normalize(finalPos + vec3(0.0001));
      finalPos += dir * (breathing + shock * 4.0) * sphereInfluence;
      finalCol += vec3(0.4, 0.7, 1.0) * shock * sphereInfluence * uGlow;
    }

    if (uMouseEnabled > 0.5) {
      float mouseDist = distance(finalPos, uMouse);
      float radius = 3.5;
      if (mouseDist < radius) {
        vec3 pushDir = normalize(finalPos - uMouse);
        float force = pow(1.0 - (mouseDist / radius), 2.0);
        finalPos += pushDir * force * 1.5;
      }
    }

    float idleWobble = 1.0;
    if (m > 3.0 && finalPos.y < -3.0) {
      idleWobble = 0.0;
    } else if (m > 3.0) {
      idleWobble = 1.0 - treeInfluence;
    }

    finalPos.y += sin(finalPos.x * 2.0 + uTime * 2.0) * 0.1 * idleWobble;
    finalPos.x += cos(finalPos.y * 2.0 + uTime * 2.0) * 0.1 * idleWobble;
    finalPos.z += sin(finalPos.x * 1.5 + finalPos.y * 1.5 + uTime * 1.6) * 0.06 * idleWobble;

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    float pointSize = (13.0 * uPixelRatio * uPointScale) * (1.0 / -mvPosition.z);
    if (vFlowerGlint > 0.0) {
      pointSize *= 1.0 + vFlowerGlint * 0.75;
    }
    gl_PointSize = pointSize;
    gl_Position = projectionMatrix * mvPosition;
    vColor = finalCol;
    vAlpha = 1.0;
  }
`;

const fragmentShader = `
  uniform float uParticleAlpha;
  uniform float uColorBoost;
  uniform float uTime;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vFlowerGlint;

  void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(gl_PointCoord, center);
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.08, dist);
    vec3 color = clamp(vColor * uColorBoost, 0.0, 1.0);

    if (vFlowerGlint > 0.0) {
      vec2 uv = gl_PointCoord - center;
      float ang = atan(uv.y, uv.x);
      float star = pow(abs(sin(ang * 4.0 + uTime * 9.0)), 3.0);
      float core = 1.0 - smoothstep(0.0, 0.22, dist);
      float glint = star * core * vFlowerGlint;
      color += vec3(1.0, 0.98, 0.9) * glint * 1.4;
      alpha = min(1.0, alpha * (1.0 + vFlowerGlint * 0.45));
    }

    gl_FragColor = vec4(color, alpha * uParticleAlpha * vAlpha);
  }
`;

function clampMorph(morph: number) {
  if (morph <= 0) return 0;
  if (morph >= MORPH_MAX) return MORPH_MAX;
  return morph;
}

function getTreeHold(morph: number) {
  const m = clampMorph(morph);
  if (m < 3.5) return 0;
  return Math.min(1, (m - 3.5) / 0.5);
}

function getLayersHold(morph: number) {
  const m = clampMorph(morph);
  if (m >= 0.5) return 0;
  return 1 - m / 0.5;
}

export function initParticleBackground(container: HTMLElement): () => void {
  if (prefersReducedMotion()) {
    return () => {};
  }

  document.body.classList.add("has-particle-background");

  const particleCount = isMobileTier() ? MOBILE_COUNT : DESKTOP_COUNT;
  const mouseEnabled = hasFinePointer();
  const palette = getPalette(resolveTheme());

  const scene = new Scene();
  const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 10;

  const renderer = new WebGLRenderer({
    alpha: false,
    antialias: false,
    powerPreference: "high-performance",
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const geometry = new BufferGeometry();
  const pos0 = new Float32Array(particleCount * 3);
  const col0 = new Float32Array(particleCount * 3);
  const pos1 = new Float32Array(particleCount * 3);
  const col1 = new Float32Array(particleCount * 3);
  const pos2 = new Float32Array(particleCount * 3);
  const col2 = new Float32Array(particleCount * 3);
  const pos3 = new Float32Array(particleCount * 3);
  const col3 = new Float32Array(particleCount * 3);
  const pos4 = new Float32Array(particleCount * 3);
  const col4 = new Float32Array(particleCount * 3);
  const isFlower = new Float32Array(particleCount);

  generateLayers(particleCount, pos0, col0, palette.layers);
  generateSphere(particleCount, pos1, col1, palette.sphere);
  generateCube(particleCount, pos2, col2, palette.cube);
  generateHelix(particleCount, pos3, col3, palette.helix);
  generateDetailedTree(particleCount, pos4, col4, isFlower, palette);

  geometry.setAttribute("pos0", new BufferAttribute(pos0, 3));
  geometry.setAttribute("col0", new BufferAttribute(col0, 3));
  geometry.setAttribute("pos1", new BufferAttribute(pos1, 3));
  geometry.setAttribute("col1", new BufferAttribute(col1, 3));
  geometry.setAttribute("pos2", new BufferAttribute(pos2, 3));
  geometry.setAttribute("col2", new BufferAttribute(col2, 3));
  geometry.setAttribute("pos3", new BufferAttribute(pos3, 3));
  geometry.setAttribute("col3", new BufferAttribute(col3, 3));
  geometry.setAttribute("pos4", new BufferAttribute(pos4, 3));
  geometry.setAttribute("col4", new BufferAttribute(col4, 3));
  geometry.setAttribute("aIsFlower", new BufferAttribute(isFlower, 1));
  geometry.setAttribute("position", new BufferAttribute(pos0, 3));

  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uMorph: { value: 0 },
      uTime: { value: 0 },
      uMouse: { value: new Vector3(999, 999, 999) },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uMouseEnabled: { value: mouseEnabled ? 1 : 0 },
      uGlow: { value: palette.glow },
      uParticleAlpha: { value: palette.particleAlpha },
      uColorBoost: { value: palette.colorBoost },
      uPointScale: { value: palette.pointScale },
    },
    transparent: true,
    depthWrite: false,
    blending: resolveTheme() === "dark" ? AdditiveBlending : NormalBlending,
  });

  const points = new Points(geometry, material);
  points.position.y = -0.65 * SHAPE_SCALE;
  scene.add(points);

  let targetMorph = 0;
  let currentMorph = 0;
  let spinY = 0;
  let spinX = 0;
  const clock = new Clock();
  let frameId = 0;
  let disposed = false;

  const plane = new Plane(new Vector3(0, 0, 1), 0);
  const raycaster = new Raycaster();
  const mouseNdc = new Vector2(-999, -999);
  const targetMouseWorld = new Vector3();

  function applyThemePalette(theme: ThemeChoice) {
    const nextPalette = getPalette(theme);
    fillShapeColors(geometry, nextPalette, particleCount);
    generateDetailedTree(particleCount, pos4, col4, isFlower, nextPalette);
    (geometry.getAttribute("col4") as BufferAttribute).needsUpdate = true;
    (geometry.getAttribute("pos4") as BufferAttribute).needsUpdate = true;
    (geometry.getAttribute("aIsFlower") as BufferAttribute).needsUpdate = true;
    material.uniforms.uGlow.value = nextPalette.glow;
    material.uniforms.uParticleAlpha.value = nextPalette.particleAlpha;
    material.uniforms.uColorBoost.value = nextPalette.colorBoost;
    material.uniforms.uPointScale.value = nextPalette.pointScale;
    material.blending = theme === "dark" ? AdditiveBlending : NormalBlending;
    material.needsUpdate = true;
    renderer.setClearColor(getPaperColor(), 1);
  }

  applyThemePalette(resolveTheme());

  function getScrollProgress() {
    const scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    const maxScroll = Math.max(0, scrollHeight - window.innerHeight);
    if (maxScroll <= 0) return 0;
    const scrollY = Math.min(Math.max(0, window.scrollY), maxScroll);
    const progress = scrollY / maxScroll;
    // Lock morph at the end so elastic overscroll / sub-pixel gaps do not flicker.
    return progress >= 0.992 ? 1 : progress;
  }

  function onScroll() {
    targetMorph = clampMorph(getScrollProgress() * MORPH_MAX);
  }

  function onMouseMove(event: MouseEvent) {
    if (!mouseEnabled) return;
    mouseNdc.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseNdc.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    renderer.setClearColor(getPaperColor(), 1);
    onScroll();
  }

  const themeObserver = new MutationObserver(() => {
    applyThemePalette(resolveTheme());
  });

  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemThemeChange = () => {
    applyThemePalette(resolveTheme());
  };

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  darkModeQuery.addEventListener("change", onSystemThemeChange);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("mousemove", onMouseMove, { passive: true });
  window.addEventListener("resize", onResize);

  onScroll();

  function smoothstep(value: number) {
    return value * value * (3 - 2 * value);
  }

  function animate() {
    if (disposed) return;
    frameId = window.requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();
    material.uniforms.uTime.value = time;
    currentMorph += (targetMorph - currentMorph) * 0.05;
    currentMorph = clampMorph(currentMorph);
    material.uniforms.uMorph.value = currentMorph;

    const layersHold = getLayersHold(currentMorph);
    const treeHold = getTreeHold(currentMorph);
    const spinWeight = 1 - layersHold;
    const treeSettle = smoothstep(treeHold);

    if (layersHold < 0.99) {
      spinY += delta * (0.1 + 0.05 * treeSettle);
      spinX += delta * 0.05 * (1 - treeSettle);
    } else {
      spinY = 0;
      spinX = 0;
    }

    const easedSpin = smoothstep(spinWeight);
    points.rotation.y = spinY * easedSpin;
    points.rotation.x = spinX * easedSpin * (1 - treeSettle);

    if (mouseEnabled) {
      raycaster.setFromCamera(mouseNdc, camera);
      raycaster.ray.intersectPlane(plane, targetMouseWorld);
      const localMouse = targetMouseWorld.clone();
      points.worldToLocal(localMouse);
      material.uniforms.uMouse.value.lerp(localMouse, 0.1);
    }

    renderer.setClearColor(getPaperColor(), 1);
    renderer.render(scene, camera);
  }

  animate();

  return () => {
    disposed = true;
    window.cancelAnimationFrame(frameId);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("resize", onResize);
    darkModeQuery.removeEventListener("change", onSystemThemeChange);
    themeObserver.disconnect();
    document.body.classList.remove("has-particle-background");
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
