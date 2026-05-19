import { createEffect, onCleanup, onMount } from "solid-js";
import type { MermaidCatalogDiagram } from "../lib/catalog-to-mermaid";
import { siteCanvasTheme, watchSiteTheme } from "../lib/catalog-canvas-theme";

type CatalogMermaidViewProps = {
  diagram: MermaidCatalogDiagram;
};

type MermaidModule = typeof import("mermaid");
type SvgPanZoomModule = typeof import("svg-pan-zoom")["default"];

export function CatalogMermaidView(props: CatalogMermaidViewProps) {
  let container!: HTMLDivElement;

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
      const [{ default: mermaid }, { default: svgPanZoom }] = await Promise.all([
        import("mermaid"),
        import("svg-pan-zoom"),
      ]);
      mermaidModule = mermaid;
      svgPanZoomModule = svgPanZoom;
    }
  };

  const renderDiagram = async () => {
    const source = props.diagram.source;
    const theme = siteCanvasTheme();
    if (!container || (source === lastSource && theme === lastTheme)) return;
    lastSource = source;
    lastTheme = theme;

    const generation = ++renderGeneration;
    disposePanZoom();

    await ensureModules();
    if (generation !== renderGeneration || !mermaidModule || !svgPanZoomModule) return;

    mermaidModule.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: theme === "dark" ? "dark" : "default",
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

    const renderedSvg = container.querySelector<SVGSVGElement>("svg");
    if (!renderedSvg) return;
    renderedSvg.classList.add("catalog-mermaid-view__svg");
    renderedSvg.removeAttribute("style");
    renderedSvg.style.height = "100%";
    renderedSvg.style.width = "100%";

    panZoom = svgPanZoomModule(renderedSvg, {
      zoomEnabled: true,
      panEnabled: true,
      controlIconsEnabled: false,
      fit: true,
      center: true,
      minZoom: 0.3,
      maxZoom: 8,
      dblClickZoomEnabled: true,
      mouseWheelZoomEnabled: true,
    });

    panZoom.resize();
    panZoom.fit();
    panZoom.center();
  };

  onMount(() => {
    void renderDiagram();

    const stopThemeWatch = watchSiteTheme(() => {
      void renderDiagram();
    });

    resizeObserver = new ResizeObserver(() => {
      panZoom?.resize();
      panZoom?.fit();
      panZoom?.center();
    });
    resizeObserver.observe(container);

    onCleanup(() => {
      renderGeneration += 1;
      stopThemeWatch();
      resizeObserver?.disconnect();
      resizeObserver = undefined;
      disposePanZoom();
    });
  });

  createEffect(() => {
    props.diagram.source;
    void renderDiagram();
  });

  const resetView = () => {
    if (!panZoom) return;
    panZoom.reset();
    panZoom.fit();
    panZoom.center();
  };

  const zoomIn = () => {
    panZoom?.zoomIn();
  };

  const zoomOut = () => {
    panZoom?.zoomOut();
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
      </div>
    </div>
  );
}
