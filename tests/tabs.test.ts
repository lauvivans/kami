import { beforeEach, describe, expect, it } from "vitest";
import { shallowMount, type VueWrapper } from "@vue/test-utils";
import Tabs from "@core/components/Tabs.vue";
import { useStore } from "@core/store";

const store = useStore;
const tab = (id: string) => ({ pageId: id, pageName: id, pagePath: `/${id}` });

// A tap fires touchstart and then click, so each handler must run on click only.
async function tap(wrapper: VueWrapper, selector: string) {
  const el = wrapper.find(selector);
  await el.trigger("touchstart");
  await el.trigger("click");
}

beforeEach(() => {
  localStorage.clear();
  store.$reset();
  store.storeActivePage({ id: "a", path: "/a", title: "a", component: {} });
  store.storeTabs([tab("a"), tab("b"), tab("c")]);
  store.storeActiveTab(0);
});

describe("Tabs on a touch device", () => {
  it("opens one tab when the add button is tapped", async () => {
    const wrapper = shallowMount(Tabs);
    await tap(wrapper, ".tabs__add");
    expect(store.tabs).toHaveLength(4);
  });

  it("closes only the tapped tab", async () => {
    const wrapper = shallowMount(Tabs);
    await tap(wrapper, ".tabs__tab:nth-child(2) .tabs__tab--close");
    expect(store.tabs.map((t) => t.pageId)).toEqual(["a", "c"]);
  });

  it("does not switch tabs when a scroll starts over one", async () => {
    const wrapper = shallowMount(Tabs);
    await wrapper.find(".tabs__tab:nth-child(3)").trigger("touchstart");
    expect(store.activeTab).toBe(0);
  });

  it("switches tabs on a click", async () => {
    const wrapper = shallowMount(Tabs);
    await wrapper.find(".tabs__tab:nth-child(3)").trigger("click");
    expect(store.activeTab).toBe(2);
    expect(wrapper.emitted("navigate")).toEqual([["/c"]]);
  });
});
