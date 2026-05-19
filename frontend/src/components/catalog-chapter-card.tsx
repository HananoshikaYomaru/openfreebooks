import { For, Show } from "solid-js";
import type { CatalogChapter } from "../../../data/catalog.types";
import { curriculumBadgeClass } from "../lib/catalog-badge";

export type CatalogChapterCardProps = {
  chapter: CatalogChapter;
  subjectId: string;
  index?: number;
  variant?: "list" | "map";
};

function chapterHref(subjectId: string, slug: string): string {
  return `/${subjectId}/${slug}/`;
}

function appendMeta(parent: HTMLElement, chapter: CatalogChapter) {
  const meta = document.createElement("div");
  meta.className = "catalog-chapter-card__meta";

  for (const curriculum of chapter.curriculums) {
    const badge = document.createElement("span");
    badge.className = `catalog-badge ${curriculumBadgeClass(curriculum)}`;
    badge.textContent = curriculum;
    meta.appendChild(badge);
  }

  if (chapter.status === "planned") {
    const soon = document.createElement("span");
    soon.className = "book-chapter-badge book-chapter-badge--planned";
    soon.textContent = "Coming soon";
    meta.appendChild(soon);
  }

  parent.appendChild(meta);
}

function appendMapTitle(
  body: HTMLElement,
  chapter: CatalogChapter,
  subjectId: string
) {
  const heading = document.createElement("h3");
  heading.className = "catalog-chapter-card__title";

  if (chapter.status === "live") {
    const link = document.createElement("a");
    link.className = "catalog-chapter-card__title-link";
    link.href = chapterHref(subjectId, chapter.slug);
    link.addEventListener("click", (event) => event.stopPropagation());

    const text = document.createElement("span");
    text.className = "catalog-chapter-card__title-text";
    text.textContent = chapter.title;

    const arrow = document.createElement("span");
    arrow.className = "catalog-chapter-card__title-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";

    link.append(text, arrow);
    heading.appendChild(link);
  } else {
    heading.textContent = chapter.title;
  }

  body.appendChild(heading);
}

/** DOM builder for json-canvas-viewer `nodeComponents.text` (same markup/classes as list view). */
export function renderCatalogChapterCardElement(
  chapter: CatalogChapter,
  subjectId: string,
  variant: "list" | "map" = "map"
): HTMLElement {
  const root = document.createElement("div");
  root.className = [
    "catalog-chapter-card",
    variant === "map" ? "catalog-chapter-card--map" : "",
    chapter.status === "planned" ? "catalog-chapter-card--planned" : "",
  ]
    .filter(Boolean)
    .join(" ");
  root.dataset.chapterSlug = chapter.slug;

  const body = document.createElement("div");
  body.className = "catalog-chapter-card__body";

  if (variant === "map") {
    appendMapTitle(body, chapter, subjectId);
  } else {
    const title = document.createElement("h3");
    title.className = "catalog-chapter-card__title";
    title.textContent = chapter.title;
    body.appendChild(title);
  }

  if (chapter.description) {
    const description = document.createElement("p");
    description.className = "catalog-chapter-card__description";
    description.textContent = chapter.description;
    body.appendChild(description);
  }

  appendMeta(body, chapter);
  root.appendChild(body);

  return root;
}

function MapChapterTitle(props: {
  chapter: CatalogChapter;
  subjectId: string;
}) {
  return (
    <h3 class="catalog-chapter-card__title">
      <Show
        when={props.chapter.status === "live"}
        fallback={props.chapter.title}
      >
        <a class="catalog-chapter-card__title-link" href={chapterHref(props.subjectId, props.chapter.slug)}>
          <span class="catalog-chapter-card__title-text">{props.chapter.title}</span>
          <span class="catalog-chapter-card__title-arrow" aria-hidden="true">
            →
          </span>
        </a>
      </Show>
    </h3>
  );
}

export function CatalogChapterCard(props: CatalogChapterCardProps) {
  const variant = () => props.variant ?? "list";
  const href = () => chapterHref(props.subjectId, props.chapter.slug);
  const number = () =>
    props.index === undefined ? undefined : String(props.index + 1).padStart(2, "0");

  const inner = (
    <div class="catalog-chapter-card__body">
      <Show when={variant() === "list" && number()}>
        <div class="catalog-chapter-card__main">
          <span class="catalog-chapter-card__number">{number()}</span>
          <h3 class="catalog-chapter-card__title">{props.chapter.title}</h3>
        </div>
      </Show>
      <Show when={variant() === "map"}>
        <MapChapterTitle chapter={props.chapter} subjectId={props.subjectId} />
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
        <Show when={props.chapter.status === "planned"}>
          <span class="book-chapter-badge book-chapter-badge--planned">Coming soon</span>
        </Show>
      </div>
    </div>
  );

  return (
    <Show
      when={props.chapter.status === "live" && variant() === "list"}
      fallback={
        <div
          class="catalog-chapter-card"
          classList={{
            "catalog-chapter-card--map": variant() === "map",
            "catalog-chapter-card--planned": props.chapter.status === "planned",
          }}
          data-chapter-slug={props.chapter.slug}
        >
          {inner}
        </div>
      }
    >
      <a
        class="catalog-chapter-card"
        href={href()}
        data-chapter-slug={props.chapter.slug}
      >
        {inner}
      </a>
    </Show>
  );
}
