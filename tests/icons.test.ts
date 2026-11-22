import { describe, expect, it } from "vitest";
import type { IconifyJSON } from "@iconify/types";
import { icons as eva } from "@iconify-json/eva";
import { icons as famicons } from "@iconify-json/famicons";
import { icons as materialSymbols } from "@iconify-json/material-symbols";
import { Icons } from "@core/enum";

const sets: Record<string, IconifyJSON> = {
  eva,
  famicons,
  "material-symbols": materialSymbols,
};

describe("Icons", () => {
  // Iconify renders nothing for an unknown name, so a typo only shows as a
  // missing icon on the page.
  it.each(Object.entries(Icons))("%s is a known icon name", (_, value) => {
    const [prefix = "", name = ""] = value.split(":");
    const set = sets[prefix];
    expect(set, `no icon set installed for "${prefix}"`).toBeDefined();
    expect(name in set!.icons || name in (set!.aliases ?? {})).toBe(true);
  });
});
