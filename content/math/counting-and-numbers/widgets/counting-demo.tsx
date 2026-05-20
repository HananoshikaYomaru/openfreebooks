import { createSignal, For } from "solid-js";

const MAX = 10;

function CountingDemo() {
  const [count, setCount] = createSignal(0);

  const addOne = () => {
    if (count() < MAX) setCount(count() + 1);
  };

  const reset = () => setCount(0);

  return (
    <section class="math-widget" aria-labelledby="counting-demo-title">
      <h2 id="counting-demo-title" class="math-widget__title">
        Count the objects
      </h2>
      <div class="math-widget__body">
        <p class="math-widget__caption">
          Tap to place one object at a time (up to {MAX}). Use reset to start again.
        </p>
        <p class="counting-demo__count" aria-live="polite">
          Count: {count()}
        </p>
        <div
          class="counting-demo__objects"
          role="group"
          aria-label={`${count()} objects placed`}
          onClick={addOne}
        >
          <For each={Array.from({ length: count() })}>
            {(_, i) => (
              <button
                type="button"
                class="counting-demo__object counting-demo__object--active"
                aria-label={`Object ${i() + 1}`}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </For>
        </div>
        <div class="scenario-demo__actions">
          <button type="button" class="scenario-demo__btn" onClick={reset}>
            Reset
          </button>
          <button
            type="button"
            class="scenario-demo__btn scenario-demo__btn--primary"
            onClick={addOne}
            disabled={count() >= MAX}
          >
            Add one
          </button>
        </div>
      </div>
    </section>
  );
}

export default CountingDemo;
