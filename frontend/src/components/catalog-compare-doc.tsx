import { createSignal, onMount, Show } from "solid-js";

function readCompareTemplateHtml(): string {
  const el = document.getElementById("catalog-compare-template");
  return el?.innerHTML?.trim() ?? "";
}

export function CatalogCompareDoc() {
  const [html, setHtml] = createSignal("");

  onMount(() => {
    setHtml(readCompareTemplateHtml());
  });

  return (
    <Show when={html()}>
      <article
        class="catalog-compare-doc book-prose"
        aria-label="Mathematics curriculum comparison"
        innerHTML={html()}
      />
    </Show>
  );
}
