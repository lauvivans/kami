import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { shallowMount } from "@vue/test-utils";
import { Aside } from "@core/components";
import { useStore } from "@core/store";
import type { IMetadata, PageInfo } from "@core/@types";

const store = useStore;
const metadata: IMetadata = {
  user: { author: "Ada", socialMedia: "" },
  pages: {},
  favorites: [],
};
const page: PageInfo = {
  id: "about",
  path: "/about",
  title: "About",
  component: {},
};

function mountAside(mobile: boolean, open: boolean, hover = true) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query) =>
      ({
        matches: query === "(hover: hover)" ? hover : mobile,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList
  );
  localStorage.setItem("kami-aside", String(open));
  store.$reset();
  store.storeIsAsideOpen(open);
  return shallowMount(Aside, { props: { metadata }, attachTo: document.body });
}

const mountOpenAside = (mobile: boolean) => mountAside(mobile, true);

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("Aside after navigation", () => {
  it("closes on mobile", async () => {
    const wrapper = mountOpenAside(true);
    store.storeActivePage(page);
    await nextTick();
    expect(store.isAsideOpen).toBe(false);
    wrapper.unmount();
  });

  it("closes the floating sidebar on mobile", async () => {
    const wrapper = mountAside(true, false);
    await wrapper.find(".nav-wrapper").trigger("mouseenter");
    expect(wrapper.find("nav").classes()).toContain("nav-hover");
    store.storeActivePage(page);
    await nextTick();
    expect(wrapper.find("nav").classes()).not.toContain("nav-hover");
    wrapper.unmount();
  });

  it("stays open on desktop", async () => {
    const wrapper = mountOpenAside(false);
    store.storeActivePage(page);
    await nextTick();
    expect(store.isAsideOpen).toBe(true);
    wrapper.unmount();
  });
});

describe("Aside button", () => {
  it("toggles the sidebar once on a tap", async () => {
    const wrapper = mountAside(true, false);
    const button = wrapper.find("#nav-btn");
    await button.trigger("touchstart");
    await button.trigger("click");
    expect(store.isAsideOpen).toBe(true);
    wrapper.unmount();
  });

  it("closes without the floating sidebar on a screen without hover", async () => {
    const wrapper = mountAside(true, true, false);
    await wrapper.find("#nav-btn").trigger("click");
    expect(store.isAsideOpen).toBe(false);
    expect(wrapper.find("nav").classes()).not.toContain("nav-hover");
    wrapper.unmount();
  });
});

describe("Floating sidebar", () => {
  it("opens after closing the sidebar on desktop", async () => {
    const wrapper = mountOpenAside(false);
    await wrapper.find("#nav-btn").trigger("click");
    expect(wrapper.find("nav").classes()).toContain("nav-hover");
    wrapper.unmount();
  });

  it("closes when the mouse leaves it", async () => {
    const wrapper = mountAside(false, false);
    await wrapper.find(".nav-wrapper").trigger("mouseenter");
    expect(wrapper.find("nav").classes()).toContain("nav-hover");
    await wrapper.find(".nav-wrapper").trigger("mouseleave");
    expect(wrapper.find("nav").classes()).not.toContain("nav-hover");
    wrapper.unmount();
  });

  it("closes on a press outside it and stays open on a press inside", async () => {
    const wrapper = mountAside(false, false);
    await wrapper.find(".nav-wrapper").trigger("mouseenter");
    await wrapper.find(".nav-list").trigger("pointerdown");
    expect(wrapper.find("nav").classes()).toContain("nav-hover");
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    await nextTick();
    expect(wrapper.find("nav").classes()).not.toContain("nav-hover");
    wrapper.unmount();
  });
});
