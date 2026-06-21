import { AspectRatio } from 'web';
export const Widescreen = () => (
  <div className="w-80">
    <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg bg-muted">
      <div className="flex size-full items-center justify-center text-muted-foreground text-sm">16 : 9</div>
    </AspectRatio>
  </div>
);
