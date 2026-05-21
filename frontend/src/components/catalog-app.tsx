import { createMemo, createSignal, For, lazy, Show, Suspense } from "solid-js";
import { subjectToMermaid } from "../lib/catalog-to-mermaid";
import { CatalogCompareDoc } from "./catalog-compare-doc";
import { CatalogChapterCard } from "./catalog-chapter-card";
import { CatalogFiltersMenu } from "./catalog-filters-menu";
import { chapterFilterCurriculums } from "../lib/catalog-coverage";
import type {
  CatalogChapter,
  CatalogData,
  CatalogStrand,
  CatalogSubject,
  CatalogViewMode,
} from "../../../data/catalog.types";

const CatalogMermaidView = lazy(() =>
  import("./catalog-mermaid-view").then((m) => ({ default: m.CatalogMermaidView }))
);

function normalizeChapter(chapter: CatalogChapter): CatalogChapter {
  const coverage = chapter.curriculumCoverage;
  if (coverage && typeof coverage === "object" && !Array.isArray(coverage)) {
    return chapter;
  }
  const legacy = chapter.curriculums;
  if (!legacy?.length) return { ...chapter, curriculumCoverage: {} };
  const curriculumCoverage: CatalogChapter["curriculumCoverage"] = {};
  for (const label of legacy) {
    curriculumCoverage[label] = "core";
  }
  return { ...chapter, curriculumCoverage };
}

function normalizeSubject(subject: CatalogSubject): CatalogSubject {
  return {
    ...subject,
    strands: (subject.strands ?? []).map((strand) => ({
      ...strand,
      chapters: (strand.chapters ?? []).map(normalizeChapter),
    })),
    graph: subject.graph ?? { edges: [] },
  };
}

function readCatalogData(): CatalogData | null {
  const el = document.getElementById("catalog-data");
  if (!el?.textContent) return null;
  const raw = JSON.parse(el.textContent) as CatalogData;
  return {
    ...raw,
    curriculums: raw.curriculums ?? [],
    subjects: (raw.subjects ?? []).map(normalizeSubject),
  };
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
  const view = params.get("view");
  if (view === "tree") return "tree";
  if (view === "compare") return "compare";
  return "linear";
}

function chapterMatchesFilters(chapter: CatalogChapter, activeFilters: Set<string>): boolean {
  if (activeFilters.size === 0) return true;
  return chapterFilterCurriculums(chapter).some((c) => activeFilters.has(c));
}

function countVisibleChapters(subject: CatalogSubject, activeFilters: Set<string>): number {
  return (subject.strands ?? []).reduce((total, strand) => {
    const visible = (strand.chapters ?? []).filter((ch) => chapterMatchesFilters(ch, activeFilters));
    return total + visible.length;
  }, 0);
}

function syncUrl(subjectId: string, viewMode: CatalogViewMode) {
  const url = new URL(window.location.href);
  url.searchParams.set("subject", subjectId);
  if (viewMode === "tree") {
    url.searchParams.set("view", "tree");
  } else if (viewMode === "compare") {
    url.searchParams.set("view", "compare");
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

  const currentSubject = createMemo(() => {
    const subjects = data.subjects ?? [];
    return subjects.find((s) => s.id === currentSubjectId()) ?? subjects[0];
  });

  const visibleCount = createMemo(() => {
    const subject = currentSubject();
    return subject ? countVisibleChapters(subject, activeFilters()) : 0;
  });

  const hasChapterTree = createMemo(() => (currentSubject()?.strands ?? []).length > 0);

  const chapterFilter = createMemo(
    () => (chapter: CatalogChapter) => chapterMatchesFilters(chapter, activeFilters())
  );

  const mermaidData = createMemo(() => {
    const subject = currentSubject();
    if (!subject) return null;
    return subjectToMermaid(subject, chapterFilter(), currentSubjectId());
  });

  const showCompareDoc = createMemo(
    () => currentSubjectId() === "math" && viewMode() === "compare"
  );

  const statsLabel = createMemo(() => {
    if (showCompareDoc()) {
      return "Curriculum comparison for Mathematics";
    }
    const count = visibleCount();
    const filters = activeFilters();
    const filterText =
      filters.size === 0 ? "all" : `filtered (${Array.from(filters).join(", ")})`;
    return `Showing ${count} ${filterText} chapter${count === 1 ? "" : "s"}`;
  });

  const selectSubject = (subjectId: string) => {
    if (subjectId !== "math" && viewMode() === "compare") {
      setViewMode("linear");
      syncUrl(subjectId, "linear");
    } else {
      syncUrl(subjectId, viewMode());
    }
    setCurrentSubjectId(subjectId);
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
    if (!subject) return [];
    return (subject.strands ?? [])
      .map((strand) => ({
        ...strand,
        chapters: (strand.chapters ?? []).filter((ch) =>
          chapterMatchesFilters(ch, activeFilters())
        ),
      }))
      .filter((strand) => strand.chapters.length > 0);
  });

  return (
    <div
      class="catalog-shell"
      classList={{
        "catalog-shell--tree": viewMode() === "tree",
        "catalog-shell--compare": showCompareDoc(),
      }}
    >
      <aside class="catalog-sidebar" aria-label="Subjects">
        <div class="catalog-sidebar__header">
          <p class="catalog-sidebar__kicker">{data.title}</p>
          <p class="catalog-sidebar__subtitle">{data.subtitle}</p>
        </div>
        <nav class="catalog-sidebar__nav" aria-label="Subject navigation">
          <select
            class="catalog-subject-select"
            aria-label="Select subject"
            value={currentSubjectId()}
            onChange={(event) => selectSubject(event.currentTarget.value)}
          >
            <For each={data.subjects}>
              {(subject) => <option value={subject.id}>{subject.name}</option>}
            </For>
          </select>
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
        <header
          class="catalog-header"
          classList={{ "catalog-header--has-banner": Boolean(currentSubject()?.banner) }}
        >
          <Show when={currentSubject()?.banner}>
            <div class="catalog-header__banner" aria-hidden="true">
              <img
                src={currentSubject()!.banner!}
                alt=""
                width={1400}
                height={700}
                decoding="async"
              />
            </div>
          </Show>
          <div class="catalog-header__head">
            <div class="catalog-header__intro">
              <h1 class="catalog-header__title">{currentSubject()?.name ?? "Catalog"}</h1>
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
              <Show when={currentSubjectId() === "math"}>
                <button
                  type="button"
                  class="catalog-view-toggle__btn"
                  role="tab"
                  aria-selected={viewMode() === "compare" ? "true" : "false"}
                  onClick={() => setCatalogView("compare")}
                >
                  Compare
                </button>
              </Show>
            </div>
          </div>
          <Show when={!showCompareDoc()}>
            <div class="catalog-header__filters">
              <CatalogFiltersMenu
                curriculums={data.curriculums ?? []}
                activeFilters={activeFilters}
                onToggle={toggleFilter}
              />
            </div>
          </Show>
        </header>

        <div
          class="catalog-content"
          classList={{ "catalog-content--tree": viewMode() === "tree" }}
        >
          <Show
            when={showCompareDoc()}
            fallback={
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
              <Suspense fallback={<p class="catalog-canvas-loading">Loading chapter map…</p>}>
                <Show
                  when={mermaidData()}
                  fallback={<p class="catalog-canvas-loading">Loading chapter map…</p>}
                >
                  {(diagram) => <CatalogMermaidView diagram={diagram()} />}
                </Show>
              </Suspense>
            </Show>
          </Show>
            }
          >
            <CatalogCompareDoc />
          </Show>
        </div>
      </div>
    </div>
  );
}
