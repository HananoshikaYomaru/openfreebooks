import { createMemo, createSignal } from "solid-js";

type Scenario = {
  id: string;
  prompt: string;
  imageSrc: string;
  imageAlt: string;
  correctAmount: 0 | 1;
};

const SCENARIOS: Scenario[] = [
  {
    id: "empty-box",
    prompt: "The box has no marbles inside.",
    imageSrc: "/chapters/math/zero-and-one/empty-box-std.jpg",
    imageAlt: "An empty box with nothing inside",
    correctAmount: 0,
  },
  {
    id: "one-apple",
    prompt: "There is exactly one apple on the plate.",
    imageSrc: "/chapters/math/zero-and-one/app-plate-std.jpg",
    imageAlt: "A plate with one apple",
    correctAmount: 1,
  },
  {
    id: "light-off",
    prompt: "The lamp is off — no light showing.",
    imageSrc: "/chapters/math/zero-and-one/lamp-off-std.jpg",
    imageAlt: "A lamp switched off",
    correctAmount: 0,
  },
  {
    id: "light-on",
    prompt: "The lamp is on — one steady light.",
    imageSrc: "/chapters/math/zero-and-one/lamp-on-std.jpg",
    imageAlt: "A lamp switched on",
    correctAmount: 1,
  },
];

function ZeroOneBoard() {
  const [index, setIndex] = createSignal(0);
  const [picked, setPicked] = createSignal<0 | 1 | null>(null);

  const scenario = createMemo(() => SCENARIOS[index() % SCENARIOS.length]);
  const atEnd = createMemo(() => index() >= SCENARIOS.length - 1);

  const amountCorrect = createMemo(() => {
    const p = picked();
    return p !== null && p === scenario().correctAmount;
  });

  const answered = createMemo(() => picked() !== null);

  const allCorrect = createMemo(() => answered() && amountCorrect());

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
    return "Try again.";
  });

  const pickAmount = (n: 0 | 1) => {
    setPicked(n);
  };

  const goNext = () => {
    if (!answered() || !allCorrect()) return;
    if (atEnd()) return;
    setIndex((i) => i + 1);
    setPicked(null);
  };

  const resetAll = () => {
    setIndex(0);
    setPicked(null);
  };

  return (
    <section class="math-widget zero-one-board" aria-labelledby="zero-one-board-title">
      <h2 id="zero-one-board-title" class="math-widget__title">
        Practice: zero or one
      </h2>
      <div class="math-widget__body">
        <p class="math-widget__caption">
          Situation {index() + 1} of {SCENARIOS.length}. Pick the amount that fits the image.
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
          <img
            src={scenario().imageSrc}
            alt={scenario().imageAlt}
            width="640"
            height="400"
            class="zero-one-board__image"
            loading="lazy"
          />
          <p class="zero-one-board__count">
            Your pick: <strong>{picked() === null ? "?" : picked()}</strong>
          </p>
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
