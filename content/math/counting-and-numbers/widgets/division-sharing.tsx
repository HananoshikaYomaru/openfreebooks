import { createMemo, createSignal, For, Show } from "solid-js";

function SharePile(props: { count: number; label: string }) {
  return (
    <div class="division-sharing__pile">
      <span class="division-sharing__pile-label">{props.label}</span>
      <div class="division-sharing__dots" role="img" aria-label={`${props.count} dots`}>
        <For each={Array.from({ length: props.count })}>
          {() => <span class="division-sharing__dot" />}
        </For>
      </div>
    </div>
  );
}

function DivisionSharing() {
  const [total, setTotal] = createSignal(12);
  const [groups, setGroups] = createSignal(3);

  const each = createMemo(() => Math.floor(total() / groups()));
  const remainder = createMemo(() => total() % groups());
  const fair = createMemo(() => remainder() === 0);

  const groupLabels = createMemo(() =>
    Array.from({ length: groups() }, (_, i) => `Pile ${i + 1}`)
  );

  return (
    <section class="math-widget" aria-labelledby="division-sharing-title">
      <h2 id="division-sharing-title" class="math-widget__title">
        Share the dots equally
      </h2>
      <div class="math-widget__body">
        <div class="math-widget__controls">
          <div class="scenario-demo__control">
            <label class="scenario-demo__label" for="share-total">
              <span>Dots to share</span>
              <span class="scenario-demo__value">{total()}</span>
            </label>
            <input
              id="share-total"
              class="scenario-demo__slider"
              type="range"
              min={4}
              max={20}
              step={1}
              value={total()}
              onInput={(e) => setTotal(Number(e.currentTarget.value))}
            />
          </div>
          <div class="scenario-demo__control">
            <label class="scenario-demo__label" for="share-groups">
              <span>Equal piles</span>
              <span class="scenario-demo__value">{groups()}</span>
            </label>
            <input
              id="share-groups"
              class="scenario-demo__slider"
              type="range"
              min={2}
              max={6}
              step={1}
              value={groups()}
              onInput={(e) => setGroups(Number(e.currentTarget.value))}
            />
          </div>
        </div>

        <p class="division-sharing__equation" aria-live="polite">
          <Show
            when={fair()}
            fallback={
              <>
                <strong>{total()}</strong> ÷ <strong>{groups()}</strong> does not split evenly —{" "}
                <strong>{each()}</strong> in each pile and <strong>{remainder()}</strong> left over
              </>
            }
          >
            <strong>{total()}</strong> ÷ <strong>{groups()}</strong> = <strong>{each()}</strong> dots
            per pile
          </Show>
        </p>

        <Show when={fair()}>
          <div class="division-sharing__piles">
            <For each={groupLabels()}>
              {(label) => <SharePile count={each()} label={label} />}
            </For>
          </div>
        </Show>

        <Show when={!fair()}>
          <div class="division-sharing__uneven">
            <div class="division-sharing__piles">
              <For each={groupLabels()}>
                {(label) => <SharePile count={each()} label={label} />}
              </For>
            </div>
            <div class="division-sharing__remainder">
              <span class="division-sharing__pile-label">Left over</span>
              <div class="division-sharing__dots division-sharing__dots--remainder" role="img">
                <For each={Array.from({ length: remainder() })}>
                  {() => <span class="division-sharing__dot division-sharing__dot--extra" />}
                </For>
              </div>
            </div>
          </div>
        </Show>

        <p class="math-widget__caption">
          Check: {groups()} × {each()} = {groups() * each()}
          <Show when={fair()}> — that matches {total()} dots.</Show>
        </p>
      </div>
    </section>
  );
}

export default DivisionSharing;
