'use client';

import { AlertTriangle, Check, Copy, Laptop, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import XLogo from '@/components/icons/x-logo';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getXDirectMessageLink } from '@/lib/utils';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorFallback: React.FC<ErrorProps> = ({ error, reset }) => {
  const [copied, setCopied] = useState(false);

  const errorDetails = JSON.stringify(
    {
      name: error.name,
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    },
    null,
    2
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(errorDetails);
      setCopied(true);
      toast.success('Error details copied to clipboard');
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error('Failed to copy error details');
    }
  };

  const dmLink = getXDirectMessageLink(
    process.env.NEXT_PUBLIC_LEAD_DEV_X_USER_ID
  );

  return (
    <div className="container mx-auto max-w-2xl space-y-6 p-6 md:p-8">
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-xl">Dashboard Error</CardTitle>
              <CardDescription className="mt-1">
                Something went wrong while loading the dashboard
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-muted-foreground text-sm">
              We&apos;re experiencing issues with the dashboard on mobile
              devices. The dashboard should work properly on desktop devices.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <Laptop className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="space-y-1">
              <p className="font-medium text-sm">Try on Desktop</p>
              <p className="text-muted-foreground text-sm">
                For the best experience, please access the dashboard from a
                desktop or laptop computer.
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">Error Details</p>
              <Button
                icon={
                  copied ? (
                    <Check className="size-3" />
                  ) : (
                    <Copy className="size-3" />
                  )
                }
                onClick={handleCopy}
                size="sm"
                variant="outline"
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <pre className="max-h-64 overflow-auto rounded-md bg-muted p-3 text-muted-foreground text-xs">
              {errorDetails}
            </pre>
          </div>

          <div className="rounded-lg border p-4">
            <p className="mb-2 font-medium text-sm">Need Help?</p>
            <p className="text-muted-foreground text-sm">
              If you continue to experience issues, please copy the error
              details above and reach out to us on{' '}
              <a
                className={buttonVariants({
                  variant: 'link',
                  className: '!px-0 !gap-1 !text-primary',
                  size: 'sm',
                })}
                href={dmLink}
                rel="noopener"
                target="_blank"
              >
                <XLogo className="inline size-3" />
                (Twitter)
              </a>{' '}
              and we&apos;ll help you resolve this.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button className="flex-1" onClick={reset} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button asChild className="flex-1" variant="secondary">
            <Link href="/">Go Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ErrorFallback;
