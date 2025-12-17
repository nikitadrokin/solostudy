'use client';

import { AlertTriangle, Check, Copy, RefreshCw } from 'lucide-react';
import Script from 'next/script';
import { useState } from 'react';
import { toast } from 'sonner';
import XLogo from '@/components/icons/x-logo';
import Providers from '@/components/providers';
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
import '../index.css';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorFallback: React.FC<GlobalErrorProps> = ({ error, reset }) => {
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
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription className="mt-1">
                An unexpected error occurred while loading this page
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-muted-foreground text-sm">
              We apologize for the inconvenience. Please try refreshing the page
              or contact support if the issue persists.
            </p>
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
                <XLogo className="inline size-3" />X (Twitter)
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
            <a href={dmLink} rel="noopener" target="_blank">
              Contact Support
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const GlobalError: React.FC<GlobalErrorProps> = ({ error, reset }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Error | solostudy</title>
        <meta content="solostudy" name="description" />
        <link href="/pwa-192x192.png" rel="icon" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <link href="/apple-touch-icon-180x180.png" rel="apple-touch-icon" />
        <link href="/manifest.json" rel="manifest" />
        <meta content="device-width, initial-scale=1" name="viewport" />
        <meta content="#000000" name="theme-color" />
        <meta content="yes" name="apple-mobile-web-app-capable" />
        <meta content="SoloStudy" name="apple-mobile-web-app-title" />
        <meta content="yes" name="mobile-web-app-capable" />
        <meta
          content="black-translucent"
          name="apple-mobile-web-app-status-bar-style"
        />
        {process.env.NODE_ENV === 'development' && (
          <Script
            crossOrigin="anonymous"
            data-enabled="true"
            src="//unpkg.com/react-grab/dist/index.global.js"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="antialiased">
        <Providers>
          <ErrorFallback error={error} reset={reset} />
        </Providers>
      </body>
    </html>
  );
};

export default GlobalError;
