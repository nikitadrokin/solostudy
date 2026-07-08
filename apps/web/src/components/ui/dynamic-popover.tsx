'use client';

import type * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

/**
 * Renders a Popover on desktop and a Drawer on mobile behind a single
 * composable API. `DynamicPopoverHeader` floats above the content and
 * publishes its measured height as `--dynamic-popover-header-height`,
 * so a sibling `DynamicPopoverBody` scrolls underneath it without
 * hardcoded offsets.
 */

const DynamicPopoverContext = React.createContext<{ isMobile: boolean }>({
  isMobile: false,
});

function useDynamicPopover() {
  return React.useContext(DynamicPopoverContext);
}

function DynamicPopover({
  children,
  ...props
}: React.ComponentProps<typeof Popover>) {
  const isMobile = useIsMobile();
  const context = React.useMemo(() => ({ isMobile }), [isMobile]);

  return (
    <DynamicPopoverContext.Provider value={context}>
      {isMobile ? (
        <Drawer repositionInputs={false} {...props}>
          {children}
        </Drawer>
      ) : (
        <Popover {...props}>{children}</Popover>
      )}
    </DynamicPopoverContext.Provider>
  );
}

function DynamicPopoverTrigger({
  tooltip,
  tooltipAlign = 'center',
  tooltipSide = 'bottom',
  children,
  ...props
}: Omit<React.ComponentProps<typeof PopoverTrigger>, 'ref'> & {
  tooltip?: React.ReactNode;
  tooltipAlign?: React.ComponentProps<typeof TooltipContent>['align'];
  tooltipSide?: React.ComponentProps<typeof TooltipContent>['side'];
}) {
  const { isMobile } = useDynamicPopover();
  const Trigger = isMobile ? DrawerTrigger : PopoverTrigger;
  const trigger = (
    <Trigger data-slot="dynamic-popover-trigger" {...props}>
      {children}
    </Trigger>
  );

  if (!tooltip) {
    return trigger;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent align={tooltipAlign} side={tooltipSide}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

function DynamicPopoverContent({
  className,
  children,
  title,
  align = 'start',
  side = 'bottom',
  ...props
}: Pick<
  React.ComponentProps<typeof PopoverPrimitive.Content>,
  'align' | 'side'
> &
  Omit<React.ComponentProps<'div'>, 'ref' | 'style'> & {
    /**
     * Accessible title for the mobile drawer. Omit when a visible
     * `DynamicPopoverTitle` is rendered inside the content.
     */
    title?: string;
  }) {
  const { isMobile } = useDynamicPopover();

  if (isMobile) {
    return (
      <DrawerContent
        className={cn(
          'h-[calc(100vh-3.5rem)] overflow-hidden bg-background/95 backdrop-blur-sm',
          className
        )}
        data-slot="dynamic-popover-content"
        {...props}
      >
        {title && (
          <VisuallyHidden>
            <DrawerTitle>{title}</DrawerTitle>
          </VisuallyHidden>
        )}
        {children}
      </DrawerContent>
    );
  }

  return (
    <PopoverContent
      align={align}
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl p-0',
        'border border-white/10 bg-background/75 shadow-xl backdrop-blur-md',
        className
      )}
      data-slot="dynamic-popover-content"
      side={side}
      {...props}
    >
      {children}
    </PopoverContent>
  );
}

function DynamicPopoverHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { isMobile } = useDynamicPopover();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const header = ref.current;
    const parent = header?.parentElement;
    if (!(header && parent)) {
      return;
    }

    const update = () => {
      parent.style.setProperty(
        '--dynamic-popover-header-height',
        `${header.offsetHeight}px`
      );
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => {
      observer.disconnect();
      parent.style.removeProperty('--dynamic-popover-header-height');
    };
  }, []);

  return (
    <div
      className={cn(
        'absolute inset-x-0 top-0 z-10 flex flex-col gap-1.5 bg-background/80 p-4',
        'after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-5 after:bg-gradient-to-b after:from-background/80 after:to-transparent after:content-[""]',
        isMobile && 'pt-12',
        className
      )}
      data-slot="dynamic-popover-header"
      ref={ref}
      {...props}
    />
  );
}

function DynamicPopoverBody({
  className,
  viewportClassName,
  ...props
}: React.ComponentProps<typeof ScrollArea>) {
  return (
    <ScrollArea
      className={cn('min-h-0 flex-1', className)}
      data-slot="dynamic-popover-body"
      fadeColor="color-mix(in oklab, var(--background) 80%, transparent)"
      fadeTop="0px"
      viewportClassName={cn(
        'pt-[var(--dynamic-popover-header-height,3.5rem)] md:pt-[var(--dynamic-popover-header-height,1rem)]',
        viewportClassName
      )}
      {...props}
    />
  );
}

function DynamicPopoverTitle({
  className,
  ...props
}: Omit<React.ComponentProps<'div'>, 'ref' | 'style'>) {
  const { isMobile } = useDynamicPopover();
  const Title = isMobile ? DrawerTitle : 'div';

  return (
    <Title
      className={cn('font-semibold text-foreground leading-none', className)}
      data-slot="dynamic-popover-title"
      {...props}
    />
  );
}

function DynamicPopoverDescription({
  className,
  ...props
}: Omit<React.ComponentProps<'div'>, 'ref' | 'style'>) {
  const { isMobile } = useDynamicPopover();
  const Description = isMobile ? DrawerDescription : 'div';

  return (
    <Description
      className={cn('text-muted-foreground text-sm', className)}
      data-slot="dynamic-popover-description"
      {...props}
    />
  );
}

export {
  DynamicPopover,
  DynamicPopoverTrigger,
  DynamicPopoverContent,
  DynamicPopoverHeader,
  DynamicPopoverBody,
  DynamicPopoverTitle,
  DynamicPopoverDescription,
};
