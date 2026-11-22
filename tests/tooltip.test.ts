import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import Tooltip from "@core/components/Tooltip.vue";

// A link with the tooltip text inside, like a sidebar item.
function mountLink(scrollWidth: number) {
  const Link = defineComponent(
    () => () =>
      h("a", { href: "/page" }, [h(Tooltip, { text: "A long page title" })])
  );
  const wrapper = mount(Link, { attachTo: document.body });
  const text = wrapper.find(".ellipsis").element;
  Object.defineProperty(text, "scrollWidth", { value: scrollWidth });
  Object.defineProperty(text, "clientWidth", { value: 100 });
  return wrapper;
}

const tooltip = () => document.querySelector<HTMLElement>("[role=tooltip]");

beforeEach(() => vi.useFakeTimers());

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

describe("Tooltip", () => {
  it("shows the full text on hover when it is cut off", async () => {
    const wrapper = mountLink(300);
    await wrapper.find("a").trigger("pointerenter");
    expect(tooltip()).toBeNull();

    vi.runAllTimers();
    await flushPromises();
    expect(tooltip()?.textContent?.trim()).toBe("A long page title");
    expect(wrapper.find("a").attributes("aria-describedby")).toBe(
      tooltip()?.id
    );

    await wrapper.find("a").trigger("pointerleave");
    expect(tooltip()).toBeNull();
    expect(wrapper.find("a").attributes("aria-describedby")).toBeUndefined();
  });

  it("shows nothing when the text fits", async () => {
    const wrapper = mountLink(100);
    await wrapper.find("a").trigger("pointerenter");
    vi.runAllTimers();
    await flushPromises();
    expect(tooltip()).toBeNull();
  });

  it("shows on keyboard focus and hides on Escape", async () => {
    const wrapper = mountLink(300);
    await wrapper.find("a").trigger("focusin");
    vi.runAllTimers();
    await flushPromises();
    expect(tooltip()).not.toBeNull();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();
    expect(tooltip()).toBeNull();
  });
});
