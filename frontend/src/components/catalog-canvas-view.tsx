import { createEffect, onCleanup, onMount } from "solid-js";
import type {
  JSONCanvas,
  JSONCanvasTextNode,
  JSONCanvasViewerInterface,
} from "json-canvas-viewer";
import {
  JSONCanvasViewer,
  MistouchPreventer,
  Controls,
  Minimap,
  parser,
} from "json-canvas-viewer";
import type { CatalogChapter } from "../../../data/catalog.types";
import { renderCatalogChapterCardElement } from "./catalog-chapter-card";
import { chapterSlugFromNodeId, relayoutCanvasChapterHeights } from "../lib/catalog-to-canvas";
import { measureRenderedMapChapterCards } from "../lib/catalog-chapter-card-layout";
import {
  syncViewerTheme,
  VIEWER_THEME_COLORS,
  siteCanvasTheme,
  watchSiteTheme,
} from "../lib/catalog-canvas-theme";

type CatalogCanvasViewProps = {
  canvas: JSONCanvas;
  subjectId: string;
  chapters: Record<string, CatalogChapter>;
};

function serializeCanvas(canvas: JSONCanvas): string {
  return JSON.stringify(canvas);
}

function waitForLayout(el: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const check = () => {
      if (el.clientWidth >= 1 && el.clientHeight >= 1) {
        resolve();
        return;
      }
      requestAnimationFrame(check);
    };
    check();
  });
}

function bindPageScrollWheel(container: HTMLElement): () => void {
  const onWheel = (event: WheelEvent) => {
    if (event.ctrlKey || event.metaKey) return;
    event.stopPropagation();
  };
  container.addEventListener("wheel", onWheel, { capture: true, passive: true });
  return () => container.removeEventListener("wheel", onWheel, { capture: true });
}

function waitForFrames(count = 2): Promise<void> {
  return new Promise((resolve) => {
    let remaining = count;
    const step = () => {
      remaining -= 1;
      if (remaining <= 0) {
        resolve();
        return;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

function buildNodeComponents(
  subjectId: string,
  chapters: Record<string, CatalogChapter>
) {
  return {
    text: ({
      container,
      node,
    }: {
      container: HTMLDivElement;
      node: JSONCanvasTextNode;
    }) => {
      const slug = chapterSlugFromNodeId(node.id);
      if (!slug) return;
      const chapter = chapters[slug];
      if (!chapter) return;
      container.replaceChildren();
      container.appendChild(renderCatalogChapterCardElement(chapter, subjectId, "map"));
    },
  };
}

export function CatalogCanvasView(props: CatalogCanvasViewProps) {
  let container!: HTMLDivElement;
  let viewer: JSONCanvasViewerInterface | undefined;
  let lastSerialized = "";
  let loadGeneration = 0;
  let unbindWheel: (() => void) | undefined;

  const chaptersKey = (chapters: Record<string, CatalogChapter>) =>
    JSON.stringify(
      Object.entries(chapters).map(([slug, ch]) => [slug, ch.title, ch.description, ch.status])
    );

  const loadCanvas = async (canvas: JSONCanvas, chapters: Record<string, CatalogChapter>) => {
    const cacheKey = `${serializeCanvas(canvas)}|${chaptersKey(chapters)}`;
    if (!viewer || cacheKey === lastSerialized) return;

    const generation = ++loadGeneration;

    await waitForLayout(container);
    if (generation !== loadGeneration || !viewer) return;

    lastSerialized = cacheKey;
    viewer.load({ canvas });
    syncViewerTheme(viewer);

    await waitForFrames();
    if (generation !== loadGeneration || !viewer) return;

    const measured = measureRenderedMapChapterCards(container);
    const fitted = relayoutCanvasChapterHeights(canvas, measured);
    if (!fitted) return;

    const fittedKey = `${serializeCanvas(fitted)}|${chaptersKey(chapters)}`;
    if (fittedKey === lastSerialized) return;

    lastSerialized = fittedKey;
    viewer.load({ canvas: fitted });
    syncViewerTheme(viewer);
  };

  onMount(() => {
    let stopThemeWatch: (() => void) | undefined;

    unbindWheel = bindPageScrollWheel(container);

    viewer = new JSONCanvasViewer(
      {
        container,
        parser,
        theme: siteCanvasTheme(),
        colors: VIEWER_THEME_COLORS,
        loading: "none",
        preventMistouchAtStart: false,
        mistouchPreventerBannerText: "Click the map to pan and zoom",
        minimapCollapsed: true,
        nodeComponents: buildNodeComponents(props.subjectId, props.chapters),
      },
      [MistouchPreventer, Controls, Minimap]
    );

    stopThemeWatch = watchSiteTheme(() => syncViewerTheme(viewer));

    void loadCanvas(props.canvas, props.chapters);

    onCleanup(() => {
      loadGeneration += 1;
      stopThemeWatch?.();
      unbindWheel?.();
      unbindWheel = undefined;
      viewer?.dispose();
      viewer = undefined;
      lastSerialized = "";
    });
  });

  createEffect(() => {
    if (!viewer) return;
    viewer.options.nodeComponents = buildNodeComponents(
      props.subjectId,
      props.chapters
    );
    void loadCanvas(props.canvas, props.chapters);
  });

  return (
    <div ref={container} class="catalog-canvas-view" role="application" aria-label="Chapter map" />
  );
}
