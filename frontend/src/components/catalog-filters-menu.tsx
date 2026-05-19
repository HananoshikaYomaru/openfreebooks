import { createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";

type CatalogFiltersMenuProps = {
  curriculums: string[];
  activeFilters: () => Set<string>;
  onToggle: (curriculum: string) => void;
};

function filtersSummary(active: Set<string>): string {
  if (active.size === 0) return "All";
  return Array.from(active).join(", ");
}

export function CatalogFiltersMenu(props: CatalogFiltersMenuProps) {
  const [open, setOpen] = createSignal(false);
  let root!: HTMLDivElement;

  const summary = createMemo(() => filtersSummary(props.activeFilters()));

  const close = () => setOpen(false);

  onMount(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!open() || !root.contains(event.target as Node)) {
        close();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", onKeyDown);
    onCleanup(() => {
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("keydown", onKeyDown);
    });
  });

  return (
    <div class="catalog-filter-menu" ref={root}>
      <button
        type="button"
        class="catalog-filter-menu__trigger"
        aria-expanded={open() ? "true" : "false"}
        aria-haspopup="true"
        aria-controls="catalog-filter-menu-panel"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((isOpen) => !isOpen);
        }}
      >
        <span class="catalog-filter-menu__trigger-kicker">Filter by curriculum</span>
        <span class="catalog-filter-menu__trigger-value">{summary()}</span>
        <span class="catalog-filter-menu__chevron" aria-hidden="true" />
      </button>
      <Show when={open()}>
        <div
          id="catalog-filter-menu-panel"
          class="catalog-filter-menu__panel"
          role="group"
          aria-label="Curriculum filters"
          onClick={(event) => event.stopPropagation()}
        >
          <label class="catalog-filter-menu__option">
            <input
              type="checkbox"
              class="catalog-filter-menu__checkbox"
              checked={props.activeFilters().size === 0}
              onChange={() => props.onToggle("ALL")}
            />
            <span class="catalog-filter-menu__option-label">All</span>
          </label>
          <For each={props.curriculums}>
            {(curriculum) => (
              <label class="catalog-filter-menu__option">
                <input
                  type="checkbox"
                  class="catalog-filter-menu__checkbox"
                  checked={props.activeFilters().has(curriculum)}
                  onChange={() => props.onToggle(curriculum)}
                />
                <span class="catalog-filter-menu__option-label">{curriculum}</span>
              </label>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
