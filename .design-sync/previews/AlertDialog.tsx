import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from 'web';
export const Confirm = () => (
  <AlertDialog defaultOpen>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete this deck?</AlertDialogTitle>
        <AlertDialogDescription>This removes all 42 flashcards. This action can't be undone.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Delete deck</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
