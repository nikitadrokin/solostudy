'use client';

import type { Popover as PopoverPrimitive } from '@base-ui/react/popover';
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
  PopoverDescription,
  PopoverTitle,
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

type DynamicPopoverProps = {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
};

function DynamicPopover({
  children,
  open,
  defaultOpen,
  onOpenChange,
  modal,
}: DynamicPopoverProps) {
  const isMobile = useIsMobile();
  const context = React.useMemo(() => ({ isMobile }), [isMobile]);

  return (
    <DynamicPopoverContext.Provider value={context}>
      {isMobile ? (
        <Drawer
          defaultOpen={defaultOpen}
          modal={modal}
          onOpenChange={onOpenChange}
          open={open}
          repositionInputs={false}
        >
          {children}
        </Drawer>
      ) : (
        <Popover
          defaultOpen={defaultOpen}
          modal={modal}
          onOpenChange={onOpenChange}
          open={open}
        >
          {children}
        </Popover>
      )}
    </DynamicPopoverContext.Provider>
  );
}

function DynamicPopoverTrigger({
  tooltip,
  tooltipAlign = 'center',
  tooltipSide = 'bottom',
  children,
  className,
  render,
  ...props
}: Omit<React.ComponentProps<'button'>, 'ref'> & {
  tooltip?: React.ReactNode;
  tooltipAlign?: React.ComponentProps<typeof TooltipContent>['align'];
  tooltipSide?: React.ComponentProps<typeof TooltipContent>['side'];
  render?: React.ComponentProps<typeof PopoverTrigger>['render'];
}) {
  const { isMobile } = useDynamicPopover();

  let trigger: React.ReactElement;
  if (isMobile) {
    const drawerChild =
      render && React.isValidElement(render)
        ? React.cloneElement(
            render as React.ReactElement<{ children?: React.ReactNode }>,
            undefined,
            children
          )
        : children;

    trigger = (
      <DrawerTrigger
        asChild={Boolean(render && React.isValidElement(render))}
        className={typeof className === 'string' ? className : undefined}
        data-slot="dynamic-popover-trigger"
        {...props}
      >
        {drawerChild}
      </DrawerTrigger>
    );
  } else {
    trigger = (
      <PopoverTrigger
        className={className}
        data-slot="dynamic-popover-trigger"
        render={render}
        {...props}
      >
        {children}
      </PopoverTrigger>
    );
  }

  if (!tooltip) {
    return trigger;
  }

  return (
    <Tooltip>
      <TooltipTrigger render={trigger} />
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
}: Pick<PopoverPrimitive.Positioner.Props, 'align' | 'side'> &
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
        {title ? (
          <VisuallyHidden>
            <DrawerTitle>{title}</DrawerTitle>
          </VisuallyHidden>
        ) : null}
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

  if (isMobile) {
    return (
      <DrawerTitle
        className={cn('font-semibold text-foreground leading-none', className)}
        data-slot="dynamic-popover-title"
        {...props}
      />
    );
  }

  return (
    <PopoverTitle
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

  if (isMobile) {
    return (
      <DrawerDescription
        className={cn('text-muted-foreground text-sm', className)}
        data-slot="dynamic-popover-description"
        {...props}
      />
    );
  }

  return (
    <PopoverDescription
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
