import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button } from 'web';
export const Open = () => (
  <Dialog defaultOpen modal={false}>
    <DialogContent className="relative">
      <DialogHeader>
        <DialogTitle>End this session?</DialogTitle>
        <DialogDescription>Your focus progress so far will be saved to today's summary.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline">Keep going</Button>
        <Button>End session</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
