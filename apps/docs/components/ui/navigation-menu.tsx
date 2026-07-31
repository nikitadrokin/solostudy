import { NavigationMenu as NavigationMenuPrimitive } from '@base-ui/react/navigation-menu';
import { cva } from 'class-variance-authority';
import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

function NavigationMenu({
  align = 'start',
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Root.Props &
  Pick<NavigationMenuPrimitive.Positioner.Props, 'align'>) {
  return (
    <NavigationMenuPrimitive.Root
      className={cn(
        'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
        className
      )}
      data-slot="navigation-menu"
      {...props}
    >
      {children}
      <NavigationMenuPositioner align={align} />
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      className={cn(
        'group relative flex flex-1 list-none items-center justify-center gap-0',
        className
      )}
      data-slot="navigation-menu-list"
      {...props}
    />
  );
}

/**
 * Sliding background shared by the items of the list it is rendered in.
 * Base UI has no `NavigationMenu.Indicator` equivalent of `Tabs.Indicator`, so
 * this tracks the hovered/focused item itself and animates between positions.
 * Render it as the first child of `NavigationMenuList`; it is opt-in, so lists
 * without it behave exactly as before.
 */
function NavigationMenuHighlight({
  className,
  ...props
}: React.ComponentPropsWithRef<'li'>) {
  const ref = React.useRef<HTMLLIElement>(null);
  const [state, setState] = React.useState<{
    rect: { left: number; width: number } | null;
    /** True while appearing, so the first position is taken without sliding. */
    instant: boolean;
  }>({ rect: null, instant: true });

  React.useEffect(() => {
    const list = ref.current?.parentElement;
    if (!list) return;

    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const measure = (item: Element | null) => {
      if (!item) return;
      const itemBox = item.getBoundingClientRect();
      const listBox = list.getBoundingClientRect();
      // biome-ignore lint/nursery/noShadow: same var name
      const rect = { left: itemBox.left - listBox.left, width: itemBox.width };
      // Appearing from nothing snaps into place; moving between items slides.
      setState((prev) => ({ rect, instant: prev.rect === null }));
    };

    // An item whose popup is open keeps the highlight after the pointer leaves.
    const pinnedItem = () =>
      list.querySelector(
        '[data-slot="navigation-menu-item"]:has([data-popup-open]), [data-slot="navigation-menu-item"]:has([data-active])'
      );

    const itemFrom = (target: EventTarget | null) =>
      target instanceof Element
        ? target.closest('[data-slot="navigation-menu-item"]')
        : null;

    const show = (event: Event) => {
      const item = itemFrom(event.target);
      if (!item) return; // gaps between items keep the current position
      clearTimeout(hideTimer);
      measure(item);
    };

    // Small grace period so crossing a gap between two items doesn't reset the
    // highlight (which would make the next item snap instead of slide).
    const hide = () => {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        const pinned = pinnedItem();
        if (pinned) {
          measure(pinned);
        } else {
          setState({ rect: null, instant: true });
        }
      }, 80);
    };

    const onResize = () => {
      const pinned = pinnedItem();
      if (pinned) measure(pinned);
    };

    list.addEventListener('pointerover', show);
    list.addEventListener('pointerleave', hide);
    list.addEventListener('focusin', show);
    list.addEventListener('focusout', hide);
    window.addEventListener('resize', onResize);

    const pinned = pinnedItem();
    if (pinned) measure(pinned);

    return () => {
      clearTimeout(hideTimer);
      list.removeEventListener('pointerover', show);
      list.removeEventListener('pointerleave', hide);
      list.removeEventListener('focusin', show);
      list.removeEventListener('focusout', hide);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // The snapped position is committed with transitions off; re-enable them on
  // the next frame so every later move animates.
  React.useEffect(() => {
    if (!(state.instant && state.rect)) return;
    const frame = requestAnimationFrame(() =>
      setState((prev) => (prev.instant ? { ...prev, instant: false } : prev))
    );
    return () => cancelAnimationFrame(frame);
  }, [state]);

  const { rect, instant } = state;

  return (
    <li
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute top-0 left-0 h-full rounded-lg bg-muted opacity-0 transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-visible:opacity-100 data-instant:transition-opacity data-instant:duration-150 motion-reduce:transition-none',
        className
      )}
      data-instant={instant ? '' : undefined}
      data-slot="navigation-menu-highlight"
      data-visible={rect ? '' : undefined}
      ref={ref}
      role="presentation"
      style={{
        transform: `translateX(${rect?.left ?? 0}px)`,
        width: rect?.width ?? 0,
      }}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      className={cn('relative', className)}
      data-slot="navigation-menu-item"
      {...props}
    />
  );
}

const navigationMenuTriggerStyle = cva(
  'group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center rounded-lg px-2.5 py-1.5 font-medium text-sm outline-none transition-all hover:bg-muted focus:bg-muted focus-visible:outline-1 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-open:bg-muted/50 data-popup-open:bg-muted/50 data-open:focus:bg-muted data-open:hover:bg-muted data-popup-open:hover:bg-muted'
);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Trigger.Props) {
  return (
    <NavigationMenuPrimitive.Trigger
      className={cn(navigationMenuTriggerStyle(), 'group', className)}
      data-slot="navigation-menu-trigger"
      {...props}
    >
      {children}{' '}
      <ChevronDownIcon
        aria-hidden="true"
        className="relative top-px ml-1 size-3 transition duration-300 group-data-open/navigation-menu-trigger:rotate-180 group-data-popup-open/navigation-menu-trigger:rotate-180"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: NavigationMenuPrimitive.Content.Props) {
  return (
    <NavigationMenuPrimitive.Content
      className={cn(
        'data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out group-data-[viewport=false]/navigation-menu:data-open:fade-in-0 group-data-[viewport=false]/navigation-menu:data-open:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-closed:fade-out-0 group-data-[viewport=false]/navigation-menu:data-closed:zoom-out-95 h-full w-auto p-1 transition-[opacity,transform,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:data-activation-direction=left:translate-x-[50%] data-ending-style:data-activation-direction=right:translate-x-[-50%] data-starting-style:data-activation-direction=left:translate-x-[-50%] data-starting-style:data-activation-direction=right:translate-x-[50%] data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-ending-style:opacity-0 data-starting-style:opacity-0 **:data-[slot=navigation-menu-link]:focus:outline-none **:data-[slot=navigation-menu-link]:focus:ring-0 group-data-[viewport=false]/navigation-menu:rounded-lg group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:ring-foreground/10 group-data-[viewport=false]/navigation-menu:duration-300 group-data-[viewport=false]/navigation-menu:data-closed:animate-out group-data-[viewport=false]/navigation-menu:data-open:animate-in',
        className
      )}
      data-slot="navigation-menu-content"
      {...props}
    />
  );
}

function NavigationMenuPositioner({
  className,
  side = 'bottom',
  sideOffset = 8,
  align = 'start',
  alignOffset = 0,
  ...props
}: NavigationMenuPrimitive.Positioner.Props) {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className={cn(
          'isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-instant:transition-none data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0',
          className
        )}
        side={side}
        sideOffset={sideOffset}
        {...props}
      >
        <NavigationMenuPrimitive.Popup className="data-[ending-style]:easing-[ease] relative h-(--popup-height) w-(--popup-width) xs:w-(--popup-width) origin-(--transform-origin) rounded-lg bg-popover text-popover-foreground shadow outline-none ring-1 ring-foreground/10 transition-[opacity,transform,width,height,scale,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:scale-90 data-starting-style:scale-90 data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-150">
          <NavigationMenuPrimitive.Viewport className="relative size-full overflow-hidden" />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  );
}

function NavigationMenuLink({
  className,
  ...props
}: NavigationMenuPrimitive.Link.Props) {
  return (
    <NavigationMenuPrimitive.Link
      className={cn(
        "flex items-center gap-2 in-data-[slot=navigation-menu-content]:rounded-md rounded-lg p-2 text-sm outline-none transition-all hover:bg-muted focus:bg-muted focus-visible:outline-1 focus-visible:ring-3 focus-visible:ring-ring/50 data-active:bg-muted/50 data-active:focus:bg-muted data-active:hover:bg-muted [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      data-slot="navigation-menu-link"
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Icon>) {
  return (
    <NavigationMenuPrimitive.Icon
      className={cn(
        'data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-1 flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=visible]:animate-in',
        className
      )}
      data-slot="navigation-menu-indicator"
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </NavigationMenuPrimitive.Icon>
  );
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuHighlight,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuPositioner,
};
