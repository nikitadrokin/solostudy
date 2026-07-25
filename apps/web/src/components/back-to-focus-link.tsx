import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function BackToFocusLink({ className }: { className?: string }) {
  return (
    <Link
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'text-muted-foreground hover:text-foreground',
        className
      )}
      href="/focus"
    >
      <ArrowLeft />
      Back to focus room
    </Link>
  );
}
