import { afterEach, describe, expect, it, vi } from "vitest";
import { mount, RouterLinkStub } from "@vue/test-utils";
import { Breadcrumb } from "@core/@client/components";
import { useStore } from "@core/store";
import type { IMetadata, PageInfo } from "@core/@types";

const store = useStore;

const ids = ["a", "b", "c", "d", "e"];
const pages: Record<string, PageInfo> = Object.fromEntries(
  ids.map((id, i) => [
    id,
    {
      id,
      path: `/${id}`,
      title: id.toUpperCase(),
      component: {},
      parentPage: i ? ids[i - 1] : undefined,
    },
  ])
);
const metadata: IMetadata = {
  user: { author: "Ada", socialMedia: "" },
  pages,
  favorites: [],
};

function mountAt(pageId: string) {
  store.$reset();
  store.storeActivePage(pages[pageId]!);
  return mount(Breadcrumb, {
    props: { metadata },
    attrs: { class: "custom" },
    global: { stubs: { RouterLink: RouterLinkStub, teleport: true } },
  });
}

const crumbText = (wrapper: ReturnType<typeof mountAt>) =>
  wrapper.findAll(".breadcrumb__crumb").map((c) => c.find("div").text());

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Breadcrumb", () => {
  it("shows the full path up to 3 levels", () => {
    const wrapper = mountAt("c");
    expect(crumbText(wrapper)).toEqual(["A", "B", "C"]);
    expect(wrapper.find(".breadcrumb").classes()).toContain("custom");
    expect(wrapper.find(".breadcrumb__menu a").exists()).toBe(false);
  });

  it("collapses the middle pages of a deeper path into …", async () => {
    const wrapper = mountAt("e");
    expect(crumbText(wrapper)).toEqual(["A", "…", "D", "E"]);
    expect(wrapper.find(".breadcrumb__menu").exists()).toBe(false);

    await wrapper.find("button").trigger("click");
    const hidden = wrapper.findAll(".breadcrumb__menu a");
    expect(hidden.map((a) => a.text())).toEqual(["B", "C"]);
  });

  it("closes the menu on a press outside it or on Escape, without blocking the page", async () => {
    const wrapper = mountAt("e");
    const more = wrapper.find("button");

    await more.trigger("click");
    expect(document.body.style.pointerEvents).not.toBe("none");
    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".breadcrumb__menu").exists()).toBe(false);

    await more.trigger("click");
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".breadcrumb__menu").exists()).toBe(false);
    wrapper.unmount();
  });

  it("navigates to a hidden page from the menu", async () => {
    const updateTabs = vi.spyOn(store, "storeUpdateTabs");
    const wrapper = mountAt("e");
    await wrapper.find("button").trigger("click");
    const links = wrapper.findAllComponents(RouterLinkStub);
    const b = links.find((l) => l.text() === "B")!;
    expect(b.props("to")).toBe("/b");
    await b.trigger("click");
    expect(updateTabs).toHaveBeenCalledWith(pages.b);
  });
});
