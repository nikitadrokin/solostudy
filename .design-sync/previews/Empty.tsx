import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent, Button } from 'web';
import { Inbox } from 'lucide-react';
export const NoSessions = () => (
  <div className="w-96">
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon"><Inbox /></EmptyMedia>
        <EmptyTitle>No study sessions yet</EmptyTitle>
        <EmptyDescription>Start a focus block and your sessions will show up here.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent><Button>Start a session</Button></EmptyContent>
    </Empty>
  </div>
);
