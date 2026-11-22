---
title: Pulling a first espresso
date: 2026-11-20
banner:
  path: /banners/page-example.webp
  author: Danis Lou
  link: https://unsplash.com/photos/restaurant-with-people-dining-in-jfZfdQtcH6k
---

This post is a **Markdown file**. Kami turns it into a page at build time, with the same blocks as every other page, so it follows the theme, the font settings and the page width.

## What you need

- A grinder and fresh beans
- A machine with a _portafilter_
- A scale, since dose and yield are measured in grams

## The recipe

Grind 18 g of coffee, tamp it level and pull about 36 g of espresso in 25 to 30 seconds. Write it down in [the menu](/demo/coffee-shop/menu) when it tastes right.

```ts
const recipe = { dose: 18, yield: 36, seconds: [25, 30] };
```

> Sour means under-extracted: grind finer. Bitter means over-extracted: grind coarser.

---

### Checklist

- [x] Warm the cup
- [ ] Purge the group head
- [ ] Time the shot from the first drop, with `Date.now()`
