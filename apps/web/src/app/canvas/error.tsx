'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ErrorFallback: React.FC<{
  error: Error & { digest?: string };
  reset: () => void;
}> = ({ error, reset }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Something went wrong!</CardTitle>
      </CardHeader>
      <CardContent>
        <pre>{JSON.stringify(error, null, 2)}</pre>

        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
      </CardContent>
    </Card>
  );
};

export default ErrorFallback;
