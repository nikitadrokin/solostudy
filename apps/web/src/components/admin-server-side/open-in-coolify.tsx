import { Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sidebarMenuButtonVariants, useSidebar } from '../ui/sidebar';

export type OpenInCoolifyProps = {
  /** Coolify project URL from server env `COOLIFY_PROJECT_URL` (passed from layout). */
  projectUrl: string;
};

const OpenInCoolify: React.FC<OpenInCoolifyProps> = ({ projectUrl }) => {
  const { open } = useSidebar();

  return (
    <a
      className={sidebarMenuButtonVariants({ className: 'px-3' })}
      href={projectUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Terminal className={cn(open ? '!size-5 ml-0.5' : '!size-5')} />
      <span>Open in Coolify</span>
    </a>
  );
};

export default OpenInCoolify;
