## Design & Style Guidelines

**Avoid generic "AI slop"**: no excessive centered layouts, no purple gradients everywhere, no uniform rounded corners, no Inter font. Commit to a bold aesthetic direction and execute it with intention.

## Using shadcn-svelte Components

All components are installed under `$lib/components/ui/`. Import them directly:

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card/index.js";
  import { Dialog, DialogContent, DialogTrigger } from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs/index.js";
</script>
```

### Available shadcn-svelte components (55+)

**Form & Input:** Accordion, Button, Button Group, Calendar, Checkbox, Combobox, Date Picker, Field, Formsnap, Input, Input Group, Input OTP, Label, Native Select, Radio Group, Range Calendar, Select, Slider, Switch, Textarea

**Layout & Navigation:** Breadcrumb, Navigation Menu, Resizable, Scroll Area, Separator, Sidebar, Tabs

**Overlays & Dialogs:** Alert Dialog, Command, Context Menu, Dialog, Drawer, Dropdown Menu, Hover Card, Menubar, Popover, Sheet, Tooltip

**Feedback & Status:** Alert, Badge, Empty, Progress, Skeleton, Sonner (toast), Spinner

**Display & Media:** Aspect Ratio, Avatar, Card, Carousel, Chart, Data Table, Item, Kbd, Table, Typography

**Misc:** Collapsible, Pagination, Toggle, Toggle Group

Reference: https://shadcn-svelte.com/docs/components

## Using radix-svelte Primitives

radix-svelte provides unstyled, accessible primitives. Use when you need full styling control or a primitive not in shadcn-svelte:

```svelte
<script lang="ts">
  import { Accordion, AlertDialog, AspectRatio, Avatar, Checkbox,
    Collapsible, Dialog, HoverCard, Label, Progress, RadioGroup,
    Separator, Slider, Switch, Tabs, Toggle, ToggleGroup, Tooltip
  } from "radix-svelte";
</script>
```

Reference: https://radix-svelte.com

## Dark Mode

mode-watcher is pre-configured in the root layout. Toggle with:

```svelte
<script lang="ts">
  import { toggleMode, setMode, resetMode } from "mode-watcher";
</script>

<button onclick={toggleMode}>Toggle dark mode</button>
```

CSS variables automatically switch between light/dark via the `.dark` class.

## Routing

SvelteKit file-based routing. Add pages under `src/routes/`:

```
src/routes/
  +page.svelte          # /
  +layout.svelte        # root layout (already created)
  about/+page.svelte    # /about
  dashboard/
    +page.svelte        # /dashboard
    +layout.svelte      # dashboard layout
    settings/+page.svelte  # /dashboard/settings
```

## Testing (Optional)

Use available tools (Playwright, test-webapp skill) to verify the app. Prefer shipping first, testing later if issues arise.
