'use client';

import type { UrlObject } from 'node:url';
import { useQuery } from '@tanstack/react-query';
import {
  Award,
  Bell,
  BookOpen,
  Calendar,
  ChevronRight,
  FileText,
  Focus,
  LayoutDashboard,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';
import { trpcClient } from '@/utils/trpc';
import { ModeToggle } from './theme-toggle/dropdown';
import { ThemeToggle } from './theme-toggle/inline';
import UserMenu from './user-menu';

const mainLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/focus', label: 'Focus Room', icon: Focus },
];

const canvasLinks = [
  { href: '/canvas/assignments', label: 'Assignments', icon: FileText },
  { href: '/canvas/courses', label: 'Courses', icon: BookOpen },
  { href: '/canvas/grades', label: 'Grades', icon: Award },
  { href: '/canvas/calendar', label: 'Calendar', icon: Calendar },
  { href: '/canvas/announcements', label: 'Announcements', icon: Bell },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();
  const { data: session } = authClient.useSession();
  const [canvasOpen, setCanvasOpen] = useState(pathname.startsWith('/canvas'));

  const { data: canvasStatus } = useQuery({
    queryKey: [['canvas', 'getStatus']],
    queryFn: () => trpcClient.canvas.getStatus.query(),
    enabled: !!session,
  });

  const isCanvasConnected = canvasStatus?.connected === true;
  const isCanvasPath = pathname.startsWith('/canvas');

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Toggle Sidebar">
              <SidebarTrigger className="h-8 w-8" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>SoloStudy</SidebarGroupLabel>
          <SidebarMenu>
            {mainLinks.map(({ href, label, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === href}
                  tooltip={label}
                >
                  <Link href={href as unknown as UrlObject}>
                    <Icon />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            {isCanvasConnected && (
              <Collapsible
                asChild
                defaultOpen={canvasOpen}
                onOpenChange={setCanvasOpen}
                open={canvasOpen}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={isCanvasPath} tooltip="Canvas">
                      <FileText />
                      <span>Canvas</span>
                      <ChevronRight
                        className={`ml-auto transition-transform duration-200 ${
                          canvasOpen ? 'rotate-90' : ''
                        }`}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {canvasLinks.map(({ href, label, icon: Icon }) => (
                        <SidebarMenuSubItem key={href}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === href}
                          >
                            <Link href={href as unknown as UrlObject}>
                              <Icon />
                              <span>{label}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )}

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/settings'}
                tooltip="Settings"
              >
                <Link href={'/settings' as unknown as UrlObject}>
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {open ? <ThemeToggle /> : <ModeToggle />}
          </SidebarMenuItem>
          <SidebarMenuItem>
            <UserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
