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
  vi.restoreAllMocks();
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

  it("shows nothing on a touch tap", async () => {
    const wrapper = mountLink(300);
    await wrapper.find("a").trigger("pointerenter", { pointerType: "touch" });
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

  it("stays inside the viewport near its bottom right corner", async () => {
    const [clientWidth, clientHeight] = [1000, 800];
    vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(
      clientWidth
    );
    vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(
      clientHeight
    );
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        return (this.getAttribute("role") === "tooltip"
          ? { width: 200, height: 20 }
          : {
              top: clientHeight - 28,
              bottom: clientHeight,
              left: clientWidth - 50,
            }) as unknown as DOMRect;
      }
    );
    const wrapper = mountLink(300);
    await wrapper.find("a").trigger("pointerenter");
    vi.runAllTimers();
    await flushPromises();
    expect(tooltip()!.style.top).toBe(`${clientHeight - 48}px`);
    expect(tooltip()!.style.left).toBe(`${clientWidth - 200}px`);
  });
});
