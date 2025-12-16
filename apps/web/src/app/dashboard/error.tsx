import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorFallback: React.FC<ErrorProps> = ({ error, reset }) => {
  return (
    <div>
      An Error occurred.
      <pre>{JSON.stringify(error, null, 2)}</pre>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
};

export default ErrorFallback;
