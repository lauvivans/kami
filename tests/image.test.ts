import { afterEach, describe, expect, it } from "vitest";
import { h } from "vue";
import { mount } from "@vue/test-utils";
import { BulletItem, Image } from "@core/index.ts";

// Icon stubbed: Iconify fetches the icons over the network
const global = { stubs: { Icon: true } };

function mountImage(props: Record<string, unknown> = {}) {
  return mount(Image, {
    attachTo: document.body,
    props: { src: "/shot.png", alt: "A screenshot", ...props },
    global,
  });
}

const viewer = () => document.querySelector<HTMLDialogElement>(".image-viewer");

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Image", () => {
  it("opens the viewer on click, with the same alt in the page and the viewer", async () => {
    const wrapper = mountImage();
    expect(viewer()!.open).toBe(false);

    await wrapper.find("button").trigger("click");
    expect(viewer()!.open).toBe(true);

    const alts = [...document.querySelectorAll("img")].map((img) => img.alt);
    expect(alts).toEqual(["A screenshot", "A screenshot"]);
  });

  it("renders the page image inside a native button, so Enter and Space open it", () => {
    const wrapper = mountImage();
    const trigger = wrapper.find("button");
    expect(trigger.attributes("type")).toBe("button");
    expect(trigger.find("img").exists()).toBe(true);
  });

  it("names the button when the image is decorative", () => {
    const wrapper = mountImage({ alt: undefined });
    expect(wrapper.find("img").attributes("alt")).toBe("");
    expect(wrapper.find("button").attributes("aria-label")).toBe("Open image");
  });

  it.each([
    ["the close button", () => viewer()!.querySelector("button")!.click()],
    ["a click on the backdrop", () => viewer()!.click()],
    // what the browser does on Escape
    ["Escape", () => viewer()!.close()],
  ])("closes with %s and moves focus back to the image", async (_, act) => {
    const wrapper = mountImage();
    await wrapper.find("button").trigger("click");

    act();
    expect(viewer()!.open).toBe(false);
    expect(document.activeElement).toBe(wrapper.find("button").element);
  });

  it("stays open on a click on the image itself", async () => {
    const wrapper = mountImage();
    await wrapper.find("button").trigger("click");

    viewer()!.querySelector("img")!.click();
    expect(viewer()!.open).toBe(true);
  });

  it("doesn't open with zoomable set to false", () => {
    const wrapper = mountImage({ zoomable: false });
    expect(wrapper.find("button").exists()).toBe(false);
    expect(viewer()).toBe(null);
  });

  it("doesn't open inside a list item", () => {
    const wrapper = mount(BulletItem, {
      attachTo: document.body,
      slots: { default: () => h(Image, { src: "/icon.png" }) },
      global,
    });
    expect(wrapper.find(".img-wrapper button").exists()).toBe(false);
    expect(viewer()).toBe(null);
  });
});
