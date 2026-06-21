# SoloStudy UI — how to build with this library

A shadcn-style React component library (new-york style) built on Radix UI, Base UI,
and Tailwind CSS v4. Components are imported from the bundle and styled with Tailwind
utility classes plus CSS custom-property design tokens. Every export is available on
`window.SoloStudyUI.*`.

## Styling idiom

Style with **Tailwind v4 utility classes** that reference the design tokens — never
hard-coded colors. The tokens are CSS custom properties (oklch) defined in the bundled
stylesheet under `:root` and `.dark`, and exposed as Tailwind color utilities.

Use the **semantic token utilities**, not raw palette values:

| Surface / text | Utilities |
|---|---|
| App surface | `bg-background` / `text-foreground` |
| Cards, panels | `bg-card` / `text-card-foreground`, `bg-popover` / `text-popover-foreground` |
| Primary action | `bg-primary` / `text-primary-foreground` |
| Secondary | `bg-secondary` / `text-secondary-foreground` |
| Muted / subtle | `bg-muted` / `text-muted-foreground` |
| Accent (hover) | `bg-accent` / `text-accent-foreground` |
| Destructive | `bg-destructive` / `text-white` |
| Borders / inputs / focus | `border`, `border-input`, `ring-ring` |
| Charts | `var(--chart-1)` … `var(--chart-5)` |

Radius scales off `--radius` via `rounded-sm|md|lg|xl`. Dark mode is the `.dark` class on
an ancestor — token utilities flip automatically; don't write `dark:` color overrides
unless a component already does. Spacing/typography use stock Tailwind scales
(`gap-2`, `p-4`, `text-sm`, `font-medium`).

## Component composition

Components are **compound**: a family root plus parts you assemble. Examples:

- `Card` → `CardHeader` / `CardTitle` / `CardDescription` / `CardAction` / `CardContent` / `CardFooter`
- `Dialog` → `DialogTrigger` + `DialogContent` ( `DialogHeader` / `DialogTitle` / `DialogDescription` / `DialogFooter` )
- `Field`/`FieldSet` → `FieldGroup` / `Field` / `FieldLabel` / `FieldDescription` / `FieldError`
- `Table` → `TableHeader` / `TableBody` / `TableRow` / `TableHead` / `TableCell`
- `Item`/`ItemGroup`, `Empty`, `InputGroup`, `ButtonGroup`, `Sidebar*` follow the same pattern.

`Button` carries the variant vocabulary used across actions:
`variant="default|secondary|destructive|outline|ghost|ghost-destructive|link"`,
`size="default|sm|lg|icon"`, plus `isLoading`, `fullWidth`, `icon`, and `asChild`.
`Badge` uses `variant="default|secondary|destructive|outline"`.

Icons are **lucide-react** (`size-4` inside buttons by default).

## Setup notes

- **Tabs** and **Combobox** are **Base UI** (not Radix): use `Tabs` + `TabsList` +
  `TabsTab value` + `TabsPanel value` (there is no `TabsTrigger`/`TabsContent`).
- **Tooltip** must be wrapped in a `TooltipProvider`.
- **Sidebar** must be wrapped in a `SidebarProvider`.
- **Chart** uses recharts: wrap a recharts chart in `ChartContainer config={...}` and
  reference series colors as `var(--color-<key>)`.

## Where the truth lives

The full token set and component styles are in the bundled stylesheet
(`styles.css` → `_ds_bundle.css`). Each component has a `<Name>.d.ts` (its props
contract) and a `<Name>.prompt.md` (usage) under `components/general/<Name>/`.

## Example

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Badge } from 'web';

<Card className="w-80">
  <CardHeader>
    <CardTitle>Calculus II</CardTitle>
    <Badge variant="secondary" className="text-muted-foreground">In progress</Badge>
  </CardHeader>
  <CardContent className="text-muted-foreground text-sm">
    12 of 18 lessons complete.
  </CardContent>
  <CardFooter className="gap-2">
    <Button size="sm">Resume</Button>
    <Button size="sm" variant="outline">Details</Button>
  </CardFooter>
</Card>
```
