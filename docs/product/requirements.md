# Product requirements

What Kami offers and the rules it follows.

## General

- Kami is a Vue library for building a portfolio that looks and works like Notion. The idea came from Nitin Ranganath's VS Code Portfolio.
- A portfolio is a Vue app. Its owner writes each page as a Vue component and lists the pages in a metadata object (`IMetadata`). There is no CMS and no backend: the content lives in the portfolio's code.
- The library is in English. See [decision 002](../decisions/002-language-policy.md).
- It works on a phone and on a computer. On small screens the tabs move to the bottom of the screen.
- Preferences (theme, open tabs, sidebar state and page settings) are kept in the browser's local storage, with keys prefixed `kami-`. Nothing is sent to a server.

## Creating a portfolio

- `npx @lauvivans/kami <name>` creates a folder with the template, installs its dependencies and installs the library. The name defaults to `my-portfolio`.
- If the folder already exists, the CLI stops with an error and changes nothing.
- The template comes with one example page, a Posts page that lists its posts with `PostList` and an example Markdown post, a banner and an icon, so `npm run dev` shows a working portfolio right away.

## Pages and metadata

- `metadata.user` holds the author's name and social handle, shown at the top of the sidebar.
- `metadata.pages` lists the pages by id. Each page (`PageInfo`) has a path, a title and its component, and can have:
  - a banner and an icon, each with the image path and optional author and link for the credit;
  - `pages`, the ids of its sub-pages, and `parentPage`, the id of its parent;
  - `isHomepage`, for the page shown at `/`;
  - `date`, a post's date as `YYYY-MM-DD`;
  - `databaseInfo`, properties shown under the title (an icon and one or more values), like the properties of a Notion database item. An array value is a multi-select: each item is a tag, written as text or as `{ name, color }` with one of the tag colors (purple, blue, yellow, brown, green, orange, gray, pink, red). A tag without a color gets one from its text, so it has the same color everywhere; two tags can share a color, and setting one avoids that.
- `metadata.favorites` lists the page ids shown under Favorites in the sidebar.
- Every page shows its banner, icon, title and properties above its content, through `MainLayout`.
- A path that matches no page shows the 404 page, with a button back to the previous page.

## Markdown pages

- A page can be a `.md` file with front matter. The Vite plugin `markdown()` from `@lauvivans/kami/vite`, placed before `vue()`, turns each file into a component built from Kami blocks at build time, so no Markdown parser reaches the browser. See [decision 006](../decisions/006-markdown-pages.md).
- The front matter (`title`, `date`, `banner`, `icon`) is exported as `frontmatter`. `markdownPages(files, { parentPage, path })` builds one page per file from an eager `import.meta.glob`: the id is the file name, the path is `path` plus the id, the title falls back to the id, and the pages are ordered by date, newest first.
- Headings (5 and 6 as 4), paragraphs, bold, italic, strikethrough, inline and fenced code, quotes, dividers, links, images, bullet lists, numbered lists (with their start number) and to-do lists map to their blocks. A fenced block in a language `Code` highlights gets highlighted. An image alone on its line is an `Image` block; a relative image path is bundled with the post.
- Tables and raw HTML are dropped, and the build prints a warning for each without failing. Text is never compiled as a Vue template.
- The portfolio loads the `*.md` module type with `"types": ["@lauvivans/kami/markdown"]` in its `tsconfig.app.json`.

## Layout

- **Sidebar (`Aside`):** the author, Search and Settings, then two groups of pages: Favorites and Private. Pages with sub-pages expand to show them. The sidebar can be pinned open or closed, and when closed it opens on hover. On screens up to `$screen-small` wide it closes after a page is picked.
- **Tabs (`Tabs`):** like Notion Desktop. A visitor can open up to 10 tabs, switch between them and close them. The open tabs and the active one survive a reload. A restored tab whose page is no longer in the metadata is dropped.
- **Header (`Header`):** the breadcrumb of the current page and a button that opens the page settings. On a page more than 3 levels deep, the breadcrumb shows the first page and the last two, with `…` in between; clicking `…` opens a menu with the hidden pages.
- **Search:** the entry in the sidebar opens an empty modal. Search isn't built yet.

## Themes and settings

- Four themes, picked in Settings in the sidebar: Light (default), Dark, Catppuccin Latte and Catppuccin Mocha (shown as "Cat Latte" and "Cat Mocha"). The choice applies to the whole portfolio.
- Menus opened from a button (the page settings, the theme list in Settings and the breadcrumb `…` menu) are plain dropdowns, like Notion's: they open next to their button with no overlay, the rest of the page stays clickable, and they close on a press outside or on Escape. A press inside a menu opened from another menu keeps both open.
- Each page has its own settings, from the header button or the button in the page modal:
  - font: Default (Roboto), Serif (Roboto Serif) or Mono (Roboto Mono);
  - small text, on or off;
  - full width, on or off.

## Blocks

The components a page uses for its content, named after Notion's blocks:

- **Text:** `Text`, `Heading` (levels 1 to 4) and `TextHighlight`, which takes an optional `color` (a `TagColor`) for a background from the tag palette.
- **Code:** `Code`, as a block or, with `inline`, inside a line of text. A block keeps the line breaks of the code it receives. With `lang` (`ts`, `js`, `vue`, `html`, `scss`, `json` or `bash`), the block gets syntax highlighting from highlight.js, colored with the `$code-*` tokens (GitHub's code colors), with a light and a dark set.
- **Callout:** a box with an emoji and text.
- **Quote:** `Quote`, a quotation with a line on its left in the text color. It takes any content in its slot, such as text, links and highlights.
- **Lists:** `BulletList` and `BulletItem`, `NumberedList` and `NumberedItem` (with an optional `start`), `ToDoList` and `ToDoItem` (with a checked state), and `ToggleList`, which shows and hides its content and rotates the icon given in `iconToOpen` when open (`iconToClose` is still accepted and no longer shown).
- **Layout:** `Columns` with 2 to 5 `Column`s and an optional size for each, `Divider` and `Empty` (blank space).
- **Links:** `Link` (inline), `LinkMention` (an emoji and the name of a page or an external link) and `Bookmark` (a card with title, subtitle and URL; the subtitle wraps to two lines before the ellipsis, and an optional `icon`, a favicon path, shows before the URL; an optional `image` fills the right side of the card and is hidden on phones).
- **Media:** `Image`, with an optional `alt` (empty for a decorative image). A click, Enter or Space opens it in a full-screen viewer, a native modal `<dialog>` that closes with Escape, its close button or a click on the backdrop and returns focus to the image. `zoomable` (on by default) turns the viewer off; an image inside a list item shows as an inline icon and never opens.
- **Posts list:** `PostList` lists the pages from `markdownPages` (the object it returns, or an array of pages), grouped by year and month under a level 4 heading, newest first. Each post is a link to its page with its title and date. Month names and dates follow `locale` (default `"en-US"`); dates are read as UTC, so no time zone moves a post to another month. Posts without a valid `YYYY-MM-DD` date go last, without a heading or a date.
- **Show more:** `ShowMore` shows the first `limit` blocks of its slot (each item of a `v-for` counts as one) with a "Show more" button below while blocks are left. Each click shows the next `limit` blocks and moves focus to the first of them. When every block shows, the button reads "Show less" and goes back to the first `limit`, keeping focus on the button. `label` and `lessLabel` change the texts. Without `limit`, or with 0 or less, every block shows and there is no button. The button is the same one as the database's Load more.
- **Database:** a list of pages shown as a gallery of cards or a table. Tabs above the database switch between the two views, like Notion's database views; `layout` (`"gallery"` or `"table"`) sets the view it opens with. The chosen view isn't saved, so it goes back to `layout` on reload. Clicking a card, or a title in the table, opens the page in a modal, with a link to its full page. The card preview can be the page's cover. The table has one row per page: the first column is the title and the others are the properties from the pages' `databaseInfo`, in the order they first appear, with multi-select values shown as tags. A page without a property leaves its cell empty. A table wider than the screen scrolls horizontally inside its own box. Editing cells isn't offered.
  - **Filter and Sort:** two menus in the database's navbar, next to the view tabs, that apply to every view. Filter lists the properties from the pages' `databaseInfo`; choosing one lists the values it has across the pages (each tag counts as a value), and the database keeps only the pages that have at least one of the picked values. One property is filtered at a time. Sort orders the pages by the title (Name) or a property, ascending or descending. Values are compared as text with `localeCompare` and the `numeric` option, so "2" comes before "10"; a multi-select sorts by its first tag, and pages without the property go last in both directions. The button shows what's active ("Filter: Vue", "Sort: Created ↓") and each menu has a Clear option. Filter and sort aren't saved, so they reset on reload. The menus close on a click outside and on Escape; focus moves into a menu when it opens and back to its button when it closes.
  - **Load limit:** an optional `loadLimit` shows that many pages at first, counted after Filter and Sort, with a "Load more" button below the view while pages are left. Each click shows the next `loadLimit` pages and moves focus to the first of them. Changing the filter, sort or view goes back to the first `loadLimit` pages. `loadMoreLabel` changes the button text (default "Load more"). Without `loadLimit`, every page shows and there is no button.
- **Loader:** a loading indicator.

## Documentation site

- The site at kami.arualvivan.com is a Kami portfolio built from `src/`.
- **Client docs:** for people building a portfolio. Start from here, Setup, Building your first page, Your first deploy and Writing posts in Markdown.
- **Developer docs:** for people working on the library. Contributing, Version control, Icons, Storage, Testing and Release and deploy.
- **Demo:** an example portfolio with a gallery database of projects, two posts written in Markdown, and a Blocks page that shows every block next to the code that renders it.
- Routes use browser history, so the host answers every path with `index.html`. Cloudflare Pages does this when the build has no `404.html`.

## Public API

- The package exports the layout components, the blocks, `MainLayout`, `NotFoundPage`, `useStore`, `piniaInstance`, `useAside`, `useDisplay`, `useIsMobile`, `isTouchDevice`, `markdownPages`, the `Icons` enum (the icons `ToggleList` takes), and the types `IMetadata`, `PageInfo`, `DatabaseTag`, `TagColor`, `MarkdownFrontmatter`, `MarkdownModule` and `MarkdownPagesOptions`. The full list is in `packages/core/index.ts`.
- The styles ship in one CSS file, `dist/kami.css`, which the portfolio imports once.
- `@lauvivans/kami/vite` exports the `markdown()` plugin, built for Node with `marked` and `yaml` as dependencies, and `@lauvivans/kami/markdown` holds the `*.md` module type.
- Changing any of these in a way that breaks an existing portfolio needs a major version. See [decision 001](../decisions/001-stack-and-hosting.md).
