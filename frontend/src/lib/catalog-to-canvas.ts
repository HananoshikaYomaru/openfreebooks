import type { JSONCanvas, JSONCanvasEdge, JSONCanvasNode } from "json-canvas-viewer";
import type {
  CatalogChapter,
  CatalogGraphEdge,
  CatalogSubject,
} from "../../../data/catalog.types";
import { canvasNodeColors } from "./catalog-canvas-theme";
import { measureAllMapChapterCardHeights } from "./catalog-chapter-card-layout";

export const CHAPTER_NODE_WIDTH = 300;
/** Horizontal gap between strand columns (groups must not overlap). */
export const STRAND_GAP_X = 112;
const GAP_Y = 48;
const GROUP_PAD = 28;

export function chapterNodeId(slug: string): string {
  return `chapter-${slug}`;
}

export function chapterSlugFromNodeId(nodeId: string): string | null {
  return nodeId.startsWith("chapter-") ? nodeId.slice("chapter-".length) : null;
}

function strandGroupId(strandId: string): string {
  return `strand-${strandId}`;
}

function collectVisibleChapters(
  subject: CatalogSubject,
  matches: (chapter: CatalogChapter) => boolean
): Map<string, CatalogChapter> {
  const map = new Map<string, CatalogChapter>();
  for (const strand of subject.strands) {
    for (const chapter of strand.chapters) {
      if (matches(chapter)) {
        map.set(chapter.slug, chapter);
      }
    }
  }
  return map;
}

function buildEdgeList(
  subject: CatalogSubject,
  visible: Map<string, CatalogChapter>
): CatalogGraphEdge[] {
  const seen = new Set<string>();
  const edges: CatalogGraphEdge[] = [];

  const add = (from: string, to: string, label?: string) => {
    if (!visible.has(from) || !visible.has(to)) return;
    const key = `${from}->${to}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push({ from, to, label });
  };

  for (const edge of subject.graph?.edges ?? []) {
    add(edge.from, edge.to, edge.label);
  }

  return edges;
}

function assertAcyclic(edges: CatalogGraphEdge[], slugs: Iterable<string>): void {
  const nodes = new Set(slugs);
  const adj = new Map<string, string[]>();
  for (const slug of nodes) {
    adj.set(slug, []);
  }
  for (const { from, to } of edges) {
    adj.get(from)?.push(to);
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();

  const visit = (node: string) => {
    if (visited.has(node)) return;
    if (visiting.has(node)) {
      throw new Error(`Catalog graph has a cycle involving "${node}"`);
    }
    visiting.add(node);
    for (const next of adj.get(node) ?? []) {
      visit(next);
    }
    visiting.delete(node);
    visited.add(node);
  };

  for (const node of nodes) {
    visit(node);
  }
}

/** Longest-path rank: level(to) >= level(from) + 1 for every required edge; roots at 0. */
function assignLevels(edges: CatalogGraphEdge[], slugs: string[]): Map<string, number> {
  const levels = new Map<string, number>();
  for (const slug of slugs) {
    levels.set(slug, 0);
  }

  for (let pass = 0; pass < slugs.length; pass++) {
    let changed = false;
    for (const { from, to } of edges) {
      const next = (levels.get(from) ?? 0) + 1;
      if (next > (levels.get(to) ?? 0)) {
        levels.set(to, next);
        changed = true;
      }
    }
    if (!changed) break;
  }

  return levels;
}

function yOffsetInColumn(level: number, levelRowHeights: Map<number, number>): number {
  let y = 0;
  for (let l = 0; l < level; l++) {
    y += (levelRowHeights.get(l) ?? 0) + GAP_Y;
  }
  return y;
}

type ChapterLayoutSlot = {
  slug: string;
  columnX: number;
  level: number;
  height: number;
  sortIndex: number;
};

/** Stack chapters that share a level within one strand column (avoids overlapping cards). */
function layoutChapterPositions(
  slots: ChapterLayoutSlot[]
): Map<string, { x: number; y: number; height: number }> {
  const byColumn = new Map<number, ChapterLayoutSlot[]>();
  for (const slot of slots) {
    const column = byColumn.get(slot.columnX) ?? [];
    column.push(slot);
    byColumn.set(slot.columnX, column);
  }

  const positions = new Map<string, { x: number; y: number; height: number }>();

  for (const [columnX, columnSlots] of byColumn) {
    const byLevel = new Map<number, ChapterLayoutSlot[]>();
    for (const slot of columnSlots) {
      const levelSlots = byLevel.get(slot.level) ?? [];
      levelSlots.push(slot);
      byLevel.set(slot.level, levelSlots);
    }

    const levelRowHeights = new Map<number, number>();
    for (const [level, levelSlots] of byLevel) {
      levelSlots.sort((a, b) => a.sortIndex - b.sortIndex);
      let rowHeight = 0;
      for (let i = 0; i < levelSlots.length; i++) {
        rowHeight += levelSlots[i].height;
        if (i < levelSlots.length - 1) rowHeight += GAP_Y;
      }
      levelRowHeights.set(level, rowHeight);
    }

    for (const [level, levelSlots] of byLevel) {
      levelSlots.sort((a, b) => a.sortIndex - b.sortIndex);
      let y = yOffsetInColumn(level, levelRowHeights);
      for (const slot of levelSlots) {
        positions.set(slot.slug, { x: columnX, y, height: slot.height });
        y += slot.height + GAP_Y;
      }
    }
  }

  return positions;
}

function buildStrandChapterOrder(subject: CatalogSubject): Map<string, number> {
  const order = new Map<string, number>();
  for (const strand of subject.strands) {
    strand.chapters.forEach((chapter, index) => {
      order.set(chapter.slug, index);
    });
  }
  return order;
}

function layoutNodes(
  subject: CatalogSubject,
  visible: Map<string, CatalogChapter>,
  edges: CatalogGraphEdge[]
): JSONCanvasNode[] {
  const slugs = [...visible.keys()];
  const levels = assignLevels(edges, slugs);

  const slugToStrandId = new Map<string, string>();
  const strandColumnX = new Map<string, number>();
  subject.strands.forEach((strand, index) => {
    strandColumnX.set(strand.id, index * (CHAPTER_NODE_WIDTH + STRAND_GAP_X));
    for (const chapter of strand.chapters) {
      slugToStrandId.set(chapter.slug, strand.id);
    }
  });

  const heightBySlug = measureAllMapChapterCardHeights(
    visible,
    CHAPTER_NODE_WIDTH,
    subject.id
  );

  const strandChapterOrder = buildStrandChapterOrder(subject);
  const slots: ChapterLayoutSlot[] = [];

  for (const [slug] of visible) {
    const strandId = slugToStrandId.get(slug);
    const columnX = strandId ? (strandColumnX.get(strandId) ?? 0) : 0;
    slots.push({
      slug,
      columnX,
      level: levels.get(slug) ?? 0,
      height: heightBySlug.get(slug) ?? 0,
      sortIndex: strandChapterOrder.get(slug) ?? 0,
    });
  }

  const positions = layoutChapterPositions(slots);

  const groups: JSONCanvasNode[] = [];
  const nodes: JSONCanvasNode[] = [];
  const colors = canvasNodeColors();

  for (const strand of subject.strands) {
    const strandSlugs = strand.chapters
      .map((ch) => ch.slug)
      .filter((slug) => visible.has(slug));
    if (strandSlugs.length === 0) continue;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const slug of strandSlugs) {
      const pos = positions.get(slug);
      if (!pos) continue;
      minX = Math.min(minX, pos.x);
      minY = Math.min(minY, pos.y);
      maxX = Math.max(maxX, pos.x + CHAPTER_NODE_WIDTH);
      maxY = Math.max(maxY, pos.y + pos.height);
    }

    if (!Number.isFinite(minX)) continue;

    groups.push({
      id: strandGroupId(strand.id),
      type: "group",
      label: strand.title,
      x: minX - GROUP_PAD,
      y: minY - GROUP_PAD,
      width: maxX - minX + GROUP_PAD * 2,
      height: maxY - minY + GROUP_PAD * 2,
      color: colors.groupBorder,
    });
  }

  for (const [slug, chapter] of visible) {
    const pos = positions.get(slug);
    if (!pos) continue;
    nodes.push({
      id: chapterNodeId(slug),
      type: "text",
      text: chapter.slug,
      x: pos.x,
      y: pos.y,
      width: CHAPTER_NODE_WIDTH,
      height: pos.height,
      color: chapter.status === "live" ? colors.live : colors.planned,
    });
  }

  return [...groups, ...nodes];
}

function toCanvasEdges(edgeList: CatalogGraphEdge[]): JSONCanvasEdge[] {
  const edgeColor = canvasNodeColors().edge;
  return edgeList.map((edge) => ({
    id: `edge-${edge.from}-${edge.to}`,
    fromNode: chapterNodeId(edge.from),
    toNode: chapterNodeId(edge.to),
    fromSide: "bottom",
    toSide: "top",
    toEnd: "arrow",
    label: edge.label,
    color: edgeColor,
  }));
}

function edgesFromCanvas(canvas: JSONCanvas): CatalogGraphEdge[] {
  const edges: CatalogGraphEdge[] = [];
  for (const edge of canvas.edges ?? []) {
    const from = chapterSlugFromNodeId(edge.fromNode);
    const to = chapterSlugFromNodeId(edge.toNode);
    if (!from || !to) continue;
    edges.push({ from, to, label: edge.label });
  }
  return edges;
}

/** Recompute chapter Y/height (and strand groups) after measuring rendered cards. */
export function relayoutCanvasChapterHeights(
  canvas: JSONCanvas,
  heightBySlug: Map<string, number>
): JSONCanvas | null {
  const canvasNodes = canvas.nodes ?? [];
  const chapterNodes = canvasNodes.filter(
    (node) => node.type === "text" && node.id.startsWith("chapter-")
  );
  if (chapterNodes.length === 0) return null;

  const slugs = chapterNodes
    .map((node) => chapterSlugFromNodeId(node.id))
    .filter((slug): slug is string => Boolean(slug));
  const levels = assignLevels(edgesFromCanvas(canvas), slugs);

  const mergedHeights = new Map<string, number>();
  for (const node of chapterNodes) {
    const slug = chapterSlugFromNodeId(node.id);
    if (!slug) continue;
    const measured = heightBySlug.get(slug);
    if (measured !== undefined) {
      mergedHeights.set(slug, measured);
    } else {
      mergedHeights.set(slug, node.height ?? 0);
    }
  }

  const slots: ChapterLayoutSlot[] = chapterNodes.map((node, index) => {
    const slug = chapterSlugFromNodeId(node.id) ?? "";
    return {
      slug,
      columnX: node.x,
      level: levels.get(slug) ?? 0,
      height: mergedHeights.get(slug) ?? node.height ?? 0,
      sortIndex: node.y * 1000 + index,
    };
  });

  const positions = layoutChapterPositions(slots);

  let changed = false;
  const updatedChapters = chapterNodes.map((node) => {
    const slug = chapterSlugFromNodeId(node.id);
    if (!slug) return node;
    const pos = positions.get(slug);
    if (!pos) return node;
    const height = pos.height;
    if (pos.y !== node.y || height !== node.height) changed = true;
    return { ...node, y: pos.y, height };
  });

  if (!changed) return null;

  const chapterById = new Map(updatedChapters.map((node) => [node.id, node]));

  let nodes = canvasNodes.map((node) => {
    if (node.type === "text" && node.id.startsWith("chapter-")) {
      return chapterById.get(node.id) ?? node;
    }
    return node;
  });

  nodes = nodes.map((node) => {
    if (node.type !== "group") return node;
    const inGroup = updatedChapters.filter(
      (chapter) =>
        chapter.x + chapter.width / 2 >= node.x + GROUP_PAD &&
        chapter.x + chapter.width / 2 <= node.x + node.width - GROUP_PAD
    );
    if (inGroup.length === 0) return node;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const chapter of inGroup) {
      minX = Math.min(minX, chapter.x);
      minY = Math.min(minY, chapter.y);
      maxX = Math.max(maxX, chapter.x + chapter.width);
      maxY = Math.max(maxY, chapter.y + chapter.height);
    }

    return {
      ...node,
      x: minX - GROUP_PAD,
      y: minY - GROUP_PAD,
      width: maxX - minX + GROUP_PAD * 2,
      height: maxY - minY + GROUP_PAD * 2,
    };
  });

  return { ...canvas, nodes };
}

export function subjectToCanvas(
  subject: CatalogSubject,
  matches: (chapter: CatalogChapter) => boolean
): JSONCanvas | null {
  const visible = collectVisibleChapters(subject, matches);
  if (visible.size === 0) return null;

  const edgeList = buildEdgeList(subject, visible);
  assertAcyclic(edgeList, visible.keys());

  return {
    nodes: layoutNodes(subject, visible, edgeList),
    edges: toCanvasEdges(edgeList),
  };
}
