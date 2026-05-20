import { renderLatex } from "@ofb/katex";
import { createMemo, createSignal } from "solid-js";

function DistributiveAreaDemo() {
  const [a, setA] = createSignal(2);
  const [b, setB] = createSignal(3);
  const [c, setC] = createSignal(5);
  const [showNumbers, setShowNumbers] = createSignal(true);

  const leftArea = createMemo(() => a() * b());
  const rightArea = createMemo(() => a() * c());
  const total = createMemo(() => leftArea() + rightArea());

  const formulaHtml = createMemo(() => {
    if (showNumbers()) {
      return renderLatex(
        `${a()}\\times(${b()}+${c()}) = ${a()}\\times${b()} + ${a()}\\times${c()} = ${leftArea()} + ${rightArea()} = ${total()}`
      );
    }
    return renderLatex("a(b+c) = a \\times b + a \\times c");
  });

  const leftLabel = createMemo(() =>
    showNumbers() ? `${a()} \\times ${b()} = ${leftArea()}` : "a \\times b"
  );
  const rightLabel = createMemo(() =>
    showNumbers() ? `${a()} \\times ${c()} = ${rightArea()}` : "a \\times c"
  );

  return (
    <section
      class="math-widget prop-dist"
      aria-labelledby="prop-dist-title"
    >
      <div class="prop-dist__header">
        <h2 id="prop-dist-title" class="math-widget__title prop-dist__title">
          Distributive property
        </h2>
        <button
          type="button"
          class="prop-dist__toggle"
          aria-pressed={showNumbers()}
          onClick={() => setShowNumbers((v) => !v)}
        >
          {showNumbers() ? "Show letters" : "Show numbers"}
        </button>
      </div>

      <div class="math-widget__body">
        <div class="prop-dist__formula" innerHTML={formulaHtml()} aria-live="polite" />

        <figure class="math-widget__figure prop-dist__figure">
          <div
            class="prop-dist__model"
            role="img"
            aria-label={`Rectangle height ${a()}, width ${b()} plus ${c()}, total area ${total()}`}
          >
            <div class="prop-dist__height" aria-hidden="true">
              <span class="prop-dist__dim prop-dist__dim--a" innerHTML={renderLatex("a")} />
            </div>
            <div
              class="prop-dist__rects"
              style={{ "min-height": `${a() * 28}px` }}
            >
              <div
                class="prop-dist__rect prop-dist__rect--b"
                style={{ flex: `${b()} 1 0` }}
              >
                <span class="prop-dist__area" innerHTML={renderLatex(leftLabel())} />
              </div>
              <div
                class="prop-dist__rect prop-dist__rect--c"
                style={{ flex: `${c()} 1 0` }}
              >
                <span class="prop-dist__area" innerHTML={renderLatex(rightLabel())} />
              </div>
            </div>
            <div class="prop-dist__widths" aria-hidden="true">
              <span
                class="prop-dist__dim prop-dist__dim--b"
                style={{ flex: `${b()} 1 0` }}
                innerHTML={renderLatex("b")}
              />
              <span
                class="prop-dist__dim prop-dist__dim--c"
                style={{ flex: `${c()} 1 0` }}
                innerHTML={renderLatex("c")}
              />
            </div>
          </div>
          <figcaption class="math-widget__caption">
            One rectangle of height <span class="prop-dist__var-a">a</span> and width
            <span class="prop-dist__var-b">b</span> + <span class="prop-dist__var-c">c</span> splits
            into two areas <span class="prop-dist__var-a">a</span>×<span class="prop-dist__var-b">b</span>{" "}
            and <span class="prop-dist__var-a">a</span>×<span class="prop-dist__var-c">c</span>.
          </figcaption>
        </figure>

        <div class="math-widget__controls prop-dist__controls">
          <div class="scenario-demo__control">
            <label class="scenario-demo__label prop-dist__label-a" for="prop-dist-a">
              <span>a (height)</span>
              <span class="scenario-demo__value">{a()}</span>
            </label>
            <input
              id="prop-dist-a"
              class="scenario-demo__slider prop-dist__slider-a"
              type="range"
              min={1}
              max={6}
              step={1}
              value={a()}
              onInput={(e) => setA(Number(e.currentTarget.value))}
            />
          </div>
          <div class="scenario-demo__control">
            <label class="scenario-demo__label prop-dist__label-b" for="prop-dist-b">
              <span>b (width)</span>
              <span class="scenario-demo__value">{b()}</span>
            </label>
            <input
              id="prop-dist-b"
              class="scenario-demo__slider prop-dist__slider-b"
              type="range"
              min={1}
              max={8}
              step={1}
              value={b()}
              onInput={(e) => setB(Number(e.currentTarget.value))}
            />
          </div>
          <div class="scenario-demo__control">
            <label class="scenario-demo__label prop-dist__label-c" for="prop-dist-c">
              <span>c (width)</span>
              <span class="scenario-demo__value">{c()}</span>
            </label>
            <input
              id="prop-dist-c"
              class="scenario-demo__slider prop-dist__slider-c"
              type="range"
              min={1}
              max={8}
              step={1}
              value={c()}
              onInput={(e) => setC(Number(e.currentTarget.value))}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default DistributiveAreaDemo;
