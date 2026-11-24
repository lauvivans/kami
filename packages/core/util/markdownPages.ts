import type { MarkdownModule, PagesInfo } from "@core/@types";

export interface MarkdownPagesOptions {
  // The base path of the pages: "/blog" puts blog/first-post.md at /blog/first-post.
  path: string;
  // The id of the page that lists them in the sidebar.
  parentPage?: string;
}

// Builds one page per Markdown file from an eager import.meta.glob, newest
// first. The id is the file name, so it must be unique across the portfolio.
const markdownPages = (
  files: Record<string, MarkdownModule>,
  { path, parentPage }: MarkdownPagesOptions
): PagesInfo => {
  const base = path.replace(/\/+$/, "");
  const pages = Object.entries(files).map(([file, post]) => {
    const id = file.split("/").pop()!.replace(/\.md$/, "");
    const { title, date, banner, icon } = post.frontmatter;
    return {
      id,
      path: `${base}/${id}`,
      title: title ?? id,
      date: date === undefined ? undefined : String(date),
      banner,
      icon,
      parentPage,
      component: post.default,
    };
  });
  // ISO dates sort as text; posts without a date go last.
  pages.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  return Object.fromEntries(pages.map((page) => [page.id, page]));
};

export default markdownPages;
