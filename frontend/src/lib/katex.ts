import katex from "katex";
import renderMathInElement from "katex/contrib/auto-render";
import "katex/dist/katex.min.css";

export type RenderLatexOptions = {
  displayMode?: boolean;
};

export type RenderMathInContainerOptions = {
  force?: boolean;
};

export type RenderBookMathOptions = {
  force?: boolean;
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
  ".book-prose, .book-callout, .book-formula, .book-question__prompt, .book-question__solution, .math-widget";

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
export function renderMathInContainer(
  el: HTMLElement,
  options: RenderMathInContainerOptions = {}
) {
  if (options.force) {
    delete el.dataset.katexRendered;
  } else if (el.dataset.katexRendered === "true") {
    return;
  }
  renderMathInElement(el, AUTO_RENDER_OPTIONS);
  el.dataset.katexRendered = "true";
}

/**
 * Scan chapter / book content for math delimiters in prose and widget trees.
 */
export function renderBookMath(
  root: ParentNode = document,
  options: RenderBookMathOptions = {}
) {
  const article =
    root instanceof Document
      ? root.querySelector<HTMLElement>("[data-pagefind-body]")
      : root instanceof HTMLElement && root.matches("[data-pagefind-body]")
        ? root
        : root.querySelector<HTMLElement>("[data-pagefind-body]");

  const scope: ParentNode = article ?? root;

  scope.querySelectorAll<HTMLElement>(AUTO_RENDER_TARGETS).forEach((el) => {
    renderMathInContainer(el, { force: options.force });
  });
}

function nodeInsideKatex(node: Node) {
  const element =
    node instanceof Element ? node : node.parentElement;
  return Boolean(element?.closest(".katex"));
}

/**
 * Observe dynamic DOM updates (including Solid widget updates) and auto-render math delimiters.
 * Returns a disposer function.
 */
export function observeMathAutoRender(root: ParentNode = document) {
  const observedNode =
    root instanceof Document
      ? root.documentElement
      : root instanceof HTMLElement
        ? root
        : null;

  if (!observedNode) {
    return () => {};
  }

  let scheduled = false;
  let rendering = false;

  const scheduleRender = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      rendering = true;
      renderBookMath(root, { force: true });
      rendering = false;
    });
  };

  const observer = new MutationObserver((mutations) => {
    if (rendering) return;
    const hasExternalChange = mutations.some((mutation) => {
      if (nodeInsideKatex(mutation.target)) return false;
      if (mutation.type === "characterData") return true;
      if (mutation.addedNodes.length === 0 && mutation.removedNodes.length === 0) return false;
      const addedInsideKatex = Array.from(mutation.addedNodes).every(nodeInsideKatex);
      const removedInsideKatex = Array.from(mutation.removedNodes).every(nodeInsideKatex);
      return !(addedInsideKatex && removedInsideKatex);
    });
    if (hasExternalChange) scheduleRender();
  });

  observer.observe(observedNode, {
    subtree: true,
    childList: true,
    characterData: true,
  });

  return () => observer.disconnect();
}
