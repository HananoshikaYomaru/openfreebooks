import renderMathInElement from "katex/contrib/auto-render";
import "katex/dist/katex.min.css";

const DELIMITERS = [
  { left: "$$", right: "$$", display: true },
  { left: "\\(", right: "\\)", display: false },
  { left: "\\[", right: "\\]", display: true },
];

export function renderBookMath() {
  document.querySelectorAll<HTMLElement>(".book-prose, .book-callout").forEach((el) => {
    renderMathInElement(el, {
      delimiters: DELIMITERS,
      throwOnError: false,
      strict: "ignore",
    });
  });
}
