import { PanelLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

type SidebarTriggerProps = React.ComponentProps<typeof Button>;

const SidebarTrigger: React.FC<SidebarTriggerProps> = ({
  onClick,
  ...props
}) => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      size="sm"
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

export default SidebarTrigger;
