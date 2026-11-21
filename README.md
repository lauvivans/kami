# Kami

A Vue component library for building a portfolio that looks and works like Notion: a sidebar with nested pages, tabs, themes and Notion-style blocks. It ships as the npm package [`@lauvivans/kami`](https://www.npmjs.com/package/@lauvivans/kami), with a CLI that creates a new portfolio from a template.

The idea came from Nitin Ranganath's VS Code Portfolio. Documentation and a demo: [kami.arualvivan.com](https://kami.arualvivan.com).

## Features

- Sidebar with the author, Favorites and nested pages. It can be pinned open or closed.
- Tabs for navigation, as in Notion Desktop. Open tabs survive a reload.
- Four themes: Light, Dark, Catppuccin Latte and Catppuccin Mocha.
- Page settings: font (Roboto, Roboto Serif or Roboto Mono), small text and full width.
- Blocks for page content: text, headings, code with syntax highlighting, callouts, lists, columns, links, bookmarks, images and a database gallery.
- Preferences are kept in the browser's local storage. There is no backend.
- Search is not built yet.

The full list is in [docs/product/requirements.md](docs/product/requirements.md).

## Requirements

Node.js `^20.19.0 || >=22.12.0`, for both the CLI and the project it creates. CI creates and builds a project on Node 20.19.0, 22.12.0 and the version in `.nvmrc`.

On Node versions below 22.22, `npm install` prints `EBADENGINE` warnings for `chokidar` and `ast-walker-scope`. They come from `vue-router` 5 and are only used by its file-based routing plugin (`vue-router/vite`), which Kami doesn't use, so the project still installs and builds.

## Create a portfolio

```sh
npx @lauvivans/kami my-portfolio
```

The CLI copies the template into `./my-portfolio` (the name defaults to `my-portfolio`), installs its dependencies and then installs `@lauvivans/kami`. The template has one example page, a banner and an icon. It stops with an error if the folder already exists.

```sh
cd my-portfolio
npm run dev
```

Each page is a Vue component listed in `src/metadata/index.ts`. The [client docs](https://kami.arualvivan.com/client-docs) explain how to add pages and deploy.

## Develop locally

Use the Node version in `.nvmrc`.

```sh
git clone https://github.com/lauvivans/kami.git
cd kami
npm install
npm run dev
```

`npm run dev` serves the documentation site in `src/`, which imports the library from `packages/core/`, so it also works as the playground.

| Script              | What it does                                     |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Serves the documentation site.                   |
| `npm run build`     | Type checks and builds the site into `dist/`.    |
| `npm run build:pkg` | Type checks and builds the package into `dist/`. |
| `npm run lint`      | Runs ESLint.                                     |
| `npm run format`    | Runs Prettier on the repository.                 |
| `npm test`          | Runs the Vitest tests.                           |
| `npm run test:cli`  | Runs the CLI from the local clone.               |

## Branches and releases

Kami follows GitHub flow ([decision 003](docs/decisions/003-branching-workflow.md)):

- `main` is the only long-lived branch. Each change goes in a branch named `<type>/<issue>-kebab-case-name` and is opened as a pull request into `main`.
- The pull request title follows [Conventional Commits](https://www.conventionalcommits.org/). Pull requests are squash-merged, so the title becomes the commit on `main`.
- [release-please](https://github.com/googleapis/release-please) keeps a Release PR open with the next version and its changelog ([decision 004](docs/decisions/004-release-flow.md)). Each merge updates it when the commit calls for a release: `fix` and `perf` add a patch, `feat` a minor, and `!` or a `BREAKING CHANGE` footer a major. `chore`, `docs`, `test`, `ci` and `refactor` add nothing.
- Merging the Release PR tags the version, creates a draft GitHub release and stages the package on npm. A maintainer approves it with 2FA on npmjs.com, which puts the version live, and then publishes the draft release on GitHub.

Design decisions are in [docs/decisions/](docs/decisions/).

## Tools

![Vue.js Badge](https://img.shields.io/badge/Vue.js-4FC08D?logo=vuedotjs&logoColor=fff&style=for-the-badge)
![TypeScript Badge](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=for-the-badge)
![Pinia Badge](https://img.shields.io/badge/Pinia-FFD859?logo=pinia&logoColor=000&style=for-the-badge)
![Sass Badge](https://img.shields.io/badge/Sass-C69?logo=sass&logoColor=fff&style=for-the-badge)
![Vite Badge](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff&style=for-the-badge)
![Vitest Badge](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=fff&style=for-the-badge)

## License

[MIT](License)
