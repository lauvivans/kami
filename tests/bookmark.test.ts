import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { Bookmark } from "@core/@client/components";

const link = "https://github.com/lauvivans/kami";

describe("Bookmark", () => {
  it("shows the title and the URL without the protocol", () => {
    const wrapper = mount(Bookmark, { props: { title: "Kami", link } });
    expect(wrapper.find(".bookmark__title").text()).toBe("Kami");
    expect(wrapper.find(".bookmark__url").text()).toBe(
      "github.com/lauvivans/kami"
    );
    expect(wrapper.find(".bookmark__subtitle").exists()).toBe(false);
    expect(wrapper.find(".bookmark__icon").exists()).toBe(false);
  });

  it("shows the icon before the URL", () => {
    const wrapper = mount(Bookmark, {
      props: { title: "Kami", link, icon: "/icons/page-example.png" },
    });
    const url = wrapper.find(".bookmark__url");
    const icon = url.element.firstElementChild;
    expect(icon?.classList.contains("bookmark__icon")).toBe(true);
    expect(icon?.getAttribute("src")).toBe("/icons/page-example.png");
  });
});
