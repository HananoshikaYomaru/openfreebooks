import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { MathVisualizer } from "./lib/math-visualizer";

type Op = "+" | "-" | "*" | "/";

const DEFAULT_NUMBERS = "27\n59";

class WorkbenchSound {
  private ctx: AudioContext | null = null;
  muted = true;
  private lastTick = 0;

  private ensureCtx() {
    if (!this.ctx) {
      this.ctx = new (
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      )();
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
  }

  toggleMute() {
    this.ensureCtx();
    this.muted = !this.muted;
    return this.muted;
  }

  private play(
    type: OscillatorType,
    fromHz: number,
    toHz: number,
    duration: number,
    gainStart: number
  ) {
    if (this.muted) return;
    this.ensureCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(fromHz, this.ctx.currentTime);
    if (toHz > fromHz) {
      osc.frequency.exponentialRampToValueAtTime(toHz, this.ctx.currentTime + duration);
    } else {
      osc.frequency.linearRampToValueAtTime(toHz, this.ctx.currentTime + duration);
    }
    gain.gain.setValueAtTime(gainStart, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.start();
    osc.stop(this.ctx.currentTime + duration + 0.01);
  }

  playTick() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (now - this.lastTick < 0.04) return;
    this.lastTick = now;
    this.play("sine", 520, 220, 0.07, 0.07);
  }

  playGenerate() {
    this.play("triangle", 200, 420, 0.22, 0.11);
  }

  playTogglePlay(playing: boolean) {
    if (playing) {
      this.play("triangle", 260, 600, 0.15, 0.09);
    } else {
      this.play("sawtooth", 440, 220, 0.12, 0.06);
    }
  }

  playError() {
    this.play("square", 180, 120, 0.16, 0.08);
  }
}

function VerticalArithmeticWorkbench() {
  let rootRef!: HTMLElement;
  let canvasRef!: HTMLCanvasElement;
  let canvasWrapRef!: HTMLDivElement;
  let visualizer: MathVisualizer | undefined;

  const [operation, setOperation] = createSignal<Op>("+");
  const [numbersInput, setNumbersInput] = createSignal(DEFAULT_NUMBERS);
  const [message, setMessage] = createSignal("Enter numbers and click Generate");
  const [isError, setIsError] = createSignal(false);
  const [stepCurrent, setStepCurrent] = createSignal(0);
  const [stepTotal, setStepTotal] = createSignal(0);
  const [playing, setPlaying] = createSignal(false);
  const [speed, setSpeed] = createSignal(800);
  const [soundMuted, setSoundMuted] = createSignal(true);

  const sound = new WorkbenchSound();
  let lastStep = 0;
  let lastPlaying = false;

  const progress = () =>
    stepTotal() > 0 ? (stepCurrent() / stepTotal()) * 100 : 0;

  onMount(() => {
    visualizer = new MathVisualizer({
      canvas: canvasRef,
      wrapper: canvasWrapRef,
      themeRoot: rootRef,
    });
    visualizer.onMessage = (msg, err) => {
      setMessage(msg);
      setIsError(!!err);
      if (err) sound.playError();
    };
    visualizer.onStep = (current, total) => {
      setStepCurrent(current);
      setStepTotal(total);
      if (current !== lastStep) {
        sound.playTick();
      }
      lastStep = current;
    };
    visualizer.onPlayState = (nextPlaying) => {
      setPlaying(nextPlaying);
      if (nextPlaying !== lastPlaying) {
        sound.playTogglePlay(nextPlaying);
      }
      lastPlaying = nextPlaying;
    };

    const resize = () => visualizer?.resizeCanvas();
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvasWrapRef);
    window.addEventListener("resize", resize);

    const themeObserver = new MutationObserver(() => {
      visualizer?.refreshColors();
      visualizer?.render();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    onCleanup(() => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();
      visualizer?.destroy();
    });

    setTimeout(() => generate(), 100);
  });

  createEffect(() => {
    visualizer?.setOperation(operation());
    visualizer?.setSpeed(speed());
  });

  const generate = () => {
    visualizer?.setOperation(operation());
    visualizer?.generateFromInput(numbersInput());
    sound.playGenerate();
  };

  return (
    <section
      ref={rootRef}
      class="math-widget va-workbench"
      aria-labelledby="va-workbench-title"
    >
      <h2 id="va-workbench-title" class="math-widget__title">
        Carry &amp; borrow arithmetic visualizer
      </h2>

      <div class="va-workbench__shell">
        <aside class="va-workbench__sidebar">
          <div class="va-workbench__brand">
            <span class="va-workbench__brand-icon" aria-hidden="true">
              ±
            </span>
            <span class="va-workbench__brand-text">
              Arithmetic <strong>Visualizer</strong>
            </span>
            <button
              type="button"
              class="va-workbench__sound-btn"
              aria-pressed={!soundMuted()}
              title={soundMuted() ? "Enable sound effects" : "Mute sound effects"}
              onClick={() => {
                const muted = sound.toggleMute();
                setSoundMuted(muted);
              }}
            >
              {soundMuted() ? "🔇 Muted" : "🔊 Active"}
            </button>
          </div>

          <div class="va-workbench__field">
            <span class="va-workbench__label">Operation</span>
            <div class="va-workbench__op-grid" role="group" aria-label="Operation">
              {(
                [
                  ["+", "Add"],
                  ["-", "Subtract"],
                  ["*", "Multiply"],
                  ["/", "Divide"],
                ] as const
              ).map(([op, label]) => (
                <button
                  type="button"
                  class="va-workbench__op-btn"
                  classList={{ "va-workbench__op-btn--active": operation() === op }}
                  aria-pressed={operation() === op}
                  aria-label={label}
                  onClick={() => {
                    setOperation(op);
                    sound.playTick();
                  }}
                >
                  {op === "*" ? "×" : op === "/" ? "÷" : op}
                </button>
              ))}
            </div>
          </div>

          <div class="va-workbench__field">
            <label class="va-workbench__label" for="va-numbers">
              Numbers (one per line)
            </label>
            <textarea
              id="va-numbers"
              class="va-workbench__textarea"
              rows={4}
              value={numbersInput()}
              placeholder={"99\n99\n273"}
              onInput={(e) => setNumbersInput(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  generate();
                }
              }}
            />
            <p class="va-workbench__hint">
              Multi-step operations run in order (e.g. subtract or divide each line from the
              result so far).
            </p>
          </div>

          <button type="button" class="va-workbench__generate" onClick={generate}>
            Generate visualization
          </button>

          <div class="va-workbench__anim">
            <span class="va-workbench__label">Animation controls</span>
            <div class="va-workbench__transport">
              <button
                type="button"
                class="va-workbench__transport-btn"
                title="Previous step"
                aria-label="Previous step"
                onClick={() => visualizer?.step(-1)}
              >
                ‹
              </button>
              <button
                type="button"
                class="va-workbench__play"
                title={playing() ? "Pause" : "Play"}
                onClick={() => visualizer?.togglePlay()}
              >
                {playing() ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                class="va-workbench__transport-btn"
                title="Next step"
                aria-label="Next step"
                onClick={() => visualizer?.step(1)}
              >
                ›
              </button>
            </div>
            <div class="va-workbench__speed">
              <span>Slow</span>
              <input
                type="range"
                class="va-workbench__speed-slider"
                min={200}
                max={2000}
                step={100}
                value={speed()}
                dir="rtl"
                aria-label="Animation speed"
                onInput={(e) => setSpeed(Number(e.currentTarget.value))}
              />
              <span>Fast</span>
            </div>
          </div>

          <p class="va-workbench__footer-note">
            Max 8 digits recommended for best visualization.
          </p>
        </aside>

        <div class="va-workbench__stage">
          <div
            class="va-workbench__message-box"
            classList={{ "va-workbench__message-box--error": isError() }}
          >
            <p class="va-workbench__message" aria-live="polite">
              {message()}
            </p>
            <div class="va-workbench__progress-track">
              <div
                class="va-workbench__progress-fill"
                style={{ width: `${progress()}%` }}
              />
            </div>
            <p class="va-workbench__step-counter">
              Step {stepCurrent()} / {stepTotal()}
            </p>
          </div>

          <div ref={canvasWrapRef} class="va-workbench__canvas-wrap">
            <canvas ref={canvasRef} class="va-workbench__canvas" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default VerticalArithmeticWorkbench;
