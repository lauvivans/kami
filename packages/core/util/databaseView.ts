import type { PageInfo } from "@core/@types";
import { tagName } from "@core/util/tagColorClass";

// Pages with at least one of `values` in `property`
export type DatabaseFilter = { property: string; values: string[] };
// `property: null` sorts by the page title
export type DatabaseSort = { property: string | null; desc: boolean };

// A property's values as text: one per tag for a multi-select
export function valuesOf(page: PageInfo, property: string) {
  const value = page.databaseInfo?.[property]?.value;
  if (value === undefined) return [];
  return Array.isArray(value) ? value.map(tagName) : [value];
}

// Every property the pages have, in the order they first appear, with its distinct values
export function propertyValues(pages: PageInfo[]) {
  const properties = new Map<string, Set<string>>();
  for (const page of pages) {
    for (const property of Object.keys(page.databaseInfo ?? {})) {
      const values = properties.get(property) ?? new Set();
      valuesOf(page, property).forEach((value) => values.add(value));
      properties.set(property, values);
    }
  }
  return [...properties].map(([property, values]) => ({
    property,
    values: [...values],
  }));
}

// The pages a view shows. Values compare as text, so "2" comes before "10";
// pages without the sorted property go last in both directions.
export function viewPages(
  pages: PageInfo[],
  filter?: DatabaseFilter,
  sort?: DatabaseSort
) {
  const shown = filter
    ? pages.filter((page) =>
        valuesOf(page, filter.property).some((value) =>
          filter.values.includes(value)
        )
      )
    : [...pages];
  if (!sort) return shown;

  const key = (page: PageInfo) =>
    sort.property === null ? page.title : valuesOf(page, sort.property)[0];
  return shown.sort((a, b) => {
    const [keyA, keyB] = [key(a), key(b)];
    if (keyA === undefined || keyB === undefined) {
      return Number(keyA === undefined) - Number(keyB === undefined);
    }
    const order = keyA.localeCompare(keyB, undefined, { numeric: true });
    return sort.desc ? -order : order;
  });
}
