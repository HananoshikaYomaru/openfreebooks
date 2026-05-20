import { renderLatex } from "@ofb/katex";
import { createMemo, createSignal, For } from "solid-js";

function MultiplicationArray() {
  const [rows, setRows] = createSignal(3);
  const [cols, setCols] = createSignal(2);
  const total = createMemo(() => rows() * cols());

  const equationHtml = createMemo(() =>
    renderLatex(`${rows()} \\times ${cols()} = ${total()}`)
  );

  const cells = createMemo(() => Array.from({ length: total() }));

  return (
    <section class="math-widget" aria-labelledby="multiplication-array-title">
      <h2 id="multiplication-array-title" class="math-widget__title">
        Multiplication array
      </h2>
      <div class="math-widget__body">
        <div class="math-widget__controls">
          <div class="scenario-demo__control">
            <label class="scenario-demo__label" for="mult-rows">
              <span>Rows</span>
              <span class="scenario-demo__value">{rows()}</span>
            </label>
            <input
              id="mult-rows"
              class="scenario-demo__slider"
              type="range"
              min={1}
              max={5}
              step={1}
              value={rows()}
              onInput={(e) => setRows(Number(e.currentTarget.value))}
            />
          </div>
          <div class="scenario-demo__control">
            <label class="scenario-demo__label" for="mult-cols">
              <span>Columns</span>
              <span class="scenario-demo__value">{cols()}</span>
            </label>
            <input
              id="mult-cols"
              class="scenario-demo__slider"
              type="range"
              min={1}
              max={5}
              step={1}
              value={cols()}
              onInput={(e) => setCols(Number(e.currentTarget.value))}
            />
          </div>
        </div>

        <div
          class="math-widget__formula"
          innerHTML={equationHtml()}
          aria-live="polite"
        />

        <figure class="math-widget__figure">
          <div
            class="multiplication-array__grid"
            role="img"
            aria-label={`${rows()} rows of ${cols()} dots, ${total()} in total`}
            style={{
              "grid-template-columns": `repeat(${cols()}, 22px)`,
              "grid-template-rows": `repeat(${rows()}, 22px)`,
            }}
          >
            <For each={cells()}>{() => <span class="multiplication-array__cell" />}</For>
          </div>
          <figcaption class="math-widget__caption">
            Each row has {cols()} dots. {rows()} rows give {total()} dots altogether.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export default MultiplicationArray;
