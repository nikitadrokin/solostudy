import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, Button } from 'web';
export const Open = () => (
  <Sheet defaultOpen modal={false}>
    <SheetContent side="right" className="w-80">
      <SheetHeader>
        <SheetTitle>Session settings</SheetTitle>
        <SheetDescription>Tune your focus block before you start.</SheetDescription>
      </SheetHeader>
      <div className="flex-1 px-4 text-muted-foreground text-sm">Block length, break reminders, and ambient sound options.</div>
      <SheetFooter><Button>Save</Button></SheetFooter>
    </SheetContent>
  </Sheet>
);
