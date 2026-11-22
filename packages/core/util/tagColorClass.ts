// the length of $tag-colors in _var.scss
const TAG_COLORS = 7;

// The class that colors a multi-select tag. The color comes from the tag's
// text, so the same tag looks the same everywhere and on every render.
export function tagColorClass(tag: string) {
  let hash = 0;
  for (const char of tag) {
    hash = (hash * 31 + char.charCodeAt(0)) % TAG_COLORS;
  }
  return `multi-select__tag--${hash}`;
}
