import type * as React from 'react';

import { cn } from '@/lib/utils';

function VisuallyHidden({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('sr-only', className)} {...props} />;
}

function VisuallyHiddenRoot({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return <VisuallyHidden className={className} {...props} />;
}

export { VisuallyHiddenRoot, VisuallyHidden };
