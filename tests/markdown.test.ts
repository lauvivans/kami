// Spike #174: the kami-markdown plugin turns a .md file into Kami blocks.
import { describe, expect, it } from "vitest";
import { mount, RouterLinkStub } from "@vue/test-utils";
import Post, { frontmatter } from "@/pages/demo/posts/first-espresso.md";
import { toModule } from "@core/vite/markdown";

const mountPost = () =>
  mount(Post, { global: { stubs: { RouterLink: RouterLinkStub } } });

describe("markdown pages", () => {
  it("exports the front matter", () => {
    expect(frontmatter).toMatchObject({
      title: "Pulling a first espresso",
      date: "2026-11-20",
      banner: { path: "/banners/page-example.webp" },
    });
  });

  it("renders Markdown elements as Kami blocks", () => {
    const wrapper = mountPost();
    expect(wrapper.find("h2.heading").text()).toBe("What you need");
    expect(wrapper.find("h3.heading").text()).toBe("Checklist");
    expect(wrapper.find("p.text strong").text()).toBe("Markdown file");
    expect(wrapper.findAll(".bullet-item")).toHaveLength(3);
    expect(wrapper.findAll(".todo-item")).toHaveLength(3);
    expect(wrapper.find(".todo-item__checkbox").element).toHaveProperty(
      "checked",
      true
    );
    expect(wrapper.find("blockquote.quote").text()).toContain("Sour means");
    expect(wrapper.find(".divider").exists()).toBe(true);
    expect(wrapper.find("code.code--inline").text()).toBe("Date.now()");
  });

  it("highlights code with Code and links pages through the router", () => {
    const wrapper = mountPost();
    expect(wrapper.find("pre.code--block .hljs-keyword").text()).toBe("const");
    expect(wrapper.findComponent(RouterLinkStub).props("to")).toBe(
      "/demo/coffee-shop/menu"
    );
  });

  it("keeps text as text and warns about what has no block", () => {
    const { code, warnings } = toModule(
      "a <b>{{ x }}</b> &amp; b\n\n| a |\n|---|\n| 1 |\n",
      "kami"
    );
    expect(code).toContain(JSON.stringify("a "));
    expect(code).toContain(JSON.stringify(" & b"));
    expect(warnings).toContain('block "table" is not supported');
  });
});
