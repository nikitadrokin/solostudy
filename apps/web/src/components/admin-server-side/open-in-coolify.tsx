import { Terminal } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { sidebarMenuButtonVariants, useSidebar } from '../ui/sidebar';

const OpenInCoolify: React.FC = () => {
  const { open } = useSidebar();

  return (
    <Link
      className={sidebarMenuButtonVariants({ className: 'px-3' })}
      href={(process.env.COOLIFY_PROJECT_URL ?? '') as Route}
    >
      <Terminal className={cn(open ? '!size-5 ml-0.5' : '!size-5')} />
      <span>Open in Coolify</span>
    </Link>
  );
};

export default OpenInCoolify;
