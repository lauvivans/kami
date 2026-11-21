import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";
import axe from "axe-core";
import { useStore } from "@core/store";
import type { IMetadata, PageInfo } from "@core/@types";
import { Aside, Header, Tabs } from "@core/components";
import {
  Database,
  Image,
  ToDoList,
  ToggleList,
} from "@core/@client/components";
import { Icons } from "@core/enum";

const pages: PageInfo[] = [
  {
    id: "home",
    path: "/",
    title: "Home",
    component: {},
    icon: { path: "/icon.png" },
    banner: { path: "/banner.png" },
    pages: ["about"],
  },
  {
    id: "about",
    path: "/about",
    title: "About",
    component: {},
    parentPage: "home",
  },
];

const metadata: IMetadata = {
  user: { author: "Author", socialMedia: "Links" },
  pages: Object.fromEntries(pages.map((page) => [page.id, page])),
  favorites: ["home"],
};

const store = useStore;
let wrapper: VueWrapper | undefined;

function mountAttached(component: unknown, props: Record<string, unknown>) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: pages.map((page) => ({ path: page.path, component: {} })),
  });
  wrapper = mount(component as never, {
    props: props as never,
    attachTo: document.body,
    global: { plugins: [router] },
  });
  return wrapper;
}

// color-contrast needs layout, which happy-dom lacks: contrast.test.ts checks the tokens.
async function violations() {
  const result = await axe.run(document.body, {
    rules: { "color-contrast": { enabled: false }, region: { enabled: false } },
  });
  return result.violations.map(
    (v) => `${v.id}: ${v.nodes.map((n) => n.html).join(" | ")}`
  );
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function press(key: string, shiftKey = false) {
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key, shiftKey, bubbles: true })
  );
}

beforeEach(() => {
  localStorage.clear();
  store.$reset();
  store.storeActivePage(pages[1]!);
});

afterEach(() => {
  wrapper?.unmount();
  wrapper = undefined;
  document.body.innerHTML = "";
});

describe("axe", () => {
  it.each([
    ["Aside", Aside, { metadata }],
    ["Header", Header, { metadata }],
    ["Tabs", Tabs, {}],
    [
      "ToggleList",
      ToggleList,
      { iconToOpen: Icons.arrowRight, iconToClose: Icons.arrowDown },
    ],
    [
      "ToDoList",
      ToDoList,
      { items: [{ name: "Buy coffee", isChecked: true }] },
    ],
    ["Image", Image, { src: "/a.png", alt: "A photo" }],
    ["Database gallery", Database, { layout: "gallery", pages }],
  ])("%s has no violations", async (_, component, props) => {
    mountAttached(component, props);
    expect(await violations()).toEqual([]);
  });
});

describe("keyboard", () => {
  it("opens the sidebar with Enter", async () => {
    const aside = mountAttached(Aside, { metadata });
    const navBtn = aside.get("#nav-btn");
    const expanded = navBtn.attributes("aria-expanded");
    await navBtn.trigger("keydown", { key: "Enter" });
    expect(navBtn.attributes("aria-expanded")).not.toBe(expanded);
  });

  it("toggles a setting with Space and reports its state", async () => {
    const header = mountAttached(Header, { metadata });
    const toggle = header.get('[role="switch"]');
    expect(toggle.attributes("aria-checked")).toBe("false");
    await toggle.trigger("keydown", { key: " " });
    expect(toggle.attributes("aria-checked")).toBe("true");
  });

  it("expands a toggle list from its button", async () => {
    const list = mountAttached(ToggleList, {
      iconToOpen: Icons.arrowRight,
      iconToClose: Icons.arrowDown,
    });
    const button = list.get("button");
    await button.trigger("click");
    expect(button.attributes("aria-expanded")).toBe("true");
  });
});

describe("modal", () => {
  async function openSettings() {
    const header = mountAttached(Header, { metadata });
    const opener = header.get<HTMLButtonElement>("#header-btn").element;
    const overlay = document.querySelector<HTMLElement>(".modal-settings")!;
    opener.focus();
    opener.click();
    await wait(300);
    return { opener, overlay };
  }

  it("moves focus into the dialog when it opens", async () => {
    const { overlay } = await openSettings();
    expect(overlay.style.display).toBe("block");
    expect(overlay.contains(document.activeElement)).toBe(true);
  });

  it("keeps Tab inside the dialog", async () => {
    const { overlay } = await openSettings();
    const items = overlay.querySelectorAll<HTMLElement>('[tabindex="0"]');
    const last = items[items.length - 1]!;

    last.focus();
    press("Tab");
    expect(document.activeElement).toBe(items[0]);

    press("Tab", true);
    expect(document.activeElement).toBe(last);
  });

  it("closes with Esc and gives focus back to the opener", async () => {
    const { opener, overlay } = await openSettings();
    press("Escape");
    expect(overlay.style.display).toBe("none");
    expect(document.activeElement).toBe(opener);
  });

  it("closes only the innermost modal with Esc", async () => {
    const aside = mountAttached(Aside, { metadata });
    aside.get<HTMLElement>("#settings-btn").element.click();
    await wait(300);
    const [settings, themes] = document.querySelectorAll<HTMLElement>(
      ".overlay"
    ) as unknown as HTMLElement[];
    document.querySelector<HTMLElement>(".select-btn")!.click();
    await wait(300);

    press("Escape");
    expect(themes!.style.display).toBe("none");
    expect(settings!.style.display).toBe("block");
  });
});
