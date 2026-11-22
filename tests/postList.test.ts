import { describe, expect, it } from "vitest";
import { mount, RouterLinkStub } from "@vue/test-utils";
import { PostList } from "@core/@client/components";
import type { PageInfo } from "@core/@types";

const global = { stubs: { RouterLink: RouterLinkStub } };
const page = (id: string, date?: string): PageInfo => ({
  id,
  path: `/posts/${id}`,
  title: `Title ${id}`,
  date,
  component: {},
});

describe("PostList", () => {
  it("groups posts by year and month, newest first", () => {
    const wrapper = mount(PostList, {
      props: {
        pages: {
          old: page("old", "2025-11-03"),
          b: page("b", "2026-11-01"),
          none: page("none"),
          a: page("a", "2026-11-20"),
          c: page("c", "2026-10-31"),
        },
      },
      global,
    });
    const sections = wrapper.findAll("section");
    expect(
      sections.map((s) => s.find("h4").exists() && s.find("h4").text())
    ).toEqual(["November 2026", "October 2026", "November 2025", false]);
    expect(
      sections[0]!.findAll("li").map((li) => li.find("span").text())
    ).toEqual(["Title a", "Title b"]);
    expect(sections[3]!.text()).toBe("Title none");
  });

  it("links each post to its page, with its date", () => {
    const wrapper = mount(PostList, {
      props: { pages: [page("a", "2026-11-01")] },
      global,
    });
    expect(wrapper.findComponent(RouterLinkStub).props("to")).toBe("/posts/a");
    const time = wrapper.find("time");
    expect(time.attributes("datetime")).toBe("2026-11-01");
    expect(time.text()).toBe("Nov 1, 2026");
  });

  it.each(["November 2026", "2026-1-5", "2026-13-40"])(
    "treats %s as no date instead of breaking the list",
    (date) => {
      const wrapper = mount(PostList, {
        props: { pages: [page("bad", date), page("a", "2026-11-01")] },
        global,
      });
      const sections = wrapper.findAll("section");
      expect(sections).toHaveLength(2);
      expect(sections[1]!.find("h4").exists()).toBe(false);
      expect(sections[1]!.find("time").exists()).toBe(false);
      expect(sections[1]!.text()).toBe("Title bad");
    }
  );

  it("names the months in the given locale", () => {
    const wrapper = mount(PostList, {
      props: { pages: [page("a", "2026-11-01")], locale: "pt-BR" },
      global,
    });
    expect(wrapper.find("h4").text()).toBe("novembro de 2026");
  });
});
