---
title: Hello, world
date: 2026-11-22
icon:
  path: /icons/page-example.png
  author: Paula Lee
  link: https://www.flaticon.com/free-sticker/drink_7465398?related_id=7465398
---

This post is a **Markdown file**. Kami turns it into a page when the portfolio builds, with the same blocks as the other pages.

## Write a new post

- Add a `.md` file to `src/pages/posts/`.
- Start it with front matter: `title`, `date` and, if you want, `banner` and `icon`.
- Write the content below it.

The file name becomes the page's address, under [Posts](/posts): this one is at `/posts/hello-world`.

> Headings, lists, to-dos, code, quotes, links and images each render as their Kami block.

```ts
const post = { title: "Hello, world", date: "2026-11-22" };
```

- [x] Write the first post
- [ ] Write the next one
