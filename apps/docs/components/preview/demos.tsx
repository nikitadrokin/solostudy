'use client';

import {
  BadgeCheck,
  Bell,
  Bold,
  CalendarDays,
  ChevronsUpDown,
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
import type { ComponentType } from 'react';
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
  DynamicPopoverDescription,
  DynamicPopoverHeader,
  DynamicPopoverTitle,
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
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
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

function DynamicPopoverDemo() {
  return (
    <DynamicPopover>
      <DynamicPopoverTrigger
        className={cn(buttonVariants({ variant: 'outline' }))}
      >
        Open
      </DynamicPopoverTrigger>
      <DynamicPopoverContent className="h-64 w-72" title="Notifications">
        <DynamicPopoverHeader>
          <DynamicPopoverTitle>Notifications</DynamicPopoverTitle>
          <DynamicPopoverDescription>
            A popover on desktop, a drawer on mobile.
          </DynamicPopoverDescription>
        </DynamicPopoverHeader>
        <DynamicPopoverBody className="p-4">
          <div className="flex flex-col gap-3">
            {['New comment', 'Session reminder', 'Weekly recap'].map((n) => (
              <div className="flex items-center gap-2 text-sm" key={n}>
                <Bell className="size-4 text-muted-foreground" />
                {n}
              </div>
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

function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger className={cn(buttonVariants({ variant: 'outline' }))}>
        Open popover
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the layout dimensions.</PopoverDescription>
        </PopoverHeader>
        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="width">Width</Label>
            <Input className="h-8 w-24" defaultValue="100%" id="width" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="height">Height</Label>
            <Input className="h-8 w-24" defaultValue="24px" id="height" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
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
