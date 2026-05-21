import { createEffect, onCleanup, onMount } from "solid-js";
import type { MermaidCatalogDiagram } from "../lib/catalog-to-mermaid";
import { siteCanvasTheme, watchSiteTheme } from "../lib/catalog-canvas-theme";
import { mermaidInitializeOptions } from "../lib/catalog-mermaid-theme";
import { enhanceStrandClusterHeaders } from "../lib/catalog-mermaid-strand-headers";

type CatalogMermaidViewProps = {
  diagram: MermaidCatalogDiagram;
};

type MermaidModule = typeof import("mermaid");
type ViewBox = { x: number; y: number; width: number; height: number };

const ZOOM_MIN = 0.3;
const ZOOM_MAX = 8;
const ZOOM_STEP = 1.2;
const ROOT_ZOOM_MULTIPLIER = 2.2;

export function CatalogMermaidView(props: CatalogMermaidViewProps) {
  let container!: HTMLDivElement;
  let renderedSvg: SVGSVGElement | undefined;

  let resizeObserver: ResizeObserver | undefined;
  let renderGeneration = 0;
  let lastSource = "";
  let lastTheme: "light" | "dark" = siteCanvasTheme();
  let mermaidModule: MermaidModule["default"] | undefined;
  let baseViewBox: ViewBox | undefined;
  let currentViewBox: ViewBox | undefined;

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

  const parseViewBox = (svg: SVGSVGElement): ViewBox => {
    const raw = svg.getAttribute("viewBox");
    if (raw) {
      const nums = raw.split(/\s+/).map((value) => Number(value));
      if (nums.length === 4 && nums.every(Number.isFinite)) {
        return { x: nums[0], y: nums[1], width: nums[2], height: nums[3] };
      }
    }
    return {
      x: 0,
      y: 0,
      width: svg.viewBox.baseVal.width || svg.width.baseVal.value || 1000,
      height: svg.viewBox.baseVal.height || svg.height.baseVal.value || 1000,
    };
  };

  const applyViewBox = (next: ViewBox) => {
    if (!renderedSvg) return;
    currentViewBox = next;
    renderedSvg.setAttribute("viewBox", `${next.x} ${next.y} ${next.width} ${next.height}`);
  };

  const currentScale = (): number => {
    if (!baseViewBox || !currentViewBox || !currentViewBox.width) return 1;
    return baseViewBox.width / currentViewBox.width;
  };

  const clampScale = (scale: number): number => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, scale));

  const zoomAtClientPoint = (scaleFactor: number, clientX: number, clientY: number) => {
    if (!renderedSvg || !currentViewBox || !baseViewBox) return;
    const rect = container.getBoundingClientRect();
    if (rect.width <= 1 || rect.height <= 1) return;

    const oldScale = currentScale();
    const targetScale = clampScale(oldScale * scaleFactor);
    const effectiveFactor = targetScale / oldScale;
    if (!Number.isFinite(effectiveFactor) || effectiveFactor <= 0 || effectiveFactor === 1) return;

    const ux = (clientX - rect.left) / rect.width;
    const uy = (clientY - rect.top) / rect.height;
    const focalX = currentViewBox.x + ux * currentViewBox.width;
    const focalY = currentViewBox.y + uy * currentViewBox.height;

    const nextWidth = currentViewBox.width / effectiveFactor;
    const nextHeight = currentViewBox.height / effectiveFactor;
    const nextX = focalX - ux * nextWidth;
    const nextY = focalY - uy * nextHeight;

    applyViewBox({ x: nextX, y: nextY, width: nextWidth, height: nextHeight });
  };

  const panByPixels = (deltaX: number, deltaY: number) => {
    if (!currentViewBox) return;
    const rect = container.getBoundingClientRect();
    if (rect.width <= 1 || rect.height <= 1) return;

    const nextX = currentViewBox.x - deltaX * (currentViewBox.width / rect.width);
    const nextY = currentViewBox.y - deltaY * (currentViewBox.height / rect.height);
    applyViewBox({ ...currentViewBox, x: nextX, y: nextY });
  };

  const fitWholeBoard = () => {
    if (!baseViewBox) return;
    applyViewBox({ ...baseViewBox });
  };

  const ensureModules = async () => {
    if (!mermaidModule) {
      const mermaidImport = await import("mermaid");
      mermaidModule = mermaidImport.default;
    }
  };

  const resolveLiveHrefFromNode = (node: SVGGElement): string | null => {
    const byNodeId = props.diagram.liveNodeHrefById;
    const dataId = node.getAttribute("data-id");
    if (dataId && byNodeId[dataId]) return byNodeId[dataId];
    if (node.id && byNodeId[node.id]) return byNodeId[node.id];
    if (node.id) {
      for (const [key, href] of Object.entries(byNodeId)) {
        if (node.id.includes(key)) return href;
      }
    }
    return null;
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

  const renderDiagram = async () => {
    const source = props.diagram.source;
    const theme = siteCanvasTheme();
    if (!container || (source === lastSource && theme === lastTheme)) return;
    lastSource = source;
    lastTheme = theme;

    const generation = ++renderGeneration;
    renderedSvg = undefined;

    await ensureModules();
    if (generation !== renderGeneration || !mermaidModule) return;

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

    await waitForContainerLayout(container);
    if (document.fonts) {
      await document.fonts.ready;
    }
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
    if (generation !== renderGeneration || !renderedSvg) return;

    baseViewBox = parseViewBox(renderedSvg);
    fitWholeBoard();
  };

  const resetView = () => {
    fitWholeBoard();
  };

  const zoomIn = () => {
    const rect = container.getBoundingClientRect();
    zoomAtClientPoint(ZOOM_STEP, rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  const zoomOut = () => {
    const rect = container.getBoundingClientRect();
    zoomAtClientPoint(1 / ZOOM_STEP, rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  const zoomToRoot = () => {
    if (!baseViewBox || !renderedSvg) {
      resetView();
      return;
    }
    const rootNode = resolveRootNode();
    if (!rootNode) {
      resetView();
      return;
    }

    const box = rootNode.getBBox();
    if (!Number.isFinite(box.width) || !Number.isFinite(box.height) || box.width <= 0 || box.height <= 0) {
      resetView();
      return;
    }

    const targetScale = clampScale((baseViewBox.height / box.height) * (1 / ROOT_ZOOM_MULTIPLIER));
    const nextWidth = baseViewBox.width / targetScale;
    const nextHeight = baseViewBox.height / targetScale;
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    applyViewBox({
      x: centerX - nextWidth / 2,
      y: centerY - nextHeight / 2,
      width: nextWidth,
      height: nextHeight,
    });
  };

  onMount(() => {
    void renderDiagram();

    let pinchDistance = 0;
    let isTouchPanning = false;
    let hasTouchPanMoved = false;
    let suppressNextClick = false;
    let lastTouchX = 0;
    let lastTouchY = 0;
    let isMousePanning = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const onContainerClick = (event: MouseEvent) => {
      if (suppressNextClick) {
        suppressNextClick = false;
        return;
      }
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (target.closest("a[href]")) return;
      const node = target.closest("g.node");
      if (!(node instanceof SVGGElement)) return;
      const href = resolveLiveHrefFromNode(node);
      if (!href) return;
      window.location.assign(href);
    };

    const onWheel = (event: WheelEvent) => {
      const scaleFactor = Math.exp(-event.deltaY * 0.002);
      zoomAtClientPoint(scaleFactor, event.clientX, event.clientY);
      if (event.cancelable) event.preventDefault();
    };

    const onDblClick = (event: MouseEvent) => {
      zoomAtClientPoint(ZOOM_STEP, event.clientX, event.clientY);
      if (event.cancelable) event.preventDefault();
    };

    const onMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) return;
      isMousePanning = true;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      if (event.cancelable) event.preventDefault();
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isMousePanning) return;
      const deltaX = event.clientX - lastMouseX;
      const deltaY = event.clientY - lastMouseY;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      panByPixels(deltaX, deltaY);
      if (event.cancelable) event.preventDefault();
    };

    const onMouseUp = () => {
      isMousePanning = false;
    };

    const touchDistance = (touches: TouchList): number => {
      if (touches.length < 2) return 0;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.hypot(dx, dy);
    };

    const touchMidpoint = (touches: TouchList): { x: number; y: number } => ({
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    });

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length >= 2) {
        pinchDistance = touchDistance(event.touches);
        isTouchPanning = false;
        hasTouchPanMoved = false;
        if (event.cancelable) event.preventDefault();
        return;
      }
      if (event.touches.length === 1) {
        isTouchPanning = true;
        hasTouchPanMoved = false;
        pinchDistance = 0;
        lastTouchX = event.touches[0].clientX;
        lastTouchY = event.touches[0].clientY;
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length >= 2) {
        const nextDistance = touchDistance(event.touches);
        if (!pinchDistance || !nextDistance) {
          pinchDistance = nextDistance;
          if (event.cancelable) event.preventDefault();
          return;
        }

        const scaleDelta = nextDistance / pinchDistance;
        const midpoint = touchMidpoint(event.touches);
        if (Number.isFinite(scaleDelta) && scaleDelta > 0) {
          zoomAtClientPoint(scaleDelta, midpoint.x, midpoint.y);
        }
        pinchDistance = nextDistance;
        isTouchPanning = false;
        hasTouchPanMoved = true;
        if (event.cancelable) event.preventDefault();
        return;
      }

      if (!isTouchPanning || event.touches.length !== 1) return;
      const touch = event.touches[0];
      const deltaX = touch.clientX - lastTouchX;
      const deltaY = touch.clientY - lastTouchY;
      lastTouchX = touch.clientX;
      lastTouchY = touch.clientY;
      if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
        hasTouchPanMoved = true;
        panByPixels(deltaX, deltaY);
        if (event.cancelable) event.preventDefault();
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (event.touches.length >= 2) return;
      pinchDistance = 0;
      isTouchPanning = false;
      if (hasTouchPanMoved) {
        suppressNextClick = true;
      }
      hasTouchPanMoved = false;
    };

    const onGestureEvent = (event: Event) => {
      if (event.cancelable) event.preventDefault();
    };

    container.addEventListener("click", onContainerClick);
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("dblclick", onDblClick);
    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove, { passive: false });
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("touchstart", onTouchStart, { passive: false });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: true });
    container.addEventListener("touchcancel", onTouchEnd, { passive: true });
    container.addEventListener("gesturestart", onGestureEvent as EventListener, { passive: false });
    container.addEventListener("gesturechange", onGestureEvent as EventListener, { passive: false });
    container.addEventListener("gestureend", onGestureEvent as EventListener, { passive: false });

    const stopThemeWatch = watchSiteTheme(() => {
      void renderDiagram();
    });

    resizeObserver = new ResizeObserver(() => {
      fitWholeBoard();
    });
    resizeObserver.observe(container);

    onCleanup(() => {
      renderGeneration += 1;
      container.removeEventListener("click", onContainerClick);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("dblclick", onDblClick);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("touchcancel", onTouchEnd);
      container.removeEventListener("gesturestart", onGestureEvent as EventListener);
      container.removeEventListener("gesturechange", onGestureEvent as EventListener);
      container.removeEventListener("gestureend", onGestureEvent as EventListener);
      stopThemeWatch();
      resizeObserver?.disconnect();
      resizeObserver = undefined;
      renderedSvg = undefined;
      baseViewBox = undefined;
      currentViewBox = undefined;
    });
  });

  createEffect(() => {
    props.diagram.source;
    void renderDiagram();
  });

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
      </div>
    </div>
  );
}
