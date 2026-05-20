import { createMemo, createSignal, For, Show } from "solid-js";

type Technique =
  | "hcf"
  | "grouping"
  | "difference-squares"
  | "perfect-square"
  | "quadratic";

type Problem = {
  id: string;
  expression: string;
  answers: string[];
  steps: string[];
};

const PROBLEMS: Record<Technique, Problem[]> = {
  hcf: [
    {
      id: "hcf-1",
      expression: "6x + 9",
      answers: ["3(2x+3)", "3(2x + 3)"],
      steps: [
        "HCF of 6 and 9 is 3.",
        "Factor out 3: 3(2x + 3).",
      ],
    },
    {
      id: "hcf-2",
      expression: "4x² − 8x",
      answers: ["4x(x-2)", "4x(x − 2)", "4x(x-2)"],
      steps: [
        "HCF is 4x.",
        "4x² ÷ 4x = x; −8x ÷ 4x = −2.",
        "Result: 4x(x − 2).",
      ],
    },
  ],
  grouping: [
    {
      id: "grp-1",
      expression: "ax + ay + bx + by",
      answers: ["(a+b)(x+y)", "(a+b)(x + y)", "(b+a)(x+y)"],
      steps: [
        "Group: a(x+y) + b(x+y).",
        "Common bracket (x+y): (a+b)(x+y).",
      ],
    },
    {
      id: "grp-2",
      expression: "2x² + 6x − x − 3",
      answers: ["(2x-1)(x+3)", "(2x-1)(x + 3)", "(x+3)(2x-1)"],
      steps: [
        "Group: 2x(x+3) − 1(x+3).",
        "Factor (x+3): (2x−1)(x+3).",
      ],
    },
  ],
  "difference-squares": [
    {
      id: "dos-1",
      expression: "x² − 9",
      answers: ["(x+3)(x-3)", "(x-3)(x+3)", "(x + 3)(x - 3)"],
      steps: [
        "Recognise a² − b² with a = x, b = 3.",
        "(x+3)(x−3).",
      ],
    },
    {
      id: "dos-2",
      expression: "4x² − 25",
      answers: ["(2x+5)(2x-5)", "(2x-5)(2x+5)", "(2x + 5)(2x - 5)"],
      steps: [
        "4x² = (2x)² and 25 = 5².",
        "(2x+5)(2x−5).",
      ],
    },
  ],
  "perfect-square": [
    {
      id: "ps-1",
      expression: "x² + 6x + 9",
      answers: ["(x+3)²", "(x+3)^2", "(x + 3)^2"],
      steps: [
        "Check: 3 × 3 = 9 and 3 + 3 = 6.",
        "Perfect square: (x+3)².",
      ],
    },
    {
      id: "ps-2",
      expression: "x² − 10x + 25",
      answers: ["(x-5)²", "(x-5)^2", "(x − 5)^2"],
      steps: [
        "5 × 5 = 25 and −5 + (−5) = −10.",
        "(x−5)².",
      ],
    },
  ],
  quadratic: [
    {
      id: "quad-1",
      expression: "x² + 5x + 6",
      answers: ["(x+2)(x+3)", "(x+3)(x+2)", "(x + 2)(x + 3)"],
      steps: [
        "Find two numbers: product 6, sum 5 → 2 and 3.",
        "(x+2)(x+3).",
      ],
    },
    {
      id: "quad-2",
      expression: "2x² + 7x + 3",
      answers: ["(2x+1)(x+3)", "(x+3)(2x+1)", "(2x + 1)(x + 3)"],
      steps: [
        "ac = 6; split 7x as 6x + x.",
        "2x(x+3) + 1(x+3) = (2x+1)(x+3).",
      ],
    },
  ],
};

const TECHNIQUE_LABELS: Record<Technique, string> = {
  hcf: "Highest common factor",
  grouping: "Grouping",
  "difference-squares": "Difference of squares",
  "perfect-square": "Perfect square",
  quadratic: "Quadratic trinomial",
};

/** Normalize student input for comparison: lowercase, no spaces, ×→*, superscript ²→^2 */
function normalizeAnswer(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/×/g, "*")
    .replace(/²/g, "^2")
    .replace(/−/g, "-")
    .replace(/–/g, "-");
}

function FactorisationChecker() {
  const [technique, setTechnique] = createSignal<Technique>("hcf");
  const [problemIndex, setProblemIndex] = createSignal(0);
  const [input, setInput] = createSignal("");
  const [checked, setChecked] = createSignal(false);
  const [revealed, setRevealed] = createSignal(false);

  const problems = createMemo(() => PROBLEMS[technique()]);
  const problem = createMemo(() => problems()[problemIndex() % problems().length]);

  const isCorrect = createMemo(() => {
    if (!checked()) return false;
    const norm = normalizeAnswer(input());
    return problem().answers.some((a) => normalizeAnswer(a) === norm);
  });

  const changeTechnique = (t: Technique) => {
    setTechnique(t);
    setProblemIndex(0);
    setInput("");
    setChecked(false);
    setRevealed(false);
  };

  const nextProblem = () => {
    setProblemIndex((i) => (i + 1) % problems().length);
    setInput("");
    setChecked(false);
    setRevealed(false);
  };

  const checkAnswer = () => {
    setChecked(true);
  };

  return (
    <section class="math-widget" aria-labelledby="factor-checker-title">
      <h2 id="factor-checker-title" class="math-widget__title">Factorisation checker</h2>
      <div class="math-widget__body">
        <div class="scenario-demo__control">
          <label class="scenario-demo__label" for="factor-technique">
            <span>Method</span>
          </label>
          <select
            id="factor-technique"
            class="polynomials-factor-checker__input"
            value={technique()}
            onChange={(e) => changeTechnique(e.currentTarget.value as Technique)}
          >
            <For each={Object.keys(TECHNIQUE_LABELS) as Technique[]}>
              {(key) => <option value={key}>{TECHNIQUE_LABELS[key]}</option>}
            </For>
          </select>
        </div>

        <p class="scenario-demo__live" aria-live="polite">
          Factorise: <strong>{problem().expression}</strong>
        </p>

        <div class="scenario-demo__control">
          <label class="scenario-demo__label" for="factor-answer">
            <span>Your factors</span>
          </label>
          <input
            id="factor-answer"
            class="polynomials-factor-checker__input"
            type="text"
            placeholder="e.g. (x+2)(x+3)"
            value={input()}
            onInput={(e) => {
              setInput(e.currentTarget.value);
              setChecked(false);
              setRevealed(false);
            }}
          />
        </div>

        <div class="scenario-demo__actions">
          <button type="button" class="scenario-demo__btn scenario-demo__btn--primary" onClick={checkAnswer}>
            Check
          </button>
          <button type="button" class="scenario-demo__btn" onClick={() => setRevealed(true)}>
            Show steps
          </button>
          <button type="button" class="scenario-demo__btn" onClick={nextProblem}>
            Next
          </button>
        </div>

        <Show when={checked()}>
          <div
            class={`polynomials-factor-checker__feedback ${
              isCorrect()
                ? "polynomials-factor-checker__feedback--correct"
                : "polynomials-factor-checker__feedback--incorrect"
            }`}
            role="status"
          >
            {isCorrect() ? (
              <p>Correct — well done.</p>
            ) : (
              <p>
                Not quite. Compare with the worked steps, or try equivalent factor order such as
                (x+3)(x+2) instead of (x+2)(x+3).
              </p>
            )}
          </div>
        </Show>

        <Show when={revealed()}>
          <div class="polynomials-factor-checker__feedback">
            <p>
              <strong>Method:</strong> {TECHNIQUE_LABELS[technique()]}
            </p>
            <ol class="polynomials-factor-checker__steps">
              <For each={problem().steps}>{(step) => <li>{step}</li>}</For>
            </ol>
            <p>
              <strong>Answer:</strong> {problem().answers[0]}
            </p>
          </div>
        </Show>
      </div>
    </section>
  );
}

export default FactorisationChecker;
