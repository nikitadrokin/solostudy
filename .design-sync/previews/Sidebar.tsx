import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from 'web';
import { BookOpen, Home, Timer, Settings } from 'lucide-react';
const items = [['Home', Home], ['Sessions', Timer], ['Courses', BookOpen], ['Settings', Settings]] as const;
export const Navigation = () => (
  <div className="relative h-80 w-64 overflow-hidden rounded-lg border">
    <SidebarProvider className="min-h-full" style={{ '--sidebar-width': '16rem' } as React.CSSProperties}>
      <Sidebar collapsible="none" className="h-full border-r">
        <SidebarHeader className="font-semibold">SoloStudy</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map(([label, Icon], i) => (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton isActive={i === 1}><Icon /> <span>{label}</span></SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="text-muted-foreground text-xs">v1.0</SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  </div>
);
