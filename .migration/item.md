# item

2026-07-09, transformation engine, Slot → `useRender` + `mergeProps`.

## Changed

- `apps/web/src/components/ui/item.tsx`: `Item` polymorphic Slot/`asChild` → `render` via `useRender`. Leftover scan clean.
- Consumers: quiz-practice + grade-predictor course pickers use `render={<button />}` instead of wrapping `<button>`.

## Left alone

- Non-polymorphic Item* parts unchanged; Separator import now Base UI-backed.

## Behavior changes

None beyond composition API.

## Verify by hand

- Grade predictor / quiz practice empty course grid: click a course card; keyboard activation on the rendered button.
