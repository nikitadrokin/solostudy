'use client';

import {
  Award,
  Bell,
  BookOpen,
  Calendar,
  ChartLine,
  ChevronRight,
  FileText,
  FlaskConical,
  Focus,
  Laptop,
  LayoutDashboard,
  Link as LinkIcon,
  Settings,
  Shield,
  User,
} from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
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
import { cn } from '@/lib/utils';
import { ModeToggle } from './theme-toggle/dropdown';
import { ThemeToggle } from './theme-toggle/inline';
import UserMenu from './user-menu';

// biome-ignore format: because
const mainLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/focus', label: 'Focus Room', icon: Focus },
];

// biome-ignore format: because
const canvasLinks = [
  { href: '/canvas/assignments', label: 'Assignments', icon: FileText },
  { href: '/canvas/courses', label: 'Courses', icon: BookOpen },
  { href: '/canvas/grades', label: 'Grades', icon: Award },
  { href: '/canvas/calendar', label: 'Calendar', icon: Calendar },
  { href: '/canvas/announcements', label: 'Announcements', icon: Bell },
];

// biome-ignore format: because
const experimentalCanvasLinks = [
  { href: '/canvas/study-lab', label: 'Study Lab', icon: FlaskConical },
  { href: '/canvas/grade-predictor', label: 'Grade Predictor', icon: ChartLine },
  { href: '/canvas/study-planner', label: 'Study Planner', icon: Calendar },
];

// biome-ignore format: because
const settingsLinks = [
  { href: '/settings#profile', label: 'Profile', icon: User },
  { href: '/settings#appearance', label: 'Appearance', icon: Laptop },
  { href: '/settings#security', label: 'Security', icon: Shield },
  { href: '/settings#integrations', label: 'Integrations', icon: LinkIcon },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();
  const [settingsOpen, setSettingsOpen] = useState(pathname === '/settings');
  const [experimentalOpen, setExperimentalOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    setCurrentHash(window.location.hash);
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (pathname === '/settings') {
      setSettingsOpen(true);
      setCurrentHash(window.location.hash);
    }
  }, [pathname]);

  const isSettingsPath = pathname === '/settings';

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
                  <Link href={href as Route}>
                    <Icon />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            <Collapsible
              asChild
              defaultOpen={settingsOpen}
              onOpenChange={setSettingsOpen}
              open={settingsOpen}
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    isActive={isSettingsPath}
                    tooltip="Settings"
                  >
                    <Link href="/settings">
                      <Settings />
                      <span>Settings</span>
                      <ChevronRight
                        className={cn(
                          'ml-auto transition-transform duration-200',
                          settingsOpen && 'rotate-90'
                        )}
                      />
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {settingsLinks.map(({ href, label, icon: Icon }) => {
                      const hash = href.split('#')[1];
                      return (
                        <SidebarMenuSubItem key={href}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              isSettingsPath && currentHash === `#${hash}`
                            }
                          >
                            <Link href={href as Route}>
                              <Icon />
                              <span>{label}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Canvas</SidebarGroupLabel>
          <SidebarMenu>
            <Collapsible
              asChild
              defaultOpen={experimentalOpen}
              onOpenChange={setExperimentalOpen}
              open={experimentalOpen}
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip="Study Lab">
                    <FlaskConical className="size-4" />
                    <span>Experimental</span>
                    <ChevronRight
                      className={cn(
                        'ml-auto transition-transform duration-200',
                        experimentalOpen && 'rotate-90'
                      )}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {experimentalCanvasLinks.map(
                      ({ href, label, icon: Icon }) => {
                        return (
                          <SidebarMenuSubItem key={href}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === href}
                            >
                              <Link href={href as Route}>
                                <Icon />
                                <span>{label}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      }
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
            {canvasLinks.map(({ href, label, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === href}
                  tooltip={label}
                >
                  <Link href={href as Route}>
                    <Icon />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
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
