import renderMathInElement from "katex/contrib/auto-render";
import "katex/dist/katex.min.css";

const DELIMITERS = [
  { left: "$$", right: "$$", display: true },
  { left: "\\(", right: "\\)", display: false },
  { left: "\\[", right: "\\]", display: true },
];

const RENDER_OPTIONS = {
  delimiters: DELIMITERS,
  throwOnError: false,
  strict: "ignore" as const,
};

export function renderMathInContainer(el: HTMLElement) {
  renderMathInElement(el, RENDER_OPTIONS);
}

export function renderBookMath() {
  document
    .querySelectorAll<HTMLElement>(".book-prose, .book-callout, .math-widget__caption")
    .forEach(renderMathInContainer);
}
