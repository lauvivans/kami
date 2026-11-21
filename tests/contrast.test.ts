import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  // import.meta.url is not a file: URL under happy-dom, so resolve from the directory.
  resolve(import.meta.dirname, "../packages/core/assets/scss/_var.scss"),
  "utf8"
);

// WCAG 2.2 AA contrast of the theme colors, read from the tokens in _var.scss.
// The pairs follow _theme.scss (dark, latte, mocha) and the base styles (light).

type Rgba = [number, number, number, number];

const tokens = Object.fromEntries(
  [...source.matchAll(/^\$([\w-]+):\s*([^;]+);/gm)].map((m) => [m[1], m[2]])
);

function parse(color: string): Rgba {
  const hex = color.match(/^#([\da-f]{3}|[\da-f]{6})$/i)?.[1];
  if (hex) {
    const full = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
    return [r!, g!, b!, 1];
  }
  const rgb = color.match(/^rgb\((\d+) (\d+) (\d+)(?: \/ ([\d.]+)%)?\)$/);
  if (!rgb) throw new Error(`Unsupported color: ${color}`);
  const [, r, g, b, a] = rgb;
  return [Number(r), Number(g), Number(b), a ? Number(a) / 100 : 1];
}

// A name is a token from _var.scss; anything else is a literal from _theme.scss.
const color = (name: string) =>
  parse(tokens[name] ?? name.replace(/^literal /, ""));

// Paints the layers bottom to top, so translucent tokens blend like in the page.
function paint(...layers: string[]): Rgba {
  return layers.map(color).reduce((bg, fg) => {
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

// [what, foreground, background layers, minimum, proposed token for a known failure]
type Pair = [string, string, string[], number, string?];

const themes: Record<string, Pair[]> = {
  light: [
    ["body text", "black-8", ["white"], TEXT],
    ["secondary text (tabs, settings)", "black-6", ["white"], TEXT],
    ["links and sidebar items", "black-5", ["white"], TEXT, "black-6"],
    ["font names in page settings", "black-4", ["white"], TEXT, "black-6"],
    ["inactive tab text", "black-6", ["white", "gray-4"], TEXT],
    ["icons", "black-3", ["white"], UI, "black-5"],
    ["toggle off", "gray-stroke", ["white"], UI, "black-5"],
    ["toggle on", "active", ["white"], UI],
    ["focus ring", "active", ["white"], UI],
  ],
  dark: [
    ["body text", "white", ["dark"], TEXT],
    ["sidebar text (#a8a8a8)", "literal #a8a8a8", ["dark-lighter"], TEXT],
    ["modal and callout text", "white", ["black"], TEXT],
    ["tab text", "white", ["dark", "gray-1"], TEXT],
    ["link hover", "gray", ["dark"], TEXT],
    ["inline code", "mocha-red", ["black"], TEXT],
    ["toggle on", "active", ["black"], UI],
    ["focus ring", "active", ["dark"], UI],
  ],
  latte: [
    ["body text", "latte-text", ["latte-mantle"], TEXT],
    ["sidebar text", "latte-subtext0", ["latte-base"], TEXT, "latte-subtext1"],
    ["modal and callout text", "latte-text", ["latte-surface0"], TEXT],
    ["tab text", "latte-text", ["latte-surface0"], TEXT],
    ["link hover", "latte-overlay2", ["latte-mantle"], TEXT, "latte-subtext1"],
    ["toggle on", "latte-sky", ["latte-surface0"], UI, "latte-blue"],
    ["focus ring", "active", ["latte-mantle"], UI],
  ],
  mocha: [
    ["body text", "mocha-text", ["mocha-crust"], TEXT],
    ["sidebar text", "mocha-subtext0", ["mocha-base"], TEXT],
    ["modal and callout text", "mocha-text", ["mocha-mantle"], TEXT],
    ["tab text", "mocha-text", ["mocha-base"], TEXT],
    ["link hover", "mocha-subtext0", ["mocha-crust"], TEXT],
    ["inline code", "mocha-red", ["mocha-mantle"], TEXT],
    ["toggle on", "mocha-sapphire", ["mocha-mantle"], UI],
    ["focus ring", "active", ["mocha-crust"], UI],
  ],
};

const contrast = (fg: string, bg: string[]) =>
  ratio(paint(...bg, fg), paint(...bg));

describe.each(Object.entries(themes))("%s theme", (_, pairs) => {
  it.each(pairs)("%s: %s on %j", (_, fg, bg, min, proposed) => {
    if (!proposed) {
      expect(contrast(fg, bg)).toBeGreaterThanOrEqual(min);
      return;
    }
    // Known failure. Once the styles use the proposed token, move it into the pair.
    expect(contrast(fg, bg)).toBeLessThan(min);
    expect(contrast(proposed, bg)).toBeGreaterThanOrEqual(min);
  });
});
