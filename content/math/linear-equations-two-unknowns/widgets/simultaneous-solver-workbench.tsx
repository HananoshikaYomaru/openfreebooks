import { renderLatex } from "@ofb/katex";
import { createEffect, createMemo, createSignal, For, onCleanup, Show } from "solid-js";

type Eq = [number, number, number];
type Method = "substitution" | "elimination";

type Preset = {
  id: string;
  label: string;
  eq1: Eq;
  eq2: Eq;
  methods: Method[];
};

type Step = {
  title: string;
  latex: string;
};

const PRESETS: Preset[] = [
  {
    id: "add-y",
    label: "x + y = 5, 2x − y = 1",
    eq1: [1, 1, 5],
    eq2: [2, -1, 1],
    methods: ["elimination", "substitution"],
  },
  {
    id: "sub-y",
    label: "y = 2x + 1, x + y = 7",
    eq1: [-2, 1, 1],
    eq2: [1, 1, 7],
    methods: ["substitution", "elimination"],
  },
  {
    id: "coins",
    label: "x + y = 8, 5x + 2y = 28",
    eq1: [1, 1, 8],
    eq2: [5, 2, 28],
    methods: ["substitution", "elimination"],
  },
  {
    id: "parallel",
    label: "x + y = 5, 2x + 2y = 12 (parallel)",
    eq1: [1, 1, 5],
    eq2: [2, 2, 12],
    methods: ["elimination"],
  },
];

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

function lcm(a: number, b: number): number {
  return (Math.abs(a) * Math.abs(b)) / gcd(a, b);
}

function formatTerm(coef: number, variable: string, first: boolean): string {
  if (coef === 0) return "";
  const abs = Math.abs(coef);
  const sign =
    coef < 0 ? (first ? "-" : " - ") : first ? "" : " + ";
  const body = abs === 1 ? variable : `${abs}${variable}`;
  return `${sign}${body}`;
}

function formatEqLatex([a, b, c]: Eq): string {
  const xPart = formatTerm(a, "x", true);
  const yPart = formatTerm(b, "y", !xPart);
  const left = (xPart + yPart).trim() || "0";
  return `${left} = ${c}`;
}

function determinant(eq1: Eq, eq2: Eq): number {
  const [a1, b1] = eq1;
  const [a2, b2] = eq2;
  return a1 * b2 - a2 * b1;
}

function solveSystem(eq1: Eq, eq2: Eq): { x: number; y: number } | null {
  const det = determinant(eq1, eq2);
  if (Math.abs(det) < 1e-9) return null;
  const [a1, b1, c1] = eq1;
  const [a2, b2, c2] = eq2;
  const x = (c1 * b2 - c2 * b1) / det;
  const y = (a1 * c2 - a2 * c1) / det;
  return { x: round(x), y: round(y) };
}

function round(n: number, digits = 4) {
  const p = 10 ** digits;
  return Math.round(n * p) / p;
}

function formatNum(n: number) {
  if (Number.isInteger(n)) return String(n);
  return round(n, 2).toString();
}

function classifySystem(eq1: Eq, eq2: Eq): "unique" | "parallel" | "coincident" {
  const det = determinant(eq1, eq2);
  if (Math.abs(det) > 1e-9) return "unique";
  const [a1, b1, c1] = eq1;
  const [a2, b2, c2] = eq2;
  const ratio =
    Math.abs(a2) > 1e-9
      ? a1 / a2
      : Math.abs(b2) > 1e-9
        ? b1 / b2
        : 1;
  const same =
    Math.abs(a1 - ratio * a2) < 1e-9 &&
    Math.abs(b1 - ratio * b2) < 1e-9 &&
    Math.abs(c1 - ratio * c2) < 1e-9;
  return same ? "coincident" : "parallel";
}

function buildSubstitutionSteps(eq1: Eq, eq2: Eq, solution: { x: number; y: number }): Step[] {
  const [a1, b1, c1] = eq1;
  const steps: Step[] = [
    {
      title: "Write the system",
      latex: `\\begin{cases} ${formatEqLatex(eq1)} \\\\ ${formatEqLatex(eq2)} \\end{cases}`,
    },
  ];

  if (b1 === 1 && a1 === 0) {
    steps.push({
      title: "Isolate y from equation (1)",
      latex: `y = ${formatNum(c1)}`,
    });
    steps.push({
      title: "Substitute into equation (2)",
      latex: `${formatTerm(eq2[0], "x", true)}${formatTerm(1, `(${formatNum(c1)})`, false)} = ${eq2[2]}`,
    });
  } else if (b1 === -2 && a1 === 0 && c1 === 1) {
    steps.push({
      title: "Rewrite equation (1) as y = 2x + 1",
      latex: "y = 2x + 1",
    });
    steps.push({
      title: "Substitute into equation (2)",
      latex: "x + (2x + 1) = 7",
    });
    steps.push({
      title: "Collect like terms",
      latex: "3x + 1 = 7",
    });
    steps.push({
      title: "Solve for x",
      latex: `3x = 6 \\Rightarrow x = ${formatNum(solution.x)}`,
    });
    steps.push({
      title: "Find y",
      latex: `y = 2(${formatNum(solution.x)}) + 1 = ${formatNum(solution.y)}`,
    });
  } else if (eq2[1] === 1 && eq2[0] === 1) {
    steps.push({
      title: "Express y from equation (2)",
      latex: `y = ${eq2[2]} - x`,
    });
    steps.push({
      title: "Substitute into equation (1)",
      latex: `${formatTerm(eq1[0], "x", true)}${formatTerm(eq1[1], `(${eq2[2]} - x)`, false)} = ${c1}`,
    });
    const combined = eq1[0] - eq1[1];
    const constant = c1 - eq1[1] * eq2[2];
    steps.push({
      title: "Simplify",
      latex: `${formatTerm(combined, "x", true)} = ${constant}`,
    });
    steps.push({
      title: "Solve for x",
      latex: `x = ${formatNum(solution.x)}`,
    });
    steps.push({
      title: "Find y",
      latex: `y = ${eq2[2]} - ${formatNum(solution.x)} = ${formatNum(solution.y)}`,
    });
  } else {
    steps.push({
      title: "Isolate one unknown, then substitute",
      latex: `\\text{Solve one equation for } x \\text{ or } y, \\text{ substitute into the other.}`,
    });
    steps.push({
      title: "Solution",
      latex: `(x, y) = (${formatNum(solution.x)},\\; ${formatNum(solution.y)})`,
    });
    return steps;
  }

  steps.push({
    title: "Solution",
    latex: `(x, y) = (${formatNum(solution.x)},\\; ${formatNum(solution.y)})`,
  });
  return steps;
}

function buildEliminationSteps(eq1: Eq, eq2: Eq, solution: { x: number; y: number }): Step[] {
  const [a1, b1, c1] = eq1;
  const [a2, b2, c2] = eq2;
  const steps: Step[] = [
    {
      title: "Write the system",
      latex: `\\begin{cases} ${formatEqLatex(eq1)} \\quad (1) \\\\ ${formatEqLatex(eq2)} \\quad (2) \\end{cases}`,
    },
  ];

  if (b1 !== 0 && b2 !== 0 && b1 === -b2) {
    steps.push({
      title: "Add (1) and (2) to eliminate y",
      latex: `${formatTerm(a1 + a2, "x", true)} = ${c1 + c2}`,
    });
    steps.push({
      title: "Solve for x",
      latex: `x = ${formatNum(solution.x)}`,
    });
    steps.push({
      title: "Substitute into (1)",
      latex: `${formatNum(solution.x)} + y = ${c1} \\Rightarrow y = ${formatNum(solution.y)}`,
    });
  } else if (a1 !== 0 && a2 !== 0 && a1 === -a2) {
    steps.push({
      title: "Add (1) and (2) to eliminate x",
      latex: `${formatTerm(b1 + b2, "y", true)} = ${c1 + c2}`,
    });
    steps.push({
      title: "Solve for y",
      latex: `y = ${formatNum(solution.y)}`,
    });
    steps.push({
      title: "Substitute into (1)",
      latex: `x = ${formatNum(solution.x)}`,
    });
  } else {
    const mult1 = lcm(b1, b2) / Math.abs(b1);
    const mult2 = lcm(b1, b2) / Math.abs(b2);
    const newB1 = b1 * mult1;
    const newB2 = b2 * mult2;
    steps.push({
      title: "Match coefficients of y",
      latex: `\\text{Multiply (1) by } ${mult1}, \\text{ (2) by } ${mult2} \\text{ so y terms cancel.}`,
    });
    const op = newB1 + newB2 === 0 ? "+" : "−";
    steps.push({
      title: `Combine equations (${op})`,
      latex: `${formatTerm(a1 * mult1 + (op === "+" ? a2 * mult2 : -a2 * mult2), "x", true)} = ${op === "+" ? c1 * mult1 + c2 * mult2 : c1 * mult1 - c2 * mult2}`,
    });
    steps.push({
      title: "Solve and back-substitute",
      latex: `x = ${formatNum(solution.x)},\\quad y = ${formatNum(solution.y)}`,
    });
  }

  steps.push({
    title: "Solution",
    latex: `(x, y) = (${formatNum(solution.x)},\\; ${formatNum(solution.y)})`,
  });
  return steps;
}

function buildSteps(
  eq1: Eq,
  eq2: Eq,
  method: Method
): { steps: Step[]; error: string | null } {
  const kind = classifySystem(eq1, eq2);
  if (kind === "parallel") {
    return {
      steps: [],
      error: "These lines are parallel — the system has no solution. Elimination would lead to a false statement such as 0 = 7.",
    };
  }
  if (kind === "coincident") {
    return {
      steps: [],
      error: "The two equations describe the same line — infinitely many solutions. A single (x, y) pair is not enough.",
    };
  }

  const solution = solveSystem(eq1, eq2);
  if (!solution) {
    return { steps: [], error: "Could not solve this system." };
  }

  const steps =
    method === "substitution"
      ? buildSubstitutionSteps(eq1, eq2, solution)
      : buildEliminationSteps(eq1, eq2, solution);

  return { steps, error: null };
}

function SimultaneousSolverWorkbench() {
  const [presetId, setPresetId] = createSignal(PRESETS[0].id);
  const [method, setMethod] = createSignal<Method>("elimination");
  const [stepIndex, setStepIndex] = createSignal(0);
  const [playing, setPlaying] = createSignal(false);
  const [speed, setSpeed] = createSignal(1200);

  const preset = createMemo(() => PRESETS.find((p) => p.id === presetId()) ?? PRESETS[0]);

  const availableMethods = createMemo(() => preset().methods);

  const result = createMemo(() =>
    buildSteps(preset().eq1, preset().eq2, method())
  );

  const steps = createMemo(() => result().steps);
  const error = createMemo(() => result().error);
  const current = createMemo(() => steps()[stepIndex()] ?? null);

  const progress = createMemo(() =>
    steps().length > 0 ? ((stepIndex() + 1) / steps().length) * 100 : 0
  );

  createEffect(() => {
    presetId();
    method();
    setStepIndex(0);
    setPlaying(false);
  });

  createEffect(() => {
    if (!playing() || error()) return;
    const id = window.setInterval(() => {
      setStepIndex((i) => {
        if (i >= steps().length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, speed());
    onCleanup(() => window.clearInterval(id));
  });

  createEffect(() => {
    if (method() === "substitution" && !availableMethods().includes("substitution")) {
      setMethod(availableMethods()[0]);
    }
    if (method() === "elimination" && !availableMethods().includes("elimination")) {
      setMethod(availableMethods()[0]);
    }
  });

  const eqDisplay = createMemo(() =>
    renderLatex(
      `\\begin{cases} ${formatEqLatex(preset().eq1)} \\\\ ${formatEqLatex(preset().eq2)} \\end{cases}`
    )
  );

  return (
    <section
      class="math-widget sim-solver"
      aria-labelledby="sim-solver-title"
    >
      <h2 id="sim-solver-title" class="math-widget__title">
        Substitution &amp; elimination step-by-step
      </h2>

      <div class="sim-solver__shell">
        <aside class="sim-solver__sidebar">
          <div class="sim-solver__field">
            <span class="sim-solver__label">Preset system</span>
            <select
              class="sim-solver__select"
              value={presetId()}
              onChange={(e) => setPresetId(e.currentTarget.value)}
            >
              <For each={PRESETS}>
                {(p) => <option value={p.id}>{p.label}</option>}
              </For>
            </select>
          </div>

          <div class="sim-solver__field">
            <span class="sim-solver__label">Method</span>
            <div class="sim-solver__method-grid" role="group" aria-label="Solution method">
              <button
                type="button"
                class="sim-solver__method-btn"
                classList={{
                  "sim-solver__method-btn--active": method() === "substitution",
                  "sim-solver__method-btn--disabled":
                    !availableMethods().includes("substitution"),
                }}
                disabled={!availableMethods().includes("substitution")}
                aria-pressed={method() === "substitution"}
                onClick={() => setMethod("substitution")}
              >
                Substitution
              </button>
              <button
                type="button"
                class="sim-solver__method-btn"
                classList={{
                  "sim-solver__method-btn--active": method() === "elimination",
                  "sim-solver__method-btn--disabled":
                    !availableMethods().includes("elimination"),
                }}
                disabled={!availableMethods().includes("elimination")}
                aria-pressed={method() === "elimination"}
                onClick={() => setMethod("elimination")}
              >
                Elimination
              </button>
            </div>
          </div>

          <div class="sim-solver__anim">
            <span class="sim-solver__label">Step controls</span>
            <div class="sim-solver__transport">
              <button
                type="button"
                class="sim-solver__transport-btn"
                aria-label="Previous step"
                disabled={!!error() || stepIndex() === 0}
                onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              >
                ‹
              </button>
              <button
                type="button"
                class="sim-solver__play"
                disabled={!!error() || steps().length === 0}
                onClick={() => setPlaying((p) => !p)}
              >
                {playing() ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                class="sim-solver__transport-btn"
                aria-label="Next step"
                disabled={!!error() || stepIndex() >= steps().length - 1}
                onClick={() => setStepIndex((i) => Math.min(steps().length - 1, i + 1))}
              >
                ›
              </button>
            </div>
            <div class="sim-solver__speed">
              <span>Slow</span>
              <input
                type="range"
                class="sim-solver__speed-slider"
                min={600}
                max={2400}
                step={200}
                value={speed()}
                dir="rtl"
                aria-label="Animation speed"
                onInput={(e) => setSpeed(Number(e.currentTarget.value))}
              />
              <span>Fast</span>
            </div>
          </div>
        </aside>

        <div class="sim-solver__stage">
          <div
            class="sim-solver__message-box"
            classList={{ "sim-solver__message-box--error": !!error() }}
          >
            <Show
              when={error()}
              fallback={
                <p class="sim-solver__message" aria-live="polite">
                  Step {stepIndex() + 1} of {steps().length}
                  {current() ? `: ${current()!.title}` : ""}
                </p>
              }
            >
              <p class="sim-solver__message" aria-live="polite">
                {error()}
              </p>
            </Show>
            <div class="sim-solver__progress-track">
              <div
                class="sim-solver__progress-fill"
                style={{ width: `${progress()}%` }}
              />
            </div>
          </div>

          <div class="sim-solver__equation-panel" aria-live="polite">
            <p class="sim-solver__panel-label">System</p>
            <div class="sim-solver__system" innerHTML={eqDisplay()} />
          </div>

          <Show when={current() && !error()}>
            {(step) => (
              <div class="sim-solver__step-panel">
                <h3 class="sim-solver__step-title">{step().title}</h3>
                <div class="sim-solver__step-math" innerHTML={renderLatex(step().latex)} />
              </div>
            )}
          </Show>
        </div>
      </div>
    </section>
  );
}

export default SimultaneousSolverWorkbench;
