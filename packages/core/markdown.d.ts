// The module the kami-markdown plugin (@lauvivans/kami/vite) builds from each
// .md file. Portfolios load it with "types": ["@lauvivans/kami/markdown"].
// The front matter matches MarkdownFrontmatter; it is written out here since an
// ambient module can't import from the package.
declare module "*.md" {
  import type { Component } from "vue";

  interface Credit {
    path: string;
    author?: string;
    link?: string;
  }

  export const frontmatter: {
    title?: string;
    date?: string;
    banner?: Credit;
    icon?: Credit;
    [key: string]: unknown;
  };
  const component: Component;
  export default component;
}
