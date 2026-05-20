import { createSignal, Show } from "solid-js";
import { render } from "solid-js/web";

const GRAPH_EDGES: Array<{ from: string; to: string }> = [
  { from: "quadratic", to: "sequences" },
  { from: "quadratic", to: "functions" },
  { from: "sequences", to: "linear-programming" },
  { from: "functions", to: "linear-programming" },
];

function GraphPrereqDemo() {
  const [focus, setFocus] = createSignal<string | null>(null);

  const nodeLit = (id: string) => {
    const active = focus();
    if (!active) return false;
    if (id === active) return true;
    return GRAPH_EDGES.some(
      (edge) =>
        (edge.from === active && edge.to === id) || (edge.from === id && edge.to === active)
    );
  };

  const toggle = (id: string) => setFocus((prev) => (prev === id ? null : id));

  return (
    <div class="contributing-graph-demo" aria-label="Interactive prerequisite graph example">
      <p class="contributing-demo__hint">
        Click a topic to highlight its prerequisites and follow-on chapters.
      </p>
      <div class="contributing-graph-demo__layout">
        <button
          type="button"
          class="contributing-graph-demo__node contributing-graph-demo__node--root"
          classList={{ "is-lit": nodeLit("quadratic") }}
          onClick={() => toggle("quadratic")}
        >
          Quadratic equations
        </button>
        <span class="contributing-graph-demo__fork" aria-hidden="true">
          ↙
          <span class="contributing-graph-demo__fork-line" />
          ↘
        </span>
        <div class="contributing-graph-demo__row">
          <button
            type="button"
            class="contributing-graph-demo__node"
            classList={{ "is-lit": nodeLit("sequences") }}
            onClick={() => toggle("sequences")}
          >
            Sequences
          </button>
          <button
            type="button"
            class="contributing-graph-demo__node"
            classList={{ "is-lit": nodeLit("functions") }}
            onClick={() => toggle("functions")}
          >
            Functions
          </button>
        </div>
        <span class="contributing-graph-demo__join" aria-hidden="true">
          ↘
          <span class="contributing-graph-demo__join-line" />
          ↙
        </span>
        <button
          type="button"
          class="contributing-graph-demo__node contributing-graph-demo__node--merge"
          classList={{ "is-lit": nodeLit("linear-programming") }}
          onClick={() => toggle("linear-programming")}
        >
          Linear programming
        </button>
      </div>
    </div>
  );
}

function CatalogViewsDemo() {
  const [view, setView] = createSignal<"list" | "map" | "compare">("list");

  return (
    <div class="contributing-views-demo" aria-label="Catalog list and map views">
      <div class="contributing-views-demo__tabs" role="tablist" aria-label="Preview catalog views">
        <button
          type="button"
          role="tab"
          class="contributing-views-demo__tab"
          classList={{ "is-active": view() === "list" }}
          aria-selected={view() === "list"}
          onClick={() => setView("list")}
        >
          List
        </button>
        <button
          type="button"
          role="tab"
          class="contributing-views-demo__tab"
          classList={{ "is-active": view() === "map" }}
          aria-selected={view() === "map"}
          onClick={() => setView("map")}
        >
          Map
        </button>
        <button
          type="button"
          role="tab"
          class="contributing-views-demo__tab"
          classList={{ "is-active": view() === "compare" }}
          aria-selected={view() === "compare"}
          onClick={() => setView("compare")}
        >
          Compare
        </button>
      </div>
      <div class="contributing-views-demo__panel" role="tabpanel">
        <Show
          when={view() === "compare"}
          fallback={
            <Show
          when={view() === "list"}
          fallback={
            <div class="contributing-views-demo__map">
              <div class="contributing-views-demo__map-col">
                <span class="contributing-views-demo__strand">Number &amp; Algebra</span>
                <span class="contributing-views-demo__map-node is-root">Directed numbers</span>
                <span class="contributing-views-demo__map-arrow" aria-hidden="true">
                  ↓
                </span>
                <span class="contributing-views-demo__map-node">Quadratic equations</span>
                <span class="contributing-views-demo__map-fork" aria-hidden="true">
                  ↙ ↘
                </span>
                <div class="contributing-views-demo__map-row">
                  <span class="contributing-views-demo__map-node is-small">Sequences</span>
                  <span class="contributing-views-demo__map-node is-small">Functions</span>
                </div>
              </div>
              <p class="contributing-views-demo__caption">
                Arrows come from <code>graph.edges</code> only — strand order in JSON does not draw
                links.
              </p>
            </div>
          }
        >
          <ol class="contributing-views-demo__list">
            <li>
              <span class="contributing-views-demo__list-num">01</span>
              <span class="contributing-views-demo__list-title">Quadratic equations</span>
              <span class="contributing-views-demo__list-badge">DSE</span>
            </li>
            <li>
              <span class="contributing-views-demo__list-num">02</span>
              <span class="contributing-views-demo__list-title">Sequences &amp; series</span>
              <span class="contributing-views-demo__list-badge is-muted">Coming soon</span>
            </li>
          </ol>
          <p class="contributing-views-demo__caption">
            List order follows the <code>chapters[]</code> array — your table of contents.
          </p>
        </Show>
          }
        >
          <p class="contributing-views-demo__caption">
            Mathematics only: curricula comparison doc at{" "}
            <code>?view=compare</code> (HTML partial, not JSON).
          </p>
        </Show>
      </div>
    </div>
  );
}

export function mountContributingDemos() {
  const graphRoot = document.getElementById("contributing-demo-graph");
  if (graphRoot) {
    render(() => <GraphPrereqDemo />, graphRoot);
  }

  const viewsRoot = document.getElementById("contributing-demo-views");
  if (viewsRoot) {
    render(() => <CatalogViewsDemo />, viewsRoot);
  }
}
