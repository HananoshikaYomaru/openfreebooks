import { describe, expect, test } from "bun:test";
import type { JSONCanvas } from "json-canvas-viewer";
import type {
  CatalogChapter,
  CatalogGraphEdge,
  CatalogSubject,
} from "../../../data/catalog.types";
import {
  CHAPTER_NODE_WIDTH,
  chapterNodeId,
  chapterSlugFromNodeId,
  relayoutCanvasChapterHeights,
  subjectToCanvas,
} from "./catalog-to-canvas";

const GAP_Y = 48;

function chapter(
  slug: string,
  overrides: Partial<CatalogChapter> = {}
): CatalogChapter {
  return {
    slug,
    title: slug,
    description: "Test chapter description for layout.",
    status: "planned",
    curriculums: ["DSE"],
    ...overrides,
  };
}

function miniSubject(chapters: CatalogChapter[], edges: CatalogGraphEdge[] = []): CatalogSubject {
  return {
    id: "math",
    name: "Mathematics",
    strands: [
      {
        id: "number-algebra",
        title: "Number & Algebra",
        chapters,
      },
    ],
    graph: { edges },
  };
}

function textNode(canvas: JSONCanvas, slug: string) {
  return (canvas.nodes ?? []).find((node) => node.id === chapterNodeId(slug) && node.type === "text");
}

function bottomY(node: { y: number; height?: number }) {
  return node.y + (node.height ?? 0);
}

describe("chapterNodeId", () => {
  test("maps slug to node id and back", () => {
    expect(chapterNodeId("quadratic-equations")).toBe("chapter-quadratic-equations");
    expect(chapterSlugFromNodeId("chapter-quadratic-equations")).toBe("quadratic-equations");
    expect(chapterSlugFromNodeId("group-strand")).toBeNull();
  });
});

describe("subjectToCanvas", () => {
  test("returns null when no chapters match filter", () => {
    const subject = miniSubject([chapter("a")]);
    expect(subjectToCanvas(subject, () => false)).toBeNull();
  });

  test("uses only explicit graph edges (no implicit strand chain)", () => {
    const subject = miniSubject(
      [chapter("first"), chapter("second")],
      []
    );
    const canvas = subjectToCanvas(subject, () => true);
    expect(canvas?.edges ?? []).toHaveLength(0);
  });

  test("assigns longest-path levels on y axis", () => {
    const subject = miniSubject(
      [chapter("a"), chapter("b"), chapter("c")],
      [
        { from: "a", to: "b" },
        { from: "b", to: "c" },
      ]
    );
    const canvas = subjectToCanvas(subject, () => true)!;
    const a = textNode(canvas, "a")!;
    const b = textNode(canvas, "b")!;
    const c = textNode(canvas, "c")!;

    expect(b.y).toBeGreaterThan(bottomY(a));
    expect(c.y).toBeGreaterThan(bottomY(b));
  });

  test("stacks siblings that share a level in one column", () => {
    const subject = miniSubject(
      [chapter("alpha"), chapter("beta"), chapter("merge")],
      [
        { from: "alpha", to: "merge" },
        { from: "beta", to: "merge" },
      ]
    );
    const canvas = subjectToCanvas(subject, () => true)!;
    const alpha = textNode(canvas, "alpha")!;
    const beta = textNode(canvas, "beta")!;
    const merge = textNode(canvas, "merge")!;

    expect(alpha.x).toBe(beta.x);
    expect(beta.y).toBeGreaterThanOrEqual(bottomY(alpha) + GAP_Y);
    expect(merge.y).toBeGreaterThan(bottomY(alpha));
    expect(merge.y).toBeGreaterThan(bottomY(beta));
  });

  test("places strand columns at increasing x", () => {
    const subject: CatalogSubject = {
      id: "math",
      name: "Mathematics",
      strands: [
        {
          id: "number-algebra",
          title: "Number & Algebra",
          chapters: [chapter("na")],
        },
        {
          id: "data-handling",
          title: "Data Handling",
          chapters: [chapter("dh")],
        },
      ],
      graph: { edges: [] },
    };
    const canvas = subjectToCanvas(subject, () => true)!;
    const na = textNode(canvas, "na")!;
    const dh = textNode(canvas, "dh")!;

    expect(dh.x).toBeGreaterThan(na.x);
    expect(dh.x - na.x).toBeGreaterThanOrEqual(CHAPTER_NODE_WIDTH);
  });

  test("throws when the graph has a cycle", () => {
    const subject = miniSubject(
      [chapter("a"), chapter("b"), chapter("c")],
      [
        { from: "a", to: "b" },
        { from: "b", to: "c" },
        { from: "c", to: "a" },
      ]
    );
    expect(() => subjectToCanvas(subject, () => true)).toThrow(/cycle/i);
  });
});

describe("relayoutCanvasChapterHeights", () => {
  test("handles canvas with undefined nodes and edges", () => {
    expect(relayoutCanvasChapterHeights({}, new Map())).toBeNull();
  });

  test("returns null when layout unchanged", () => {
    const subject = miniSubject([chapter("solo")], []);
    const canvas = subjectToCanvas(subject, () => true)!;
    const node = textNode(canvas, "solo")!;
    const heights = new Map([["solo", node.height ?? 0]]);
    expect(relayoutCanvasChapterHeights(canvas, heights)).toBeNull();
  });

  test("bumps y when a taller height is supplied for a sibling stack", () => {
    const subject = miniSubject(
      [chapter("top"), chapter("bottom")],
      []
    );
    const canvas = subjectToCanvas(subject, () => true)!;
    const top = textNode(canvas, "top")!;
    const bottom = textNode(canvas, "bottom")!;

    const firstSlug = top.y <= bottom.y ? "top" : "bottom";
    const secondSlug = firstSlug === "top" ? "bottom" : "top";
    const first = textNode(canvas, firstSlug)!;
    const second = textNode(canvas, secondSlug)!;

    const taller = (first.height ?? 0) + 80;
    const fitted = relayoutCanvasChapterHeights(
      canvas,
      new Map([
        [firstSlug, taller],
        [secondSlug, second.height ?? 0],
      ])
    );

    expect(fitted).not.toBeNull();
    const moved = textNode(fitted!, secondSlug)!;
    expect(moved.y).toBeGreaterThanOrEqual(first.y + taller + GAP_Y);
  });
});
