import { describe, expect, it } from "vitest";
import { mount, RouterLinkStub } from "@vue/test-utils";
import { Header } from "@core/components";
import { useStore } from "@core/store";
import type { IMetadata } from "@core/@types";

const metadata: IMetadata = {
  user: { author: "Ada", socialMedia: "" },
  pages: {},
  favorites: [],
};

describe("Header settings menu", () => {
  it("opens as a dropdown without an overlay and closes on a press outside or Escape", async () => {
    useStore.$reset();
    const wrapper = mount(Header, {
      props: { metadata },
      attachTo: document.body,
      // Icon stubbed: Iconify fetches the icons over the network
      global: { stubs: { RouterLink: RouterLinkStub, Icon: true } },
    });
    const button = wrapper.find("#header-btn");

    await button.trigger("click");
    expect(document.querySelector(".dropdown .modal-settings__style")).not.toBe(
      null
    );
    expect(document.querySelector(".overlay")).toBe(null);
    expect(document.body.style.pointerEvents).not.toBe("none");

    // Picking a font keeps the menu open
    document
      .querySelector(".modal-settings__font-wrapper")!
      .dispatchEvent(new Event("pointerdown", { bubbles: true }));
    await wrapper.vm.$nextTick();
    expect(document.querySelector(".dropdown")).not.toBe(null);

    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    await wrapper.vm.$nextTick();
    expect(document.querySelector(".dropdown")).toBe(null);

    await button.trigger("click");
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await wrapper.vm.$nextTick();
    expect(document.querySelector(".dropdown")).toBe(null);
    wrapper.unmount();
  });
});
