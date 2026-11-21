# 005 · State management without Pinia

- **Date:** 2026-11-21
- **Origin:** spike [#72](https://github.com/lauvivans/kami/issues/72), after the Pinia 4 update in [#71](https://github.com/lauvivans/kami/issues/71)
- **Status:** accepted

## Question

Does Kami need Pinia for its shared state, or does a lighter approach cover it with less code and fewer packages?

## Short answer

- **Replace the Pinia store with a plain `reactive()` module** in `packages/core/store/store.ts`, but only together with another breaking change. It doesn't justify a major release of its own.
- **The gain is small:** 2.70 kB less gzip JS, one package (`pinia`) less in each portfolio, and one line less in the store (158 to 157). What it removes is the install step and a peer dependency portfolios must keep in step with the package.
- **`useStore` keeps its shape.** It stays an object with the same state fields, `get*` getters and `store*` actions, so the components, the router guards and the portfolios that read `store.getActivePage` or call `useStore.storeActivePage(page)` don't change.
- **`piniaInstance` is removed,** together with `app.use(piniaInstance)` in the template and `pinia` in the template's dependencies and the package's peer dependencies. This is the breaking part of the change.
- **The `localStorage` helpers stay** as they are. Moving them to another mechanism is a separate question from Pinia.

## How the store works today

- `store.ts` has 158 lines: seven state fields, eight getters (seven return a field unchanged) and eight actions (six assign one field).
- The store is created when the module is imported: `defineStore("global", {...})(piniaInstance)`. `useStore` is the store object itself, so it already works like a module singleton, and `app.use(piniaInstance)` only connects the Pinia devtools plugin.
- The documentation site installs a second instance in `src/main.ts` (`createPinia()`), which the store doesn't use.
- The state is read from `localStorage` at import time, and the components write it back on `beforeunload` (`MainLayout`, `Tabs`, `Aside`).
- `useStore` is imported by 10 files in `packages/core`, 2 in `src`, 2 in `template/src` and 3 test files. Only `Settings.vue` uses a Pinia helper (`storeToRefs`), and the tests call `$reset()`.
- Pinia is not bundled into the package: `vite.config.package.ts` lists it as external and `package.json` has it as a peer dependency, so each portfolio installs it. Decision 001 and the Developer docs storage page still say it is bundled.

## Options compared

All numbers were measured on 2026-11-21. Bundle sizes come from `vite build` (Vite 8.3.5, Vue external, the production flags `@vitejs/plugin-vue` sets). Package facts come from the npm registry (`npm view`) and the template lockfile.

|                                           | Pinia 4 (today)                                             | `reactive()` module                                             | VueUse `createGlobalState` + `useStorage`                                                           | `provide` / `inject`                                         |
| ----------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Store code                                | 158 lines + 5 (`instance.ts`)                               | 157 lines                                                       | not built, see below                                                                                | not built, see below                                         |
| Library code in the bundle, minimal store | 8.27 kB (3.43 kB gzip)                                      | 0.24 kB (0.19 kB gzip), all of it the store itself              | 6.17 kB (2.45 kB gzip)                                                                              | 0, part of Vue                                               |
| Documentation site JS                     | 249.31 kB (84.46 kB gzip)                                   | 242.93 kB (81.76 kB gzip)                                       | not built                                                                                           | not built                                                    |
| Packages a portfolio installs             | `pinia`                                                     | none                                                            | `@vueuse/core`, `@vueuse/shared`, `@vueuse/metadata`, `@types/web-bluetooth` (all new)              | none                                                         |
| Devtools                                  | Pinia panel and timeline                                    | no store panel; the state shows in each component's setup state | same as `reactive()`                                                                                | same as `reactive()`                                         |
| SSR                                       | not safe today: state is read from `localStorage` at import | same                                                            | same                                                                                                | could be made per app, but the app is client-only            |
| Files to change                           | none                                                        | the store and 6 more (see below)                                | the store, the 10 `local-storage` getters and setters, the 3 components that save on `beforeunload` | every file that calls `useStore` (17), and the router guards |
| `piniaInstance` and the template          | stay                                                        | removed; template drops `app.use(piniaInstance)` and `pinia`    | removed; template drops them, `@vueuse/core` becomes a dependency of the package                    | removed; template installs a new plugin in its place         |

### Keep Pinia 4

Nothing changes. Kami uses almost none of what Pinia adds: no plugins, no `$subscribe`, no `$patch`, one store. The getters and actions would be the same in any of the other options. What Pinia gives in return is the devtools panel and `$reset()`, which only the tests call.

Dropping Pinia saves less than #71 suggested. `nostics` and `@vue/devtools-api` (with `@vue/devtools-kit` and its dependencies) stay in a portfolio's install, because `vue-router` 5.5.1 depends on both directly. The only package that leaves is `pinia` itself (195 kB unpacked).

### A plain `reactive()` module

A full version of the store was written, type-checked with `vue-tsc -b` and run against the existing tests (16 of 16 passing, unchanged) on a local branch, plus a test that destructures `storeTheme` and `storeUpdateTabs` and calls them. It keeps every field, getter and action and adds `$reset()`, so the tests didn't change. Apart from `store.ts` it needed:

- `Settings.vue`: `storeToRefs` from `pinia` becomes `toRefs` from `vue`.
- `packages/core/store/index.ts` and `packages/core/index.ts`: drop `piniaInstance`.
- `src/main.ts`: drop `createPinia()`.
- `template/src/main.ts` and `template/package.json`: drop `piniaInstance` and `pinia` (not built here, since the template installs the published package).

The documentation site lost 6.38 kB of JS (2.70 kB gzip). That build used an earlier draft whose actions used `this`; the final version differs only in the names inside the action bodies. The package bundle stays the same size (134.70 kB to 134.66 kB), since Pinia was never in it.

The store code itself stays about the same size (158 to 157 lines), because the getters and actions remain. They could be cut down later by reading the fields directly, which is a public API change of its own and works with Pinia too.

Proof of concept, two fields of the store:

```ts
import { reactive, toRefs } from "vue";
import { getAsideOpen, getTheme } from "@core/util/local-storage";
import type { Theme } from "@core/enum";

const initialState = () => ({
  theme: getTheme(),
  isAsideOpen: getAsideOpen(),
});

const state = reactive(initialState());

const useStore = reactive({
  // reactive() unwraps these refs: useStore.theme reads and writes state.theme
  ...toRefs(state),
  $reset() {
    Object.assign(state, initialState());
  },
  get getTheme(): keyof typeof Theme {
    return state.theme;
  },
  get getIsAsideOpen(): boolean {
    return state.isAsideOpen;
  },
  storeTheme(theme: keyof typeof Theme) {
    state.theme = theme;
  },
  storeIsAsideOpen(isAsideOpen: boolean) {
    state.isAsideOpen = isAsideOpen;
  },
});

export default useStore;
```

The getters and actions read and write `state` by name instead of `this`, so an action still works after it is destructured (`const { storeTheme } = useStore`). Pinia binds the actions of an options store to the store, so code that destructures them works today, and an action written with `this` would lose that. Actions that call another action or getter (`storeUpdateTabs`, `storeDynamicPageInfo`) call it as `useStore.storeTabs(...)`. The getters keep explicit return types, which the public types of `useStore` rely on. `reactive()` tracks the reads inside the getters, so `store.getTheme` in a template or a `watch` updates when `storeTheme` runs. Getters are no longer cached like Pinia getters. The only one that computes something, `getDynamicCurrentPageInfo`, reads one tab and one map entry, so the cost is negligible.

### VueUse `createGlobalState` and `useStorage`

Issue #72 assumed `@vueuse/core` was already a dependency. It isn't: neither the package's `package.json` nor the template's lists it, and it isn't in either lockfile. This option means adding it as a new runtime dependency of the package, which adds four packages to every portfolio and 2.45 kB gzip of library code for a minimal store. That is more than the `reactive()` module and less than Pinia.

What it would replace is the `localStorage` layer: `useStorage` reads and writes a key on every change, which would remove the 10 getter and setter files in `util/local-storage/` (88 lines) and the `beforeunload` listeners in three components. Two details of the saved data need care: tabs and page settings are saved with `flatted`, so `useStorage` needs a custom serializer to keep reading what visitors already have, and saving on every change replaces saving on unload, which changes when data is written. That is a separate change from the choice of store, and the `reactive()` module doesn't block it later.

### `provide` / `inject`

`inject()` only works inside `setup()` or inside `app.runWithContext()`. The store is used outside components: the route guards in `src/routes.ts` and `template/src/main.ts` call `useStore.storeActivePage(page)`, the tests import it, and portfolios receive it as the `useStore` prop. Every one of the 17 files would change, portfolios would install a new plugin in place of `piniaInstance`, and the result would still be one global object, since Kami has one app per page load.

## Consequences

- **A major release.** Removing `piniaInstance` breaks every portfolio created from the template, so the change ships as `feat!` or with a `BREAKING CHANGE` footer. The release notes tell portfolios to remove `app.use(piniaInstance)` from `main.ts` and `pinia` from their dependencies. It waits for another breaking change and goes out in the same major, since its gain is small (see the short answer).
- **Actions are written against the module's `state`, never `this`,** so destructuring `useStore` keeps working as it does with Pinia. A new action that uses `this` would break for anyone who destructures it.
- **No devtools panel for the store.** The state is still visible in the Vue devtools component inspector, and the store is small enough to read there.
- **`$patch`, `$subscribe` and `storeToRefs` stop working on `useStore`.** A portfolio that used them would switch to assigning fields, `watch` and `toRefs`. `$reset()` stays.
- **Docs to update with the change:** `CLAUDE.md` (structure and stack), decision 001 (it says Pinia is bundled), `docs/product/requirements.md` (the exports list), the Developer docs storage and contributing pages, and the Pinia badge in `README.md`.
- **Follow-up work** is described in the pull request that adds this record, and becomes an issue when approved.
