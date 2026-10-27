# Implementation notes

No new dependencies were installed — only the ones already in the project are used.

## Structure

- `src/shared/api/filters` — `getFilters` emulates the API (lazy-loads `filterData.json`), `useFilters` wraps it in **react-query**; the home page prefetches the query, so the modal usually opens without a loader
- `src/shared/store/filterStore.ts` — global applied filters (**zustand**), stored in the output format `SearchRequestFilter`
- `src/shared/lib/filter/selection.ts` — pure helpers: draft toggle and `FilterItem` + draft → `SearchRequestFilter` conversion (covered by unit tests)
- `src/shared/ui` — `Modal`, `Button`, `CloseButton`
- `src/features/filter` — filter modal, option groups and the confirmation dialog
- `src/pages/Home` — the button that opens the modal and the applied filters as JSON

## Key decisions

- **Draft vs applied state.** The modal edits a local draft. The draft is created from the global state every time the modal opens, so closing without applying (close button, Esc, backdrop click, "Use old filter") never changes the saved filters. Only "Apply new filter" in the confirmation dialog writes to the store.
- **Native `<dialog>`** with `showModal()` for semantics and accessibility: focus trap, Esc, top-layer stacking for the nested confirmation dialog — without an extra library.
- **Modal robustness:** the native `close` event is the single source of truth, so Esc closed by the browser never leaves React state "open"; a nested dialog does not close its parent; a backdrop click closes the modal only if the press also started on the backdrop (text selection is safe); focus returns to the trigger; page scroll is locked while a dialog is open.
- **Semantic markup:** `fieldset`/`legend` per filter group, real checkboxes inside `label`, `form` submit for Apply, `aria-labelledby` on dialogs.
- **Design:** sizes, typography and colors are taken from the Figma layout (design tokens in `src/main.css`). On narrow screens paddings and headings are reduced and options go into one column, since there is no mobile layout. Filter groups come from `filterData.json`, which differs from the groups in the layout.
- **Output order** follows the API data, unknown ids and empty groups are dropped.
- **i18n:** all UI texts are in `locales/en` (`filter`, `home` namespaces); the typings in `src/i18next.d.ts` were fixed to point to the existing files.
- **Tests:** unit tests for the selection helpers and integration tests for the whole flow (apply/confirm, use old filter, close, Esc, backdrop, focus return, clear all) and for loading/error/retry states.
- **CI** (`.github/workflows/pipeline.yml`): format check, lint, tests, build on Node 20 and 22, with read-only permissions and cancellation of outdated runs.
