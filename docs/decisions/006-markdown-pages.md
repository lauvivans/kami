# 006 · Markdown pages

- **Date:** 2026-11-22
- **Origin:** spike [#174](https://github.com/lauvivans/kami/issues/174)
- **Status:** accepted, implemented in [#225](https://github.com/lauvivans/kami/issues/225)

## Question

How can a portfolio author write a page, such as a blog post, as a Markdown file and have Kami render it with its own blocks, in the sidebar and with the same look as any other page?

## Short answer

- **Kami ships its own Vite plugin** that turns each `.md` file into a Vue component at build time. It reads the file with the lexer of [`marked`](https://github.com/markedjs/marked) and maps each Markdown element to a Kami block (`Heading`, `Text`, `Code`, `Quote`, `Image`, `Divider`, `Link`, bullet and to-do lists). The output is a render function, so no Markdown parser reaches the browser.
- **Front matter becomes `PageInfo`.** The plugin parses it with [`yaml`](https://github.com/eemeli/yaml) and exports it from the module as `frontmatter`. A small helper builds the pages from `import.meta.glob`, so the sidebar and a posts list come from the files.
- **The run time parser and a parser of Kami's own were dropped**: the first adds 15.6 kB gzip to every portfolio, the second means maintaining Markdown's edge cases by hand.

## How it works

The proof of concept is on branch `spike/174-markdown-pages`. The post `src/pages/demo/posts/first-espresso.md` shows up under Demo in the documentation site.

- `packages/core/vite/markdown.ts` (160 lines) is the plugin. It runs before `@vitejs/plugin-vue`, splits the front matter, lexes the body and generates a module:

  ```ts
  import { h, defineComponent } from "vue";
  import {
    Text,
    Heading,
    BulletList,
    BulletItem /* … */,
  } from "@lauvivans/kami";
  export const frontmatter = {
    title: "Pulling a first espresso",
    date: "2026-11-20" /* … */,
  };
  export default defineComponent({
    render: () => [h(Heading, { level: 2 }, () => ["What you need"]) /* … */],
  });
  ```

- Every piece of text goes into the module as a JSON string, rendered as a text node. Nothing in the file is compiled as a Vue template, so `{{ }}` or HTML in a post can't run code. Raw HTML is dropped, and the plugin prints a warning for it and for every element that has no block.
- A fenced block with a language that `Code` highlights (`bash`, `html`, `js`, `json`, `scss`, `ts`, `vue`) gets highlighted; other languages show as plain code.
- An image alone on its line is an `Image` block, with the full-screen viewer. A relative path (`./photo.png`) becomes an import, so Vite bundles the file next to the post.
- `src/metadata/index.ts` reads the posts with `import.meta.glob("../pages/demo/posts/*.md", { eager: true })` and builds one `PageInfo` per file: the id and path come from the file name, title, banner and icon from the front matter, and `parentPage` is the page that lists them.
- `tests/markdown.test.ts` mounts the post and checks each block, the highlighting, the router link and the front matter.

The generated module for the sample post is 906 bytes gzip for a 979-byte Markdown file. The documentation site's bundle has no trace of `marked`.

## Options compared

### Build time, Kami's own Vite plugin (chosen)

- Nothing changes at run time: the page is a component like any other, with the same blocks, themes, font settings and width.
- Build dependencies: `marked` (no dependencies, published from GitHub Actions with provenance) and `yaml` (no dependencies, already in the tree through `vite` and `lint-staged`).
- It needs one line in the portfolio's `vite.config.ts` and a type declaration for `*.md`, both in the template.
- Kami keeps the mapping code, about 160 lines. `marked` handles the Markdown rules (nesting, emphasis, escapes, GFM task lists and tables), and the plugin only walks its tokens.

### Build time, `unplugin-vue-markdown`

- It turns `.md` into a Vue SFC with markdown-it and supports front matter and Vue components in Markdown.
- It brings six direct dependencies (`markdown-exit`, `unplugin`, `unplugin-utils` and three `@mdit-vue/*` packages) and their trees.
- It renders HTML (`<h2>`, `<p>`) and compiles it as a Vue template. Getting Kami blocks means overriding markdown-it's render rules to print component tags, and text in the file is then template code, so `{{ }}` in a post needs escaping. Kami's plugin does the mapping directly on tokens with fewer packages.

### Run time, a `Markdown` block

- The page imports the file with `?raw` and a `Markdown` block parses it on each visit.
- The parser ships to the browser: `marked` is 15.6 kB gzip (`lib/marked.esm.js`) and `markdown-it` 41.3 kB (`dist/browser/markdown-it.umd.min.js`). The documentation site's whole bundle is 91.7 kB gzip today.
- Front matter has to be parsed at run time too, or kept out of the file, and the sidebar can only be built after every file is fetched and parsed.

### Kami's own parser

- A subset (headings, paragraphs, lists, links, images, code, quotes) looks small, but nested lists, lazy continuation lines, emphasis rules, escapes and reference links are where Markdown parsers spend their code.
- Posts written for other tools would break in ways that are hard to explain to authors. Lexing is the part `marked` already does with no dependencies, so writing it buys nothing.

## Elements without a block

| Markdown        | Today in the plugin          | Plan                    |
| --------------- | ---------------------------- | ----------------------- |
| Numbered list   | Rendered as a bullet list    | New numbered list block |
| Table (GFM)     | Dropped, with a warning      | New table block         |
| Heading 5 and 6 | Rendered as level 4          | Keep                    |
| Footnote        | Not parsed (not in `marked`) | Out of scope            |
| Raw HTML        | Dropped, with a warning      | Keep, for safety        |
| Quote           | `Quote` block                | Done                    |

## Consequences

- **The plugin ships with the library** as a subpath export (`@lauvivans/kami/vite`), built for Node in a second entry. The browser entry stays as it is. `marked` and `yaml` become dependencies of the package, since the template's `vite.config.ts` imports the plugin. They run only during the build.
- **The template** gets the plugin in `vite.config.ts`, the `*.md` type declaration and an example post.
- **A helper builds pages from the files,** for example `markdownPages(files, { parentPage: "blog", path: "/blog" })`, sorted by date, so authors don't write the glob mapping by hand. `PageInfo` gets an optional `date`.
- **A posts list block** lists the pages built from the files, grouped by year and month.
- **Every post is in the main bundle** with an eager glob. With many posts, the implementation should load the front matter eagerly and the page lazily (two globs, one with `import: "frontmatter"`), and the page component has to accept an async component.
- **Supply chain:** `marked` releases often (six versions between October and November 2026). The proof of concept pins `18.2.0`, since `18.2.1` was six days old at the time of the spike. Updates get the usual check.
