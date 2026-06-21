import { DynamicPopover, Button } from 'web';
export const Trigger = () => (
  <DynamicPopover
    trigger={<Button variant="outline">Filters</Button>}
    tooltip="Filter your sessions"
  >
    <div className="flex w-56 flex-col gap-2 p-4 text-sm">
      <div className="font-medium">Filter by subject</div>
      <div className="text-muted-foreground">Math · Science · History</div>
    </div>
  </DynamicPopover>
);
