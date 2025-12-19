import { Card } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';

export default function CanvasLoading() {
  return (
    <div className="container mx-auto max-w-7xl select-none space-y-8 p-6 md:p-8">
      <Skeleton className="h-8 w-[6ch]" />
      <Card>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Skeleton className="h-6 w-6 rounded-full" />
            </EmptyMedia>
            <EmptyTitle>
              <Skeleton className="h-6 w-[14ch]" />
            </EmptyTitle>
            <EmptyDescription>
              <Skeleton className="h-4 w-[35ch]" />
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent />
        </Empty>
      </Card>
    </div>
  );
}
