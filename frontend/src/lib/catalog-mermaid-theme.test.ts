import { describe, expect, test } from "bun:test";
import { mermaidInitializeOptions, mermaidThemeVariables } from "./catalog-mermaid-theme";

describe("catalog-mermaid-theme", () => {
  test("uses base theme with distinct cluster and secondary colors", () => {
    const dark = mermaidThemeVariables("dark");
    expect(dark.clusterBkg).not.toBe(dark.secondaryColor);
    expect(dark.clusterBkg).toBe("#202020");
    expect(dark.secondaryColor).toBe("#3d3a36");

    const init = mermaidInitializeOptions("light");
    expect(init.theme).toBe("base");
    expect(init.themeVariables.clusterBkg).toBe("#f0efec");
    expect(init.themeVariables.secondaryColor).toBe("#e3e1dc");
  });
});
