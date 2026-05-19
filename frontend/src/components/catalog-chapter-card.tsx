import { For, Show } from "solid-js";
import type { CatalogChapter } from "../../../data/catalog.types";
import { curriculumBadgeClass, tierBadgeLabel } from "../lib/catalog-badge";

export type CatalogChapterCardProps = {
  chapter: CatalogChapter;
  subjectId: string;
  index?: number;
};

function chapterHref(subjectId: string, slug: string): string {
  return `/${subjectId}/${slug}/`;
}

export function CatalogChapterCard(props: CatalogChapterCardProps) {
  const href = () => chapterHref(props.subjectId, props.chapter.slug);
  const number = () =>
    props.index === undefined ? undefined : String(props.index + 1).padStart(2, "0");

  const inner = (
    <div class="catalog-chapter-card__body">
      <Show when={number()}>
        <div class="catalog-chapter-card__main">
          <span class="catalog-chapter-card__number">{number()}</span>
          <h3 class="catalog-chapter-card__title">{props.chapter.title}</h3>
        </div>
      </Show>
      <Show when={props.chapter.description}>
        <p class="catalog-chapter-card__description">{props.chapter.description}</p>
      </Show>
      <div class="catalog-chapter-card__meta">
        <For each={props.chapter.curriculums}>
          {(curriculum) => (
            <span class={`catalog-badge ${curriculumBadgeClass(curriculum)}`}>{curriculum}</span>
          )}
        </For>
        <Show when={tierBadgeLabel(props.chapter.tier)}>
          {(label) => <span class="catalog-badge catalog-badge--extension">{label()}</span>}
        </Show>
        <Show when={props.chapter.status === "planned"}>
          <span class="book-chapter-badge book-chapter-badge--planned">Coming soon</span>
        </Show>
      </div>
    </div>
  );

  return (
    <Show
      when={props.chapter.status === "live"}
      fallback={
        <div
          class="catalog-chapter-card catalog-chapter-card--planned"
          data-chapter-slug={props.chapter.slug}
        >
          {inner}
        </div>
      }
    >
      <a class="catalog-chapter-card" href={href()} data-chapter-slug={props.chapter.slug}>
        {inner}
      </a>
    </Show>
  );
}
