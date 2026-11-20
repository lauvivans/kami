# Kami

A Vue component library for building a portfolio that looks and works like Notion: a sidebar with nested pages, tabs, themes and Notion-style blocks. It ships as an npm package with a CLI that creates a new portfolio from a template.

## Language

Everything in the repository and on GitHub is in English: code, docs, file names, issues, PRs, commits and reviews. See `docs/decisions/002-language-policy.md`.

## Structure

- `packages/core/`: the library, published to npm. `index.ts` lists everything the package exports.
  - `components/`: the layout pieces (`Aside`, `Header`, `Tabs`, settings and modals).
  - `@client/components/`: the blocks a portfolio uses inside its pages (text, heading, callout, lists, columns, database, links, image and others).
  - `store/`: the Pinia store, shared through `useStore`. `util/local-storage/` keeps theme, tabs, sidebar state and page settings in the browser.
  - `assets/scss/`: the styles. `_var.scss` holds the variables and `_theme.scss` the themes.
  - `@types/index.d.ts`: `IMetadata` and `PageInfo`, the shape a portfolio fills to describe its pages.
- `src/`: the documentation site, served at kami.arualvivan.com and built with Kami itself. It imports the library from `packages/core` through the `@core` alias, so it also works as the local playground.
  - `metadata/index.ts`: every page of the site. Top-level pages: Kami (home), Client docs, Developer docs and Demo.
  - `pages/client-docs/` and `pages/developer-docs/`: the guides.
  - `pages/demo/`: an example portfolio, with every block on the Blocks page.- `template/`: the project the CLI copies. It has its own `package.json` and lockfile (#68). `gitignore` is renamed to `.gitignore` on copy, since npm drops dot-gitignore files from packages.
- `bin/cli.js`: the CLI. It copies `template/`, installs its dependencies and then the library.
- `tests/`: Vitest tests, with `tsconfig.vitest.json`.
- `docs/product/requirements.md`: what the library offers and its rules.
- `docs/decisions/`: one decision per file, numbered. Every spike ends with a file here.

## Stack

Vue 3, Vue Router, Pinia, Sass and TypeScript, built with Vite in library mode. Releases are published to npm with semantic-release. See `docs/decisions/001-stack-and-hosting.md`.

## Commands

- `npm run dev`: the documentation site in `src/`. Node version is in `.nvmrc`.
- `npm run build`: type check and build the documentation site into `dist/`.
- `npm run build:pkg`: type check and build the package into `dist/`.
- `npm run lint`, `npm run lint:css` (fails until #75), `npm run format`, `npm test`.
- `npm run test:cli`: runs the CLI locally.

## Workflow

- **GitHub flow** (decision 003): `main` is the only long-lived branch. Every change goes in a short-lived branch, opened as a PR into `main`.
- **Branch name:** `<type>/<issue>-kebab-case-name`.
- **PR title:** Conventional Commits. The squash commit takes the PR title, and semantic-release reads it on `main` to pick the version: `fix` and `perf` are a patch, `feat` a minor, `!` or a `BREAKING CHANGE` footer a major. `chore`, `docs`, `test`, `ci` and `refactor` don't release.
- **PR body:** ends with `Closes #<issue>`, also on fixes made after QA.
- **Merge:** squash into `main`. Every merge with a `fix`, `perf` or `feat` publishes a version on npm, so changes that must ship together go in the same PR. Head branches are deleted on merge.
- **Releases:** semantic-release publishes to npm and creates the GitHub release with the notes. It pushes nothing to `main`, so `package.json` keeps `0.0.0-development`. `CHANGELOG.md` covers versions up to 1.1.6.
- **Attribution:** no `Co-Authored-By` or "Generated with Claude Code" in commits and PRs.
- **Draft before creating:** show the full text of any issue and only create it after approval. Pull requests are opened directly; say when one is open, with its link. They are reviewed on GitHub before merge.
- **Dependencies:** every PR that adds or updates a dependency gets a supply chain check in its review (new packages in the lockfile, install scripts, `npm audit signatures`, publish dates, `npm audit`).

## Issues and board

- **Issues:** use the templates in `.github/ISSUE_TEMPLATE/` (bug, feature, chore, design, spike). The type goes in the label, not in the title. Documentation counts as `chore`.
- **Board:** "Kami" (GitHub Project #5 of `lauvivans`). Status: Backlog → Ready → In progress → In review → Done.
  - When starting an issue, move it to **In progress**.
  - When opening the PR, move it to **In review**. QA happens on the PR's Cloudflare Pages preview.
  - If QA fails, move it back to **In progress** and push the fix to the same PR.
  - Merging the PR closes the issue through `Closes #<issue>` and moves it to **Done**. A problem found after that is a new bug issue that links the original.

## Security

Never commit `.env` values, the npm token, GitHub tokens or Cloudflare account IDs. The `NPM_TOKEN` secret lives only in the repository settings. Vulnerabilities are reported privately, as described in `SECURITY.md`.
