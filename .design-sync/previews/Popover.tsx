import { Popover, PopoverContent, PopoverTrigger, Button, Label, Input } from 'web';
export const Open = () => (
  <Popover defaultOpen modal={false}>
    <PopoverTrigger asChild><Button variant="outline">Session goal</Button></PopoverTrigger>
    <PopoverContent className="w-72">
      <div className="flex flex-col gap-3">
        <div className="font-medium text-sm">Set a goal</div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="goal">Minutes</Label>
          <Input id="goal" type="number" defaultValue={25} />
        </div>
        <Button size="sm">Save goal</Button>
      </div>
    </PopoverContent>
  </Popover>
);
