import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";
import Dropdown from "@core/components/Dropdown.vue";

const press = (el: Element) =>
  el.dispatchEvent(new Event("pointerdown", { bubbles: true }));

const outerOpen = ref(false);
const innerOpen = ref(false);

// An outer dropdown with an inner one in its content, both teleported to body.
const Nested = defineComponent({
  setup() {
    const anchor = document.createElement("button");
    return () =>
      h(
        Dropdown,
        {
          open: outerOpen.value,
          "onUpdate:open": (v: boolean) => (outerOpen.value = v),
          anchor,
        },
        () =>
          h(
            Dropdown,
            {
              open: innerOpen.value,
              "onUpdate:open": (v: boolean) => (innerOpen.value = v),
              anchor,
            },
            () => h("span", { class: "inner-item" }, "Option")
          )
      );
  },
});

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Dropdown", () => {
  it("lines up its right edge with the anchor when align is right", async () => {
    const anchor = document.createElement("button");
    anchor.getBoundingClientRect = () =>
      ({ bottom: 40, left: 900, right: 950 }) as DOMRect;
    const wrapper = mount(Dropdown, {
      props: { open: false, anchor, align: "right" },
      attachTo: document.body,
    });

    await wrapper.setProps({ open: true });
    const menu = document.querySelector<HTMLElement>(".dropdown")!;
    expect(menu.style.top).toBe("40px");
    expect(menu.style.right).toBe(
      `${document.documentElement.clientWidth - 950}px`
    );
    expect(menu.style.left).toBe("");
    wrapper.unmount();
  });

  it("keeps the outer dropdown open on a press inside a nested one", async () => {
    const wrapper = mount(Nested, { attachTo: document.body });
    outerOpen.value = true;
    await nextTick();
    innerOpen.value = true;
    await nextTick();
    expect(document.querySelectorAll(".dropdown")).toHaveLength(2);

    press(document.querySelector(".inner-item")!);
    await nextTick();
    expect(outerOpen.value).toBe(true);
    expect(innerOpen.value).toBe(true);

    press(document.body);
    await nextTick();
    expect(outerOpen.value).toBe(false);
    expect(innerOpen.value).toBe(false);
    wrapper.unmount();
  });
});
