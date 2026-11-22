import { describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";
import { mount, RouterLinkStub } from "@vue/test-utils";
import MainModalView from "@core/components/Modal/MainModalView.vue";
import { useModal } from "@core/hooks";
import type { PageInfo } from "@core/@types";

const page: PageInfo = {
  id: "about",
  path: "/about",
  title: "About",
  component: {},
};

describe("Page modal settings menu", () => {
  it("closes without closing the page modal", async () => {
    vi.useFakeTimers();
    let modal!: ReturnType<typeof useModal>;
    const wrapper = mount(
      defineComponent({
        setup() {
          modal = useModal({ provideName: "page" });
          return () =>
            h(MainModalView, {
              provideName: "page",
              hideMainModal: modal.hideModal,
              addMainModalListener: modal.addModalListener,
              page,
            });
        },
      }),
      {
        attachTo: document.body,
        // Icon stubbed: Iconify fetches the icons over the network
        global: { stubs: { RouterLink: RouterLinkStub, Icon: true } },
      }
    );
    modal.showModal();
    vi.advanceTimersByTime(250);
    vi.useRealTimers();
    const overlay = document.querySelector<HTMLElement>(".overlay")!;
    expect(overlay.style.display).toBe("block");

    document.querySelector<HTMLElement>("#settings-btn")!.click();
    await wrapper.vm.$nextTick();
    const menu = document.querySelector(".dropdown")!;
    // Teleported outside the overlay, where useModal listens for clicks
    expect(overlay.contains(menu)).toBe(false);

    const header = overlay.querySelector<HTMLElement>(".page-modal__header")!;
    header.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    header.click();
    await wrapper.vm.$nextTick();
    expect(document.querySelector(".dropdown")).toBe(null);
    expect(overlay.style.display).toBe("block");
    wrapper.unmount();
  });
});
