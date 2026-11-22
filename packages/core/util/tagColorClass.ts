import type { DatabaseTag, TagColor } from "@core/@types";

// the keys of $tag-colors in _var.scss, in the same order
const TAG_COLORS: TagColor[] = [
  "purple",
  "blue",
  "yellow",
  "brown",
  "green",
  "orange",
  "gray",
  "pink",
  "red",
];

export const tagName = (tag: DatabaseTag) =>
  typeof tag === "string" ? tag : tag.name;

// The class that colors a multi-select tag: its own color when it has one,
// otherwise one picked from its text, so the same tag looks the same
// everywhere and on every render.
export function tagColorClass(tag: DatabaseTag) {
  if (typeof tag !== "string") return `multi-select__tag--${tag.color}`;
  let hash = 0;
  for (const char of tag) {
    hash = (hash * 31 + char.charCodeAt(0)) % TAG_COLORS.length;
  }
  return `multi-select__tag--${TAG_COLORS[hash]}`;
}
