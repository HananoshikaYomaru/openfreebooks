import { renderLatex } from "@ofb/katex";
import { createMemo, createSignal, For } from "solid-js";

function DotPile(props: { count: number; label: string; class?: string }) {
  return (
    <div class={`addition-groups__pile ${props.class ?? ""}`}>
      <span class="scenario-demo__value">{props.label}</span>
      <div class="addition-groups__dots" role="img" aria-label={`${props.count} dots`}>
        <For each={Array.from({ length: props.count })}>{() => <span class="addition-groups__dot" />}</For>
      </div>
    </div>
  );
}

function AdditionGroups() {
  const [a, setA] = createSignal(3);
  const [b, setB] = createSignal(4);
  const sum = createMemo(() => a() + b());

  const equationHtml = createMemo(() =>
    renderLatex(`${a()} + ${b()} = ${sum()}`)
  );

  return (
    <section class="math-widget" aria-labelledby="addition-groups-title">
      <h2 id="addition-groups-title" class="math-widget__title">
        Add two groups
      </h2>
      <div class="math-widget__body">
        <div class="math-widget__controls">
          <div class="scenario-demo__control">
            <label class="scenario-demo__label" for="add-a">
              <span>First group</span>
              <span class="scenario-demo__value">{a()}</span>
            </label>
            <input
              id="add-a"
              class="scenario-demo__slider"
              type="range"
              min={0}
              max={10}
              step={1}
              value={a()}
              onInput={(e) => setA(Number(e.currentTarget.value))}
            />
          </div>
          <div class="scenario-demo__control">
            <label class="scenario-demo__label" for="add-b">
              <span>Second group</span>
              <span class="scenario-demo__value">{b()}</span>
            </label>
            <input
              id="add-b"
              class="scenario-demo__slider"
              type="range"
              min={0}
              max={10}
              step={1}
              value={b()}
              onInput={(e) => setB(Number(e.currentTarget.value))}
            />
          </div>
        </div>

        <div
          class="math-widget__formula"
          innerHTML={equationHtml()}
          aria-live="polite"
        />

        <div class="addition-groups__piles">
          <DotPile count={a()} label={`${a()}`} />
          <span class="addition-groups__plus" aria-hidden="true">
            +
          </span>
          <DotPile count={b()} label={`${b()}`} class="addition-groups__pile--b" />
          <span class="addition-groups__equals" aria-hidden="true">
            =
          </span>
          <DotPile count={sum()} label={`${sum()}`} />
        </div>
      </div>
    </section>
  );
}

export default AdditionGroups;
