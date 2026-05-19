import { createMemo, createSignal, For, Show } from "solid-js";
import type { CatalogChapter, CatalogData, CatalogStrand, CatalogSubject } from "../../../data/catalog.types";

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

function curriculumBadgeClass(curriculum: string): string {
  const map: Record<string, string> = {
    DSE: "catalog-badge--dse",
    IB: "catalog-badge--ib",
    "A-Level": "catalog-badge--a-level",
    AP: "catalog-badge--ap",
    IGCSE: "catalog-badge--igcse",
  };
  return map[curriculum] ?? "catalog-badge--default";
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

function syncSubjectUrl(subjectId: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("subject", subjectId);
  window.history.replaceState(null, "", url);
}

export function CatalogApp() {
  const data = readCatalogData();
  if (!data) {
    return <p class="catalog-error">Catalog data could not be loaded.</p>;
  }

  const [currentSubjectId, setCurrentSubjectId] = createSignal(initialSubjectId(data.subjects));
  const [activeFilters, setActiveFilters] = createSignal<Set<string>>(new Set());

  const currentSubject = createMemo(
    () => data.subjects.find((s) => s.id === currentSubjectId()) ?? data.subjects[0]
  );

  const visibleCount = createMemo(() => countVisibleChapters(currentSubject(), activeFilters()));

  const hasChapterTree = createMemo(() => currentSubject().strands.length > 0);

  const statsLabel = createMemo(() => {
    const count = visibleCount();
    const filters = activeFilters();
    const filterText =
      filters.size === 0 ? "all" : `filtered (${Array.from(filters).join(", ")})`;
    return `Showing ${count} ${filterText} chapter${count === 1 ? "" : "s"}`;
  });

  const selectSubject = (subjectId: string) => {
    setCurrentSubjectId(subjectId);
    syncSubjectUrl(subjectId);
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
    <div class="catalog-shell">
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
          <div class="catalog-header__intro">
            <h1 class="catalog-header__title">{currentSubject().name}</h1>
            <p class="catalog-header__stats">{statsLabel()}</p>
          </div>
          <div class="catalog-filters-wrap">
            <p class="catalog-filters__label">Filter by curriculum</p>
            <div class="catalog-filters" role="group" aria-label="Curriculum filters">
              <button
                type="button"
                class="catalog-filter-btn"
                classList={{ "is-active": activeFilters().size === 0 }}
                onClick={() => toggleFilter("ALL")}
              >
                All
              </button>
              <For each={data.curriculums}>
                {(curriculum) => (
                  <button
                    type="button"
                    class="catalog-filter-btn"
                    classList={{ "is-active": activeFilters().has(curriculum) }}
                    onClick={() => toggleFilter(curriculum)}
                  >
                    {curriculum}
                  </button>
                )}
              </For>
            </div>
          </div>
        </header>

        <div class="catalog-content">
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
                          <ChapterCard chapter={chapter} index={index()} />
                        </li>
                      )}
                    </For>
                  </ol>
                </section>
              )}
            </For>
          </Show>
        </div>
      </div>
    </div>
  );
}

function ChapterCard(props: { chapter: CatalogChapter; index: number }) {
  const number = () => String(props.index + 1).padStart(2, "0");

  const inner = (
    <>
      <div class="catalog-chapter-card__main">
        <span class="catalog-chapter-card__number">{number()}</span>
        <span class="catalog-chapter-card__title">{props.chapter.title}</span>
      </div>
      <div class="catalog-chapter-card__meta">
        <For each={props.chapter.curriculums}>
          {(curriculum) => (
            <span class={`catalog-badge ${curriculumBadgeClass(curriculum)}`}>{curriculum}</span>
          )}
        </For>
        <Show when={props.chapter.status === "planned"}>
          <span class="book-chapter-badge book-chapter-badge--planned">Coming soon</span>
        </Show>
      </div>
    </>
  );

  return (
    <Show
      when={props.chapter.status === "live"}
      fallback={<div class="catalog-chapter-card catalog-chapter-card--planned">{inner}</div>}
    >
      <a class="catalog-chapter-card" href={`/math/${props.chapter.slug}/`}>
        {inner}
      </a>
    </Show>
  );
}
