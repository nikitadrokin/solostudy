import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuShortcut, Button } from 'web';
import { Settings, Share, Trash } from 'lucide-react';
export const Open = () => (
  <DropdownMenu defaultOpen modal={false}>
    <DropdownMenuTrigger asChild><Button variant="outline">Options</Button></DropdownMenuTrigger>
    <DropdownMenuContent className="w-52">
      <DropdownMenuLabel>Deck</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem><Settings /> Settings <DropdownMenuShortcut>⌘S</DropdownMenuShortcut></DropdownMenuItem>
      <DropdownMenuItem><Share /> Share</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive"><Trash /> Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
