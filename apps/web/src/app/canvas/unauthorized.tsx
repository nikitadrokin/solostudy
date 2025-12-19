import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export default function CanvasUnauthorized() {
  return (
    <div className="container mx-auto max-w-7xl select-none space-y-8 p-6 md:p-8">
      <h1 className="font-bold text-2xl">Canvas Integration Required</h1>
      <Card>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookOpen className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>Canvas Not Connected</EmptyTitle>
            <EmptyDescription>
              Please connect your Canvas access token in settings first.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              className={buttonVariants({ size: 'lg' })}
              href="/settings#integrations"
            >
              Go to Settings
              <ArrowRight className="size-4" />
            </Link>
          </EmptyContent>
        </Empty>
      </Card>
    </div>
  );
}
