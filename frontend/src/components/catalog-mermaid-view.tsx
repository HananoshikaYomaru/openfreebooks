import { createEffect, onCleanup, onMount } from "solid-js";
import type { MermaidCatalogDiagram } from "../lib/catalog-to-mermaid";
import { siteCanvasTheme, watchSiteTheme } from "../lib/catalog-canvas-theme";
import { mermaidInitializeOptions } from "../lib/catalog-mermaid-theme";
import { enhanceStrandClusterHeaders } from "../lib/catalog-mermaid-strand-headers";

type CatalogMermaidViewProps = {
  diagram: MermaidCatalogDiagram;
};

type MermaidModule = typeof import("mermaid");
type SvgPanZoomModule = typeof import("svg-pan-zoom");
const PAN_ZOOM_MIN = 0.3;
const PAN_ZOOM_MAX = 8;

export function CatalogMermaidView(props: CatalogMermaidViewProps) {
  let container!: HTMLDivElement;
  let renderedSvg: SVGSVGElement | undefined;

  let panZoom: SvgPanZoom.Instance | undefined;
  let resizeObserver: ResizeObserver | undefined;
  let renderGeneration = 0;
  let lastSource = "";
  let lastTheme: "light" | "dark" = siteCanvasTheme();
  let mermaidModule: MermaidModule["default"] | undefined;
  let svgPanZoomModule: SvgPanZoomModule | undefined;

  const disposePanZoom = () => {
    panZoom?.destroy();
    panZoom = undefined;
  };

  const ensureModules = async () => {
    if (!mermaidModule || !svgPanZoomModule) {
      const [mermaidImport, svgPanZoomImport] = await Promise.all([
        import("mermaid"),
        import("svg-pan-zoom"),
      ]);
      const svgPanZoomFromDefault = (
        svgPanZoomImport as unknown as {
          default?: SvgPanZoomModule;
        }
      ).default;
      const svgPanZoom = svgPanZoomFromDefault ?? (svgPanZoomImport as unknown as SvgPanZoomModule);
      const mermaid = mermaidImport.default;
      mermaidModule = mermaid;
      svgPanZoomModule = svgPanZoom;
    }
  };

  const fitWholeBoard = () => {
    if (!panZoom) return;
    panZoom.updateBBox();
    panZoom.resize();
    panZoom.fit();
    panZoom.contain();
    panZoom.center();
  };

  const waitForContainerLayout = (el: HTMLElement): Promise<void> =>
    new Promise((resolve) => {
      const check = () => {
        if (el.clientWidth > 1 && el.clientHeight > 1) {
          resolve();
          return;
        }
        requestAnimationFrame(check);
      };
      check();
    });

  const renderDiagram = async () => {
    const source = props.diagram.source;
    const theme = siteCanvasTheme();
    if (!container || (source === lastSource && theme === lastTheme)) return;
    lastSource = source;
    lastTheme = theme;

    const generation = ++renderGeneration;
    disposePanZoom();
    renderedSvg = undefined;

    await ensureModules();
    if (generation !== renderGeneration || !mermaidModule || !svgPanZoomModule) return;

    mermaidModule.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      ...mermaidInitializeOptions(theme),
      flowchart: {
        htmlLabels: true,
        curve: "monotoneY",
        nodeSpacing: 70,
        rankSpacing: 95,
      },
    });

    const { svg, bindFunctions } = await mermaidModule.render(
      `catalog-mermaid-${generation}`,
      source
    );
    if (generation !== renderGeneration) return;

    container.innerHTML = svg;
    bindFunctions?.(container);

    renderedSvg = container.querySelector<SVGSVGElement>("svg") ?? undefined;
    if (!renderedSvg) return;
    renderedSvg.classList.add("catalog-mermaid-view__svg");
    renderedSvg.removeAttribute("style");
    renderedSvg.style.height = "100%";
    renderedSvg.style.width = "100%";

    enhanceStrandClusterHeaders(renderedSvg, theme);

    panZoom = svgPanZoomModule(renderedSvg, {
      zoomEnabled: true,
      panEnabled: true,
      controlIconsEnabled: false,
      fit: true,
      center: true,
      minZoom: PAN_ZOOM_MIN,
      maxZoom: PAN_ZOOM_MAX,
      dblClickZoomEnabled: true,
      mouseWheelZoomEnabled: true,
    });

    await waitForContainerLayout(container);
    if (document.fonts) {
      await document.fonts.ready;
    }
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
    if (generation !== renderGeneration) return;
    fitWholeBoard();
  };

  onMount(() => {
    void renderDiagram();

    const stopThemeWatch = watchSiteTheme(() => {
      void renderDiagram();
    });

    resizeObserver = new ResizeObserver(() => {
      fitWholeBoard();
    });
    resizeObserver.observe(container);

    onCleanup(() => {
      renderGeneration += 1;
      stopThemeWatch();
      resizeObserver?.disconnect();
      resizeObserver = undefined;
      disposePanZoom();
      renderedSvg = undefined;
    });
  });

  createEffect(() => {
    props.diagram.source;
    void renderDiagram();
  });

  const resetView = () => {
    if (!panZoom) return;
    panZoom.reset();
    fitWholeBoard();
  };

  const zoomIn = () => {
    panZoom?.zoomIn();
  };

  const zoomOut = () => {
    panZoom?.zoomOut();
  };

  const resolveRootNode = (): SVGGElement | null => {
    if (!renderedSvg || !props.diagram.rootNodeId) return null;
    const escapedRootNodeId =
      globalThis.CSS && typeof globalThis.CSS.escape === "function"
        ? globalThis.CSS.escape(props.diagram.rootNodeId)
        : props.diagram.rootNodeId.replaceAll(/["\\]/g, "\\$&");
    return (
      renderedSvg.querySelector<SVGGElement>(`g.node[data-id="${escapedRootNodeId}"]`) ??
      renderedSvg.querySelector<SVGGElement>(`g.node#${escapedRootNodeId}`) ??
      renderedSvg.querySelector<SVGGElement>(`g[id*="${escapedRootNodeId}"]`)
    );
  };

  const zoomToRoot = () => {
    if (!panZoom || !renderedSvg || !props.diagram.rootNodeId) {
      console.log("[catalog-mermaid] zoomToRoot fallback", {
        hasPanZoom: Boolean(panZoom),
        hasSvg: Boolean(renderedSvg),
        rootNodeId: props.diagram.rootNodeId,
        reason: "missing prerequisites",
      });
      resetView();
      return;
    }

    const rootNode = resolveRootNode();
    if (!rootNode) {
      console.log("[catalog-mermaid] zoomToRoot fallback", {
        rootNodeId: props.diagram.rootNodeId,
        reason: "root node not found in SVG",
      });
      resetView();
      return;
    }

    panZoom.updateBBox();
    panZoom.resize();

    const rootBounds = rootNode.getBBox();
    const sizes = panZoom.getSizes();
    const finiteOr = (value: number, fallback: number): number =>
      Number.isFinite(value) ? value : fallback;
    const viewportWidth = finiteOr(sizes.width, container.clientWidth);
    const viewportHeight = finiteOr(sizes.height, container.clientHeight);
    const minZoom = PAN_ZOOM_MIN;
    const maxZoom = Math.max(PAN_ZOOM_MAX, minZoom);
    const currentZoom = finiteOr(panZoom.getZoom(), finiteOr(sizes.realZoom, 1));
    const rootWidth = Math.max(finiteOr(rootBounds.width, 0), 1);
    const rootHeight = Math.max(finiteOr(rootBounds.height, 0), 1);

    // Treat viewport as a 5x5 grid and place root at top-middle cell center.
    const gridColumns = 5;
    const gridRows = 5;
    const cellWidth = viewportWidth / gridColumns;
    const cellHeight = viewportHeight / gridRows;
    const targetViewportX = cellWidth * 2.5;
    const targetViewportY = cellHeight * 0.5;

    // Fit root node within a single grid cell with some breathing room.
    const cellFitPadding = 0.8;
    const zoomToFitCellX = (cellWidth * cellFitPadding) / rootWidth;
    const zoomToFitCellY = (cellHeight * cellFitPadding) / rootHeight;
    const rootRectBeforeZoom = rootNode.getBoundingClientRect();
    const currentRootScreenHeight = Math.max(finiteOr(rootRectBeforeZoom.height, 0), 1);
    const targetRootScreenHeight = viewportHeight / 4;
    const magnification = targetRootScreenHeight / currentRootScreenHeight;
    const rawTargetZoom = currentZoom * magnification;
    const rootZoomFloor = Math.min(maxZoom, Math.max(minZoom, 1));
    const targetZoom = Math.min(maxZoom, Math.max(rootZoomFloor, rawTargetZoom));

    if (!Number.isFinite(targetZoom) || targetZoom <= 0) {
      console.log("[catalog-mermaid] zoomToRoot fallback", {
        rootNodeId: props.diagram.rootNodeId,
        reason: "non-finite targetZoom",
        targetZoom,
      });
      resetView();
      return;
    }

    console.log("[catalog-mermaid] zoomToRoot", {
      rootNodeId: props.diagram.rootNodeId,
      rootNodeDomId: rootNode.id,
      rootNodeDataId: rootNode.getAttribute("data-id"),
      rootBounds: {
        x: rootBounds.x,
        y: rootBounds.y,
        width: rootBounds.width,
        height: rootBounds.height,
      },
      viewport: {
        width: viewportWidth,
        height: viewportHeight,
        minZoom,
        maxZoom,
        currentZoom,
      },
      grid: {
        columns: gridColumns,
        rows: gridRows,
        cellWidth,
        cellHeight,
        targetViewportX,
        targetViewportY,
      },
      zoom: {
        zoomToFitCellX,
        zoomToFitCellY,
        currentRootScreenHeight,
        targetRootScreenHeight,
        magnification,
        rawTargetZoom,
        rootZoomFloor,
        zoomMode: "root-height-quarter-viewport",
        targetZoom,
      },
      targetViewport: {
        x: targetViewportX,
        y: targetViewportY,
      },
    });

    panZoom.zoom(targetZoom);

    requestAnimationFrame(() => {
      if (!panZoom) return;

      const containerRect = container.getBoundingClientRect();
      const rootRect = rootNode.getBoundingClientRect();
      const rootCenterScreenX = rootRect.left + rootRect.width / 2;
      const rootCenterScreenY = rootRect.top + rootRect.height / 2;
      const targetScreenX = containerRect.left + targetViewportX;
      const targetScreenY = containerRect.top + targetViewportY;
      const deltaX = targetScreenX - rootCenterScreenX;
      const deltaY = targetScreenY - rootCenterScreenY;

      if (!Number.isFinite(deltaX) || !Number.isFinite(deltaY)) {
        console.log("[catalog-mermaid] zoomToRoot fallback", {
          rootNodeId: props.diagram.rootNodeId,
          reason: "non-finite delta pan",
          deltaX,
          deltaY,
        });
        resetView();
        return;
      }

      const currentPan = panZoom.getPan();
      const nextPan = {
        x: currentPan.x + deltaX,
        y: currentPan.y + deltaY,
      };
      if (!Number.isFinite(nextPan.x) || !Number.isFinite(nextPan.y)) {
        console.log("[catalog-mermaid] zoomToRoot fallback", {
          rootNodeId: props.diagram.rootNodeId,
          reason: "non-finite next pan",
          nextPan,
        });
        resetView();
        return;
      }

      panZoom.pan(nextPan);
      console.log("[catalog-mermaid] zoomToRoot applied", {
        targetZoom,
        currentPan,
        nextPan,
        targetScreen: { x: targetScreenX, y: targetScreenY },
        rootCenterScreen: { x: rootCenterScreenX, y: rootCenterScreenY },
        delta: { x: deltaX, y: deltaY },
      });
    });
  };

  const snapshotView = () => {
    if (!panZoom || !renderedSvg) {
      console.log("[catalog-mermaid] snapshot fallback", {
        hasPanZoom: Boolean(panZoom),
        hasSvg: Boolean(renderedSvg),
        reason: "missing prerequisites",
      });
      return;
    }

    panZoom.updateBBox();
    panZoom.resize();

    const finiteOr = (value: number, fallback: number): number =>
      Number.isFinite(value) ? value : fallback;
    const sizes = panZoom.getSizes();
    const viewportWidth = finiteOr(sizes.width, container.clientWidth);
    const viewportHeight = finiteOr(sizes.height, container.clientHeight);
    const minZoom = PAN_ZOOM_MIN;
    const maxZoom = Math.max(PAN_ZOOM_MAX, minZoom);
    const currentZoom = finiteOr(panZoom.getZoom(), finiteOr(sizes.realZoom, 1));
    const currentPan = panZoom.getPan();
    const rootNode = resolveRootNode();
    const rootBounds = rootNode?.getBBox();

    let desired: Record<string, unknown> | null = null;
    if (rootNode && rootBounds) {
      const rootWidth = Math.max(finiteOr(rootBounds.width, 0), 1);
      const rootHeight = Math.max(finiteOr(rootBounds.height, 0), 1);
      const cellWidth = viewportWidth / 5;
      const cellHeight = viewportHeight / 5;
      const targetViewportX = cellWidth * 2.5;
      const targetViewportY = cellHeight * 0.5;
      const zoomToFitCellX = (cellWidth * 0.8) / rootWidth;
      const zoomToFitCellY = (cellHeight * 0.8) / rootHeight;
      const currentRootScreenHeight = Math.max(finiteOr(rootNode.getBoundingClientRect().height, 0), 1);
      const targetRootScreenHeight = viewportHeight / 4;
      const magnification = targetRootScreenHeight / currentRootScreenHeight;
      const rawTargetZoom = currentZoom * magnification;
      const rootZoomFloor = Math.min(maxZoom, Math.max(minZoom, 1));
      const targetZoom = Math.min(maxZoom, Math.max(rootZoomFloor, rawTargetZoom));
      const containerRect = container.getBoundingClientRect();
      const rootRect = rootNode.getBoundingClientRect();
      const rootCenterScreenX = rootRect.left + rootRect.width / 2;
      const rootCenterScreenY = rootRect.top + rootRect.height / 2;
      const targetScreenX = containerRect.left + targetViewportX;
      const targetScreenY = containerRect.top + targetViewportY;
      const deltaX = targetScreenX - rootCenterScreenX;
      const deltaY = targetScreenY - rootCenterScreenY;
      desired = {
        targetZoom,
        targetPanFromCurrent: {
          x: currentPan.x + deltaX,
          y: currentPan.y + deltaY,
        },
        targetScreen: {
          x: targetScreenX,
          y: targetScreenY,
        },
        rootCenterScreen: {
          x: rootCenterScreenX,
          y: rootCenterScreenY,
        },
        deltaPan: {
          x: deltaX,
          y: deltaY,
        },
        currentRootScreenHeight,
        targetRootScreenHeight,
        magnification,
        rawTargetZoom,
        rootZoomFloor,
        zoomToFitCellX,
        zoomToFitCellY,
        zoomMode: "root-height-quarter-viewport",
        grid: {
          columns: 5,
          rows: 5,
          targetViewportX,
          targetViewportY,
          cellWidth,
          cellHeight,
        },
      };
    }

    console.log("[catalog-mermaid] snapshot", {
      rootNodeId: props.diagram.rootNodeId,
      rootNodeDomId: rootNode?.id ?? null,
      rootNodeDataId: rootNode?.getAttribute("data-id") ?? null,
      rootBounds: rootBounds
        ? {
            x: rootBounds.x,
            y: rootBounds.y,
            width: rootBounds.width,
            height: rootBounds.height,
          }
        : null,
      actual: {
        viewport: {
          width: viewportWidth,
          height: viewportHeight,
          minZoom,
          maxZoom,
        },
        zoom: currentZoom,
        pan: currentPan,
      },
      desired,
      svg: {
        viewBox: renderedSvg.getAttribute("viewBox"),
        width: renderedSvg.getAttribute("width"),
        height: renderedSvg.getAttribute("height"),
      },
    });
  };

  return (
    <div class="catalog-mermaid-stage">
      <div
        ref={container}
        class="catalog-mermaid-view"
        role="application"
        aria-label="Chapter map (Mermaid)"
      />
      <div class="catalog-mermaid-controls">
        <button type="button" class="catalog-mermaid-controls__btn" onClick={zoomOut}>
          Zoom out
        </button>
        <button type="button" class="catalog-mermaid-controls__btn" onClick={zoomIn}>
          Zoom in
        </button>
        <button type="button" class="catalog-mermaid-controls__btn" onClick={resetView}>
          Reset view
        </button>
        <button type="button" class="catalog-mermaid-controls__btn" onClick={zoomToRoot}>
          Zoom to root
        </button>
        {/* hidden for now, as we don't have a use case for it yet */}
        <button type="button" class="catalog-mermaid-controls__btn" onClick={snapshotView} style="display: none;">
          Snapshot
        </button>
      </div>
    </div>
  );
}
