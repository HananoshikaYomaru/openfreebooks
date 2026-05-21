/**
 * Shared JavaScript for all mathematics chapters.
 * Loaded on every /math/{slug}/ page via main.tsx + generated subject-modules.ts.
 */

/** Normalize checkpoint markup and run any math-only setup on the chapter article. */
export function initMathSubject(root: HTMLElement): void {
  for (const panel of root.querySelectorAll<HTMLElement>(".book-question__answer")) {
    panel.classList.remove("book-question__answer");
    panel.classList.add("book-question__solution");
  }
}
