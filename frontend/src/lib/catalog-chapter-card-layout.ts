import type { CatalogChapter } from "../../../data/catalog.types";
import { renderCatalogChapterCardElement } from "../components/catalog-chapter-card";

export const MAP_CARD_NODE_WIDTH = 300;

/** Slack for json-canvas-viewer overlay rounding and border. */
const MAP_NODE_HEIGHT_FUDGE = 10;

let measureHost: HTMLElement | null = null;

function getMeasureHost(): HTMLElement {
  if (!measureHost) {
    const host = document.createElement("div");
    host.className = "catalog-canvas catalog-map-measure-host";
    host.setAttribute("aria-hidden", "true");
    Object.assign(host.style, {
      position: "fixed",
      left: "-10000px",
      top: "0",
      opacity: "0",
      pointerEvents: "none",
      overflow: "visible",
    });
    document.body.appendChild(host);
    measureHost = host;
  }
  return measureHost;
}

function measureCardInShell(card: HTMLElement, nodeWidth: number): number {
  const shell = document.createElement("div");
  shell.className = "catalog-map-measure-shell";
  shell.style.width = `${nodeWidth}px`;
  card.style.width = "100%";
  shell.appendChild(card);
  getMeasureHost().replaceChildren(shell);
  return Math.ceil(card.scrollHeight) + MAP_NODE_HEIGHT_FUDGE;
}

/** Measure every visible chapter card (same markup as the map). */
export function measureAllMapChapterCardHeights(
  visible: Map<string, CatalogChapter>,
  nodeWidth: number,
  subjectId: string
): Map<string, number> {
  const heights = new Map<string, number>();
  if (typeof document === "undefined") {
    for (const [slug] of visible) {
      heights.set(slug, 200);
    }
    return heights;
  }

  for (const [slug, chapter] of visible) {
    const card = renderCatalogChapterCardElement(chapter, subjectId, "map");
    heights.set(slug, measureCardInShell(card, nodeWidth));
  }

  return heights;
}

/** Heights from cards already mounted in the canvas viewer (ground truth). */
export function measureRenderedMapChapterCards(container: HTMLElement): Map<string, number> {
  const heights = new Map<string, number>();
  for (const card of container.querySelectorAll<HTMLElement>(".catalog-chapter-card--map")) {
    const slug = card.dataset.chapterSlug;
    if (!slug) continue;
    const measured = Math.ceil(card.scrollHeight) + MAP_NODE_HEIGHT_FUDGE;
    const prev = heights.get(slug) ?? 0;
    heights.set(slug, Math.max(prev, measured));
  }
  return heights;
}
