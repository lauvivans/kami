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

function mountOpenAside(mobile: boolean) {
  vi.spyOn(window, "matchMedia").mockReturnValue({
    matches: mobile,
    addEventListener: () => {},
    removeEventListener: () => {},
  } as unknown as MediaQueryList);
  localStorage.setItem("kami-aside", "true");
  store.$reset();
  store.storeIsAsideOpen(true);
  return shallowMount(Aside, { props: { metadata } });
}

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

  it("stays open on desktop", async () => {
    const wrapper = mountOpenAside(false);
    store.storeActivePage(page);
    await nextTick();
    expect(store.isAsideOpen).toBe(true);
    wrapper.unmount();
  });
});
