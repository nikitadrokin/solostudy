import { Separator } from 'web';
export const Horizontal = () => (
  <div className="w-72">
    <div className="text-sm">Focus</div>
    <Separator className="my-3" />
    <div className="text-sm">Break</div>
  </div>
);
export const Vertical = () => (
  <div className="flex h-6 items-center gap-3 text-sm">
    <span>Tasks</span><Separator orientation="vertical" />
    <span>Videos</span><Separator orientation="vertical" />
    <span>Session</span>
  </div>
);
