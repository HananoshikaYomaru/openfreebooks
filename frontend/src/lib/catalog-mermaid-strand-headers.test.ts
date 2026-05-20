import { describe, expect, test } from "bun:test";
import { isStrandClusterId } from "./catalog-mermaid-strand-headers";

describe("catalog-mermaid-strand-headers", () => {
  test("isStrandClusterId matches strand subgraph ids", () => {
    expect(isStrandClusterId("flowchart-strand_number_algebra-1")).toBe(true);
    expect(isStrandClusterId("flowchart-root-0")).toBe(false);
  });
});
