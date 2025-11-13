import type * as PopoverPrimitive from '@radix-ui/react-popover';
import type React from 'react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface DynamicPopoverProps
  extends Pick<
    React.ComponentProps<typeof PopoverPrimitive.Content>,
    'align' | 'side' | 'className'
  > {
  children?: React.ReactNode;
  tooltip?: React.ReactNode;
  trigger?: React.ReactNode;
}

const DynamicPopover: React.FC<DynamicPopoverProps> = ({
  children,
  align = 'start',
  side = 'bottom',
  tooltip,
  trigger,
  className,
}) => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <Drawer>
      {tooltip ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <DrawerTrigger asChild>{trigger}</DrawerTrigger>
          </TooltipTrigger>
          <TooltipContent align={align} side={side}>
            {tooltip}
          </TooltipContent>
        </Tooltip>
      ) : (
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      )}
      <DrawerContent
        className={cn(
          'h-[calc(100vh-2.5rem)] overflow-hidden bg-background/95 backdrop-blur-sm',
          className
        )}
      >
        {children}
      </DrawerContent>
    </Drawer>
  ) : (
    <Popover>
      {tooltip ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent align={align} side={side}>
            {tooltip}
          </TooltipContent>
        </Tooltip>
      ) : (
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      )}
      <PopoverContent
        align={align}
        className={cn(
          'flex flex-col overflow-hidden rounded-2xl bg-background/80 backdrop-blur-sm',
          className
        )}
        side={side}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
};

export default DynamicPopover;
