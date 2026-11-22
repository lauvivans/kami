import { afterEach, describe, expect, it } from "vitest";
import { Fragment, h } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import { ShowMore } from "@core/@client/components";

// Five blocks rendered with v-for, which reach the slot as one Fragment.
function mountList(limit?: number) {
  return mount(ShowMore, {
    attachTo: document.body,
    props: { limit },
    slots: {
      default: () =>
        h(
          Fragment,
          [1, 2, 3, 4, 5].map((n) => h("p", { key: n }, `Block ${n}`))
        ),
    },
  });
}

const shown = (wrapper: ReturnType<typeof mountList>) =>
  wrapper.findAll("p").map((p) => p.text());

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ShowMore", () => {
  it("shows the next blocks on each click and moves focus to the first new one", async () => {
    const wrapper = mountList(2);
    expect(shown(wrapper)).toEqual(["Block 1", "Block 2"]);
    expect(wrapper.find("button").text()).toBe("Show more");

    await wrapper.find("button").trigger("click");
    await flushPromises();
    expect(shown(wrapper)).toHaveLength(4);
    expect(document.activeElement?.textContent).toBe("Block 3");

    await wrapper.find("button").trigger("click");
    expect(shown(wrapper)).toHaveLength(5);
    expect(wrapper.find("button").text()).toBe("Show less");
  });

  it("collapses back to the limit with Show less", async () => {
    const wrapper = mountList(2);
    await wrapper.find("button").trigger("click");
    await wrapper.find("button").trigger("click");
    await wrapper.find("button").trigger("click");
    expect(shown(wrapper)).toEqual(["Block 1", "Block 2"]);
    expect(wrapper.find("button").text()).toBe("Show more");
  });

  it.each([undefined, 0, -1])(
    "shows every block and no button with limit %s",
    (limit) => {
      const wrapper = mountList(limit);
      expect(shown(wrapper)).toHaveLength(5);
      expect(wrapper.find("button").exists()).toBe(false);
    }
  );

  it("uses the given labels", async () => {
    const wrapper = mount(ShowMore, {
      props: { limit: 1, label: "Ver mais", lessLabel: "Ver menos" },
      slots: { default: () => [h("p", "A"), h("p", "B")] },
    });
    expect(wrapper.find("button").text()).toBe("Ver mais");
    await wrapper.find("button").trigger("click");
    expect(wrapper.find("button").text()).toBe("Ver menos");
  });
});
