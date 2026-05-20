import katex from "katex";
import { createEffect, createMemo, createSignal } from "solid-js";
import { renderMathInContainer } from "../../../../frontend/src/lib/render-math";

function formatNum(n: number) {
  return String(n);
}

function renderLatex(latex: string) {
  return katex.renderToString(latex, { throwOnError: false, strict: "ignore" });
}

function AreaModel() {
  const [a, setA] = createSignal(2);
  const [b, setB] = createSignal(3);
  const [c, setC] = createSignal(1);
  const [d, setD] = createSignal(4);

  const ac = createMemo(() => a() * c());
  const ad = createMemo(() => a() * d());
  const bc = createMemo(() => b() * c());
  const bd = createMemo(() => b() * d());
  const total = createMemo(() => ac() + ad() + bc() + bd());

  const expansionHtml = createMemo(() =>
    renderLatex(
      `(${formatNum(a())}+${formatNum(b())})(${formatNum(c())}+${formatNum(d())}) = ${ac()} + ${ad()} + ${bc()} + ${bd()} = ${total()}`
    )
  );

  let captionRef: HTMLElement | undefined;

  createEffect(() => {
    a();
    b();
    c();
    d();
    expansionHtml();
    if (captionRef) renderMathInContainer(captionRef);
  });

  return (
    <section class="math-widget" aria-labelledby="area-model-title">
      <h2 id="area-model-title" class="math-widget__title">Area model for expansion</h2>
      <div class="math-widget__body">
        <div class="math-widget__controls">
          <div class="scenario-demo__control">
            <label class="scenario-demo__label" for="area-a">
              <span>Width part a</span>
              <span class="scenario-demo__value">{a()}</span>
            </label>
            <input
              id="area-a"
              class="scenario-demo__slider"
              type="range"
              min={1}
              max={6}
              step={1}
              value={a()}
              onInput={(e) => setA(Number(e.currentTarget.value))}
            />
          </div>
          <div class="scenario-demo__control">
            <label class="scenario-demo__label" for="area-b">
              <span>Width part b</span>
              <span class="scenario-demo__value">{b()}</span>
            </label>
            <input
              id="area-b"
              class="scenario-demo__slider"
              type="range"
              min={1}
              max={6}
              step={1}
              value={b()}
              onInput={(e) => setB(Number(e.currentTarget.value))}
            />
          </div>
          <div class="scenario-demo__control">
            <label class="scenario-demo__label" for="area-c">
              <span>Height part c</span>
              <span class="scenario-demo__value">{c()}</span>
            </label>
            <input
              id="area-c"
              class="scenario-demo__slider"
              type="range"
              min={1}
              max={6}
              step={1}
              value={c()}
              onInput={(e) => setC(Number(e.currentTarget.value))}
            />
          </div>
          <div class="scenario-demo__control">
            <label class="scenario-demo__label" for="area-d">
              <span>Height part d</span>
              <span class="scenario-demo__value">{d()}</span>
            </label>
            <input
              id="area-d"
              class="scenario-demo__slider"
              type="range"
              min={1}
              max={6}
              step={1}
              value={d()}
              onInput={(e) => setD(Number(e.currentTarget.value))}
            />
          </div>
        </div>

        <div class="math-widget__formula" innerHTML={expansionHtml()} aria-live="polite" />

        <figure class="math-widget__figure">
          <div
            class="polynomials-area-model__grid"
            role="img"
            aria-label={`Rectangle split into areas ${ac()}, ${ad()}, ${bc()}, and ${bd()}`}
            style={{
              "grid-template-columns": `${a()}fr ${b()}fr`,
              "grid-template-rows": `${c()}fr ${d()}fr`,
            }}
          >
            <div class="polynomials-area-model__cell polynomials-area-model__cell--ac">{ac()}</div>
            <div class="polynomials-area-model__cell polynomials-area-model__cell--ad">
              {ad()}
            </div>
            <div class="polynomials-area-model__cell polynomials-area-model__cell--bc">
              {bc()}
            </div>
            <div class="polynomials-area-model__cell polynomials-area-model__cell--bd">
              {bd()}
            </div>
          </div>
          <figcaption
            class="math-widget__caption"
            ref={(el) => {
              captionRef = el;
              if (el) renderMathInContainer(el);
            }}
          >
            A rectangle of side \((a+b)\) by \((c+d)\) splits into regions \(ac\), \(ad\), \(bc\),
            \(bd\).
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export default AreaModel;
