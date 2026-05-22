import { describe, expect, it } from "bun:test";
import { validateCurriculum } from "./validate-curriculum";

describe("validate-curriculum", () => {
  it("has no curriculum validation errors", async () => {
    const result = await validateCurriculum();
    if (result.errors.length > 0) {
      const details = result.errors
        .map((error) => `[${error.file}] ${error.message}`)
        .join("\n");
      throw new Error(`Curriculum validation failed:\n${details}`);
    }
    expect(result.errors).toHaveLength(0);
  });
});
