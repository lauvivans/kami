# Visual refresh (#169)

Kami's look follows an older version of Notion. This folder holds the design for refreshing it: what changed in Notion, how each Kami piece compares, the token changes, a decision on the footer badge, and the implementation issues that follow.

- `prototype.html`: open it in a browser. The "Prototype theme" bar at the bottom previews the four themes (Default, Dark, Catppuccin Latte, Catppuccin Mocha). The bar only exists in the prototype: Kami keeps the theme choice in Settings. A window narrower than 767px shows the mobile layout. Cards in the gallery open the page modal.
- Every size, color, radius and shadow in the prototype comes from the custom properties in its `:root`, which are the proposed tokens below.

## Sources

Notion's changes come from its official release notes (notion.com/releases, 2022 to 2026). Notion doesn't publish its colors, sizes or fonts as numbers, so the token values below are Kami's own choices, picked to match the current web app by eye. None of them is quoted from Notion. No Notion logos, icons, illustrations or fonts are used: the prototype draws its own icons and uses the system font stack.

Visual changes in the release notes that matter for Kami:

| Date    | Change                                                                                     |
| ------- | ------------------------------------------------------------------------------------------ |
| 2022-03 | Dark mode palette with deeper hues and higher contrast; menu buttons with inset highlight. |
| 2022-03 | Database views shown as tabs at the top of the database.                                   |
| 2022-08 | Search redesigned; teamspaces as sidebar sections.                                         |
| 2023-11 | Hovering a page link shows a preview.                                                      |
| 2024-04 | Simpler sidebar, with reorderable sections; Filter and Sort as icons.                      |
| 2024-06 | Private and Shared sections in their own panel; floating table of contents on long pages.  |
| 2024-10 | Page titles, database views and database pages aligned to the same column.                 |
| 2024-12 | Color picker redesigned; rounded checkbox corners.                                         |
| 2025-03 | Tabbed page layout.                                                                        |
| 2025-07 | Visual refresh of databases on web, desktop and mobile: simpler menus and gentler visuals. |
| 2026-03 | Sidebar with tabs (opt-in preview); Tabs block; H4 headings.                               |
| 2026-04 | Breadcrumb shows sibling pages on hover; database tabs can show icon, text or both.        |
| 2026-05 | New mobile home layout.                                                                    |
| 2026-07 | High contrast mode for text, icons and borders.                                            |

The notes don't announce a new font or a new dark mode after 2022.

## Comparison

| Area                            | Kami today                                                                                                        | Proposal                                                                                                                                                                                 |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Font                            | Hanken Grotesk (web font), headings at weight 800.                                                                | System font stack (`ui-sans-serif`, `-apple-system`, `Segoe UI`...), headings at 600, page title at 700. Removes a web font download.                                                    |
| Text colors                     | Black at 80% opacity; secondary text at 50-60%.                                                                   | Warm dark gray for text, two named secondary levels (`text-secondary`, `text-tertiary`).                                                                                                 |
| Sidebar                         | Owner name as plain text; Search and Settings in bold 600 at 0.85rem; items with 3px radius; section labels bold. | Owner row with a small avatar and handle; items 28px tall with 6px radius and a light hover; section labels small and muted at weight 500; active page with a light background.          |
| Floating sidebar                | Opens on hover; closes when the mouse enters an invisible 600px div; 5px radius.                                  | Same floating panel with a 10px radius and the floating shadow; closes on mouse leave and on a tap outside it (#172).                                                                    |
| Header                          | 50px; breadcrumb crumbs in bold.                                                                                  | 44px; crumbs in regular weight with `/` separators, current page in full text color; icon buttons 28px square with 6px radius.                                                           |
| Tabs                            | Square tabs with right borders, 34px.                                                                             | 36px bar; tabs with rounded top corners, active tab in the page background, close button on hover. On mobile they stay at the bottom with fully rounded tabs.                            |
| Page layout                     | Content at 50% of the width, positioned absolutely below the banner.                                              | Content column of 708px plus 96px gutters, centered, in normal flow (20px gutters on mobile). Full width keeps working.                                                                  |
| Banner and icon                 | Banner 210px; icon fixed in place.                                                                                | Banner 220px (160px on mobile); icon 78px (64px on mobile) overlapping the banner by half its size.                                                                                      |
| Page title                      | Heading 1 sizing.                                                                                                 | Its own 40px size (32px on mobile).                                                                                                                                                      |
| Heading                         | 800 weight; sizes from 1.5rem to 2.2rem.                                                                          | 600 weight; H1 30px, H2 24px, H3 20px, with more space above than below. H4 kept at body size, bold.                                                                                     |
| Text                            | Line height 1.5.                                                                                                  | Unchanged, with 2px block padding to match Notion's block rhythm.                                                                                                                        |
| Link and LinkMention            | Link in bold 700, gray (`$latte-overlay0`), underlined.                                                           | Text color with a muted underline that darkens on hover; mention in weight 500 with its icon.                                                                                            |
| Callout                         | Hard-coded `#f1f1f6`, 5px radius, 20px padding.                                                                   | `bg-block` token, 6px radius, icon aligned to the first line.                                                                                                                            |
| Code                            | Inline in red on 10% black; block on gray with 5px radius.                                                        | Same idea, from tokens: `code-inline` color, `bg-block` background, 6px radius.                                                                                                          |
| Bullet, ToDo, Toggle lists      | ToDo uses the browser's native checkbox.                                                                          | Same structure; checkbox with rounded corners and the accent color when done; toggle chevron rotates.                                                                                    |
| Columns                         | Grid.                                                                                                             | Unchanged on desktop; a single column on mobile.                                                                                                                                         |
| Divider                         | 1px line in `$gray`.                                                                                              | 1px line in the `border` token.                                                                                                                                                          |
| Bookmark                        | 20px padding, 10px radius, title at weight 300; theme border in the lighter text color.                           | `border` token, 6px radius, hover background, title, description and URL in three sizes.                                                                                                 |
| Database (table, gallery)       | Table and gallery views; tags in pastel colors.                                                                   | View tabs with icons; gallery cards with a 10px radius, cover and tags; table with light borders and muted headers. Tag palette moves to Notion's nine muted colors (adds pink and red). |
| Image                           | Full width; 43% wide on full-width pages.                                                                         | Unchanged sizing; 6px radius.                                                                                                                                                            |
| TextHighlight                   | Weight 900 and underlined.                                                                                        | Weight 600 with an optional background from the tag tokens, so highlights and tags share one palette.                                                                                    |
| Empty                           | A 27px spacer (3 × `$default-spacing`).                                                                           | Height from the spacing scale (`space-7`, 24px).                                                                                                                                         |
| Loader                          | 50px spinner drawn with black gradients.                                                                          | Same spinner, drawn with `text-tertiary` and `text` so it shows in dark themes.                                                                                                          |
| Breadcrumb                      | Ellipsis rules for long trails.                                                                                   | Unchanged behavior, new look (see Header).                                                                                                                                               |
| Modals (page, settings, search) | `80vh` max height (`70vh` on phones), 5px radius, 2rem padding.                                                   | 10px radius; the page modal uses the visible height minus a 48px margin (8px on phones) and `dvh` (#173). Settings and search keep sizing to their content.                              |
| Not found page                  | `100vh`.                                                                                                          | `100dvh` (#168).                                                                                                                                                                         |
| Dark theme                      | `#171a1b` page, `#222` sidebar, white text.                                                                       | Page `rgb(25 25 25)`, sidebar `rgb(32 32 32)`, text white at 81%, muted tag colors for dark.                                                                                             |
| Catppuccin themes               | Own palettes in `_theme.scss`.                                                                                    | Kept; they fill the same token names from the palettes already in `_var.scss`, so every theme stays in sync. The prototype shows both.                                                   |
| Mobile                          | Bottom tabs, sidebar as a full panel.                                                                             | Bottom tabs, sidebar as a floating panel up to 85% of the width that closes on a tap outside, no footer badge.                                                                           |

## Proposed tokens

The tokens move to semantic names, so themes override meanings ("sidebar background") rather than raw colors. In `_var.scss` they are Sass variables as today; themes in `_theme.scss` set the same names. The prototype's `:root` holds the full list with values; the groups are:

- **Surfaces:** `bg`, `bg-sidebar`, `bg-hover`, `bg-active`, `bg-floating`, `bg-block`, `bg-tabs`, `overlay`.
- **Text and lines:** `text`, `text-secondary`, `text-tertiary`, `text-inverse`, `border`, `accent`, `code-inline`.
- **Tag colors:** `tag-{gray, brown, orange, yellow, green, blue, purple, pink, red}-bg` and `tag-text`. `$tag-colors` and `TAG_COLORS` gain `pink` and `red`.
- **Typography:** `font-sans`, `font-mono`; sizes `fs-xs` 12, `fs-sm` 14, `fs-md` 16, `fs-h3` 20, `fs-h2` 24, `fs-h1` 30, `fs-title` 40, `fs-title-mobile` 32, `fs-code` 0.85em; weights 400, 500, 600, 700; line heights `lh-body` 1.5 and `lh-heading` 1.3.
- **Spacing:** a 4px-based scale, `space-1` (2px) to `space-10` (96px). Replaces `$default-spacing` (9px) and the loose rem values in components.
- **Radius:** `radius-sm` 4, `radius-md` 6, `radius-lg` 10, `radius-pill`.
- **Shadow:** `shadow-floating` (today's `$box-shadow-1`) and `shadow-sidebar` (today's `$box-shadow-2`); `$box-shadow-3` is dropped.
- **Layout:** `sidebar-width` 240, `header-height` 44, `tabs-height` 36, `item-height` 28, `page-width` 708, `page-gutter` 96 / 20, banner, icon, tab, card, tag and modal sizes.
- **z-index (new):** `z-content` 0, `z-header` 1, `z-sidebar` 3, `z-tabs` 888, `z-overlay` 999, `z-modal` 2000. Today these numbers are spread across components.
- **Breakpoints:** unchanged (`$screen-xs` 480, `$screen-small` 767 and the rest).

**Breaking change:** renaming tokens and changing the default font changes the look of every portfolio, and portfolios that use the Sass variables in their own styles would break. The tokens PR should ship as a major release (`feat!:`), with the old variable names kept as aliases for one major if that turns out to be cheap.

## Footer badge

The badge ("by Kami (^.^)") lives in the template's `App.vue`, and the library only styles `.footer`. It floats over the page and, on phones, sits on top of the content just above the tabs.

Decision: restyle it and keep it in the template as an opt-in credit. A small pill with muted text ("by Kami"), the floating shadow, hidden below 767px. Portfolio owners can delete the line from their `App.vue` without touching the library. The prototype shows this version.

Approved by the maintainer on PR #175.

## Implementation issues (for approval)

1. Replace the design tokens with the semantic set (colors, typography, spacing, radius, shadow, z-index) and map the themes onto it. Major release.
2. Refresh the sidebar and floating sidebar (depends on #172 for the close behavior).
3. Refresh the header, breadcrumb and tabs.
4. Move the page layout to a centered content column (width, banner, icon, title).
5. Refresh the text blocks: heading, text, links and mentions, callout, code, lists, toggle, divider, bookmark, image.
6. Refresh the database views and the tag palette (adds pink and red).
7. Refresh the modals (page, settings, search), building on #173.
8. Update the dark theme and check the Catppuccin themes against the new tokens.
9. Restyle the footer badge as decided above.
10. Add a Quote block (needed for long-form pages and by #174).
