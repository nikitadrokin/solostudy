import { VisuallyHidden as VisuallyHiddenPrimitive } from 'radix-ui';
import type * as React from 'react';

const VisuallyHiddenRoot: React.FC<
  React.ComponentProps<typeof VisuallyHiddenPrimitive.Root>
> = ({ ...props }) => {
  return <VisuallyHiddenPrimitive.Root {...props} />;
};

const VisuallyHidden: React.FC<
  React.ComponentProps<typeof VisuallyHiddenPrimitive.VisuallyHidden>
> = ({ ...props }) => {
  return <VisuallyHiddenPrimitive.VisuallyHidden {...props} />;
};

export { VisuallyHiddenRoot, VisuallyHidden };
