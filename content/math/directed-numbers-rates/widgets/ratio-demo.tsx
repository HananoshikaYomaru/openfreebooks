import { renderLatex } from "@ofb/katex";
import { createMemo, createSignal } from "solid-js";

function formatNum(n: number) {
  if (Number.isInteger(n)) return String(n);
  return (Math.round(n * 100) / 100).toString();
}

function RatioDemo() {
  const [partA, setPartA] = createSignal(2);
  const [partB, setPartB] = createSignal(5);
  const [total, setTotal] = createSignal(28);

  const sumParts = createMemo(() => partA() + partB());
  const shareA = createMemo(() => (partA() / sumParts()) * total());
  const shareB = createMemo(() => (partB() / sumParts()) * total());

  const formulaHtml = createMemo(() =>
    renderLatex(
      `${partA()}:${partB()} \\Rightarrow ${formatNum(shareA())} : ${formatNum(shareB())} \\text{ from total } ${formatNum(total())}`
    )
  );

  return (
    <section
      class="scenario-demo scenario-demo--ratio"
      aria-label="Sharing a total in a given ratio"
    >
      <div class="scenario-demo__stage scenario-demo__stage--wide">
        <p class="scenario-demo__live" aria-live="polite">
          Split <strong>{formatNum(total())}</strong> in the ratio{" "}
          <strong>
            {partA()}:{partB()}
          </strong>
          . Each of the <strong>{sumParts()}</strong> equal parts has size{" "}
          <strong>{formatNum(total() / sumParts())}</strong>.
        </p>
        <div class="ratio-demo__bars" role="img" aria-hidden="true">
          <div
            class="ratio-demo__bar ratio-demo__bar--a"
            style={{ width: `${(partA() / sumParts()) * 100}%` }}
          />
          <div
            class="ratio-demo__bar ratio-demo__bar--b"
            style={{ width: `${(partB() / sumParts()) * 100}%` }}
          />
        </div>
        <div class="scenario-demo__control">
          <label class="scenario-demo__label" for="ratio-a">
            <span>First part of ratio</span>
            <span class="scenario-demo__value">{partA()}</span>
          </label>
          <input
            id="ratio-a"
            class="scenario-demo__slider"
            type="range"
            min={1}
            max={8}
            step={1}
            value={partA()}
            onInput={(e) => setPartA(Number(e.currentTarget.value))}
          />
        </div>
        <div class="scenario-demo__control">
          <label class="scenario-demo__label" for="ratio-b">
            <span>Second part of ratio</span>
            <span class="scenario-demo__value">{partB()}</span>
          </label>
          <input
            id="ratio-b"
            class="scenario-demo__slider"
            type="range"
            min={1}
            max={8}
            step={1}
            value={partB()}
            onInput={(e) => setPartB(Number(e.currentTarget.value))}
          />
        </div>
        <div class="scenario-demo__control">
          <label class="scenario-demo__label" for="ratio-total">
            <span>Total to share</span>
            <span class="scenario-demo__value">{formatNum(total())}</span>
          </label>
          <input
            id="ratio-total"
            class="scenario-demo__slider"
            type="range"
            min={10}
            max={100}
            step={2}
            value={total()}
            onInput={(e) => setTotal(Number(e.currentTarget.value))}
          />
        </div>
      </div>
      <div class="scenario-demo__panel">
        <div class="scenario-demo__formula" innerHTML={formulaHtml()} aria-live="polite" />
        <div class="scenario-demo__stats">
          <div class="scenario-demo__stat scenario-demo__stat--highlight">
            <span class="scenario-demo__stat-label">First share</span>
            <span class="scenario-demo__stat-value">{formatNum(shareA())}</span>
          </div>
          <div class="scenario-demo__stat">
            <span class="scenario-demo__stat-label">Second share</span>
            <span class="scenario-demo__stat-value">{formatNum(shareB())}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RatioDemo;
