import type { JSONCanvasViewerInterface } from "json-canvas-viewer";

/** Node/edge colors (hex) aligned with OFB tokens in _tokens.scss */
export const CANVAS_NODE = {
  groupBorder: "#9a6b2e",
  live: "#9a6b2e",
  planned: "#8f8a80",
  /** 8-digit hex — json-canvas-viewer only accepts hex for node/edge colors */
  edge: "#9a6b2e66",
} as const;

export const CANVAS_NODE_DARK = {
  groupBorder: "#c4924a",
  live: "#c4924a",
  planned: "#8f8a80",
  edge: "#c4924a73",
} as const;

export function siteCanvasTheme(): "light" | "dark" {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Passed to JSONCanvasViewer `colors` option (named theme tokens). */
export const VIEWER_THEME_COLORS = {
  light: {
    background: "#f5f4f1",
    "background-secondary": "#ffffff",
    border: "rgba(154, 107, 46, 0.22)",
    text: "#1a1a1a",
    dots: "rgba(26, 26, 26, 0.09)",
    shadow: "0 4px 18px rgba(20, 20, 20, 0.06)",
  },
  dark: {
    background: "#1a1917",
    "background-secondary": "#24221f",
    border: "rgba(196, 146, 74, 0.3)",
    text: "#eceae4",
    dots: "rgba(236, 234, 228, 0.07)",
    shadow: "0 4px 18px rgba(0, 0, 0, 0.28)",
  },
} as const;

export function watchSiteTheme(onChange: (theme: "light" | "dark") => void): () => void {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const observer = new MutationObserver(() => onChange(siteCanvasTheme()));
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  const onMedia = () => {
    if (!document.documentElement.getAttribute("data-theme")) {
      onChange(siteCanvasTheme());
    }
  };
  media.addEventListener("change", onMedia);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", onMedia);
  };
}

export function syncViewerTheme(viewer: JSONCanvasViewerInterface | undefined) {
  viewer?.changeTheme?.(siteCanvasTheme());
}

export function canvasNodeColors(): typeof CANVAS_NODE | typeof CANVAS_NODE_DARK {
  return siteCanvasTheme() === "dark" ? CANVAS_NODE_DARK : CANVAS_NODE;
}
