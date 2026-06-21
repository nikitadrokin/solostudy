import { Alert, AlertTitle, AlertDescription } from 'web';
import { Info, TriangleAlert } from 'lucide-react';
export const Default = () => (
  <div className="w-96">
    <Alert>
      <Info />
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>Your next break starts in 5 minutes.</AlertDescription>
    </Alert>
  </div>
);
export const Destructive = () => (
  <div className="w-96">
    <Alert variant="destructive">
      <TriangleAlert />
      <AlertTitle>Session interrupted</AlertTitle>
      <AlertDescription>We couldn't save your last 2 minutes of progress.</AlertDescription>
    </Alert>
  </div>
);
