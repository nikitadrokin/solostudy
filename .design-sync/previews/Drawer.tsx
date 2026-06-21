import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, Button } from 'web';
export const Open = () => (
  <Drawer defaultOpen modal={false}>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Quick add task</DrawerTitle>
        <DrawerDescription>Add a task to your current session.</DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>
        <Button>Add task</Button>
        <Button variant="outline">Cancel</Button>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
);
