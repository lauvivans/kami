import { describe, expect, it } from "vitest";
import { tagColorClass, tagName } from "@core/util/tagColorClass";

const colors = ["purple", "blue", "yellow", "brown", "green", "orange", "gray"];

describe("tagColorClass", () => {
  it("gives a tag the same class every time", () => {
    expect(tagColorClass("Vue")).toBe(tagColorClass("Vue"));
  });

  it("uses every color in $tag-colors for tags without one", () => {
    const tags = Array.from({ length: 200 }, (_, i) => `tag ${i}`);
    const classes = new Set(tags.map(tagColorClass));

    expect([...classes].sort()).toEqual(
      colors.map((color) => `multi-select__tag--${color}`).sort()
    );
  });

  it("uses the tag's own color when it has one", () => {
    const tag = { name: "TypeScript", color: "green" } as const;

    expect(tagColorClass(tag)).toBe("multi-select__tag--green");
    expect(tagName(tag)).toBe("TypeScript");
  });
});
