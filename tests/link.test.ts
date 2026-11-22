import { describe, expect, it } from "vitest";
import { mount, RouterLinkStub } from "@vue/test-utils";
import { Link, LinkMention } from "@core/@client/components";
import type { PageInfo } from "@core/@types";

const global = { stubs: { RouterLink: RouterLinkStub } };
const page: PageInfo = {
  id: "projects",
  path: "/my-projects",
  title: "My projects",
  component: {},
};

function expectExternal(wrapper: ReturnType<typeof mount>, href: string) {
  expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(false);
  const a = wrapper.find("a");
  expect(a.attributes()).toMatchObject({
    href,
    target: "_blank",
    rel: "noopener",
  });
}

describe("Link", () => {
  it("navigates to a portfolio page in the same tab", () => {
    const wrapper = mount(Link, {
      props: { href: "/my-projects" },
      slots: { default: "Go to my projects" },
      global,
    });
    const link = wrapper.findComponent(RouterLinkStub);
    expect(link.props("to")).toBe("/my-projects");
    expect(wrapper.find("a").attributes("target")).toBeUndefined();
    expect(wrapper.text()).toBe("Go to my projects");
  });

  it.each(["https://vuejs.org/", "//vuejs.org/"])(
    "opens %s in a new tab",
    (href) => {
      expectExternal(mount(Link, { props: { href }, global }), href);
    }
  );
});

describe("LinkMention", () => {
  it("shows the page title by default", () => {
    const wrapper = mount(LinkMention, {
      props: { page, emoji: "🚀" },
      global,
    });
    expect(wrapper.findComponent(RouterLinkStub).props("to")).toBe(
      "/my-projects"
    );
    expect(wrapper.find("span").text()).toBe("My projects");
  });

  it("shows custom text for a page", () => {
    const wrapper = mount(LinkMention, {
      props: { page, emoji: "🚀" },
      slots: { default: "Go to my projects" },
      global,
    });
    expect(wrapper.find("span").text()).toBe("Go to my projects");
  });

  it("navigates to an href that is a portfolio page", () => {
    const wrapper = mount(LinkMention, {
      props: { href: "/my-projects", emoji: "🚀" },
      slots: { default: "Go to my projects" },
      global,
    });
    expect(wrapper.findComponent(RouterLinkStub).props("to")).toBe(
      "/my-projects"
    );
    expect(wrapper.find("span").text()).toBe("Go to my projects");
  });

  it("opens another site in a new tab", () => {
    const href = "https://github.com/lauvivans/kami";
    const wrapper = mount(LinkMention, {
      props: { href, emoji: "🐙" },
      slots: { default: "GitHub" },
      global,
    });
    expectExternal(wrapper, href);
    expect(wrapper.find("span").text()).toBe("GitHub");
  });

  it.each([
    ["https://github.com/lauvivans/kami", "github.com/lauvivans/kami"],
    ["/my-projects", "/my-projects"],
  ])("shows %s as %s when there is no text", (href, text) => {
    const wrapper = mount(LinkMention, {
      props: { href, emoji: "🐙" },
      global,
    });
    expect(wrapper.find("span").text()).toBe(text);
  });
});
