import { describe, expect, it } from "vitest";
import { tagColorClass } from "@core/util/tagColorClass";

describe("tagColorClass", () => {
  it("gives a tag the same class every time", () => {
    expect(tagColorClass("Vue")).toBe(tagColorClass("Vue"));
  });

  it("uses every color in $tag-colors", () => {
    const tags = Array.from({ length: 200 }, (_, i) => `tag ${i}`);
    const classes = new Set(tags.map(tagColorClass));

    expect([...classes].sort()).toEqual(
      Array.from({ length: 7 }, (_, i) => `multi-select__tag--${i}`)
    );
  });
});
