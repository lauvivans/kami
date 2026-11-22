import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, inject, type Ref } from "vue";
import { mount } from "@vue/test-utils";
import { useModal } from "@core/hooks";

afterEach(() => {
  vi.useRealTimers();
});

// Same markup as Modal.vue: the overlay takes the ref that useModal provides.
const Overlay = defineComponent({
  props: { provideName: { type: String, required: true } },
  setup(props, { slots }) {
    const modalRef = inject<Ref<HTMLDivElement | null>>(props.provideName)!;
    return () =>
      h("div", { class: "overlay", ref: modalRef }, [
        h("dialog", slots.default?.()),
      ]);
  },
});

// A page modal with a settings menu nested inside it, as MainModalView has.
function mountModals() {
  let page!: ReturnType<typeof useModal>;
  let settings!: ReturnType<typeof useModal>;
  const SettingsMenu = defineComponent({
    setup() {
      settings = useModal({ provideName: "settings" });
      return () =>
        h(Overlay, { provideName: "settings" }, () =>
          h("button", { class: "option" })
        );
    },
  });
  const wrapper = mount(
    defineComponent({
      setup() {
        page = useModal({ provideName: "page" });
        return () => h(Overlay, { provideName: "page" }, () => h(SettingsMenu));
      },
    }),
    { attachTo: document.body }
  );
  const [pageEl, settingsEl] = wrapper
    .findAll(".overlay")
    .map((w) => w.element as HTMLElement) as [HTMLElement, HTMLElement];
  return { page, settings, pageEl, settingsEl, wrapper };
}

function open(modal: ReturnType<typeof useModal>) {
  modal.showModal();
  vi.advanceTimersByTime(250);
}

describe("useModal", () => {
  it("closes on a click on the overlay, not on the start of a touch", () => {
    vi.useFakeTimers();
    const { page, pageEl, wrapper } = mountModals();
    open(page);
    expect(pageEl.style.display).toBe("block");

    pageEl.dispatchEvent(new Event("touchstart", { bubbles: true }));
    expect(pageEl.style.display).toBe("block");

    pageEl.click();
    expect(pageEl.style.display).toBe("none");
    wrapper.unmount();
  });

  it("keeps the page modal open on a click inside its settings menu", () => {
    vi.useFakeTimers();
    const { page, settings, pageEl, settingsEl, wrapper } = mountModals();
    open(page);
    open(settings);

    (settingsEl.querySelector(".option") as HTMLElement).click();
    expect(settingsEl.style.display).toBe("block");
    expect(pageEl.style.display).toBe("block");

    settingsEl.click();
    expect(settingsEl.style.display).toBe("none");
    expect(pageEl.style.display).toBe("block");
    wrapper.unmount();
  });
});
