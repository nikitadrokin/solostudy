import { Collapsible, CollapsibleTrigger, CollapsibleContent, Button } from 'web';
import { ChevronsUpDown } from 'lucide-react';
export const Open = () => (
  <Collapsible defaultOpen className="w-80 rounded-lg border p-4">
    <div className="flex items-center justify-between">
      <span className="font-medium text-sm">Session details</span>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Toggle"><ChevronsUpDown /></Button>
      </CollapsibleTrigger>
    </div>
    <CollapsibleContent className="mt-3 flex flex-col gap-2 text-muted-foreground text-sm">
      <div>Started 2:14 PM</div>
      <div>Subject: Calculus II</div>
      <div>Focus score: 92%</div>
    </CollapsibleContent>
  </Collapsible>
);
