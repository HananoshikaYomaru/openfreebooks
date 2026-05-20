import { renderLatex } from "@ofb/katex";
import { createMemo, createSignal, For } from "solid-js";

function DotBlock(props: { count: number; tone: "x" | "y" | "z" }) {
  return (
    <div class={`prop-assoc__block prop-assoc__block--${props.tone}`}>
      <For each={Array.from({ length: props.count })}>
        {() => <span class="prop-assoc__dot" />}
      </For>
    </div>
  );
}

function AssociativeDemo() {
  const [mode, setMode] = createSignal<"add" | "mul">("add");
  const [x, setX] = createSignal(2);
  const [y, setY] = createSignal(3);
  const [z, setZ] = createSignal(5);
  const [groupFirst, setGroupFirst] = createSignal(true);

  const xy = createMemo(() => (mode() === "add" ? x() + y() : x() * y()));
  const total = createMemo(() => (mode() === "add" ? xy() + z() : xy() * z()));

  const leftGroupHtml = createMemo(() => {
    if (mode() === "add") {
      return groupFirst()
        ? renderLatex(`(${x()}+${y()})+${z()} = ${xy()}+${z()} = ${total()}`)
        : renderLatex(`${x()}+(${y()}+${z()}) = ${x()}+${y() + z()} = ${total()}`);
    }
    return groupFirst()
      ? renderLatex(`(${x()}\\times${y()})\\times${z()} = ${xy()}\\times${z()} = ${total()}`)
      : renderLatex(
          `${x()}\\times(${y()}\\times${z()}) = ${x()}\\times${y() * z()} = ${total()}`
        );
  });

  const otherGroupHtml = createMemo(() => {
    if (mode() === "add") {
      return groupFirst()
        ? renderLatex(`${x()}+(${y()}+${z()}) = ${total()}`)
        : renderLatex(`(${x()}+${y()})+${z()} = ${total()}`);
    }
    return groupFirst()
      ? renderLatex(`${x()}\\times(${y()}\\times${z()}) = ${total()}`)
      : renderLatex(`(${x()}\\times${y()})\\times${z()} = ${total()}`);
  });

  return (
    <section class="math-widget prop-assoc" aria-labelledby="prop-assoc-title">
      <h2 id="prop-assoc-title" class="math-widget__title">
        Associative property
      </h2>
      <div class="math-widget__body">
        <div class="prop-assoc__mode" role="group" aria-label="Operation">
          <button
            type="button"
            class="prop-assoc__mode-btn"
            classList={{ "prop-assoc__mode-btn--active": mode() === "add" }}
            onClick={() => setMode("add")}
          >
            Addition
          </button>
          <button
            type="button"
            class="prop-assoc__mode-btn"
            classList={{ "prop-assoc__mode-btn--active": mode() === "mul" }}
            onClick={() => setMode("mul")}
          >
            Multiplication
          </button>
        </div>

        <div class="math-widget__controls">
          <div class="scenario-demo__control">
            <label class="scenario-demo__label" for="prop-assoc-x">
              <span>First</span>
              <span class="scenario-demo__value">{x()}</span>
            </label>
            <input
              id="prop-assoc-x"
              class="scenario-demo__slider"
              type="range"
              min={1}
              max={6}
              step={1}
              value={x()}
              onInput={(e) => setX(Number(e.currentTarget.value))}
            />
          </div>
          <div class="scenario-demo__control">
            <label class="scenario-demo__label" for="prop-assoc-y">
              <span>Middle</span>
              <span class="scenario-demo__value">{y()}</span>
            </label>
            <input
              id="prop-assoc-y"
              class="scenario-demo__slider"
              type="range"
              min={1}
              max={6}
              step={1}
              value={y()}
              onInput={(e) => setY(Number(e.currentTarget.value))}
            />
          </div>
          <div class="scenario-demo__control">
            <label class="scenario-demo__label" for="prop-assoc-z">
              <span>Last</span>
              <span class="scenario-demo__value">{z()}</span>
            </label>
            <input
              id="prop-assoc-z"
              class="scenario-demo__slider"
              type="range"
              min={1}
              max={6}
              step={1}
              value={z()}
              onInput={(e) => setZ(Number(e.currentTarget.value))}
            />
          </div>
        </div>

        <div class="prop-assoc__formulas">
          <p class="math-widget__formula" innerHTML={leftGroupHtml()} aria-live="polite" />
          <p class="prop-assoc__alt" innerHTML={otherGroupHtml()} aria-live="polite" />
        </div>

        <div class="prop-assoc__stage">
          <div
            class="prop-assoc__group"
            classList={{ "prop-assoc__group--right": !groupFirst() }}
          >
            {groupFirst() ? (
              <>
                <div class="prop-assoc__bracket prop-assoc__bracket--open" aria-hidden="true">
                  (
                </div>
                <DotBlock count={x()} tone="x" />
                <span class="prop-assoc__op" aria-hidden="true">
                  {mode() === "add" ? "+" : "×"}
                </span>
                <DotBlock count={y()} tone="y" />
                <div class="prop-assoc__bracket prop-assoc__bracket--close" aria-hidden="true">
                  )
                </div>
                <span class="prop-assoc__op" aria-hidden="true">
                  {mode() === "add" ? "+" : "×"}
                </span>
                <DotBlock count={z()} tone="z" />
              </>
            ) : (
              <>
                <DotBlock count={x()} tone="x" />
                <span class="prop-assoc__op" aria-hidden="true">
                  {mode() === "add" ? "+" : "×"}
                </span>
                <div class="prop-assoc__bracket prop-assoc__bracket--open" aria-hidden="true">
                  (
                </div>
                <DotBlock count={y()} tone="y" />
                <span class="prop-assoc__op" aria-hidden="true">
                  {mode() === "add" ? "+" : "×"}
                </span>
                <DotBlock count={z()} tone="z" />
                <div class="prop-assoc__bracket prop-assoc__bracket--close" aria-hidden="true">
                  )
                </div>
              </>
            )}
            <span class="prop-assoc__eq" aria-hidden="true">
              =
            </span>
            <div class="prop-assoc__result">
              <For each={Array.from({ length: Math.min(total(), 48) })}>
                {() => <span class="prop-assoc__dot prop-assoc__dot--result" />}
              </For>
              {total() > 48 ? (
                <span class="prop-assoc__many">+{total() - 48} more</span>
              ) : null}
            </div>
          </div>
        </div>

        <button
          type="button"
          class="prop-assoc__toggle"
          onClick={() => setGroupFirst((v) => !v)}
        >
          {groupFirst() ? "Group the last two instead" : "Group the first two instead"}
        </button>

        <p class="math-widget__caption">
          Brackets show which pair to combine first. Different groupings give the same final answer.
        </p>
      </div>
    </section>
  );
}

export default AssociativeDemo;
