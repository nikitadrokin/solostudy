import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ControlChipProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * A still copy of a focus room control, for showing what the room looks like
 * without wiring up the real thing. Decorative — the surrounding copy carries
 * the meaning.
 */
export default function ControlChip({ children, className }: ControlChipProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        buttonVariants({ size: 'sm', variant: 'outline' }),
        'pointer-events-none relative bg-background/80 backdrop-blur-sm',
        className
      )}
    >
      {children}
    </div>
  );
}
