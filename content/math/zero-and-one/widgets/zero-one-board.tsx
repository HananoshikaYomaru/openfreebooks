import { createMemo, createSignal, For } from "solid-js";

type Scenario = {
  id: string;
  prompt: string;
  correctAmount: 0 | 1;
  showTruth?: boolean;
  correctTruth?: boolean;
};

const SCENARIOS: Scenario[] = [
  {
    id: "empty-box",
    prompt: "The box has no marbles inside.",
    correctAmount: 0,
  },
  {
    id: "one-apple",
    prompt: "There is exactly one apple on the plate.",
    correctAmount: 1,
  },
  {
    id: "light-off",
    prompt: "The lamp is off — no light showing.",
    correctAmount: 0,
  },
  {
    id: "light-on",
    prompt: "The lamp is on — one steady light.",
    correctAmount: 1,
  },
  {
    id: "statement-false",
    prompt: "Statement: “The door is open.” (The door is shut.)",
    correctAmount: 0,
    showTruth: true,
    correctTruth: false,
  },
  {
    id: "statement-true",
    prompt: "Statement: “There is one bell ringing.” (You hear one bell.)",
    correctAmount: 1,
    showTruth: true,
    correctTruth: true,
  },
];

function ZeroOneBoard() {
  const [index, setIndex] = createSignal(0);
  const [picked, setPicked] = createSignal<0 | 1 | null>(null);
  const [truthPicked, setTruthPicked] = createSignal<boolean | null>(null);

  const scenario = createMemo(() => SCENARIOS[index() % SCENARIOS.length]);
  const atEnd = createMemo(() => index() >= SCENARIOS.length - 1);

  const amountCorrect = createMemo(() => {
    const p = picked();
    return p !== null && p === scenario().correctAmount;
  });

  const truthCorrect = createMemo(() => {
    const s = scenario();
    if (!s.showTruth) return true;
    const t = truthPicked();
    return t !== null && t === s.correctTruth;
  });

  const answered = createMemo(() => {
    const s = scenario();
    if (picked() === null) return false;
    if (s.showTruth && truthPicked() === null) return false;
    return true;
  });

  const allCorrect = createMemo(() => answered() && amountCorrect() && truthCorrect());

  const feedback = createMemo(() => {
    if (!answered()) return "Choose how many, then Next when you are ready.";
    if (allCorrect()) {
      return atEnd()
        ? "Well done — you can tell 0 from 1. Continue to Counting and numbers."
        : "Correct. Try the next situation.";
    }
    if (!amountCorrect()) {
      return picked() === 0
        ? "Not quite — this situation is one, not zero."
        : "Not quite — this situation is zero, not one.";
    }
    return truthPicked() === true
      ? "Check the statement again — it does not match the world (false)."
      : "Check the statement again — it matches the world (true).";
  });

  const pickAmount = (n: 0 | 1) => {
    setPicked(n);
  };

  const pickTruth = (value: boolean) => {
    setTruthPicked(value);
  };

  const goNext = () => {
    if (!answered() || !allCorrect()) return;
    if (atEnd()) return;
    setIndex((i) => i + 1);
    setPicked(null);
    setTruthPicked(null);
  };

  const resetAll = () => {
    setIndex(0);
    setPicked(null);
    setTruthPicked(null);
  };

  return (
    <section class="math-widget zero-one-board" aria-labelledby="zero-one-board-title">
      <h2 id="zero-one-board-title" class="math-widget__title">
        Practice: zero or one
      </h2>
      <div class="math-widget__body">
        <p class="math-widget__caption">
          Situation {index() + 1} of {SCENARIOS.length}. Pick the amount that fits. When a statement
          is shown, also pick true or false.
        </p>
        <p class="zero-one-board__scenario">{scenario().prompt}</p>

        <div
          class="zero-one-board__visual"
          classList={{
            "zero-one-board__visual--correct": answered() && allCorrect(),
            "zero-one-board__visual--incorrect": answered() && !allCorrect(),
          }}
          aria-live="polite"
        >
          <p class="zero-one-board__count">
            {picked() === null ? "?" : picked()}
          </p>
          <span class="counting-dots" role="img" aria-hidden="true">
            <For each={picked() === 1 ? [0] : []}>
              {() => <span class="counting-dots__dot" />}
            </For>
            {picked() === 0 ? (
              <span class="counting-dots__none">none</span>
            ) : null}
          </span>
        </div>

        <div class="zero-one-board__choices" role="group" aria-label="How many?">
          <button
            type="button"
            class="scenario-demo__btn zero-one-board__choice"
            classList={{ "zero-one-board__choice--active": picked() === 0 }}
            onClick={() => pickAmount(0)}
          >
            Nothing (0)
          </button>
          <button
            type="button"
            class="scenario-demo__btn scenario-demo__btn--primary zero-one-board__choice"
            classList={{ "zero-one-board__choice--active": picked() === 1 }}
            onClick={() => pickAmount(1)}
          >
            One (1)
          </button>
        </div>

        {scenario().showTruth ? (
          <div class="zero-one-board__choices" role="group" aria-label="True or false?">
            <button
              type="button"
              class="scenario-demo__btn zero-one-board__choice"
              classList={{ "zero-one-board__choice--active": truthPicked() === false }}
              onClick={() => pickTruth(false)}
            >
              False
            </button>
            <button
              type="button"
              class="scenario-demo__btn scenario-demo__btn--primary zero-one-board__choice"
              classList={{ "zero-one-board__choice--active": truthPicked() === true }}
              onClick={() => pickTruth(true)}
            >
              True
            </button>
          </div>
        ) : null}

        <p
          class="zero-one-board__feedback"
          classList={{
            "zero-one-board__feedback--ok": answered() && allCorrect(),
            "zero-one-board__feedback--nope": answered() && !allCorrect(),
          }}
          aria-live="polite"
        >
          {feedback()}
        </p>

        <div class="scenario-demo__actions">
          <button type="button" class="scenario-demo__btn" onClick={resetAll}>
            Start over
          </button>
          <button
            type="button"
            class="scenario-demo__btn scenario-demo__btn--primary"
            onClick={goNext}
            disabled={!answered() || !allCorrect() || atEnd()}
          >
            Next situation
          </button>
        </div>
      </div>
    </section>
  );
}

export default ZeroOneBoard;
