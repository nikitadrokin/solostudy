import type * as React from 'react';

function AspectRatio({
  ratio = 1,
  style,
  ...props
}: React.ComponentProps<'div'> & {
  /**
   * Width / height ratio applied via CSS `aspect-ratio`.
   * @default 1
   */
  ratio?: number;
}) {
  return (
    <div
      data-slot="aspect-ratio"
      style={{
        ...style,
        aspectRatio: ratio,
      }}
      {...props}
    />
  );
}

export { AspectRatio };
