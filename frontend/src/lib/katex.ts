import katex from "katex";
import renderMathInElement from "katex/contrib/auto-render";
import "katex/dist/katex.min.css";

export type RenderLatexOptions = {
  displayMode?: boolean;
};

const DELIMITERS = [
  { left: "$$", right: "$$", display: true },
  { left: "\\(", right: "\\)", display: false },
  { left: "\\[", right: "\\]", display: true },
];

const AUTO_RENDER_OPTIONS = {
  delimiters: DELIMITERS,
  throwOnError: false,
  strict: "ignore" as const,
};

/** Prose and question blocks that may contain \\( … \\) or \\[ … \\] delimiters. */
const AUTO_RENDER_TARGETS =
  ".book-prose, .book-callout, .book-formula, .book-question__prompt, .book-question__solution, .math-widget__caption";

/**
 * Render a LaTeX string to HTML for use with Solid `innerHTML` (widgets, dynamic labels).
 */
export function renderLatex(latex: string, options: RenderLatexOptions = {}) {
  return katex.renderToString(latex, {
    throwOnError: false,
    strict: "ignore",
    displayMode: options.displayMode ?? false,
  });
}

/**
 * Auto-render delimiter-based math inside a single element (idempotent per element).
 */
export function renderMathInContainer(el: HTMLElement) {
  if (el.dataset.katexRendered === "true") return;
  renderMathInElement(el, AUTO_RENDER_OPTIONS);
  el.dataset.katexRendered = "true";
}

/**
 * Scan chapter / book content for math delimiters. Skips `.math-widget` trees (widgets use renderLatex).
 */
export function renderBookMath(root: ParentNode = document) {
  const article =
    root instanceof Document
      ? root.querySelector<HTMLElement>("[data-pagefind-body]")
      : root instanceof HTMLElement && root.matches("[data-pagefind-body]")
        ? root
        : root.querySelector<HTMLElement>("[data-pagefind-body]");

  const scope: ParentNode = article ?? root;

  scope.querySelectorAll<HTMLElement>(AUTO_RENDER_TARGETS).forEach((el) => {
    if (el.closest(".math-widget")) return;
    renderMathInContainer(el);
  });
}
