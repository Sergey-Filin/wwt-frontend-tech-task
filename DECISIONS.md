# Implementation notes

One new dependency: `@playwright/test` (dev only). jsdom has no real `<dialog>`, so the unit tests stub `showModal`/`close` and cannot press a real Esc or click a real backdrop. Playwright runs the same flows in Chromium against the production build. Everything else uses the packages already in the project.

## Structure

- `src/shared/api/filters`: `getFilters` emulates the API (lazy-loads `filterData.json`), `useFilters` wraps it in **react-query**; the home page prefetches the query, so the modal usually opens without a loader
- `src/shared/store/filterStore.ts`: global applied filters (**zustand**), stored in the output format `SearchRequestFilter`
- `src/shared/lib/filter/selection.ts`: pure helpers: draft toggle and `FilterItem` + draft → `SearchRequestFilter` conversion (covered by unit tests)
- `src/shared/ui`: `Modal`, `Button`, `CloseButton`
- `src/features/filter`: filter modal, option groups and the confirmation dialog
- `src/features/language`: language select (English / Ukrainian)
- `src/pages/Home`: the button that opens the modal and the applied filters as JSON

## Key decisions

- **Draft vs applied state.** The modal edits a local draft. The draft is created from the global state every time the modal opens, so closing without applying (close button, Esc, backdrop click, "Use old filter") never changes the saved filters. Only "Apply new filter" in the confirmation dialog writes to the store.
- **Native `<dialog>`** with `showModal()` for semantics and accessibility: the page behind becomes inert, Esc closes the top dialog, the nested confirmation sits in the top layer, all without an extra library. It is not a strict focus trap: after the last control Chrome moves focus to its own UI, but never to the page behind (checked by an e2e test).
- **Modal robustness:** the native `close` event is the single source of truth, so Esc closed by the browser never leaves React state "open"; a nested dialog does not close its parent; a backdrop click closes the modal only if the press also started on the backdrop (text selection is safe); focus returns to the trigger; page scroll is locked while a dialog is open.
- **Semantic markup:** `fieldset`/`legend` per filter group, real checkboxes inside `label`, `form` submit for Apply, `aria-labelledby` on dialogs.
- **Design:** sizes, typography and colors are taken from the Figma layout (design tokens in `src/main.css`). On narrow screens paddings and headings are reduced and options go into one column, since there is no mobile layout. Filter groups come from `filterData.json`, which differs from the groups in the layout.
- **Output order** follows the API data, unknown ids and empty groups are dropped.
- **i18n:** all UI texts are in `locales/en` and `locales/uk` (`filter`, `home` namespaces), switched by the select on the home page; `<html lang>` follows the language. The `uk` locale is typed with `satisfies typeof en`, so a missing key fails the build. Filter names come from the API and stay as they are. The typings in `src/i18next.d.ts` were fixed to point to the existing files.
- **Button widths:** Apply and the confirmation buttons use the Figma width as a minimum, so longer Ukrainian labels fit.
- **Tests:** unit tests for the selection helpers, integration tests for the whole flow (apply/confirm, use old filter, close, Esc, backdrop, focus return, clear all, language switch) and for loading/error/retry states. Playwright e2e tests (`pnpm test:e2e`) cover the flow with a real keyboard and mouse: apply and pre-fill, Esc order, backdrop click, focus staying off the page behind.
- **CI** (`.github/workflows/pipeline.yml`): format check, lint, unit tests, build and e2e on Node 20 and 22, with read-only permissions and cancellation of outdated runs. It runs on pushes to `main` and on pull requests, so a PR is not checked twice.
- **Pre-commit:** lint-staged calls prettier and eslint directly. The template called `npm run`, which fails because npm rejects the package name with spaces.
