'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';

const AppHeader: React.FC = () => {
  const pathname = usePathname();

  // Don't render on /focus page
  if (pathname === '/focus') {
    return null;
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center border-b px-4 backdrop-blur-sm lg:hidden">
      <SidebarTrigger />
    </header>
  );
};

export default AppHeader;
