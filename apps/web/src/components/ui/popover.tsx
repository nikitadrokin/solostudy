import * as PopoverPrimitive from '@radix-ui/react-popover';
import type * as React from 'react';
import { cn } from '@/lib/utils';

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <div
        className={cn(
          'relative flex max-h-[500px] flex-col pr-4 pl-2',
          'before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-[var(--gradient-height-top)] before:rounded-t-3xl before:bg-gradient-to-b before:from-[var(--gradient-color)] before:to-transparent before:content-[""]',
          'after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-10 after:h-[var(--gradient-height-bottom)] after:bg-gradient-to-t after:from-[var(--gradient-color)] after:to-transparent after:content-[""]'
        )}
        style={
          {
            '--gradient-height-top': '3.5rem',
            '--gradient-height-bottom': '3.5rem',
            '--gradient-color': 'var(--background)',
          } as React.CSSProperties
        }
      >
        <PopoverPrimitive.Content
          align={align}
          className={cn(
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[state=closed]:animate-out data-[state=open]:animate-in',
            className
          )}
          data-slot="popover-content"
          sideOffset={sideOffset}
          {...props}
        />
      </div>
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
