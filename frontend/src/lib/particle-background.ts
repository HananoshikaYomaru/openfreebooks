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

const DESKTOP_COUNT = 60000;
const MOBILE_COUNT = 20000;
const SHAPE_COUNT = 4;
const MORPH_MAX = 4;
const MORPH_LOOP_EPS = 0.001;
const SHAPE_SCALE = 0.8;

type ShapeColors = [number, number, number];

type ThemePalette = {
  layers: ShapeColors;
  sphere: ShapeColors;
  cube: ShapeColors;
  helix: ShapeColors;
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

  uniform float uMorph;
  uniform float uTime;
  uniform vec3 uMouse;
  uniform float uPixelRatio;
  uniform float uMouseEnabled;
  uniform float uGlow;
  uniform float uPointScale;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float m = mod(uMorph, ${SHAPE_COUNT}.0);
    float t = fract(m);
    float ease = t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;

    vec3 finalPos;
    vec3 finalCol;

    if (m < 1.0) {
      finalPos = mix(pos0, pos1, ease);
      finalCol = mix(col0, col1, ease);
    } else if (m < 2.0) {
      finalPos = mix(pos1, pos2, ease);
      finalCol = mix(col1, col2, ease);
    } else if (m < 3.0) {
      finalPos = mix(pos2, pos3, ease);
      finalCol = mix(col2, col3, ease);
    } else {
      finalPos = mix(pos3, pos0, ease);
      finalCol = mix(col3, col0, ease);
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

    finalPos.y += sin(finalPos.x * 2.0 + uTime * 2.0) * 0.1;
    finalPos.x += cos(finalPos.y * 2.0 + uTime * 2.0) * 0.1;
    finalPos.z += sin(finalPos.x * 1.5 + finalPos.y * 1.5 + uTime * 1.6) * 0.06;

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_PointSize = (13.0 * uPixelRatio * uPointScale) * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vColor = finalCol;
    vAlpha = 1.0;
  }
`;

const fragmentShader = `
  uniform float uParticleAlpha;
  uniform float uColorBoost;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(gl_PointCoord, center);
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.08, dist);
    vec3 color = clamp(vColor * uColorBoost, 0.0, 1.0);
    gl_FragColor = vec4(color, alpha * uParticleAlpha * vAlpha);
  }
`;

function clampMorph(morph: number) {
  if (morph <= 0) return 0;
  if (morph >= MORPH_MAX - MORPH_LOOP_EPS) return MORPH_MAX - MORPH_LOOP_EPS;
  return morph;
}

function getLayersHold(morph: number) {
  const clamped = clampMorph(morph);
  if (clamped <= MORPH_LOOP_EPS || clamped >= MORPH_MAX - MORPH_LOOP_EPS) {
    return 1;
  }
  const m = clamped % SHAPE_COUNT;
  if (m < 0.5) return 1 - m / 0.5;
  if (m > 3.5) return (SHAPE_COUNT - m) / 0.5;
  return 0;
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

  generateLayers(particleCount, pos0, col0, palette.layers);
  generateSphere(particleCount, pos1, col1, palette.sphere);
  generateCube(particleCount, pos2, col2, palette.cube);
  generateHelix(particleCount, pos3, col3, palette.helix);

  geometry.setAttribute("pos0", new BufferAttribute(pos0, 3));
  geometry.setAttribute("col0", new BufferAttribute(col0, 3));
  geometry.setAttribute("pos1", new BufferAttribute(pos1, 3));
  geometry.setAttribute("col1", new BufferAttribute(col1, 3));
  geometry.setAttribute("pos2", new BufferAttribute(pos2, 3));
  geometry.setAttribute("col2", new BufferAttribute(col2, 3));
  geometry.setAttribute("pos3", new BufferAttribute(pos3, 3));
  geometry.setAttribute("col3", new BufferAttribute(col3, 3));
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
    material.uniforms.uGlow.value = nextPalette.glow;
    material.uniforms.uParticleAlpha.value = nextPalette.particleAlpha;
    material.uniforms.uColorBoost.value = nextPalette.colorBoost;
    material.uniforms.uPointScale.value = nextPalette.pointScale;
    material.blending = theme === "dark" ? AdditiveBlending : NormalBlending;
    material.needsUpdate = true;
    renderer.setClearColor(getPaperColor(), 1);
  }

  applyThemePalette(resolveTheme());

  function onScroll() {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    targetMorph = maxScroll > 0 ? clampMorph((window.scrollY / maxScroll) * MORPH_MAX) : 0;
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
    const spinWeight = 1 - layersHold;

    if (layersHold < 0.99) {
      spinY += delta * 0.1;
      spinX += delta * 0.05;
    } else {
      spinY = 0;
      spinX = 0;
    }

    const easedSpin = smoothstep(spinWeight);
    points.rotation.y = spinY * easedSpin;
    points.rotation.x = spinX * easedSpin;

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
