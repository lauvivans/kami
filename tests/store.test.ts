import { beforeEach, describe, expect, it } from "vitest";
import { useStore } from "@core/store";
import type { PageInfo } from "@core/@types";
import { LOCAL_STORAGE_THEME } from "@core/util/local-storage/constants";
import { setActiveTab, setTabs } from "@core/util/local-storage";

const store = useStore;

const page = (id: string): PageInfo => ({
  id,
  path: `/${id}`,
  title: id,
  component: {},
});

beforeEach(() => {
  localStorage.clear();
  store.$reset();
});

describe("settings store", () => {
  it("starts with defaults when nothing is saved", () => {
    expect(store.theme).toBe("light-theme");
    expect(store.tabs).toEqual([]);
    expect(store.activeTab).toBe(0);
    expect(store.isAsideOpen).toBe(false);
  });

  it("loads the saved theme and ignores unknown ones", () => {
    localStorage.setItem(LOCAL_STORAGE_THEME, "cat-mocha");
    store.$reset();
    expect(store.theme).toBe("cat-mocha");

    localStorage.setItem(LOCAL_STORAGE_THEME, "neon");
    store.$reset();
    expect(store.theme).toBe("light-theme");
  });

  it("opens the first tab, then replaces the active one", () => {
    store.storeUpdateTabs(page("home"));
    expect(store.tabs).toEqual([
      { pageId: "home", pageName: "home", pagePath: "/home" },
    ]);

    store.storeUpdateTabs(page("about"));
    expect(store.tabs).toHaveLength(1);
    expect(store.tabs[0]?.pageId).toBe("about");
  });

  it("drops restored tabs whose page left the metadata", () => {
    const tab = (id: string) => ({
      pageId: id,
      pageName: id,
      pagePath: `/${id}`,
    });
    setTabs([tab("home"), tab("removed"), tab("about")]);
    setActiveTab(2);
    store.$reset();

    store.storeDropStaleTabs({ home: page("home"), about: page("about") });
    expect(store.tabs).toEqual([tab("home"), tab("about")]);
    expect(store.activeTab).toBe(1);
  });

  it("falls back to the first tab when the active one is dropped", () => {
    setTabs([
      { pageId: "home", pageName: "home", pagePath: "/home" },
      { pageId: "about", pageName: "about", pagePath: "/old-about" },
    ]);
    setActiveTab(1);
    store.$reset();

    store.storeDropStaleTabs({ home: page("home"), about: page("about") });
    expect(store.tabs.map((t) => t.pageId)).toEqual(["home"]);
    expect(store.activeTab).toBe(0);

    store.storeDropStaleTabs({});
    expect(store.tabs).toEqual([]);
    expect(store.activeTab).toBe(0);
  });

  it("gives the current page default settings", () => {
    expect(store.getDynamicCurrentPageInfo).toBeUndefined();

    store.storeUpdateTabs(page("home"));
    expect(store.getDynamicCurrentPageInfo).toEqual({
      pageId: "home",
      settings: {
        fontFamily: "font-roboto",
        fontSize: "font-size-default",
        pageSize: "page-default-width",
      },
    });
  });

  it("saves settings for the current page only", () => {
    setTabs([{ pageId: "home", pageName: "home", pagePath: "/home" }]);
    store.$reset();
    store.dynamicPageInfo = {
      about: {
        settings: {
          fontFamily: "font-roboto-serif",
          fontSize: "font-size-small",
          pageSize: "page-default-width",
        },
      },
    };
    store.storeActivePage(page("home"));

    store.storeDynamicPageInfo({ fontFamily: "font-roboto-mono" });
    store.storeDynamicPageInfo({ pageSize: "page-full-width" });

    expect(store.dynamicPageInfo).toEqual({
      about: {
        settings: {
          fontFamily: "font-roboto-serif",
          fontSize: "font-size-small",
          pageSize: "page-default-width",
        },
      },
      home: {
        settings: {
          fontFamily: "font-roboto-mono",
          fontSize: "font-size-default",
          pageSize: "page-full-width",
        },
      },
    });
  });
});
