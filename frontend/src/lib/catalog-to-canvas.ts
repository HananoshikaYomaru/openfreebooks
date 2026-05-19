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
const STRAND_GAP_X = 112;
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

  for (const strand of subject.strands) {
    const chapters = strand.chapters.filter((ch) => visible.has(ch.slug));
    for (let i = 0; i < chapters.length - 1; i++) {
      add(chapters[i].slug, chapters[i + 1].slug);
    }
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

function assignLevels(edges: CatalogGraphEdge[], slugs: string[]): Map<string, number> {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const slug of slugs) {
    inDegree.set(slug, 0);
    adj.set(slug, []);
  }

  for (const { from, to } of edges) {
    adj.get(from)?.push(to);
    inDegree.set(to, (inDegree.get(to) ?? 0) + 1);
  }

  const levels = new Map<string, number>();
  const queue: Array<{ slug: string; level: number }> = [];

  for (const slug of slugs) {
    if ((inDegree.get(slug) ?? 0) === 0) {
      queue.push({ slug, level: 0 });
    }
  }

  if (queue.length === 0 && slugs.length > 0) {
    queue.push({ slug: slugs[0], level: 0 });
  }

  while (queue.length > 0) {
    const { slug, level } = queue.shift()!;
    levels.set(slug, Math.max(level, levels.get(slug) ?? 0));

    for (const next of adj.get(slug) ?? []) {
      const nextLevel = level + 1;
      levels.set(next, Math.max(nextLevel, levels.get(next) ?? 0));
      inDegree.set(next, (inDegree.get(next) ?? 1) - 1);
      if ((inDegree.get(next) ?? 0) === 0) {
        queue.push({ slug: next, level: nextLevel });
      }
    }
  }

  for (const slug of slugs) {
    if (!levels.has(slug)) {
      levels.set(slug, 0);
    }
  }

  return levels;
}

function yOffsetInColumn(level: number, levelHeights: Map<number, number>): number {
  let y = 0;
  for (let l = 0; l < level; l++) {
    y += (levelHeights.get(l) ?? 0) + GAP_Y;
  }
  return y;
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

  const levelMaxHeightByStrand = new Map<string, Map<number, number>>();
  for (const [slug] of visible) {
    const strandId = slugToStrandId.get(slug);
    if (!strandId) continue;
    const level = levels.get(slug) ?? 0;
    const height = heightBySlug.get(slug) ?? 0;
    if (!levelMaxHeightByStrand.has(strandId)) {
      levelMaxHeightByStrand.set(strandId, new Map());
    }
    const levelHeights = levelMaxHeightByStrand.get(strandId)!;
    levelHeights.set(level, Math.max(levelHeights.get(level) ?? 0, height));
  }

  const positions = new Map<string, { x: number; y: number; height: number }>();

  for (const [slug] of visible) {
    const strandId = slugToStrandId.get(slug);
    const columnX = strandId ? strandColumnX.get(strandId) : 0;
    const level = levels.get(slug) ?? 0;
    const levelHeights = strandId ? levelMaxHeightByStrand.get(strandId) : undefined;
    const height = heightBySlug.get(slug) ?? 0;
    positions.set(slug, {
      x: columnX ?? 0,
      y: yOffsetInColumn(level, levelHeights ?? new Map()),
      height,
    });
  }

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
  for (const edge of canvas.edges) {
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
  const chapterNodes = canvas.nodes.filter(
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
    mergedHeights.set(slug, Math.max(node.height ?? 0, heightBySlug.get(slug) ?? 0));
  }

  const levelMaxHeightByColumn = new Map<number, Map<number, number>>();
  for (const node of chapterNodes) {
    const slug = chapterSlugFromNodeId(node.id);
    if (!slug) continue;
    const level = levels.get(slug) ?? 0;
    const height = mergedHeights.get(slug) ?? 0;
    if (!levelMaxHeightByColumn.has(node.x)) {
      levelMaxHeightByColumn.set(node.x, new Map());
    }
    const levelHeights = levelMaxHeightByColumn.get(node.x)!;
    levelHeights.set(level, Math.max(levelHeights.get(level) ?? 0, height));
  }

  let changed = false;
  const updatedChapters = chapterNodes.map((node) => {
    const slug = chapterSlugFromNodeId(node.id);
    if (!slug) return node;
    const level = levels.get(slug) ?? 0;
    const levelHeights = levelMaxHeightByColumn.get(node.x) ?? new Map();
    const height = mergedHeights.get(slug) ?? node.height ?? 0;
    const y = yOffsetInColumn(level, levelHeights);
    if (y !== node.y || height !== node.height) changed = true;
    return { ...node, y, height };
  });

  if (!changed) return null;

  const chapterById = new Map(updatedChapters.map((node) => [node.id, node]));

  let nodes = canvas.nodes.map((node) => {
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
