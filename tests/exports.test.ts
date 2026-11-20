import { describe, expect, it } from "vitest";
import { Icons } from "@core/index.ts";

describe("package entry", () => {
  it("exports the Icons enum", () => {
    expect(Icons.arrowRightFilled).toBeDefined();
  });
});
