import { createMemo, createSignal, For, Show } from "solid-js";

type VisualKind = "one" | "ten" | "hundred" | "thousand" | "million" | "billion";

type ScaleStep = {
  id: string;
  label: string;
  value: number;
  display: string;
  example: string;
  visual: VisualKind;
};

const STEPS: ScaleStep[] = [
  {
    id: "one",
    label: "1",
    value: 1,
    display: "1",
    example: "One apple on a plate.",
    visual: "one",
  },
  {
    id: "ten",
    label: "10",
    value: 10,
    display: "10",
    example: "Fingers on two hands — easy to count one by one.",
    visual: "ten",
  },
  {
    id: "hundred",
    label: "100",
    value: 100,
    display: "100",
    example: "A full stadium section; too many to count quickly without grouping.",
    visual: "hundred",
  },
  {
    id: "thousand",
    label: "1 thousand",
    value: 1_000,
    display: "1,000",
    example: "A long walk in steps; a big school’s students.",
    visual: "thousand",
  },
  {
    id: "million",
    label: "1 million",
    value: 1_000_000,
    display: "1,000,000",
    example: "A large city’s population — one dot per person would fill this whole grid.",
    visual: "million",
  },
  {
    id: "billion",
    label: "1 billion",
    value: 1_000_000_000,
    display: "1,000,000,000",
    example: "About how many people live on Earth — one thousand times a whole city-million.",
    visual: "billion",
  },
];

function DotGrid(props: { count: number; columns: number; small?: boolean }) {
  const cells = () => Array.from({ length: props.count });
  return (
    <div
      class={`big-numbers-scale__grid ${props.small ? "big-numbers-scale__grid--small" : ""}`}
      style={{ "grid-template-columns": `repeat(${props.columns}, 1fr)` }}
      role="img"
      aria-hidden="true"
    >
      <For each={cells()}>{() => <span class="big-numbers-scale__cell" />}</For>
    </div>
  );
}

/** 10×10 = 100 cells; each stands for 10,000 → 1 million total */
function MillionVisual() {
  const cells = Array.from({ length: 100 });
  return (
    <div class="big-numbers-scale__million" role="img" aria-label="100 groups of ten thousand make one million">
      <div class="big-numbers-scale__mega-grid">
        <For each={cells}>{() => <span class="big-numbers-scale__mega-cell">10k</span>}</For>
      </div>
      <p class="big-numbers-scale__visual-caption">
        100 squares × 10,000 each = <strong>1 million</strong>
      </p>
    </div>
  );
}

/** Mini million (4×4 of 10k) beside ×1000 beside 10×10 grid of 1M blocks */
function BillionVisual() {
  const millionTiles = Array.from({ length: 16 });
  const billionTiles = Array.from({ length: 100 });
  return (
    <div class="big-numbers-scale__billion" role="img" aria-label="One thousand millions make one billion">
      <div class="big-numbers-scale__billion-compare">
        <div class="big-numbers-scale__billion-unit">
          <span class="big-numbers-scale__billion-unit-label">1 million</span>
          <div class="big-numbers-scale__mini-grid">
            <For each={millionTiles}>{() => <span class="big-numbers-scale__mini-cell">10k</span>}</For>
          </div>
        </div>
        <span class="big-numbers-scale__billion-times" aria-hidden="true">× 1,000</span>
        <div class="big-numbers-scale__billion-equals" aria-hidden="true">=</div>
        <div class="big-numbers-scale__billion-unit big-numbers-scale__billion-unit--wide">
          <span class="big-numbers-scale__billion-unit-label">1 billion</span>
          <div class="big-numbers-scale__giga-grid">
            <For each={billionTiles}>{() => <span class="big-numbers-scale__giga-cell">1M</span>}</For>
          </div>
        </div>
      </div>
      <p class="big-numbers-scale__visual-caption">
        Each orange square is a <strong>whole million</strong>. This board shows 100 of them — imagine
        <strong> 10</strong> identical boards stacked (<span class="big-numbers-scale__math-hint">10 × 100 = 1,000</span>
        millions) to reach one billion.
      </p>
    </div>
  );
}

function BigNumbersScale() {
  const [index, setIndex] = createSignal(2);
  const step = createMemo(() => STEPS[index()]!);
  const prev = createMemo(() => STEPS[Math.max(0, index() - 1)]);
  const scaleRatio = createMemo(() => {
    const p = prev().value;
    const c = step().value;
    if (p === c) return null;
    return c / p;
  });

  return (
    <section class="math-widget" aria-labelledby="big-numbers-scale-title">
      <h2 id="big-numbers-scale-title" class="math-widget__title">
        How big is the number?
      </h2>
      <div class="math-widget__body">
        <div class="big-numbers-scale__picker">
          <For each={STEPS}>
            {(s, i) => (
              <button
                type="button"
                class="big-numbers-scale__btn"
                classList={{ "big-numbers-scale__btn--active": index() === i() }}
                onClick={() => setIndex(i())}
              >
                {s.label}
              </button>
            )}
          </For>
        </div>

        <p class="big-numbers-scale__display" aria-live="polite">
          <span class="big-numbers-scale__number">{step().display}</span>
        </p>

        <Show when={scaleRatio() !== null && index() > 0}>
          <p class="big-numbers-scale__compare">
            About <strong>{scaleRatio()?.toLocaleString()}</strong> times bigger than {prev().display}
          </p>
        </Show>

        <div class="big-numbers-scale__visual">
          <Show when={step().visual === "one"}>
            <span class="counting-dots" aria-hidden="true">
              <span class="counting-dots__dot" />
            </span>
          </Show>
          <Show when={step().visual === "ten"}>
            <DotGrid count={10} columns={5} />
          </Show>
          <Show when={step().visual === "hundred"}>
            <DotGrid count={100} columns={10} small />
          </Show>
          <Show when={step().visual === "thousand"}>
            <div class="big-numbers-scale__blocks" aria-hidden="true">
              <For each={Array.from({ length: 10 })}>
                {() => (
                  <span class="big-numbers-scale__block big-numbers-scale__block--hundred">100</span>
                )}
              </For>
              <p class="big-numbers-scale__visual-caption big-numbers-scale__visual-caption--inline">
                10 hundreds = 1 thousand
              </p>
            </div>
          </Show>
          <Show when={step().visual === "million"}>
            <MillionVisual />
          </Show>
          <Show when={step().visual === "billion"}>
            <BillionVisual />
          </Show>
        </div>

        <p class="math-widget__caption">{step().example}</p>
      </div>
    </section>
  );
}

export default BigNumbersScale;
