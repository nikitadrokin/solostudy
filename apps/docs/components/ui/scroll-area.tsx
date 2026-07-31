import type * as React from 'react';
import { cn } from '@/lib/utils';

function ScrollArea({
  className,
  children,
  fadeColor = 'var(--background)',
  fadeTop = '1rem',
  fadeBottom = '1rem',
  viewportClassName,
  style,
  ...props
}: React.ComponentProps<'div'> & {
  fadeColor?: string;
  fadeTop?: string;
  fadeBottom?: string;
  viewportClassName?: string;
}) {
  return (
    <div
      className={cn(
        'relative flex min-h-0 flex-col',
        'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-(--scroll-area-fade-top) before:bg-gradient-to-b before:from-(--scroll-area-fade-color) before:to-transparent before:content-[""]',
        'after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-10 after:h-(--scroll-area-fade-bottom) after:bg-gradient-to-t after:from-(--scroll-area-fade-color) after:to-transparent after:content-[""]',
        className
      )}
      data-slot="scroll-area"
      style={
        {
          '--scroll-area-fade-color': fadeColor,
          '--scroll-area-fade-top': fadeTop,
          '--scroll-area-fade-bottom': fadeBottom,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <div
        className={cn(
          'min-h-0 flex-1 overflow-y-auto pt-(--scroll-area-fade-top) pb-(--scroll-area-fade-bottom)',
          viewportClassName
        )}
        data-slot="scroll-area-viewport"
      >
        {children}
      </div>
    </div>
  );
}

export { ScrollArea };
