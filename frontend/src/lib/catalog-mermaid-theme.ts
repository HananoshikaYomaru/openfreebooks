/**
 * Mermaid only applies custom cluster/node colors via theme "base" + themeVariables (hex).
 * CSS cannot override Mermaid's inline SVG fills on cluster rects.
 */

export type MermaidThemeMode = "light" | "dark";

export type CatalogMermaidThemeVariables = {
  darkMode: boolean;
  background: string;
  primaryColor: string;
  primaryTextColor: string;
  primaryBorderColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  clusterBkg: string;
  clusterBorder: string;
  lineColor: string;
  titleColor: string;
  mainBkg: string;
  nodeBorder: string;
  edgeLabelBackground: string;
};

/** Strand title band (secondary) vs subgraph body (clusterBkg / tertiary). */
export function mermaidThemeVariables(mode: MermaidThemeMode): CatalogMermaidThemeVariables {
  if (mode === "dark") {
    return {
      darkMode: true,
      background: "#1a1917",
      primaryColor: "#2a2826",
      primaryTextColor: "#eceae4",
      primaryBorderColor: "#4a4844",
      secondaryColor: "#3d3a36",
      tertiaryColor: "#202020",
      clusterBkg: "#202020",
      clusterBorder: "#4a4844",
      lineColor: "#c4924a",
      titleColor: "#eceae4",
      mainBkg: "#2a2826",
      nodeBorder: "#4a4844",
      edgeLabelBackground: "#2a2826",
    };
  }

  return {
    darkMode: false,
    background: "#f5f4f1",
    primaryColor: "#faf9f7",
    primaryTextColor: "#1a1a1a",
    primaryBorderColor: "#e8e8e8",
    secondaryColor: "#e3e1dc",
    tertiaryColor: "#f0efec",
    clusterBkg: "#f0efec",
    clusterBorder: "#e8e8e8",
    lineColor: "#9a6b2e",
    titleColor: "#1a1a1a",
    mainBkg: "#faf9f7",
    nodeBorder: "#e8e8e8",
    edgeLabelBackground: "#f5f4f1",
  };
}

export function mermaidInitializeOptions(mode: MermaidThemeMode) {
  return {
    theme: "base" as const,
    themeVariables: mermaidThemeVariables(mode),
  };
}
