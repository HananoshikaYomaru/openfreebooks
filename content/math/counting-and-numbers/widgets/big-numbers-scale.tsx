import { onCleanup, onMount } from "solid-js";

function BigNumbersScale() {
  let rootRef: HTMLDivElement | undefined;

  onMount(() => {
    const root = rootRef;
    if (!root) return;

    const byId = <T extends HTMLElement>(id: string) => root.querySelector<T>(`#${id}`);
    const canvas = byId<HTMLCanvasElement>("scaleCanvas");
    const canvasContainer = byId<HTMLDivElement>("canvasContainer");
    const logSlider = byId<HTMLInputElement>("logSlider");
    const currentValDisplay = byId<HTMLSpanElement>("currentValDisplay");
    const tierInfoBadge = byId<HTMLSpanElement>("tierInfoBadge");
    const dotCountDisplay = byId<HTMLSpanElement>("dotCountDisplay");
    const tierValueLabel = byId<HTMLSpanElement>("tierValueLabel");
    const powerIndicator = byId<HTMLSpanElement>("powerIndicator");
    const analogyValueText = byId<HTMLSpanElement>("analogyValueText");
    const timeStatValue = byId<HTMLDivElement>("timeStatValue");
    const analogyText = byId<HTMLParagraphElement>("analogyText");
    const btnPlayPause = byId<HTMLButtonElement>("btnPlayPause");
    const btnPrevStep = byId<HTMLButtonElement>("btnPrevStep");
    const btnNextStep = byId<HTMLButtonElement>("btnNextStep");
    const stateIndicator = byId<HTMLDivElement>("stateIndicator");
    const stateIndicatorText = byId<HTMLSpanElement>("stateIndicatorText");
    const soundToggle = byId<HTMLButtonElement>("soundToggle");
    const soundIcon = byId<HTMLSpanElement>("soundIcon");
    const soundText = byId<HTMLSpanElement>("soundText");
    const controlsToggleBtn = byId<HTMLButtonElement>("controlsToggleBtn");
    const controlsDialog = byId<HTMLDialogElement>("controlsDialog");
    const presetStepsContainer = byId<HTMLDivElement>("presetStepsContainer");

    if (
      !canvas ||
      !canvasContainer ||
      !logSlider ||
      !currentValDisplay ||
      !tierInfoBadge ||
      !dotCountDisplay ||
      !tierValueLabel ||
      !powerIndicator ||
      !analogyValueText ||
      !timeStatValue ||
      !analogyText ||
      !btnPlayPause ||
      !btnPrevStep ||
      !btnNextStep ||
      !stateIndicator ||
      !stateIndicatorText ||
      !soundToggle ||
      !soundIcon ||
      !soundText ||
      !controlsToggleBtn ||
      !controlsDialog ||
      !presetStepsContainer
    ) {
      return;
    }

    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;
    const ctx: CanvasRenderingContext2D = canvasCtx;

    type CoreTone = "green" | "purple" | "orange" | "yellow" | "cyan";
    type CoreColorInfo = {
      hex: string;
      rgb: [number, number, number];
      glow: string;
    };
    type StepMeta = {
      id: string;
      label: string;
      value: number;
      power: string;
      tone: CoreTone;
      example: string;
      rawTime: number;
    };
    type TierMeta = {
      index: number;
      unitValue: number;
      colorName: CoreTone;
      label: string;
    };

    const STEPS: StepMeta[] = [
      { id: "one", label: "1", value: 1, power: "10⁰", tone: "green", example: "A single heartbeat. The primary unit of all structures.", rawTime: 1 },
      { id: "ten", label: "10", value: 10, power: "10¹", tone: "green", example: "The fingers on two hands. The basic structural unit of decimal arithmetic.", rawTime: 10 },
      { id: "hundred", label: "100", value: 100, power: "10²", tone: "purple", example: "Grains of salt in a pinch. Page count of a short story.", rawTime: 100 },
      { id: "thousand", label: "1,000", value: 1_000, power: "10³", tone: "purple", example: "Words on a book page. The steps taken in a casual 10-minute walk.", rawTime: 1_000 },
      { id: "ten_thousand", label: "10,000", value: 10_000, power: "10⁴", tone: "orange", example: "Total stars visible to the naked human eye under a perfectly clear night sky.", rawTime: 10_000 },
      { id: "hundred_thousand", label: "100,000", value: 100_000, power: "10⁵", tone: "orange", example: "The total number of hairs on a full human head. Capacity of a massive stadium.", rawTime: 100_000 },
      { id: "million", label: "1 Million", value: 1_000_000, power: "10⁶", tone: "yellow", example: "Characters in a massive novel. Total running steps in a standard marathon.", rawTime: 1_000_000 },
      { id: "ten_million", label: "10 Million", value: 10_000_000, power: "10⁷", tone: "yellow", example: "Population of a major mega-city like Tokyo, Seoul, or London.", rawTime: 10_000_000 },
      { id: "hundred_million", label: "100 Million", value: 100_000_000, power: "10⁸", tone: "cyan", example: "Total books published in human history. Heartbeats of a cat over its lifetime.", rawTime: 100_000_000 },
      { id: "billion", label: "1 Billion", value: 1_000_000_000, power: "10⁹", tone: "cyan", example: "Grains of sand in a typical children's playground. Light travel distance in meters in 3.3 seconds.", rawTime: 1_000_000_000 },
    ];

    const CORES: Record<CoreTone, CoreColorInfo> = {
      green: { hex: "#14b8a6", rgb: [20, 184, 166] as [number, number, number], glow: "rgba(20, 184, 166, 0.4)" },
      purple: { hex: "#8b5cf6", rgb: [139, 92, 246] as [number, number, number], glow: "rgba(139, 92, 246, 0.4)" },
      orange: { hex: "#f97316", rgb: [249, 115, 22] as [number, number, number], glow: "rgba(249, 115, 22, 0.4)" },
      yellow: { hex: "#f59e0b", rgb: [245, 158, 11] as [number, number, number], glow: "rgba(245, 158, 11, 0.4)" },
      cyan: { hex: "#06b6d4", rgb: [6, 182, 212] as [number, number, number], glow: "rgba(6, 182, 212, 0.4)" },
    };

    const TIERS: TierMeta[] = [
      { index: 0, unitValue: 1, colorName: "green", label: "Units (Green)" },
      { index: 1, unitValue: 100, colorName: "purple", label: "Hundreds (Purple)" },
      { index: 2, unitValue: 10_000, colorName: "orange", label: "Ten-Thousands (Orange)" },
      { index: 3, unitValue: 1_000_000, colorName: "yellow", label: "Millions (Yellow)" },
      { index: 4, unitValue: 100_000_000, colorName: "cyan", label: "Hundred-Millions (Cyan)" },
    ];

    type VisualMode = "NORMAL" | "COMPRESSING" | "EXPANDING";
    type Speed = "slow" | "normal" | "fast";

    const state = {
      currentValue: 1,
      targetValue: 1,
      isPlaying: false,
      speed: "normal" as Speed,
      speedMult: 1,
      currentTierIdx: 0,
      visualMode: "NORMAL" as VisualMode,
      transitionProgress: 0,
      particles: [] as Particle[],
      ambientStars: [] as CosmicStar[],
      shockwaves: [] as Shockwave[],
      isScrubbing: false,
    };

    class SoundSynth {
      ctx: AudioContext | null = null;
      muted = true;
      lastTickTime = 0;

      init() {
        if (!this.ctx) {
          this.ctx = new (window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
        }
        if (this.ctx.state === "suspended") {
          void this.ctx.resume();
        }
      }

      toggleMute() {
        this.init();
        this.muted = !this.muted;
        return this.muted;
      }

      playTick(value: number) {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        if (now - this.lastTickTime < 0.04) return;
        this.lastTickTime = now;

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        const logVal = Math.log10(value || 1);
        const baseFreq = 600 - logVal * 50;

        osc.type = logVal > 6 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.2, this.ctx.currentTime + 0.08);

        gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.09);
      }

      playCompress() {
        if (this.muted || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(350, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.5);

        gainNode.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.55);
      }

      playExpand() {
        if (this.muted || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc.type = "triangle";
        osc.frequency.setValueAtTime(80, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.5);

        gainNode.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.55);
      }
    }

    const audio = new SoundSynth();

    const getTierForValue = (val: number) => {
      for (let i = TIERS.length - 1; i >= 0; i -= 1) {
        if (val >= TIERS[i]!.unitValue) return TIERS[i]!;
      }
      return TIERS[0]!;
    };

    const formatNumber = (num: number) => Math.round(num).toLocaleString();

    const formatTimeAnalogy = (seconds: number) => {
      if (seconds < 60) return `${seconds.toFixed(0)} Second${seconds !== 1 ? "s" : ""}`;
      const minutes = seconds / 60;
      if (minutes < 60) return `${minutes.toFixed(1)} Minute${minutes !== 1 ? "s" : ""}`;
      const hours = minutes / 60;
      if (hours < 24) return `${hours.toFixed(1)} Hour${hours !== 1 ? "s" : ""}`;
      const days = hours / 24;
      if (days < 365) return `${days.toFixed(1)} Day${days !== 1 ? "s" : ""}`;
      const years = days / 365;
      return `${years.toFixed(1)} Year${years !== 1 ? "s" : ""}`;
    };

    const lerpColor = (c1: [number, number, number], c2: [number, number, number], factor: number) => {
      const r = Math.round(c1[0] + factor * (c2[0] - c1[0]));
      const g = Math.round(c1[1] + factor * (c2[1] - c1[1]));
      const b = Math.round(c1[2] + factor * (c2[2] - c1[2]));
      return `rgb(${r}, ${g}, ${b})`;
    };

    class Particle {
      index: number;
      tierIdx: number;
      gx = 0;
      gy = 0;
      x = 0;
      y = 0;
      radius = 5;
      alpha = 1;
      colorInfo: CoreColorInfo = CORES.green;

      constructor(index: number, tierIdx: number) {
        this.index = index;
        this.tierIdx = tierIdx;
        this.reset();
      }

      reset() {
        const tier = TIERS[this.tierIdx]!;
        const col = this.index % 10;
        const row = Math.floor(this.index / 10);
        const spacing = 32;
        this.gx = (col - 4.5) * spacing;
        this.gy = (row - 4.5) * spacing;
        this.x = 0;
        this.y = 0;
        this.radius = this.tierIdx % 2 === 0 ? 5 : 4;
        this.colorInfo = CORES[tier.colorName];
      }

      update() {
        if (state.visualMode === "NORMAL") {
          const k = 0.15 * state.speedMult;
          this.x += (this.gx - this.x) * k;
          this.y += (this.gy - this.y) * k;
          this.radius = this.tierIdx % 2 === 0 ? 5 : 4;
          this.alpha += (1 - this.alpha) * 0.15;
          return;
        }

        if (state.visualMode === "COMPRESSING") {
          const t = state.transitionProgress;
          this.x = this.gx * (1 - t);
          this.y = this.gy * (1 - t);
          this.radius = Math.max(1, (this.tierIdx % 2 === 0 ? 5 : 4) * (1 - t));
          this.alpha = 1 - t;
          return;
        }

        const t = state.transitionProgress;
        this.x = this.gx * t;
        this.y = this.gy * t;
        this.radius = Math.max(0.1, (this.tierIdx % 2 === 0 ? 5 : 4) * t);
        this.alpha = t;
      }

      draw(offsetX: number, offsetY: number) {
        ctx.save();
        ctx.translate(offsetX, offsetY);

        let currentHex = this.colorInfo.hex;
        if (state.visualMode === "COMPRESSING") {
          const nextTier = TIERS[Math.min(TIERS.length - 1, this.tierIdx + 1)]!;
          currentHex = lerpColor(this.colorInfo.rgb, CORES[nextTier.colorName].rgb, state.transitionProgress);
        } else if (state.visualMode === "EXPANDING") {
          const prevTier = TIERS[Math.max(0, this.tierIdx - 1)]!;
          currentHex = lerpColor(CORES[prevTier.colorName].rgb, this.colorInfo.rgb, state.transitionProgress);
        }

        ctx.shadowBlur = state.visualMode === "COMPRESSING" ? 15 : 8;
        ctx.shadowColor = currentHex;
        ctx.fillStyle = currentHex;
        ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.font = "600 7px var(--mono)";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.fillText(formatNumber(TIERS[this.tierIdx]!.unitValue), this.x, this.y + this.radius + 3);
        ctx.restore();
      }
    }

    class CosmicStar {
      x = 0;
      y = 0;
      depth = 0;
      size = 0;
      alpha = 0;
      speed = 0;
      constructor() {
        this.reset();
      }
      reset() {
        this.x = (Math.random() - 0.5) * window.innerWidth;
        this.y = (Math.random() - 0.5) * window.innerHeight;
        this.depth = Math.random() * 0.9 + 0.1;
        this.size = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.speed = Math.random() * 0.05 + 0.01;
      }
      update() {
        this.y += this.speed * state.speedMult;
        if (this.y > window.innerHeight / 2) this.y = -window.innerHeight / 2;
      }
      draw(cx: number, cy: number, starColor: string) {
        ctx.fillStyle = starColor;
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(cx + this.x, cy + this.y, this.size * this.depth, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    class Shockwave {
      radius = 1;
      maxRadius = 120 + Math.random() * 100;
      alpha = 1;
      color = "#8b5cf6";
      update() {
        this.radius += 5 * state.speedMult;
        this.alpha = 1 - this.radius / this.maxRadius;
      }
      draw(cx: number, cy: number) {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    for (let i = 0; i < 150; i += 1) {
      state.ambientStars.push(new CosmicStar());
    }

    const updatePresetsUI = () => {
      root.querySelectorAll<HTMLButtonElement>(".preset-step-btn").forEach((btn) => {
        const val = Number(btn.dataset.value);
        const active = Math.abs(state.targetValue - val) < 0.1;
        btn.classList.toggle("preset-step-btn--active", active);
      });
    };

    const setTargetValue = (val: number) => {
      state.targetValue = Math.max(1, Math.min(1_000_000_000, val));
      updatePresetsUI();
    };

    const showStatusIndicator = (text: string) => {
      stateIndicatorText.textContent = text;
      stateIndicator.classList.add("big-numbers-scale__status--visible");
    };

    const hideStatusIndicator = () => {
      stateIndicator.classList.remove("big-numbers-scale__status--visible");
    };

    const syncParticles = () => {
      const tier = TIERS[state.currentTierIdx]!;

      if (state.visualMode === "COMPRESSING") {
        if (state.particles.length !== 100) {
          state.particles = [];
          for (let i = 0; i < 100; i += 1) {
            const p = new Particle(i, state.currentTierIdx);
            p.x = p.gx;
            p.y = p.gy;
            state.particles.push(p);
          }
        }
        return;
      }

      if (state.visualMode === "EXPANDING") {
        if (state.particles.length !== 100) {
          state.particles = [];
          const lowerTierIdx = Math.max(0, state.currentTierIdx - 1);
          for (let i = 0; i < 100; i += 1) {
            const p = new Particle(i, lowerTierIdx);
            p.x = 0;
            p.y = 0;
            state.particles.push(p);
          }
        }
        return;
      }

      const relativeVal = state.currentValue / tier.unitValue;
      const numDots = Math.min(100, Math.max(1, Math.floor(relativeVal)));

      state.particles.forEach((p) => {
        if (p.tierIdx !== state.currentTierIdx) {
          p.tierIdx = state.currentTierIdx;
          p.colorInfo = CORES[tier.colorName];
        }
      });

      if (state.particles.length !== numDots) {
        if (state.particles.length < numDots) {
          const toAdd = numDots - state.particles.length;
          for (let i = 0; i < toAdd; i += 1) {
            const idx = state.particles.length;
            const p = new Particle(idx, state.currentTierIdx);
            p.x = 0;
            p.y = 0;
            p.alpha = 0;
            state.particles.push(p);
          }
        } else {
          state.particles.splice(numDots);
        }
      }
    };

    const updateState = () => {
      const activeTier = TIERS[state.currentTierIdx]!;
      const diff = state.targetValue - state.currentValue;

      if (Math.abs(diff) < 0.01) {
        state.currentValue = state.targetValue;
        state.visualMode = "NORMAL";
        hideStatusIndicator();
      } else if (state.visualMode === "NORMAL") {
        if (diff > 0 && state.currentValue >= activeTier.unitValue * 100) {
          if (state.currentTierIdx < TIERS.length - 1) {
            state.visualMode = "COMPRESSING";
            state.transitionProgress = 0;
            audio.playCompress();
            showStatusIndicator("Compressing 100 units...");
          } else {
            state.currentValue = state.targetValue;
          }
        } else if (diff < 0 && state.currentValue <= activeTier.unitValue && state.currentTierIdx > 0) {
          state.visualMode = "EXPANDING";
          state.transitionProgress = 0;
          audio.playExpand();
          showStatusIndicator("Expanding unit dot into 100 component dots...");
        } else {
          const stepSign = Math.sign(diff);
          const logDistance = Math.max(1, Math.log10(Math.abs(diff) / activeTier.unitValue));
          const baseVelocity = 0.15 * activeTier.unitValue * state.speedMult;
          const increment = stepSign * Math.min(Math.abs(diff), baseVelocity * Math.pow(1.5, logDistance));
          const dotsBefore = Math.floor(state.currentValue / activeTier.unitValue);
          state.currentValue += increment;
          const dotsAfter = Math.floor(state.currentValue / activeTier.unitValue);
          if (dotsBefore !== dotsAfter && increment !== 0) {
            audio.playTick(state.currentValue);
          }
        }
      }

      if (state.visualMode === "COMPRESSING") {
        state.transitionProgress += 0.02 * state.speedMult;
        if (state.transitionProgress >= 1) {
          state.currentTierIdx += 1;
          state.currentValue = TIERS[state.currentTierIdx]!.unitValue;
          state.visualMode = "NORMAL";
          hideStatusIndicator();
          const sw = new Shockwave();
          sw.color = CORES[TIERS[state.currentTierIdx]!.colorName].hex;
          state.shockwaves.push(sw);
          audio.playTick(state.currentValue);
        }
      }

      if (state.visualMode === "EXPANDING") {
        state.transitionProgress += 0.02 * state.speedMult;
        if (state.transitionProgress >= 1) {
          state.currentTierIdx -= 1;
          state.currentValue = TIERS[state.currentTierIdx]!.unitValue * 100;
          state.visualMode = "NORMAL";
          hideStatusIndicator();
          const sw = new Shockwave();
          sw.color = CORES[TIERS[state.currentTierIdx]!.colorName].hex;
          state.shockwaves.push(sw);
          audio.playTick(state.currentValue);
        }
      }

      syncParticles();
      state.particles.forEach((p) => p.update());
      state.ambientStars.forEach((s) => s.update());
      state.shockwaves = state.shockwaves.filter((sw) => sw.alpha > 0);
      state.shockwaves.forEach((sw) => sw.update());

      if (!state.isScrubbing) {
        logSlider.value = Math.log10(state.currentValue).toFixed(2);
      }
    };

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const styles = getComputedStyle(root);
      const canvasBg = styles.getPropertyValue("--big-scale-canvas-bg").trim() || "var(--paper)";
      const gridColor = styles.getPropertyValue("--big-scale-grid").trim() || "rgba(30, 41, 59, 0.22)";
      const starColor = styles.getPropertyValue("--big-scale-star").trim() || "rgba(148, 163, 184, 0.35)";

      ctx.fillStyle = canvasBg;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      state.ambientStars.forEach((s) => s.draw(cx, cy, starColor));

      ctx.save();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      const gridSpacing = 40;
      const gridCols = Math.ceil(width / gridSpacing);
      const gridRows = Math.ceil(height / gridSpacing);
      const startX = 0;
      const startY = 0;
      for (let i = 0; i < gridCols; i += 1) {
        ctx.beginPath();
        ctx.moveTo(startX + i * gridSpacing, 0);
        ctx.lineTo(startX + i * gridSpacing, height);
        ctx.stroke();
      }
      for (let j = 0; j < gridRows; j += 1) {
        ctx.beginPath();
        ctx.moveTo(0, startY + j * gridSpacing);
        ctx.lineTo(width, startY + j * gridSpacing);
        ctx.stroke();
      }
      ctx.restore();

      state.shockwaves.forEach((sw) => sw.draw(cx, cy));
      state.particles.forEach((p) => p.draw(cx, cy));
    };

    const updateHUD = () => {
      const activeTier = TIERS[state.currentTierIdx]!;
      currentValDisplay.textContent = formatNumber(state.currentValue);
      tierInfoBadge.textContent = `${activeTier.label.toUpperCase()} — UNIT VALUE = ${formatNumber(activeTier.unitValue)}`;
      tierInfoBadge.className = "big-numbers-scale__tier-badge";
      tierInfoBadge.classList.add(`big-numbers-scale__tier-badge--${activeTier.colorName}`);
      const currentUnitDots = Math.floor(state.currentValue / activeTier.unitValue);
      dotCountDisplay.textContent = `${currentUnitDots} Dot${currentUnitDots !== 1 ? "s" : ""}`;
      tierValueLabel.innerHTML = `Each dot represents <strong>${formatNumber(activeTier.unitValue)}</strong>`;
      powerIndicator.textContent = `10^${Math.log10(state.currentValue).toFixed(2)}`;
      const stepMeta = STEPS.find((s) => s.value <= state.currentValue && s.value * 10 > state.currentValue) || STEPS[0];
      analogyText.textContent = `"${stepMeta.example}"`;
      analogyValueText.textContent = formatNumber(state.currentValue);
      timeStatValue.textContent = formatTimeAnalogy(state.currentValue);
    };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvasContainer.clientWidth * dpr);
      canvas.height = Math.floor(canvasContainer.clientHeight * dpr);
      canvas.style.width = `${canvasContainer.clientWidth}px`;
      canvas.style.height = `${canvasContainer.clientHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    STEPS.forEach((step) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "preset-step-btn";
      btn.dataset.value = `${step.value}`;
      btn.innerHTML = `<span class="preset-step-btn__power">${step.power}</span><span class="preset-step-btn__label">${step.label}</span>`;
      btn.addEventListener("click", () => {
        setTargetValue(step.value);
        audio.playTick(step.value);
      });
      presetStepsContainer.appendChild(btn);
    });
    updatePresetsUI();

    const speedButtons = root.querySelectorAll<HTMLButtonElement>(".speed-btn");
    speedButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const target = e.currentTarget as HTMLButtonElement;
        const speed = (target.dataset.speed || "normal") as Speed;
        state.speed = speed;
        speedButtons.forEach((b) => b.classList.remove("speed-btn--active"));
        target.classList.add("speed-btn--active");
        if (speed === "slow") {
          state.speedMult = 0.35;
          byId<HTMLSpanElement>("speedIndicatorText")!.textContent = "Speed: Slow";
        } else if (speed === "normal") {
          state.speedMult = 1;
          byId<HTMLSpanElement>("speedIndicatorText")!.textContent = "Speed: Normal";
        } else {
          state.speedMult = 3;
          byId<HTMLSpanElement>("speedIndicatorText")!.textContent = "Speed: Fast";
        }
      });
    });

    soundToggle.addEventListener("click", () => {
      const muted = audio.toggleMute();
      if (muted) {
        soundIcon.textContent = "🔇";
        soundText.textContent = "Muted";
      } else {
        soundIcon.textContent = "🔊";
        soundText.textContent = "Active";
      }
    });

    logSlider.addEventListener("input", (e) => {
      const val = Math.pow(10, Number((e.target as HTMLInputElement).value));
      setTargetValue(val);
    });
    logSlider.addEventListener("mousedown", () => {
      state.isScrubbing = true;
    });
    logSlider.addEventListener("mouseup", () => {
      state.isScrubbing = false;
    });
    logSlider.addEventListener("touchstart", () => {
      state.isScrubbing = true;
    });
    logSlider.addEventListener("touchend", () => {
      state.isScrubbing = false;
    });

    btnPrevStep.addEventListener("click", () => {
      let closestSmallerStep: number = STEPS[0]!.value;
      for (let i = STEPS.length - 1; i >= 0; i -= 1) {
        if (STEPS[i]!.value < state.targetValue) {
          closestSmallerStep = STEPS[i]!.value;
          break;
        }
      }
      setTargetValue(closestSmallerStep);
      audio.playTick(closestSmallerStep);
    });

    btnNextStep.addEventListener("click", () => {
      let closestLargerStep: number = STEPS[STEPS.length - 1]!.value;
      for (let i = 0; i < STEPS.length; i += 1) {
        if (STEPS[i]!.value > state.targetValue) {
          closestLargerStep = STEPS[i]!.value;
          break;
        }
      }
      setTargetValue(closestLargerStep);
      audio.playTick(closestLargerStep);
    });

    btnPlayPause.addEventListener("click", () => {
      state.isPlaying = !state.isPlaying;
      if (state.isPlaying) {
        btnPlayPause.textContent = "Pause Autoplay";
        btnPlayPause.classList.add("big-numbers-scale__autoplay-btn--pause");
        showStatusIndicator("Autoplay running...");
      } else {
        btnPlayPause.textContent = "Auto Increment";
        btnPlayPause.classList.remove("big-numbers-scale__autoplay-btn--pause");
        hideStatusIndicator();
      }
    });

    const isMobileControlsMode = () => window.matchMedia("(max-width: 959px)").matches;

    const onControlsToggleClick = () => {
      if (!isMobileControlsMode()) return;
      if (!controlsDialog.open) {
        controlsDialog.showModal();
      }
    };

    const onControlsDialogClick = (event: MouseEvent) => {
      if (event.target === controlsDialog) {
        controlsDialog.close();
        return;
      }
      if (!isMobileControlsMode()) return;
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const clickedButton = target.closest("button");
      if (!clickedButton) return;
      if (clickedButton.id === "controlsToggleBtn") return;
      requestAnimationFrame(() => {
        if (controlsDialog.open) controlsDialog.close();
      });
    };

    controlsToggleBtn.addEventListener("click", onControlsToggleClick);
    controlsDialog.addEventListener("click", onControlsDialogClick);

    let rafId = 0;
    let lastTime = performance.now();
    const loop = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;
      if (state.isPlaying && state.visualMode === "NORMAL") {
        const activeTier = getTierForValue(state.currentValue);
        const multiplier = state.speed === "slow" ? 0.35 : state.speed === "normal" ? 1 : 3;
        const logDistance = Math.max(1, Math.log10(Math.abs(state.targetValue - state.currentValue) / activeTier.unitValue));
        const stepIncrement = activeTier.unitValue * 0.12 * multiplier * Math.pow(1.5, logDistance);
        if (state.targetValue < 1_000_000_000) {
          setTargetValue(state.targetValue + stepIncrement);
        } else {
          state.isPlaying = false;
          setTargetValue(1);
          btnPlayPause.click();
        }
      }
      void delta;
      updateState();
      draw();
      updateHUD();
      rafId = requestAnimationFrame(loop);
    };

    resizeCanvas();
    setTargetValue(1);
    rafId = requestAnimationFrame(loop);
    window.addEventListener("resize", resizeCanvas);

    onCleanup(() => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resizeCanvas);
      controlsToggleBtn.removeEventListener("click", onControlsToggleClick);
      controlsDialog.removeEventListener("click", onControlsDialogClick);
    });
  });

  return (
    <section class="math-widget big-numbers-scale" aria-labelledby="big-numbers-scale-title">
      <h2 id="big-numbers-scale-title" class="math-widget__title">
        Cosmic scales
      </h2>
      <div class="big-numbers-scale__layout" ref={rootRef}>
        <div class="big-numbers-scale__canvas-panel">
          <div class="big-numbers-scale__toolbar">
            <button id="soundToggle" type="button" class="big-numbers-scale__tool-btn">
              <span id="soundIcon">🔇</span>
              <span id="soundText">Muted</span>
            </button>
            <button
              id="controlsToggleBtn"
              type="button"
              class="big-numbers-scale__tool-btn big-numbers-scale__controls-toggle"
              aria-label="Open controls panel"
              aria-haspopup="dialog"
              aria-controls="controlsDialog"
            >
              ⚙
            </button>
            <span id="speedIndicatorText" class="big-numbers-scale__badge">
              Speed: Normal
            </span>
          </div>
          <div class="big-numbers-scale__hud">
            <div class="big-numbers-scale__hud-card">
              <span class="big-numbers-scale__hud-label">Current Value</span>
              <span id="currentValDisplay" class="big-numbers-scale__hud-value">
                1
              </span>
              <span id="tierInfoBadge" class="big-numbers-scale__tier-badge">
                UNITS
              </span>
            </div>
            <div class="big-numbers-scale__hud-card big-numbers-scale__hud-card--right">
              <span class="big-numbers-scale__hud-label">Active Entities</span>
              <span id="dotCountDisplay" class="big-numbers-scale__hud-value big-numbers-scale__hud-value--small">
                1 Dot
              </span>
              <span id="tierValueLabel" class="big-numbers-scale__hud-sub">
                Each dot represents 1
              </span>
            </div>
          </div>
          <div id="canvasContainer" class="big-numbers-scale__canvas-wrap">
            <canvas id="scaleCanvas" class="big-numbers-scale__canvas" />
            <div id="stateIndicator" class="big-numbers-scale__status">
              <span id="stateIndicatorText">Ready</span>
            </div>
          </div>
          <div class="big-numbers-scale__slider-wrap">
            <div class="big-numbers-scale__slider-meta">
              <span>Logarithmic power</span>
              <span id="powerIndicator">10^0</span>
            </div>
            <input id="logSlider" type="range" min="0" max="9" step="0.01" value="0" class="big-numbers-scale__slider" />
          </div>
        </div>

        <dialog id="controlsDialog" class="big-numbers-scale__controls-dialog contributor-dialog">
          <div class="big-numbers-scale__controls-dialog__sheet contributor-dialog-panel">
            <div class="big-numbers-scale__controls-dialog__header">
              <h3 class="big-numbers-scale__controls-dialog__title">Controls</h3>
              <button
                type="button"
                class="contributor-dialog-close"
                aria-label="Close controls panel"
              >
                ×
              </button>
            </div>

            <div class="big-numbers-scale__controls">
              <div class="big-numbers-scale__section">
                <h3 class="big-numbers-scale__section-title">Mathematical milestones</h3>
                <div id="presetStepsContainer" class="big-numbers-scale__preset-grid" />
              </div>
              <div class="big-numbers-scale__section">
                <h3 class="big-numbers-scale__section-title">Motion control</h3>
                <div class="big-numbers-scale__speed-grid">
                  <button type="button" class="speed-btn" data-speed="slow">
                    Slow
                  </button>
                  <button type="button" class="speed-btn speed-btn--active" data-speed="normal">
                    Normal
                  </button>
                  <button type="button" class="speed-btn" data-speed="fast">
                    Fast
                  </button>
                </div>
                <div class="big-numbers-scale__nav-row">
                  <button id="btnPrevStep" type="button" class="big-numbers-scale__tool-btn">
                    Down step
                  </button>
                  <button id="btnPlayPause" type="button" class="big-numbers-scale__autoplay-btn">
                    Auto Increment
                  </button>
                  <button id="btnNextStep" type="button" class="big-numbers-scale__tool-btn">
                    Up step
                  </button>
                </div>
              </div>
              <div class="big-numbers-scale__section big-numbers-scale__stats">
                <h3 class="big-numbers-scale__section-title">Time to count individually</h3>
                <p class="big-numbers-scale__stat-text">
                  Counting to <span id="analogyValueText">1</span> at one number per second takes:
                </p>
                <div id="timeStatValue" class="big-numbers-scale__stat-value">
                  1 Second
                </div>
                <p id="analogyText" class="big-numbers-scale__analogy">
                  "A single heartbeat. The primary unit of all structures."
                </p>
              </div>
            </div>
          </div>
        </dialog>
      </div>
    </section>
  );
}

export default BigNumbersScale;
