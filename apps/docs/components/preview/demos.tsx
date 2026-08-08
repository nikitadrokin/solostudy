'use client';

import {
  BadgeCheck,
  Bell,
  Bold,
  CalendarDays,
  ChevronsUpDown,
  Clapperboard,
  Clock,
  CreditCard,
  Folder,
  Italic,
  LogOut,
  Mail,
  Plus,
  Search,
  Settings,
  Star,
  Underline,
  User,
} from 'lucide-react';
import { type ComponentType, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from '@/components/ui/button-group';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  DynamicPopover,
  DynamicPopoverBody,
  DynamicPopoverContent,
  DynamicPopoverHeader,
  DynamicPopoverTrigger,
} from '@/components/ui/dynamic-popover';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { cn } from '@/lib/utils';

function AlertDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Alert>
        <BadgeCheck />
        <AlertTitle>Your changes have been saved</AlertTitle>
        <AlertDescription>
          This alert keeps important context in view.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <Bell />
        <AlertTitle>Unable to process your payment</AlertTitle>
        <AlertDescription>Please verify your billing details.</AlertDescription>
      </Alert>
    </div>
  );
}

function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(buttonVariants({ variant: 'outline' }))}
      >
        Delete account
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes your account and removes your data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AspectRatioDemo() {
  return (
    <div className="w-full max-w-sm">
      <AspectRatio
        className="flex items-center justify-center rounded-lg bg-gradient-to-br from-chart-1/30 to-chart-3/30 font-medium text-muted-foreground text-sm"
        ratio={16 / 9}
      >
        16 / 9
      </AspectRatio>
    </div>
  );
}

function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge>
        <BadgeCheck />
        Verified
      </Badge>
    </div>
  );
}

function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button icon={<Plus />}>New</Button>
      <Button isLoading>Saving</Button>
    </div>
  );
}

function ButtonGroupDemo() {
  return (
    <ButtonGroup>
      <ButtonGroupText>Sort</ButtonGroupText>
      <ButtonGroupSeparator />
      <Button variant="outline">Newest</Button>
      <Button variant="outline">Oldest</Button>
      <Button variant="outline">Popular</Button>
    </ButtonGroup>
  );
}

function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Weekly focus</CardTitle>
        <CardDescription>Your study sessions at a glance.</CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        You logged 12 hours across 5 sessions this week — up 8% from last week.
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">View report</Button>
        <Button size="sm" variant="outline">
          Dismiss
        </Button>
      </CardFooter>
    </Card>
  );
}

const chartData = [
  { day: 'Mon', hours: 3 },
  { day: 'Tue', hours: 2 },
  { day: 'Wed', hours: 4 },
  { day: 'Thu', hours: 1 },
  { day: 'Fri', hours: 5 },
  { day: 'Sat', hours: 2 },
  { day: 'Sun', hours: 3 },
];

const chartConfig = {
  hours: { label: 'Hours', color: 'var(--chart-1)' },
} satisfies ChartConfig;

function ChartDemo() {
  return (
    <ChartContainer
      className="min-h-[220px] w-full max-w-lg"
      config={chartConfig}
    >
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          axisLine={false}
          dataKey="day"
          tickLine={false}
          tickMargin={10}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="hours" fill="var(--color-hours)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox defaultChecked id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="newsletter" />
        <Label htmlFor="newsletter">Subscribe to the newsletter</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox disabled id="disabled" />
        <Label htmlFor="disabled">Disabled option</Label>
      </div>
    </div>
  );
}

function CollapsibleDemo() {
  return (
    <Collapsible className="flex w-full max-w-sm flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium text-sm">Starred repositories</span>
        <CollapsibleTrigger
          className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
        >
          <ChevronsUpDown />
          <VisuallyHidden>Toggle</VisuallyHidden>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-2 font-mono text-sm">
        @solostudy/ui
      </div>
      <CollapsibleContent className="flex flex-col gap-2">
        <div className="rounded-md border px-4 py-2 font-mono text-sm">
          @solostudy/hooks
        </div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm">
          @solostudy/config
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

const frameworks = ['Next.js', 'Remix', 'Astro', 'Nuxt', 'SvelteKit'];

function ComboboxDemo() {
  return (
    <div className="w-full max-w-xs">
      <Combobox items={frameworks}>
        <ComboboxInput placeholder="Search framework..." />
        <ComboboxContent>
          <ComboboxEmpty>No framework found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger className={cn(buttonVariants({ variant: 'outline' }))}>
        Edit profile
      </DialogTrigger>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input defaultValue="Ada Lovelace" id="name" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Username</Label>
            <Input defaultValue="@ada" id="username" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose className={cn(buttonVariants({ variant: 'outline' }))}>
            Cancel
          </DialogClose>
          <DialogClose className={cn(buttonVariants())}>
            Save changes
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger className={cn(buttonVariants({ variant: 'outline' }))}>
        Open drawer
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Move goal</DrawerTitle>
            <DrawerDescription>Set your daily study target.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 text-center font-semibold text-4xl">4h</div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose className={cn(buttonVariants({ variant: 'outline' }))}>
              Cancel
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(buttonVariants({ variant: 'outline' }))}
      >
        Open menu
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuItem>
            <User />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const BACKGROUND_FILTERS = ['All', 'Nature', 'Lo-fi', 'Cafe', 'Rain'] as const;

type BackgroundFilter = (typeof BACKGROUND_FILTERS)[number];

type BackgroundItem = {
  id: string;
  title: string;
  tag: Exclude<BackgroundFilter, 'All'>;
  accent: string;
};

const BACKGROUNDS: BackgroundItem[] = [
  {
    id: 'forest',
    title: 'Forest path',
    tag: 'Nature',
    accent: 'from-emerald-900 via-green-700 to-lime-600',
  },
  {
    id: 'waves',
    title: 'Ocean waves',
    tag: 'Nature',
    accent: 'from-sky-900 via-cyan-700 to-teal-500',
  },
  {
    id: 'lofi-room',
    title: 'Lo-fi room',
    tag: 'Lo-fi',
    accent: 'from-violet-900 via-purple-700 to-fuchsia-500',
  },
  {
    id: 'vinyl',
    title: 'Vinyl corner',
    tag: 'Lo-fi',
    accent: 'from-orange-900 via-amber-700 to-yellow-500',
  },
  {
    id: 'corner-cafe',
    title: 'Corner cafe',
    tag: 'Cafe',
    accent: 'from-stone-800 via-amber-800 to-orange-600',
  },
  {
    id: 'bookstore',
    title: 'Bookstore nook',
    tag: 'Cafe',
    accent: 'from-neutral-900 via-stone-700 to-amber-600',
  },
  {
    id: 'window-rain',
    title: 'Window rain',
    tag: 'Rain',
    accent: 'from-slate-900 via-blue-800 to-indigo-500',
  },
  {
    id: 'night-city',
    title: 'Night city',
    tag: 'Rain',
    accent: 'from-zinc-950 via-slate-800 to-blue-600',
  },
  {
    id: 'meadow',
    title: 'Morning meadow',
    tag: 'Nature',
    accent: 'from-green-900 via-emerald-600 to-yellow-400',
  },
  {
    id: 'study-desk',
    title: 'Study desk',
    tag: 'Lo-fi',
    accent: 'from-rose-950 via-rose-800 to-orange-500',
  },
];

function DynamicPopoverDemo() {
  const [activeFilter, setActiveFilter] = useState<BackgroundFilter>('All');
  const [urlInput, setUrlInput] = useState('');

  const filteredBackgrounds =
    activeFilter === 'All'
      ? BACKGROUNDS
      : BACKGROUNDS.filter((item) => item.tag === activeFilter);

  return (
    <DynamicPopover>
      <DynamicPopoverTrigger
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'bg-background/80 backdrop-blur-sm'
        )}
        tooltip="Select background"
      >
        <Clapperboard className="size-4" />
        Select background
      </DynamicPopoverTrigger>
      <DynamicPopoverContent className="h-95 w-85" title="Select background">
        <DynamicPopoverHeader className="gap-2 px-3 md:px-4">
          <div className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
            {BACKGROUND_FILTERS.map((filter) => (
              <Badge
                className={cn(
                  'shrink-0 cursor-pointer select-none rounded-full px-2.5 py-0.5 text-xs backdrop-blur-xs transition-colors',
                  activeFilter === filter
                    ? 'bg-foreground text-background hover:bg-foreground/90'
                    : 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                key={filter}
                onClick={() => setActiveFilter(filter)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveFilter(filter);
                  }
                }}
                render={<button type="button" />}
                variant="outline"
              >
                {filter}
              </Badge>
            ))}
          </div>
          <Label htmlFor="demo-background-url">Custom Video URL</Label>
          <div className="flex gap-2">
            <Input
              className="h-8 flex-1"
              id="demo-background-url"
              onChange={(event) => setUrlInput(event.target.value)}
              placeholder="https://youtube.com/watch?v=…"
              type="url"
              value={urlInput}
            />
            <Button disabled={!urlInput.trim()} size="sm">
              Load
            </Button>
          </div>
        </DynamicPopoverHeader>
        <DynamicPopoverBody viewportClassName="px-2 pb-3 md:px-3">
          <div className="grid grid-cols-2 gap-1 md:gap-2">
            {filteredBackgrounds.map((item) => (
              <button
                className="cursor-pointer rounded-lg p-2 text-left hover:bg-muted/50"
                key={item.id}
                type="button"
              >
                <AspectRatio
                  className="overflow-hidden rounded-md"
                  ratio={16 / 9}
                >
                  <div
                    className={cn('h-full w-full bg-linear-to-br', item.accent)}
                  />
                </AspectRatio>
                <div className="mt-2 truncate font-medium text-xs">
                  {item.title}
                </div>
              </button>
            ))}
          </div>
        </DynamicPopoverBody>
      </DynamicPopoverContent>
    </DynamicPopover>
  );
}

function EmptyDemo() {
  return (
    <Empty className="w-full max-w-sm border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Folder />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>
          Create your first project to get started.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button icon={<Plus />} size="sm">
          New project
        </Button>
      </EmptyContent>
    </Empty>
  );
}

function FieldDemo() {
  return (
    <FieldGroup className="w-full max-w-sm">
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" placeholder="you@example.com" type="email" />
        <FieldDescription>We'll never share your email.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="bio">Bio</FieldLabel>
        <Textarea id="bio" placeholder="Tell us about yourself" />
      </Field>
    </FieldGroup>
  );
}

function InputDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="demo-input">Email</Label>
      <Input id="demo-input" placeholder="you@example.com" type="email" />
    </div>
  );
}

function InputGroupDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search components..." />
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <Mail />
        </InputGroupAddon>
        <InputGroupInput placeholder="Email address" />
        <InputGroupAddon align="inline-end">@nkdr.me</InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function ItemDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <User />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Ada Lovelace</ItemTitle>
          <ItemDescription>Product designer</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            Follow
          </Button>
        </ItemActions>
      </Item>
    </div>
  );
}

function LabelDemo() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="label-demo" />
      <Label htmlFor="label-demo">
        <Star className="size-4" />
        Add to favorites
      </Label>
    </div>
  );
}

function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
          >
            Overview
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
          >
            Components
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
          >
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const SESSION_FILTERS = ['All', 'Today', 'This week'] as const;

type SessionFilter = (typeof SESSION_FILTERS)[number];

const SESSIONS = [
  {
    id: '1',
    title: 'Organic chemistry review',
    meta: '45 min · Today',
    when: 'today' as const,
  },
  {
    id: '2',
    title: 'Linear algebra drills',
    meta: '25 min · Today',
    when: 'today' as const,
  },
  {
    id: '3',
    title: 'Essay outline',
    meta: '60 min · Yesterday',
    when: 'week' as const,
  },
  {
    id: '4',
    title: 'Spanish vocab',
    meta: '20 min · Mon',
    when: 'week' as const,
  },
  {
    id: '5',
    title: 'Circuits lab prep',
    meta: '35 min · Sun',
    when: 'week' as const,
  },
  {
    id: '6',
    title: 'Reading notes',
    meta: '50 min · Sat',
    when: 'week' as const,
  },
  {
    id: '7',
    title: 'Calc problem set',
    meta: '40 min · Fri',
    when: 'week' as const,
  },
  {
    id: '8',
    title: 'Design critique',
    meta: '30 min · Thu',
    when: 'week' as const,
  },
];

function PopoverDemo() {
  const [activeFilter, setActiveFilter] = useState<SessionFilter>('All');
  const [query, setQuery] = useState('');

  const filteredSessions = SESSIONS.filter((session) => {
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Today' && session.when === 'today') ||
      (activeFilter === 'This week' &&
        (session.when === 'today' || session.when === 'week'));
    const matchesQuery = session.title
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'bg-background/80 backdrop-blur-sm'
        )}
      >
        <Clock className="size-4" />
        Recent sessions
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'relative h-95 w-80 rounded-2xl p-0',
          'border-white/10 bg-background/75 shadow-xl backdrop-blur-md'
        )}
      >
        <div className="absolute inset-x-0 top-0 isolate z-10 flex flex-col gap-2 p-4">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-[-20] h-[calc(100%+3.5rem)] overflow-hidden rounded-t-2xl"
          >
            <ProgressiveBlur side="top" />
          </div>
          <PopoverHeader>
            <PopoverTitle>Sessions</PopoverTitle>
            <PopoverDescription>
              Scroll under the glass header to browse past focus blocks.
            </PopoverDescription>
          </PopoverHeader>
          <div className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
            {SESSION_FILTERS.map((filter) => (
              <Badge
                className={cn(
                  'shrink-0 cursor-pointer select-none rounded-full px-2.5 py-0.5 text-xs backdrop-blur-xs transition-colors',
                  activeFilter === filter
                    ? 'bg-foreground text-background hover:bg-foreground/90'
                    : 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                key={filter}
                onClick={() => setActiveFilter(filter)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveFilter(filter);
                  }
                }}
                render={<button type="button" />}
                variant="outline"
              >
                {filter}
              </Badge>
            ))}
          </div>
          <Input
            className="h-8"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search sessions…"
            value={query}
          />
        </div>
        <ScrollArea
          className="h-full overflow-hidden rounded-b-2xl"
          fadeColor="color-mix(in oklab, var(--background) 80%, transparent)"
          fadeTop="0px"
          viewportClassName="space-y-1 px-3 pb-3 pt-[11.5rem]"
        >
          {filteredSessions.map((session) => (
            <button
              className="flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-muted/50"
              key={session.id}
              type="button"
            >
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                <Clock className="size-3.5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-sm">
                  {session.title}
                </div>
                <div className="text-muted-foreground text-xs">
                  {session.meta}
                </div>
              </div>
            </button>
          ))}
          {filteredSessions.length === 0 ? (
            <p className="px-2 py-6 text-center text-muted-foreground text-sm">
              No sessions match.
            </p>
          ) : null}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

function ProgressiveBlurDemo() {
  const lines = Array.from({ length: 16 }, (_, i) => {
    const n = i + 1;
    return `Focus block ${n} — review notes, drill flashcards, then take a short break.`;
  });

  return (
    <div className="relative h-72 w-full max-w-sm overflow-clip rounded-2xl border border-white/10 bg-background/75 shadow-xl backdrop-blur-md">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 isolate z-10 h-32"
      >
        <ProgressiveBlur side="top" />
      </div>
      <ScrollArea className="h-full" fadeTop="0px" viewportClassName="p-4 pt-8">
        <p className="mb-3 font-medium text-sm">Scroll under the blur</p>
        <div className="flex flex-col gap-2">
          {lines.map((line) => (
            <p className="text-muted-foreground text-sm" key={line}>
              {line}
            </p>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function ScrollAreaDemo() {
  const tags = Array.from({ length: 24 }, (_, i) => `v1.2.0-beta.${i + 1}`);
  return (
    <ScrollArea className="h-56 w-full max-w-xs rounded-md border">
      <div className="p-4">
        <div className="mb-2 font-medium text-sm">Tags</div>
        {tags.map((tag) => (
          <div className="py-1.5 text-sm" key={tag}>
            {tag}
            <Separator className="mt-1.5" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function SeparatorDemo() {
  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col gap-1">
        <span className="font-medium text-sm">solostudy registry</span>
        <span className="text-muted-foreground text-sm">
          Base UI component collection.
        </span>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-3 text-sm">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Components</span>
        <Separator orientation="vertical" />
        <span>Themes</span>
      </div>
    </div>
  );
}

function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger className={cn(buttonVariants({ variant: 'outline' }))}>
        Open sheet
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Update your details. Save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="sheet-name">Name</Label>
            <Input defaultValue="Ada Lovelace" id="sheet-name" />
          </div>
        </div>
        <SheetFooter>
          <Button>Save changes</Button>
          <SheetClose className={cn(buttonVariants({ variant: 'outline' }))}>
            Close
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function SkeletonDemo() {
  return (
    <div className="flex w-full max-w-sm items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

function SonnerDemo() {
  return (
    <>
      <Button
        onClick={() =>
          toast('Session saved', {
            description: 'Your study session was logged.',
            action: { label: 'Undo', onClick: () => toast.dismiss() },
          })
        }
        variant="outline"
      >
        Show toast
      </Button>
      <Toaster />
    </>
  );
}

function TableDemo() {
  const rows = [
    { name: 'Button', deps: 0, type: 'ui' },
    { name: 'Combobox', deps: 2, type: 'ui' },
    { name: 'Dialog', deps: 0, type: 'ui' },
    { name: 'Dynamic Popover', deps: 4, type: 'ui' },
  ];
  return (
    <div className="w-full max-w-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Component</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Deps</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell className="text-right">{row.deps}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function TabsDemo() {
  return (
    <Tabs className="w-full max-w-sm" defaultValue="account">
      <TabsList>
        <TabsTab value="account">Account</TabsTab>
        <TabsTab value="password">Password</TabsTab>
      </TabsList>
      <TabsPanel value="account">
        <p className="text-muted-foreground text-sm">
          Make changes to your account here.
        </p>
      </TabsPanel>
      <TabsPanel value="password">
        <p className="text-muted-foreground text-sm">
          Change your password here.
        </p>
      </TabsPanel>
    </Tabs>
  );
}

function TextareaDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label htmlFor="message">Your message</Label>
      <Textarea id="message" placeholder="Type your message here." />
    </div>
  );
}

function TooltipDemo() {
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger
          className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}
        >
          <CalendarDays />
          <VisuallyHidden>Schedule</VisuallyHidden>
        </TooltipTrigger>
        <TooltipContent>Schedule a session</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger className={cn(buttonVariants({ variant: 'outline' }))}>
          Hover me
        </TooltipTrigger>
        <TooltipContent>Supplemental hint text</TooltipContent>
      </Tooltip>
    </div>
  );
}

function VisuallyHiddenDemo() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <Bold />
        <VisuallyHidden>Bold</VisuallyHidden>
      </Button>
      <Button variant="outline">
        <Italic />
        <VisuallyHidden>Italic</VisuallyHidden>
      </Button>
      <Button variant="outline">
        <Underline />
        <VisuallyHidden>Underline</VisuallyHidden>
      </Button>
    </ButtonGroup>
  );
}

export const demos: Record<string, ComponentType> = {
  alert: AlertDemo,
  'alert-dialog': AlertDialogDemo,
  'aspect-ratio': AspectRatioDemo,
  badge: BadgeDemo,
  button: ButtonDemo,
  'button-group': ButtonGroupDemo,
  card: CardDemo,
  chart: ChartDemo,
  checkbox: CheckboxDemo,
  collapsible: CollapsibleDemo,
  combobox: ComboboxDemo,
  dialog: DialogDemo,
  drawer: DrawerDemo,
  'dropdown-menu': DropdownMenuDemo,
  'dynamic-popover': DynamicPopoverDemo,
  empty: EmptyDemo,
  field: FieldDemo,
  input: InputDemo,
  'input-group': InputGroupDemo,
  item: ItemDemo,
  label: LabelDemo,
  'navigation-menu': NavigationMenuDemo,
  popover: PopoverDemo,
  'progressive-blur': ProgressiveBlurDemo,
  'scroll-area': ScrollAreaDemo,
  separator: SeparatorDemo,
  sheet: SheetDemo,
  skeleton: SkeletonDemo,
  sonner: SonnerDemo,
  table: TableDemo,
  tabs: TabsDemo,
  textarea: TextareaDemo,
  tooltip: TooltipDemo,
  'visually-hidden': VisuallyHiddenDemo,
};

export function Demo({ name }: { name: string }) {
  const Component = demos[name];
  if (!Component) {
    return (
      <p className="text-muted-foreground text-sm">
        No preview available for <code>{name}</code>.
      </p>
    );
  }
  return <Component />;
}
