<script setup lang="ts">
import {
  Text,
  Heading,
  Callout,
  BulletList,
  BulletItem,
  LinkMention,
  Code,
} from "@core/index.ts";
import metadata from "@/metadata";

const post = `---
title: Pulling a first espresso
date: 2026-11-20
banner:
  path: /banners/espresso.webp
  author: Danis Lou
  link: https://unsplash.com/
icon:
  path: /icons/coffee.png
---

This post is a **Markdown file**.

## What you need

- A grinder and fresh beans
- [ ] Warm the cup

![The first shot](./first-shot.jpg)`;

const meta = `import { markdownPages, type MarkdownModule } from "@lauvivans/kami";

const posts = markdownPages(
  import.meta.glob<MarkdownModule>("../pages/posts/*.md", { eager: true }),
  { parentPage: "posts", path: "/posts" }
);

const metadata: IMetadata = {
  pages: {
    posts: {
      id: "posts",
      path: "/posts",
      title: "Posts",
      component: Posts,
      pages: Object.keys(posts),
    },
    ...posts,
  },
  // user and favorites
};`;

const viteConfig = `import { markdown } from "@lauvivans/kami/vite";

export default defineConfig({
  plugins: [markdown(), vue()],
});`;

const braces = "{{ }}";
const tsconfig =`"types": ["vite/client", "@lauvivans/kami/markdown"]`;
</script>

<template>
  <Callout emoji="📝"
    >A page can be a Markdown file instead of a Vue component. Kami turns it
    into its blocks when the portfolio builds, so a post follows the theme,
    the font settings and the page width like any other page.</Callout
  >

  <Heading :level="3">1. Write the post</Heading>
  <Text
    >Portfolios made with the CLI have a <Code inline>src/pages/posts/</Code>
    folder with an example post. Add a <Code inline>.md</Code> file there and
    start it with front matter between two <Code inline>---</Code> lines:</Text
  >
  <Code>{{ post }}</Code>
  <BulletList>
    <BulletItem
      ><Code inline>title</Code> shows in the sidebar and above the post.
      Without it, the post takes its file name.</BulletItem
    >
    <BulletItem
      ><Code inline>date</Code>, written as <Code inline>YYYY-MM-DD</Code>,
      orders the posts, newest first.</BulletItem
    >
    <BulletItem
      ><Code inline>banner</Code> and <Code inline>icon</Code> take the same
      fields as in the metadata: an image path from
      <Code inline>public/</Code>, plus an optional author and link.</BulletItem
    >
    <BulletItem
      >The file name is the post's id and the end of its address, so
      <Code inline>first-espresso.md</Code> opens at
      <Code inline>/posts/first-espresso</Code>. Ids are shared with the other
      pages, so pick a name no other page uses, with at least one letter: a
      name made only of digits, like <Code inline>2.md</Code>, breaks the
      order.</BulletItem
    >
  </BulletList>

  <Heading :level="3">2. What each element becomes</Heading>
  <BulletList>
    <BulletItem
      >Headings become <Code inline>Heading</Code> (levels 5 and 6 show as 4)
      and paragraphs <Code inline>Text</Code>, with bold, italic and
      strikethrough.</BulletItem
    >
    <BulletItem
      >Bullet lists become <Code inline>BulletList</Code>, and lists of
      <Code inline>- [ ]</Code> and <Code inline>- [x]</Code> become
      <Code inline>ToDoList</Code>. Numbered lists become
      <Code inline>NumberedList</Code> and keep their start number.</BulletItem
    >
    <BulletItem
      >Inline code and fenced code become <Code inline>Code</Code>. A fence
      with <Code inline>ts</Code>, <Code inline>js</Code>,
      <Code inline>vue</Code>, <Code inline>html</Code>,
      <Code inline>scss</Code>, <Code inline>json</Code> or
      <Code inline>bash</Code> gets highlighted.</BulletItem
    >
    <BulletItem
      >Quotes become <Code inline>Quote</Code> and <Code inline>---</Code> a
      <Code inline>Divider</Code>.</BulletItem
    >
    <BulletItem
      >Links become <Code inline>Link</Code>: one that starts with
      <Code inline>/</Code> opens that page of the portfolio.</BulletItem
    >
    <BulletItem
      >An image alone on its line becomes an <Code inline>Image</Code> that
      opens in full screen. A path from <Code inline>public/</Code> starts with
      <Code inline>/</Code>; a relative one, like
      <Code inline>./first-shot.jpg</Code>, points to a file next to the post
      and gets bundled with it.</BulletItem
    >
    <BulletItem
      >Tables and raw HTML are left out, and the build prints a warning for
      each. Text is never run as code, so <Code inline>{{ braces }}</Code> in a
      post shows as written.</BulletItem
    >
  </BulletList>

  <Heading :level="3">3. List the posts</Heading>
  <Text
    ><Code inline>markdownPages</Code> builds one page per file. It takes the
    files from <Code inline>import.meta.glob</Code>, the id of the page that
    lists them in <Code inline>parentPage</Code> and their base address in
    <Code inline>path</Code>. The template's
    <Code inline>src/metadata/index.ts</Code> already does this:</Text
  >
  <Code lang="ts">{{ meta }}</Code>

  <Heading :level="3">A portfolio made before posts</Heading>
  <Text
    >Add the plugin to <Code inline>vite.config.ts</Code>, before
    <Code inline>vue()</Code>:</Text
  >
  <Code lang="ts">{{ viteConfig }}</Code>
  <Text
    >Add the type of <Code inline>.md</Code> files to
    <Code inline>compilerOptions</Code> in
    <Code inline>tsconfig.app.json</Code>, then build the pages as in step
    3:</Text
  >
  <Code lang="json">{{ tsconfig }}</Code>

  <Callout emoji="👀"
    >The demo has a post written in Markdown, under Demo in the
    sidebar.</Callout
  >
  <LinkMention :page="metadata.pages['first-espresso']" emoji="☕" />
</template>
