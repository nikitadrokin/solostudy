import { Tabs, TabsList, TabsTab, TabsPanel } from 'web';
export const Default = () => (
  <Tabs defaultValue="tasks" className="w-96">
    <TabsList>
      <TabsTab value="tasks">Tasks</TabsTab>
      <TabsTab value="videos">Videos</TabsTab>
      <TabsTab value="session">Session</TabsTab>
    </TabsList>
    <TabsPanel value="tasks" className="p-4 text-muted-foreground text-sm">3 tasks due before your next break.</TabsPanel>
    <TabsPanel value="videos" className="p-4 text-muted-foreground text-sm">2 saved lecture videos.</TabsPanel>
    <TabsPanel value="session" className="p-4 text-muted-foreground text-sm">Focus block: 25 min remaining.</TabsPanel>
  </Tabs>
);
