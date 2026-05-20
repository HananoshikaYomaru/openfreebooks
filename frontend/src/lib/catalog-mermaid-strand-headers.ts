import {
  mermaidThemeVariables,
  type MermaidThemeMode,
} from "./catalog-mermaid-theme";

const SVG_NS = "http://www.w3.org/2000/svg";
/** Header band height — must fit title line-height + descenders inside foreignObject */
export const STRAND_HEADER_HEIGHT = 44;
const STRAND_HEADER_PAD_X = 16;

function applySvgFill(el: SVGGraphicsElement, fill: string): void {
  el.setAttribute("fill", fill);
  el.style.fill = fill;
}

export function isStrandClusterId(id: string): boolean {
  return id.includes("strand_");
}

export function isStrandCluster(cluster: SVGGElement): boolean {
  return isStrandClusterId(cluster.id ?? "");
}

/**
 * Mermaid subgraph titles are plain labels on the cluster border. Overlay a header band
 * and tuck the title into it (Cursor-style subgraph chrome).
 */
export function enhanceStrandClusterHeaders(
  svg: SVGSVGElement,
  mode: MermaidThemeMode = "light"
): void {
  const colors = mermaidThemeVariables(mode);
  const clusters = svg.querySelectorAll<SVGGElement>("g.cluster");
  for (const cluster of clusters) {
    if (!isStrandCluster(cluster)) continue;
    if (cluster.querySelector(".catalog-mermaid-strand-header")) continue;

    const frameRect = cluster.querySelector<SVGRectElement>(":scope > rect");
    const labelGroup = cluster.querySelector<SVGGElement>(":scope > g.cluster-label");
    if (!frameRect || !labelGroup) continue;

    const bbox = cluster.getBBox();
    if (bbox.width <= 0 || bbox.height <= 0) continue;

    cluster.classList.add("catalog-mermaid-strand-cluster");

    const header = document.createElementNS(SVG_NS, "rect");
    header.setAttribute("class", "catalog-mermaid-strand-header");
    header.setAttribute("x", String(bbox.x));
    header.setAttribute("y", String(bbox.y));
    header.setAttribute("width", String(bbox.width));
    header.setAttribute("height", String(STRAND_HEADER_HEIGHT));
    applySvgFill(header, colors.secondaryColor);

    const rule = document.createElementNS(SVG_NS, "line");
    rule.setAttribute("class", "catalog-mermaid-strand-header__rule");
    rule.setAttribute("x1", String(bbox.x));
    rule.setAttribute("y1", String(bbox.y + STRAND_HEADER_HEIGHT));
    rule.setAttribute("x2", String(bbox.x + bbox.width));
    rule.setAttribute("y2", String(bbox.y + STRAND_HEADER_HEIGHT));
    rule.setAttribute("stroke", colors.clusterBorder);

    frameRect.classList.add("catalog-mermaid-strand-frame");
    applySvgFill(frameRect, colors.clusterBkg);
    frameRect.setAttribute("rx", "0");
    frameRect.setAttribute("ry", "0");
    frameRect.setAttribute("stroke", colors.clusterBorder);
    cluster.insertBefore(header, frameRect.nextSibling);
    cluster.insertBefore(rule, header.nextSibling);

    labelGroup.setAttribute("transform", `translate(${bbox.x}, ${bbox.y})`);

    const foreignObject = labelGroup.querySelector<SVGForeignObjectElement>("foreignObject");
    if (foreignObject) {
      foreignObject.setAttribute("class", "catalog-mermaid-strand-label-fo");
      foreignObject.setAttribute("overflow", "visible");
      foreignObject.setAttribute("width", String(Math.max(bbox.width, 120)));
      foreignObject.setAttribute("height", String(STRAND_HEADER_HEIGHT));
    }

    for (const el of labelGroup.querySelectorAll<HTMLElement>("div, span, p, header")) {
      el.style.overflow = "visible";
      el.style.border = "none";
      el.style.borderRadius = "0";
      el.style.background = "transparent";
      el.style.boxShadow = "none";
    }

    const labelRoot = labelGroup.querySelector<HTMLElement>("div");
    if (labelRoot) {
      labelRoot.style.height = `${STRAND_HEADER_HEIGHT}px`;
      labelRoot.style.width = "100%";
      labelRoot.style.boxSizing = "border-box";
      labelRoot.style.padding = `0 ${STRAND_HEADER_PAD_X}px`;
      labelRoot.style.display = "flex";
      labelRoot.style.alignItems = "center";
    }
  }
}
