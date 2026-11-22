import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, inject, type Ref } from "vue";
import { mount } from "@vue/test-utils";
import { useModal } from "@core/hooks";

afterEach(() => {
  vi.useRealTimers();
});

// The modal view injects the ref that useModal provides, as the app's modals do.
const ModalView = defineComponent({
  setup() {
    const modalRef = inject<Ref<HTMLDivElement | null>>("test-modal")!;
    return () => h("div", { ref: modalRef });
  },
});

function mountModal() {
  let modal!: ReturnType<typeof useModal>;
  const wrapper = mount(
    defineComponent({
      setup() {
        modal = useModal({ provideName: "test-modal" });
        return () => h(ModalView);
      },
    }),
    { attachTo: document.body }
  );
  return { modal, el: wrapper.element as HTMLDivElement };
}

describe("useModal", () => {
  it("closes on a click outside the modal, not on the start of a touch", () => {
    vi.useFakeTimers();
    const { modal, el } = mountModal();
    modal.showModal();
    vi.advanceTimersByTime(250);
    expect(el.style.display).toBe("block");

    document.body.dispatchEvent(new Event("touchstart", { bubbles: true }));
    expect(el.style.display).toBe("block");

    document.body.click();
    expect(el.style.display).toBe("none");
  });
});
