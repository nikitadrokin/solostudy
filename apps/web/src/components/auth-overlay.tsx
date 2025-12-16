'use client';

import { Lock, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { authClient } from '@/lib/auth-client';

type AuthOverlayProps = {
  children: React.ReactNode;
};

export function AuthOverlay({ children }: AuthOverlayProps) {
  const { data: session, isPending } = authClient.useSession();
  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (session) {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
      return;
    }

    if (toastIdRef.current) {
      return;
    }

    // Check if a toast already exists in the DOM
    const existingToast = document.querySelector('[data-account-wall-toast]');
    if (existingToast) {
      return;
    }

    const id = toast.custom(
      (t) => (
        <div
          className="flex select-none items-start gap-3 rounded-2xl bg-muted p-4 shadow-lg"
          data-account-wall-toast
        >
          <div className="flex shrink-0 items-center justify-center rounded-full bg-primary/10 p-2">
            <Lock className="h-4 w-4 text-primary" />
          </div>
          <div className="grid space-y-2">
            <p className="font-medium text-sm">Sign in to use features</p>
            <p className="text-muted-foreground text-xs">
              You can browse the content, but you&apos;ll need an account to
              interact with features.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                asChild
                onClick={() => {
                  toast.dismiss(t);
                  toastIdRef.current = null;
                }}
                size="sm"
              >
                <Link href="/login">Sign In</Link>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    Learn More
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Sign in to continue</DialogTitle>
                    <DialogDescription>
                      Create an account or sign in to interact with this page.
                      You can browse the content freely, but you&apos;ll need an
                      account to use features like creating tasks, tracking
                      focus time, and connecting Canvas.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button asChild className="w-full sm:w-auto">
                      <Link href="/login">Sign In or Create Account</Link>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <Button
            className="h-6 w-6 shrink-0"
            onClick={() => {
              toast.dismiss(t);
              toastIdRef.current = null;
            }}
            size="icon"
            variant="ghost"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      ),
      {
        duration: Number.POSITIVE_INFINITY,
        position: 'bottom-center',
      }
    );

    toastIdRef.current = id;
  }, [session, isPending]);

  return <>{children}</>;
}
