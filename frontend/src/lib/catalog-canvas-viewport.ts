import { internal, type JSONCanvasViewerInterface } from "json-canvas-viewer";
import { CHAPTER_NODE_WIDTH, STRAND_GAP_X } from "./catalog-to-canvas";

/** Roughly one strand column plus peek of the next — readable card text, not full board. */
const READABLE_COLUMNS_IN_VIEW = 1.15;
const MIN_READABLE_SCALE = 0.78;
const MAX_READABLE_SCALE = 1.08;

export function focusReadableCatalogView(
  viewer: JSONCanvasViewerInterface,
  container: HTMLElement
): void {
  const dm = viewer.container.get(internal.DataManager);
  const bounds = dm.data.nodeBounds;
  if (bounds.width <= 0 || bounds.height <= 0) return;

  const viewportW = container.clientWidth;
  const viewportH = container.clientHeight;
  if (viewportW < 1 || viewportH < 1) return;

  const columnSpan = CHAPTER_NODE_WIDTH + STRAND_GAP_X;
  const scaleByWidth = viewportW / (columnSpan * READABLE_COLUMNS_IN_VIEW);
  const scale = Math.min(MAX_READABLE_SCALE, Math.max(MIN_READABLE_SCALE, scaleByWidth));

  const focusX = bounds.minX + Math.min(bounds.width * 0.28, columnSpan * 0.65);
  const focusY = bounds.minY + Math.min(bounds.height * 0.22, 280);

  dm.data.scale = scale;
  dm.data.offsetX = viewportW / 2 - focusX * scale;
  dm.data.offsetY = viewportH / 2 - focusY * scale;
}
