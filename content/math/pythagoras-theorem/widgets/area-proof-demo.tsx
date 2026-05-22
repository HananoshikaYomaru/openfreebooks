import { renderLatex } from "@ofb/katex";
import { createMemo, createSignal } from "solid-js";

function AreaProofDemo() {
  const [a, setA] = createSignal(4);
  const [b, setB] = createSignal(3);
  const [showNumbers, setShowNumbers] = createSignal(false);

  const sum = createMemo(() => a() + b());
  const c2 = createMemo(() => a() * a() + b() * b());
  const bigArea = createMemo(() => sum() * sum());
  const fourTriangles = createMemo(() => 2 * a() * b());
  const centerArea = createMemo(() => c2());
  const sideScale = createMemo(() => 260 / sum());
  const sidePx = createMemo(() => sum() * sideScale());
  const offset = 30;

  const ax = createMemo(() => a() * sideScale());
  const bx = createMemo(() => b() * sideScale());

  const top = createMemo(() => `${offset + ax()},${offset}`);
  const right = createMemo(() => `${offset + sidePx()},${offset + ax()}`);
  const bottom = createMemo(() => `${offset + bx()},${offset + sidePx()}`);
  const left = createMemo(() => `${offset},${offset + bx()}`);

  const centerSquarePoints = createMemo(
    () => `${top()} ${right()} ${bottom()} ${left()}`
  );

  const triangleTL = createMemo(
    () =>
      `${offset},${offset} ${offset + ax()},${offset} ${offset},${offset + bx()}`
  );
  const triangleTR = createMemo(
    () =>
      `${offset + sidePx()},${offset} ${offset + sidePx()},${offset + ax()} ${offset + ax()},${offset}`
  );
  const triangleBR = createMemo(
    () =>
      `${offset + sidePx()},${offset + sidePx()} ${offset + bx()},${offset + sidePx()} ${offset + sidePx()},${offset + ax()}`
  );
  const triangleBL = createMemo(
    () =>
      `${offset},${offset + sidePx()} ${offset},${offset + bx()} ${offset + bx()},${offset + sidePx()}`
  );

  const modeFormulaLatex = createMemo(() => {
    if (showNumbers()) {
      return `(${a()}+${b()})^2 = 4\\left(\\frac{1}{2}\\cdot ${a()}\\cdot ${b()}\\right) + ${centerArea()} \\Rightarrow ${a()}^2 + ${b()}^2 = ${c2()}`;
    }
    return "(a+b)^2 = 4\\left(\\frac{1}{2}ab\\right) + c^2 \\Rightarrow a^2 + b^2 = c^2";
  });

  return (
    <section class="math-widget pyth-proof-demo" aria-labelledby="pyth-proof-demo-title">
      <h3 id="pyth-proof-demo-title" class="math-widget__title">
        Interactive <span innerHTML={renderLatex("(a+b)^2")} /> area proof
      </h3>

      <div class="math-widget__body">
        <p class="math-widget__caption">
          Move <strong>a</strong> and <strong>b</strong> to resize the same diagram. The large square
          area and the piece-sum area stay equal.
        </p>

        <figure class="math-widget__figure pyth-proof-demo__figure">
          <svg
            viewBox="0 0 320 320"
            width="320"
            height="320"
            role="img"
            aria-label={`Area proof diagram with a=${a()} and b=${b()}`}
          >
            <rect
              x={offset}
              y={offset}
              width={sidePx()}
              height={sidePx()}
              class="pyth-proof-demo__outer"
            />

            <polygon points={triangleTL()} class="pyth-proof-demo__tri pyth-proof-demo__tri--1" />
            <polygon points={triangleTR()} class="pyth-proof-demo__tri pyth-proof-demo__tri--2" />
            <polygon points={triangleBR()} class="pyth-proof-demo__tri pyth-proof-demo__tri--3" />
            <polygon points={triangleBL()} class="pyth-proof-demo__tri pyth-proof-demo__tri--4" />

            <polygon points={centerSquarePoints()} class="pyth-proof-demo__center" />

            <text x={offset + sidePx() / 2} y={offset - 10} class="pyth-proof-demo__label">
              a + b
            </text>
            <text x={offset - 12} y={offset + sidePx() / 2} class="pyth-proof-demo__label pyth-proof-demo__label--vertical">
              a + b
            </text>
            <text x={offset + sidePx() / 2 + 6} y={offset + sidePx() / 2 + 4} class="pyth-proof-demo__center-label">
              c²
            </text>
          </svg>

          <figcaption class="math-widget__caption">
            Four congruent right triangles each have area{" "}
            <span innerHTML={renderLatex("\\tfrac{1}{2}ab")} />. The middle square has area{" "}
            <span innerHTML={renderLatex("c^2")} />.
          </figcaption>
        </figure>

        <div class="math-widget__controls pyth-proof-demo__controls">
          <div class="scenario-demo__control">
            <label class="scenario-demo__label pyth-proof-demo__label-a" for="pyth-proof-a">
              <span>a (leg)</span>
              <span class="scenario-demo__value">{a()}</span>
            </label>
            <input
              id="pyth-proof-a"
              class="scenario-demo__slider pyth-proof-demo__slider-a"
              type="range"
              min={1}
              max={10}
              step={1}
              value={a()}
              onInput={(e) => setA(Number(e.currentTarget.value))}
            />
          </div>
          <div class="scenario-demo__control">
            <label class="scenario-demo__label pyth-proof-demo__label-b" for="pyth-proof-b">
              <span>b (leg)</span>
              <span class="scenario-demo__value">{b()}</span>
            </label>
            <input
              id="pyth-proof-b"
              class="scenario-demo__slider pyth-proof-demo__slider-b"
              type="range"
              min={1}
              max={10}
              step={1}
              value={b()}
              onInput={(e) => setB(Number(e.currentTarget.value))}
            />
          </div>
        </div>

        <div class="pyth-proof-demo__equations" aria-live="polite">
          <div class="pyth-proof-demo__equation-header">
            <button
              type="button"
              class="pyth-proof-demo__toggle"
              aria-pressed={showNumbers()}
              onClick={() => setShowNumbers((v) => !v)}
            >
              {showNumbers() ? "Show variables" : "Show numbers"}
            </button>
          </div>
          <p class="math-widget__formula" innerHTML={renderLatex(modeFormulaLatex())} />
          <p class="pyth-proof-demo__areas">
            Big square area: <strong>{bigArea()}</strong>, four triangles total:{" "}
            <strong>{fourTriangles()}</strong>, center square area: <strong>{centerArea()}</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AreaProofDemo;
