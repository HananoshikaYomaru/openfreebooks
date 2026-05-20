import katex from "katex";
import { createMemo, createSignal, For } from "solid-js";

function renderLatex(latex: string) {
  return katex.renderToString(latex, { throwOnError: false, strict: "ignore", displayMode: true });
}

const PRESETS = [
  {
    id: "difference-squares",
    label: "Difference of squares",
    original: String.raw`\frac{x^2 - 1}{x^2 + x}`,
    factored: String.raw`\frac{(x-1)(x+1)}{x(x+1)}`,
    simplified: String.raw`\frac{x-1}{x}`,
    restriction: String.raw`x \neq 0,\; x \neq -1`,
  },
  {
    id: "common-factor",
    label: "Common factor in numerator",
    original: String.raw`\frac{2x^2 - 8}{x^2 - 4}`,
    factored: String.raw`\frac{2(x-2)(x+2)}{(x-2)(x+2)}`,
    simplified: String.raw`2`,
    restriction: String.raw`x \neq 2,\; x \neq -2`,
  },
  {
    id: "quadratic-denom",
    label: "Factorised quadratic denominator",
    original: String.raw`\frac{x}{x^2 - 5x + 6}`,
    factored: String.raw`\frac{x}{(x-2)(x-3)}`,
    simplified: String.raw`\frac{x}{(x-2)(x-3)}`,
    restriction: String.raw`x \neq 2,\; x \neq 3`,
  },
] as const;

function FractionSimplifyDemo() {
  const [presetId, setPresetId] = createSignal(PRESETS[0].id);
  const preset = createMemo(() => PRESETS.find((p) => p.id === presetId()) ?? PRESETS[0]);

  const originalHtml = createMemo(() => renderLatex(preset().original));
  const factoredHtml = createMemo(() => renderLatex(preset().factored));
  const simplifiedHtml = createMemo(() => renderLatex(preset().simplified));
  const restrictionHtml = createMemo(() =>
    katex.renderToString(preset().restriction, { throwOnError: false, strict: "ignore" })
  );

  return (
    <section
      class="scenario-demo scenario-demo--fraction-simplify"
      aria-label="Simplifying an algebraic fraction step by step"
    >
      <div class="scenario-demo__stage scenario-demo__stage--wide">
        <div class="scenario-demo__control">
          <label class="scenario-demo__label" for="fraction-preset">
            <span>Example</span>
          </label>
          <select
            id="fraction-preset"
            class="formula-rearrange-demo__select"
            value={presetId()}
            onChange={(e) => setPresetId(e.currentTarget.value)}
          >
            <For each={PRESETS}>
              {(p) => <option value={p.id}>{p.label}</option>}
            </For>
          </select>
        </div>
        <ol class="fraction-simplify-demo__steps">
          <li>
            <span class="fraction-simplify-demo__step-label">Original</span>
            <div class="scenario-demo__formula" innerHTML={originalHtml()} />
          </li>
          <li>
            <span class="fraction-simplify-demo__step-label">Factorise</span>
            <div class="scenario-demo__formula" innerHTML={factoredHtml()} />
          </li>
          <li>
            <span class="fraction-simplify-demo__step-label">Cancel common factors</span>
            <div class="scenario-demo__formula" innerHTML={simplifiedHtml()} />
          </li>
        </ol>
      </div>
      <div class="scenario-demo__panel">
        <p class="scenario-demo__live" aria-live="polite">
          Cancel only factors that appear in <strong>both</strong> numerator and denominator.
        </p>
        <div class="scenario-demo__stat scenario-demo__stat--highlight">
          <span class="scenario-demo__stat-label">Restrictions</span>
          <span class="scenario-demo__stat-value fraction-simplify-demo__restriction">
            <span innerHTML={restrictionHtml()} />
          </span>
        </div>
      </div>
    </section>
  );
}

export default FractionSimplifyDemo;
