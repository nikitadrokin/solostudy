import { Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sidebarMenuButtonVariants, useSidebar } from '../ui/sidebar';

export type OpenInSupabaseProps = {
  /** Supabase dashboard URL from server env `SUPABASE_DASHBOARD_URL` (passed from layout). */
  dashboardUrl: string;
};

const OpenInSupabase: React.FC<OpenInSupabaseProps> = ({ dashboardUrl }) => {
  const { open } = useSidebar();

  return (
    <a
      className={sidebarMenuButtonVariants({ className: 'px-3' })}
      href={dashboardUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Database className={cn(open ? '!size-5 ml-0.5' : '!size-5')} />
      <span>Open in Supabase</span>
    </a>
  );
};

export default OpenInSupabase;
