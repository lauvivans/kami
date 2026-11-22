// Spike #174: the module the kami-markdown plugin makes from each .md file.
declare module "*.md" {
  import type { Component } from "vue";
  export const frontmatter: Record<string, unknown>;
  const component: Component;
  export default component;
}
