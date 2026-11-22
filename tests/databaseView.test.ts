import { describe, expect, it } from "vitest";
import { propertyValues, viewPages } from "@core/util/databaseView";
import type { DatabaseTag, PageInfo } from "@core/@types";

const page = (
  id: string,
  databaseInfo: Record<string, string | DatabaseTag[]> = {}
): PageInfo => ({
  id,
  path: `/${id}`,
  title: id,
  component: {},
  databaseInfo: Object.fromEntries(
    Object.entries(databaseInfo).map(([key, value]) => [
      key,
      { icon: "code", value },
    ])
  ),
});

const pages = [
  page("b", { Order: "10", Tags: ["Vue", "Sass"] }),
  page("a", { Order: "2", Tags: [{ name: "TypeScript", color: "green" }] }),
  page("c"),
  page("d", { Order: "1", Tags: ["Astro", "Vue"] }),
];

const ids = (list: PageInfo[]) => list.map((item) => item.id);

describe("viewPages", () => {
  it("keeps pages with at least one of the filter values", () => {
    expect(
      ids(viewPages(pages, { property: "Tags", values: ["Vue"] }))
    ).toEqual(["b", "d"]);
    expect(
      ids(
        viewPages(pages, { property: "Tags", values: ["Sass", "TypeScript"] })
      )
    ).toEqual(["b", "a"]);
  });

  it("returns every page, in order, without a filter or sort", () => {
    expect(ids(viewPages(pages))).toEqual(["b", "a", "c", "d"]);
  });

  it("sorts numbers inside text numerically, ascending and descending", () => {
    expect(
      ids(viewPages(pages, undefined, { property: "Order", desc: false }))
    ).toEqual(["d", "a", "b", "c"]);
    expect(
      ids(viewPages(pages, undefined, { property: "Order", desc: true }))
    ).toEqual(["b", "a", "d", "c"]);
  });

  it("puts pages without the property last in both directions", () => {
    for (const desc of [false, true]) {
      const sorted = viewPages(pages, undefined, { property: "Tags", desc });
      expect(sorted.at(-1)!.id).toBe("c");
    }
  });

  it("sorts arrays by their first item and sorts by title", () => {
    expect(
      ids(viewPages(pages, undefined, { property: "Tags", desc: false }))
    ).toEqual(["d", "a", "b", "c"]);
    expect(
      ids(viewPages(pages, undefined, { property: null, desc: true }))
    ).toEqual(["d", "c", "b", "a"]);
  });

  it("does not reorder the pages it gets", () => {
    viewPages(pages, undefined, { property: null, desc: false });
    expect(ids(pages)).toEqual(["b", "a", "c", "d"]);
  });
});

describe("propertyValues", () => {
  it("lists each property once with its distinct values", () => {
    expect(propertyValues(pages)).toEqual([
      { property: "Order", values: ["10", "2", "1"] },
      { property: "Tags", values: ["Vue", "Sass", "TypeScript", "Astro"] },
    ]);
  });
});
