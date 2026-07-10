import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  Button,
  Label,
  Input,
} from 'web';
export const Open = () => (
  <Popover defaultOpen modal={false}>
    <PopoverTrigger render={<Button variant="outline" />}>
      Session goal
    </PopoverTrigger>
    <PopoverContent className="w-72">
      <div className="flex flex-col gap-3">
        <PopoverHeader>
          <PopoverTitle>Set a goal</PopoverTitle>
          <PopoverDescription>
            Choose how long this focus block should last.
          </PopoverDescription>
        </PopoverHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="goal">Minutes</Label>
          <Input id="goal" type="number" defaultValue={25} />
        </div>
        <Button size="sm">Save goal</Button>
      </div>
    </PopoverContent>
  </Popover>
);
