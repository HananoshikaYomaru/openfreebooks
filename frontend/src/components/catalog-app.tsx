import { createMemo, createSignal, For, lazy, onCleanup, onMount, Show, Suspense } from "solid-js";
import { subjectToCanvas } from "../lib/catalog-to-canvas";
import { watchSiteTheme } from "../lib/catalog-canvas-theme";
import { CatalogChapterCard } from "./catalog-chapter-card";
import { CatalogFiltersMenu } from "./catalog-filters-menu";
import type {
  CatalogChapter,
  CatalogData,
  CatalogStrand,
  CatalogSubject,
  CatalogViewMode,
} from "../../../data/catalog.types";

const CatalogCanvasView = lazy(() =>
  import("./catalog-canvas-view").then((m) => ({ default: m.CatalogCanvasView }))
);

function readCatalogData(): CatalogData | null {
  const el = document.getElementById("catalog-data");
  if (!el?.textContent) return null;
  return JSON.parse(el.textContent) as CatalogData;
}

function initialSubjectId(subjects: CatalogSubject[]): string {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("subject");
  if (fromUrl && subjects.some((s) => s.id === fromUrl)) {
    return fromUrl;
  }
  return subjects[0]?.id ?? "math";
}

function initialViewMode(): CatalogViewMode {
  const params = new URLSearchParams(window.location.search);
  return params.get("view") === "tree" ? "tree" : "linear";
}

function chapterMatchesFilters(chapter: CatalogChapter, activeFilters: Set<string>): boolean {
  if (activeFilters.size === 0) return true;
  return chapter.curriculums.some((c) => activeFilters.has(c));
}

function countVisibleChapters(subject: CatalogSubject, activeFilters: Set<string>): number {
  return subject.strands.reduce((total, strand) => {
    return total + strand.chapters.filter((ch) => chapterMatchesFilters(ch, activeFilters)).length;
  }, 0);
}

function syncUrl(subjectId: string, viewMode: CatalogViewMode) {
  const url = new URL(window.location.href);
  url.searchParams.set("subject", subjectId);
  if (viewMode === "tree") {
    url.searchParams.set("view", "tree");
  } else {
    url.searchParams.delete("view");
  }
  window.history.replaceState(null, "", url);
}

export function CatalogApp() {
  const data = readCatalogData();
  if (!data) {
    return <p class="catalog-error">Catalog data could not be loaded.</p>;
  }

  const [currentSubjectId, setCurrentSubjectId] = createSignal(initialSubjectId(data.subjects));
  const [activeFilters, setActiveFilters] = createSignal<Set<string>>(new Set());
  const [viewMode, setViewMode] = createSignal<CatalogViewMode>(initialViewMode());
  const [canvasThemeTick, setCanvasThemeTick] = createSignal(0);
  const [mapLayoutReady, setMapLayoutReady] = createSignal(!document.fonts);

  onMount(() => {
    const stopThemeWatch = watchSiteTheme(() => setCanvasThemeTick((tick) => tick + 1));
    if (document.fonts) {
      void document.fonts.ready.then(() => setMapLayoutReady(true));
    }
    onCleanup(stopThemeWatch);
  });

  const currentSubject = createMemo(
    () => data.subjects.find((s) => s.id === currentSubjectId()) ?? data.subjects[0]
  );

  const visibleCount = createMemo(() => countVisibleChapters(currentSubject(), activeFilters()));

  const hasChapterTree = createMemo(() => currentSubject().strands.length > 0);

  const chapterFilter = createMemo(
    () => (chapter: CatalogChapter) => chapterMatchesFilters(chapter, activeFilters())
  );

  const canvasData = createMemo(() => {
    canvasThemeTick();
    if (!mapLayoutReady()) return undefined;
    return subjectToCanvas(currentSubject(), chapterFilter());
  });

  const visibleChapters = createMemo(() => {
    const map: Record<string, CatalogChapter> = {};
    for (const strand of currentSubject().strands) {
      for (const chapter of strand.chapters) {
        if (chapterFilter()(chapter)) {
          map[chapter.slug] = chapter;
        }
      }
    }
    return map;
  });

  const statsLabel = createMemo(() => {
    const count = visibleCount();
    const filters = activeFilters();
    const filterText =
      filters.size === 0 ? "all" : `filtered (${Array.from(filters).join(", ")})`;
    return `Showing ${count} ${filterText} chapter${count === 1 ? "" : "s"}`;
  });

  const selectSubject = (subjectId: string) => {
    setCurrentSubjectId(subjectId);
    syncUrl(subjectId, viewMode());
  };

  const setCatalogView = (mode: CatalogViewMode) => {
    setViewMode(mode);
    syncUrl(currentSubjectId(), mode);
  };

  const toggleFilter = (curriculum: string) => {
    if (curriculum === "ALL") {
      setActiveFilters(new Set<string>());
      return;
    }
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(curriculum)) {
        next.delete(curriculum);
      } else {
        next.add(curriculum);
      }
      return next;
    });
  };

  const filteredStrands = createMemo(() => {
    const subject = currentSubject();
    return subject.strands
      .map((strand) => ({
        ...strand,
        chapters: strand.chapters.filter((ch) => chapterMatchesFilters(ch, activeFilters())),
      }))
      .filter((strand) => strand.chapters.length > 0);
  });

  return (
    <div
      class="catalog-shell"
      classList={{ "catalog-shell--tree": viewMode() === "tree" }}
    >
      <aside class="catalog-sidebar" aria-label="Subjects">
        <div class="catalog-sidebar__header">
          <p class="catalog-sidebar__kicker">{data.title}</p>
          <p class="catalog-sidebar__subtitle">{data.subtitle}</p>
        </div>
        <nav class="catalog-sidebar__nav" aria-label="Subject navigation">
          <For each={data.subjects}>
            {(subject) => (
              <button
                type="button"
                class="catalog-subject-btn"
                classList={{ "is-active": currentSubjectId() === subject.id }}
                onClick={() => selectSubject(subject.id)}
              >
                {subject.name}
              </button>
            )}
          </For>
        </nav>
      </aside>

      <div class="catalog-main">
        <header class="catalog-header">
          <div class="catalog-header__head">
            <div class="catalog-header__intro">
              <h1 class="catalog-header__title">{currentSubject().name}</h1>
              <p class="catalog-header__stats">{statsLabel()}</p>
            </div>
            <div class="catalog-view-toggle" role="tablist" aria-label="Chapter layout">
              <button
                type="button"
                class="catalog-view-toggle__btn"
                role="tab"
                aria-selected={viewMode() === "linear" ? "true" : "false"}
                onClick={() => setCatalogView("linear")}
              >
                List
              </button>
              <button
                type="button"
                class="catalog-view-toggle__btn"
                role="tab"
                aria-selected={viewMode() === "tree" ? "true" : "false"}
                onClick={() => setCatalogView("tree")}
              >
                Map
              </button>
            </div>
          </div>
          <div class="catalog-header__filters">
            <CatalogFiltersMenu
              curriculums={data.curriculums}
              activeFilters={activeFilters}
              onToggle={toggleFilter}
            />
          </div>
        </header>

        <div
          class="catalog-content"
          classList={{ "catalog-content--tree": viewMode() === "tree" }}
        >
          <Show
            when={hasChapterTree() && visibleCount() > 0}
            fallback={
              <div class="catalog-empty">
                <h2 class="catalog-empty__title">
                  {hasChapterTree() ? "No chapters found" : "Coming soon"}
                </h2>
                <p class="catalog-empty__text">
                  {hasChapterTree()
                    ? "There are no chapters in this subject matching your selected curriculum filters. Try selecting All to see everything."
                    : "Chapters for this subject are on the roadmap. Mathematics is available now — select it from the sidebar."}
                </p>
              </div>
            }
          >
            <Show
              when={viewMode() === "tree"}
              fallback={
                <For each={filteredStrands()}>
                  {(strand: CatalogStrand) => (
                    <section class="catalog-strand" aria-labelledby={`strand-${strand.id}`}>
                      <h2 id={`strand-${strand.id}`} class="catalog-strand__title">
                        <span class="catalog-strand__marker" aria-hidden="true">
                          ✦
                        </span>
                        {strand.title}
                      </h2>
                      <ol class="catalog-tree">
                        <For each={strand.chapters}>
                          {(chapter, index) => (
                            <li class="catalog-tree__item">
                              <CatalogChapterCard
                                chapter={chapter}
                                index={index()}
                                subjectId={currentSubjectId()}
                                variant="list"
                              />
                            </li>
                          )}
                        </For>
                      </ol>
                    </section>
                  )}
                </For>
              }
            >
              <Show
                when={canvasData()}
                fallback={<p class="catalog-canvas-loading">Loading chapter map…</p>}
              >
                {(canvas) => (
                  <Suspense fallback={<p class="catalog-canvas-loading">Loading chapter map…</p>}>
                    <CatalogCanvasView
                      canvas={canvas()}
                      subjectId={currentSubjectId()}
                      chapters={visibleChapters()}
                    />
                  </Suspense>
                )}
              </Show>
            </Show>
          </Show>
        </div>
      </div>
    </div>
  );
}
