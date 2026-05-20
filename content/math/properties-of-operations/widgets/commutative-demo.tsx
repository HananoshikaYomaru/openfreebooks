import katex from "katex";
import { createMemo, createSignal, For } from "solid-js";

function renderLatex(latex: string) {
  return katex.renderToString(latex, { throwOnError: false, strict: "ignore" });
}

function DotRow(props: { count: number; class?: string }) {
  return (
    <div class={`prop-comm__row ${props.class ?? ""}`}>
      <For each={Array.from({ length: props.count })}>
        {() => <span class="prop-comm__dot" />}
      </For>
    </div>
  );
}

function CommutativeDemo() {
  const [mode, setMode] = createSignal<"add" | "mul">("add");
  const [left, setLeft] = createSignal(3);
  const [right, setRight] = createSignal(5);
  const [swapped, setSwapped] = createSignal(false);

  const first = createMemo(() => (swapped() ? right() : left()));
  const second = createMemo(() => (swapped() ? left() : right()));
  const product = createMemo(() => left() * right());

  const equationHtml = createMemo(() => {
    if (mode() === "add") {
      return renderLatex(`${first()} + ${second()} = ${first() + second()}`);
    }
    return renderLatex(`${first()} \\times ${second()} = ${product()}`);
  });

  const compareHtml = createMemo(() => {
    if (mode() === "add") {
      return renderLatex(`${left()} + ${right()} = ${right()} + ${left()} = ${left() + right()}`);
    }
    return renderLatex(`${left()} \\times ${right()} = ${right()} \\times ${left()} = ${product()}`);
  });

  return (
    <section class="math-widget prop-comm" aria-labelledby="prop-comm-title">
      <h2 id="prop-comm-title" class="math-widget__title">
        Commutative property
      </h2>
      <div class="math-widget__body">
        <div class="prop-comm__mode" role="group" aria-label="Operation">
          <button
            type="button"
            class="prop-comm__mode-btn"
            classList={{ "prop-comm__mode-btn--active": mode() === "add" }}
            onClick={() => {
              setMode("add");
              setSwapped(false);
            }}
          >
            Addition
          </button>
          <button
            type="button"
            class="prop-comm__mode-btn"
            classList={{ "prop-comm__mode-btn--active": mode() === "mul" }}
            onClick={() => {
              setMode("mul");
              setSwapped(false);
            }}
          >
            Multiplication
          </button>
        </div>

        <div class="math-widget__controls">
          <div class="scenario-demo__control">
            <label class="scenario-demo__label" for="prop-comm-left">
              <span>First number</span>
              <span class="scenario-demo__value">{left()}</span>
            </label>
            <input
              id="prop-comm-left"
              class="scenario-demo__slider"
              type="range"
              min={1}
              max={8}
              step={1}
              value={left()}
              onInput={(e) => setLeft(Number(e.currentTarget.value))}
            />
          </div>
          <div class="scenario-demo__control">
            <label class="scenario-demo__label" for="prop-comm-right">
              <span>Second number</span>
              <span class="scenario-demo__value">{right()}</span>
            </label>
            <input
              id="prop-comm-right"
              class="scenario-demo__slider"
              type="range"
              min={1}
              max={8}
              step={1}
              value={right()}
              onInput={(e) => setRight(Number(e.currentTarget.value))}
            />
          </div>
        </div>

        <div class="math-widget__formula" innerHTML={equationHtml()} aria-live="polite" />
        <p class="prop-comm__compare" innerHTML={compareHtml()} aria-live="polite" />

        <div class="prop-comm__stage">
          {mode() === "add" ? (
            <div class="prop-comm__add-piles">
              <div class="prop-comm__pile">
                <span class="prop-comm__pile-label">{first()}</span>
                <DotRow count={first()} class="prop-comm__pile-dots--a" />
              </div>
              <span class="prop-comm__op" aria-hidden="true">
                +
              </span>
              <div class="prop-comm__pile">
                <span class="prop-comm__pile-label">{second()}</span>
                <DotRow count={second()} class="prop-comm__pile-dots--b" />
              </div>
              <span class="prop-comm__op" aria-hidden="true">
                =
              </span>
              <div class="prop-comm__pile prop-comm__pile--total">
                <span class="prop-comm__pile-label">{first() + second()}</span>
                <div class="prop-comm__merged">
                  <DotRow count={first()} class="prop-comm__pile-dots--a" />
                  <DotRow count={second()} class="prop-comm__pile-dots--b" />
                </div>
              </div>
            </div>
          ) : (
            <div
              class="prop-comm__grid"
              role="img"
              aria-label={`${first()} rows of ${second()} dots, ${product()} total`}
              style={{
                "grid-template-rows": `repeat(${first()}, 1fr)`,
                "grid-template-columns": `repeat(${second()}, 1fr)`,
              }}
            >
              <For each={Array.from({ length: product() })}>
                {() => <span class="prop-comm__grid-dot" />}
              </For>
            </div>
          )}
        </div>

        <button
          type="button"
          class="prop-comm__swap"
          onClick={() => setSwapped((v) => !v)}
        >
          {swapped() ? "Original order" : "Swap order"}
        </button>

        <p class="math-widget__caption">
          Swapping the order does not change the total. Commutative means you can
          <strong> commute</strong> (move) the numbers.
        </p>
      </div>
    </section>
  );
}

export default CommutativeDemo;
