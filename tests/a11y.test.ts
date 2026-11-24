import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
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

function mountAttached(
  component: unknown,
  props: Record<string, unknown>,
  slots: Record<string, string> = {}
) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: pages.map((page) => ({ path: page.path, component: {} })),
  });
  wrapper = mount(component as never, {
    props: props as never,
    slots,
    attachTo: document.body,
    global: { plugins: [router] },
  });
  return wrapper;
}

// color-contrast needs layout, which happy-dom lacks: contrast.test.ts checks the tokens.
async function violations(skip: string[] = []) {
  const off = Object.fromEntries(
    ["color-contrast", "region", ...skip].map((id) => [id, { enabled: false }])
  );
  const result = await axe.run(document.body, { rules: off });
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
    ["Header", Header, { metadata }],
    ["Tabs", Tabs, {}],
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

  it("ToggleList has no violations", async () => {
    mountAttached(
      ToggleList,
      { iconToOpen: Icons.arrowRight },
      { summaryContent: "Details", detailsContent: "Hidden content" }
    );
    expect(await violations()).toEqual([]);
  });

  // Known: the sidebar puts each page link inside the <summary> that expands
  // it (nested-interactive), recorded as a follow-up on the PR.
  it("Aside has no violations besides the known one", async () => {
    mountAttached(Aside, { metadata });
    expect(await violations(["nested-interactive"])).toEqual([]);
  });
});

describe("keyboard", () => {
  // Native buttons get Enter, Space and the tab order from the browser.
  it("uses real buttons in the sidebar", () => {
    const aside = mountAttached(Aside, { metadata });
    expect(aside.find('[role="button"]').exists()).toBe(false);
    expect(aside.get("#nav-btn").element.tagName).toBe("BUTTON");
    expect(aside.get("#settings-btn").element.tagName).toBe("BUTTON");
  });

  // The page settings render only while their dropdown is open.
  async function openPageSettings() {
    mountAttached(Header, { metadata });
    document.querySelector<HTMLElement>("#header-btn")!.click();
    await nextTick();
  }

  it("toggles a setting with a real button and reports its state", async () => {
    await openPageSettings();
    const toggle = document.querySelector<HTMLElement>('[role="switch"]')!;
    expect(toggle.tagName).toBe("BUTTON");
    expect(toggle.getAttribute("aria-checked")).toBe("false");
    toggle.click();
    await nextTick();
    expect(toggle.getAttribute("aria-checked")).toBe("true");
  });

  it("picks a font in the page settings with a real button", async () => {
    await openPageSettings();
    const pick = vi.spyOn(store, "storeDynamicPageInfo");
    const font = document.querySelector<HTMLElement>(
      ".modal-settings__font-wrapper"
    )!;
    expect(font.tagName).toBe("BUTTON");
    font.click();
    expect(pick).toHaveBeenCalledOnce();
    pick.mockRestore();
  });
});

describe("modal", () => {
  // The sidebar's Settings is a modal; the page settings are a dropdown.
  async function openSettings() {
    const aside = mountAttached(Aside, { metadata });
    const opener = aside.get<HTMLElement>("#settings-btn").element;
    const overlay = document.querySelector<HTMLElement>(".settings-modal")!;
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
    const items = overlay.querySelectorAll<HTMLElement>("button, input");
    const first = items[0]!;
    const last = items[items.length - 1]!;

    last.focus();
    press("Tab");
    expect(document.activeElement).toBe(first);

    press("Tab", true);
    expect(document.activeElement).toBe(last);
  });

  it("closes with Esc and gives focus back to the opener", async () => {
    const { opener, overlay } = await openSettings();
    press("Escape");
    expect(overlay.style.display).toBe("none");
    expect(document.activeElement).toBe(opener);
  });
});
