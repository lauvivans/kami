# 005 · State management

- **Date:** 2026-11-21
- **Origin:** spike [#72](https://github.com/lauvivans/kami/issues/72), after the Pinia 4 update in [#71](https://github.com/lauvivans/kami/issues/71)
- **Status:** accepted

## Question

Does Kami need Pinia for its shared state, or does a lighter approach cover it with less code and fewer packages? And whichever tool holds it, where does each piece of state live?

## Short answer

- **Keep Pinia 4** and the single options store `useStore` in `packages/core/store/store.ts`.
- **Replacing it doesn't pay off.** A plain `reactive()` module was built and measured: it saves 2.70 kB of gzip JS on the documentation site and one package (`pinia`) in each portfolio, and the store stays the same size (158 to 157 lines). In return it removes `piniaInstance` from the public API, which needs a major release and a change in every portfolio's `main.ts`, and it loses the devtools panel.
- **State lives in one of three places,** following the rules below: the global store for state shared across the app, component state or `provide` / `inject` for state that belongs to one part of the page, and `localStorage` for what survives a reload.

## How state is handled

### The global store

- `useStore` is the only global store. It holds the state that more than one part of the app reads or that code outside components reads: theme, tabs, active tab, active page, sidebar state, the page open in a modal and the settings of each page.
- It is created when the module is imported, bound to `piniaInstance` (`defineStore("global", {...})(piniaInstance)`). It works like a module singleton: the route guards, the tests and portfolios (through the `useStore` prop) use it without calling a composable inside `setup()`.
- Each field has a `store*` action to change it and a `get*` getter to read it. Kami's own code changes the state only through the actions. Getters and actions keep explicit types, since `useStore` is public API.
- `Settings.vue` reads the store with `storeToRefs`, and the tests call `$reset()`. Kami uses no plugins, `$patch` or `$subscribe`.
- A new store is added only when a group of state has no relation to the current one. Until then, new shared fields go into `useStore`.

### Local state

- State used by one component stays in that component (`ref`, `computed`).
- State shared by a component and its children goes through `provide` / `inject`, wrapped in a hook in `packages/core/hooks/`: `useAside` (layout of the main area), `useModal` and `useToggle` (the element a modal or toggle controls). It doesn't go into the store, so each instance of a modal or toggle keeps its own state.
- `useIsMobile` is a hook with its own `matchMedia` listener, and each component that calls it gets its own ref.

### Persistence

- `localStorage` is accessed only through the getters and setters in `packages/core/util/local-storage/`. The keys live in `constants.ts` and start with `kami-`.
- The store reads them once, in its initial state. The components that own each piece (`MainLayout`, `Tabs`, `Aside`) write it back on `beforeunload`. The store never calls `localStorage` itself.
- Tabs and page settings are saved with `flatted`, so a change of format has to keep reading what visitors already have.
- Reading `localStorage` when the store is created assumes a browser. Kami is client-only, and SSR would need the initial state read after mount.

## Options compared

All numbers were measured on 2026-11-21. Bundle sizes come from `vite build` (Vite 8.3.5, Vue external, the production flags `@vitejs/plugin-vue` sets). Package facts come from the npm registry (`npm view`) and the template lockfile.

|                                           | Pinia 4 (chosen)                                            | `reactive()` module                                             | VueUse `createGlobalState` + `useStorage`                                                           | `provide` / `inject`                                         |
| ----------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Store code                                | 158 lines + 5 (`instance.ts`)                               | 157 lines                                                       | not built, see below                                                                                | not built, see below                                         |
| Library code in the bundle, minimal store | 8.27 kB (3.43 kB gzip)                                      | 0.24 kB (0.19 kB gzip), all of it the store itself              | 6.17 kB (2.45 kB gzip)                                                                              | 0, part of Vue                                               |
| Documentation site JS                     | 249.31 kB (84.46 kB gzip)                                   | 242.93 kB (81.76 kB gzip)                                       | not built                                                                                           | not built                                                    |
| Packages a portfolio installs             | `pinia`                                                     | none                                                            | `@vueuse/core`, `@vueuse/shared`, `@vueuse/metadata`, `@types/web-bluetooth` (all new)              | none                                                         |
| Devtools                                  | Pinia panel and timeline                                    | no store panel; the state shows in each component's setup state | same as `reactive()`                                                                                | same as `reactive()`                                         |
| SSR                                       | not safe today: state is read from `localStorage` at import | same                                                            | same                                                                                                | could be made per app, but the app is client-only            |
| Files to change                           | none                                                        | the store and 6 more                                            | the store, the 10 `local-storage` getters and setters, the 3 components that save on `beforeunload` | every file that calls `useStore` (17), and the router guards |
| `piniaInstance` and the template          | stay                                                        | removed; template drops `app.use(piniaInstance)` and `pinia`    | removed; template drops them, `@vueuse/core` becomes a dependency of the package                    | removed; template installs a new plugin in its place         |

### Pinia 4

Kami uses a small part of Pinia: one store, no plugins, no `$patch` or `$subscribe`. What it gets is the devtools panel and timeline, `storeToRefs`, `$reset()` for the tests, and actions bound to the store, so `const { storeTheme } = useStore` works. Pinia is external in `vite.config.package.ts` and a peer dependency, so a portfolio installs one copy.

Pinia 4 brought less weight than #71 suggested. `nostics` and `@vue/devtools-api` (with `@vue/devtools-kit` and its dependencies) are in a portfolio's install anyway, because `vue-router` 5.5.1 depends on both directly. The package Pinia adds on its own is `pinia` (195 kB unpacked).

### A plain `reactive()` module

A full version of the store was written on a local branch, type-checked with `vue-tsc -b` and run against the 16 existing tests, which passed unchanged. Apart from `store.ts` it changed `Settings.vue` (`storeToRefs` to `toRefs`), the two index files that export `piniaInstance`, `src/main.ts`, and the template's `main.ts` and `package.json`. The documentation site lost 6.38 kB of JS (2.70 kB gzip). The package bundle stayed the same size (134.70 kB to 134.66 kB), since Pinia was never in it.

The store code doesn't shrink, because the getters and actions remain. The actions also have to be written against a module-level `state` object instead of `this`, so a destructured action keeps working as Pinia's bound actions do. The gain is too small for a major release and a migration step in every portfolio. It becomes worth revisiting if another breaking change already removes `piniaInstance` from the template, or if a future Pinia major asks for changes to the store or the template.

### VueUse `createGlobalState` and `useStorage`

Issue #72 assumed `@vueuse/core` was already a dependency. It isn't: neither the package's `package.json` nor the template's lists it, and it isn't in either lockfile. This option adds four packages to every portfolio and 2.45 kB gzip of library code for a minimal store.

Its real gain is in the `localStorage` layer: `useStorage` would replace the 10 getter and setter files (88 lines) and the `beforeunload` listeners. That needs a custom serializer for the `flatted` data and changes when data is written (on every change instead of on unload). It is a separate question from the store and works with Pinia too.

### `provide` / `inject`

`inject()` only works inside `setup()` or inside `app.runWithContext()`. The store is used outside components: the route guards in `src/routes.ts` and `template/src/main.ts` call `useStore.storeActivePage(page)`, the tests import it, and portfolios receive it as the `useStore` prop. Every one of the 17 files would change, portfolios would install a new plugin in place of `piniaInstance`, and the result would still be one global object, since Kami has one app per page load. It stays the tool for state local to one part of the page, as described above.

## Consequences

- **No change to the public API or the template.** `useStore` and `piniaInstance` stay exported, and portfolios keep `app.use(piniaInstance)` and `pinia` in their dependencies.
- **Pinia updates are handled as dependency updates.** A Pinia major gets a supply chain check and a look at whether the store, `storeToRefs` or `$reset()` changed.
- **New state follows the rules above:** global only when shared across the app or read outside components, local otherwise, and persisted only through `util/local-storage/`.
- **Docs fixed with this record:** decision 001 and the Developer docs storage page said Pinia is bundled into the package. It is external and a peer dependency.
- **Cleanup:** the documentation site installs a second Pinia instance in `src/main.ts` (`createPinia()`), which the store doesn't use. It is described as follow-up work in the pull request that adds this record.
