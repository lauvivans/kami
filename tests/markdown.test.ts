// The kami-markdown plugin turns a .md file into Kami blocks, and
// markdownPages turns the files into pages.
import { describe, expect, it } from "vitest";
import { mount, RouterLinkStub } from "@vue/test-utils";
import Post, { frontmatter } from "@/pages/demo/posts/first-espresso.md";
import { toModule } from "@core/vite/markdown";
import { markdownPages, type MarkdownModule } from "@core/index";

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
    expect(wrapper.find("ol.numbered-list").attributes("start")).toBe("1");
    expect(wrapper.findAll(".numbered-item")).toHaveLength(3);
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
      "a <b>{{ x }}</b> &amp; b `&amp;`\n\n| a |\n|---|\n| 1 |\n",
      "kami"
    );
    expect(code).toContain(JSON.stringify("a "));
    expect(code).toContain(JSON.stringify(" & b "));
    expect(code).toContain(`() => ${JSON.stringify("&amp;")}`);
    expect(new Set(warnings)).toEqual(new Set(["raw HTML is dropped"]));
    expect(toModule("<div>a</div>\n", "kami").warnings).toContain(
      "raw HTML is dropped"
    );
  });

  it("renders a GFM table with its header row and alignment", () => {
    const wrapper = mountPost();
    const table = wrapper.find(".table table");
    expect(table.findAll("thead th").map((th) => th.text())).toEqual([
      "Drink",
      "Dose",
      "Yield",
    ]);
    expect(table.find("th").attributes("scope")).toBe("col");
    expect(table.findAll("tbody tr")).toHaveLength(3);
    expect(table.find("tbody td strong").text()).toBe("Espresso");
    const [name, dose] = table.findAll("tbody tr")[0]!.findAll("td");
    expect(name!.attributes("style")).toBeUndefined();
    expect(dose!.attributes("style")).toContain("text-align: right");
  });

  it("maps a header-only table without warnings", () => {
    const { code, warnings } = toModule("| a | b |\n|:-:|---|\n", "kami");
    expect(code).toContain(
      `h(Table, null, () => [h("thead", null, [h("tr", null, [h("th", { scope: "col", style: { textAlign: "center" } }, ["a"]), h("th", { scope: "col" }, ["b"])])])])`
    );
    expect(warnings).toEqual([]);
  });

  it("keeps the start number of a numbered list", () => {
    const { code, warnings } = toModule("3. c\n4. d\n", "kami");
    expect(code).toContain("h(NumberedList, { start: 3 }");
    expect(code).toContain(`h(NumberedItem, null, () => ["c"])`);
    expect(warnings).toEqual([]);
    expect(toModule("1. a\n", "kami").code).toContain("h(NumberedList, null");
  });

  it("bundles a relative image and keeps a public path", () => {
    const { code } = toModule(
      "![Alt](./photo.png)\n\nA logo ![Logo](/icons/a.png) here\n",
      "kami"
    );
    expect(code).toContain(`import __img0 from "./photo.png";`);
    expect(code).toContain(`h(Image, { src: __img0, alt: "Alt" })`);
    expect(code).toContain(
      `h(Text, null, () => ["A logo ", h(Image, { src: "/icons/a.png", alt: "Logo" }), " here"])`
    );
  });

  it("builds one page per file, newest first", () => {
    const post = (frontmatter: MarkdownModule["frontmatter"]) => ({
      default: Post,
      frontmatter,
    });
    const pages = markdownPages(
      {
        "./posts/old.md": post({ title: "Old", date: "2025-03-01" }),
        "./posts/untitled.md": post({}),
        "./posts/new.md": post({
          title: "New",
          date: "2026-11-20",
          icon: { path: "/icons/new.png" },
        }),
      },
      { parentPage: "blog", path: "/blog/" }
    );
    expect(Object.keys(pages)).toEqual(["new", "old", "untitled"]);
    expect(pages.new).toMatchObject({
      id: "new",
      path: "/blog/new",
      title: "New",
      date: "2026-11-20",
      icon: { path: "/icons/new.png" },
      parentPage: "blog",
      component: Post,
    });
    expect(pages.untitled?.title).toBe("untitled");
  });
});
