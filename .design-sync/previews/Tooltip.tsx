import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, Button } from 'web';
import { Info } from 'lucide-react';
export const Open = () => (
  <TooltipProvider>
    <div className="flex justify-center pt-10">
      <Tooltip defaultOpen>
        <TooltipTrigger asChild><Button variant="outline" size="icon" aria-label="Info"><Info /></Button></TooltipTrigger>
        <TooltipContent>Focus score updates every minute</TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
);
