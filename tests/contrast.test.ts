import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// WCAG 2.2 AA contrast of the theme tokens, read from _theme.scss (with the
// Catppuccin palettes from _var.scss), so a color change is checked here.

const scss = (file: string) =>
  readFileSync(
    // import.meta.url is not a file: URL under happy-dom, so resolve from the directory.
    resolve(import.meta.dirname, "../packages/core/assets/scss", file),
    "utf8"
  );

const palette = Object.fromEntries(
  [...scss("_var.scss").matchAll(/^\$([\w-]+):\s*([^;]+);/gm)].map((m) => [
    m[1],
    m[2]!.trim(),
  ])
);

// Each theme block of _theme.scss, keyed by its first selector.
const blocks = Object.fromEntries(
  [...scss("_theme.scss").matchAll(/^([:.][\w-]+)[^{]*\{([^}]*)\}/gm)].map(
    (m) => [
      m[1],
      Object.fromEntries(
        [...m[2]!.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((t) => [
          t[1],
          t[2]!.trim().replace(/^#\{var\.\$([\w-]+)\}$/, (_, n) => palette[n]),
        ])
      ),
    ]
  )
);

// Later blocks override earlier ones, as in the cascade of _theme.scss.
const themes: Record<string, Record<string, string>> = {
  light: blocks[":root"]!,
  dark: blocks[".dark-theme"]!,
  latte: { ...blocks[":root"], ...blocks[".cat-latte"] },
  mocha: { ...blocks[".dark-theme"], ...blocks[".cat-mocha"] },
};

type Rgba = [number, number, number, number];

function parse(color: string): Rgba {
  const hex = color.match(/^#([\da-f]{6})$/i)?.[1];
  if (hex) {
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
    return [r!, g!, b!, 1];
  }
  const rgb = color.match(/^rgb\((\d+) (\d+) (\d+)(?: \/ ([\d.]+)%)?\)$/);
  if (!rgb) throw new Error(`Unsupported color: ${color}`);
  const [, r, g, b, a] = rgb;
  return [Number(r), Number(g), Number(b), a ? Number(a) / 100 : 1];
}

// Paints the layers bottom to top, so translucent tokens blend like in the page.
function paint(theme: Record<string, string>, layers: string[]): Rgba {
  return layers
    .map((name) => parse(theme[name]!))
    .reduce((bg, fg) => {
      const a = fg[3];
      return [0, 1, 2]
        .map((i) => fg[i]! * a + bg[i]! * (1 - a))
        .concat(1) as Rgba;
    });
}

function luminance([r, g, b]: Rgba) {
  const [lr, lg, lb] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lr! + 0.7152 * lg! + 0.0722 * lb!;
}

function ratio(fg: Rgba, bg: Rgba) {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi! + 0.05) / (lo! + 0.05);
}

const TEXT = 4.5;
const UI = 3;

// [what, foreground token, background layers, minimum]
const pairs: [string, string, string[], number][] = [
  ["page text", "text", ["bg"], TEXT],
  ["secondary text", "text-secondary", ["bg"], TEXT],
  ["sidebar text", "text-secondary", ["bg-sidebar"], TEXT],
  ["sidebar item on hover", "text-secondary", ["bg-sidebar", "bg-hover"], TEXT],
  ["modal and menu text", "text", ["bg-floating"], TEXT],
  ["callout and code block text", "text", ["bg-block"], TEXT],
  ["inactive tab text", "text-secondary", ["bg-tabs"], TEXT],
  ["inline code", "code-inline", ["bg"], TEXT],
  ["focus ring and accent", "accent", ["bg"], UI],
  ["icons", "text-tertiary", ["bg"], UI],
];

// Known failures, kept from the visual refresh design until its colors change.
// Once a pair passes, remove it here so it stays checked.
const known: Record<string, string[]> = {
  light: ["sidebar item on hover", "inactive tab text", "icons"],
  latte: ["sidebar item on hover", "inactive tab text", "icons"],
};

const contrast = (theme: Record<string, string>, fg: string, bg: string[]) =>
  ratio(paint(theme, [...bg, fg]), paint(theme, bg));

describe.each(Object.entries(themes))("%s theme", (name, theme) => {
  it.each(pairs)("%s: %s on %j", (what, fg, bg, min) => {
    if (known[name]?.includes(what)) {
      expect(contrast(theme, fg, bg)).toBeLessThan(min);
      return;
    }
    expect(contrast(theme, fg, bg)).toBeGreaterThanOrEqual(min);
  });
});
