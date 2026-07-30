import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Mirrors the focus room's floating control row: same offsets, same glass
 * chips, so arriving at /focus feels like the same screen.
 */
export default function LandingHeader() {
  return (
    <div className="absolute top-4 right-4 left-4 z-10 flex items-start justify-between">
      <Link
        className={cn(
          buttonVariants({ size: 'sm', variant: 'outline' }),
          'bg-background/80 font-semibold backdrop-blur-sm'
        )}
        href="/"
        title="SoloStudy home"
      >
        SoloStudy
      </Link>

      <div className="flex items-center gap-2">
        <Link
          className={cn(
            buttonVariants({ size: 'sm', variant: 'outline' }),
            'bg-background/80 backdrop-blur-sm'
          )}
          href="/login"
          title="Sign in"
        >
          <LogIn className="size-4" />
          <span className="sr-only sm:not-sr-only">Sign in</span>
        </Link>

        <Link
          className={cn(
            buttonVariants({ size: 'sm' }),
            'transition-transform duration-200 ease-out active:scale-[0.97]'
          )}
          href="/focus"
        >
          Open focus room
        </Link>
      </div>
    </div>
  );
}
