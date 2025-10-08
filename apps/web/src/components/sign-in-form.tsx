import { useForm } from '@tanstack/react-form';
import type { BetterFetchOption } from 'better-auth/react';
import { Fingerprint } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import z from 'zod';
import { authClient } from '@/lib/auth-client';
import Loader from './loader';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';

export default function SignInForm({
  onSwitchToSignUp,
}: {
  onSwitchToSignUp: () => void;
}) {
  const router = useRouter();
  const { isPending, refetch } = authClient.useSession();
  const [isPasskeySubmitting, setIsPasskeySubmitting] =
    useState<boolean>(false);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: async () => {
            // Refetch session to update React state
            await refetch();
            toast.success('Sign in successful');
            router.push('/dashboard');
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        }
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
      }),
    },
  });

  // Attempt WebAuthn Conditional UI (autofill) when supported
  useEffect(() => {
    let cancelled = false;

    const maybeAutofill = async (): Promise<void> => {
      // Check if browser supports conditional UI
      if (
        typeof PublicKeyCredential === 'undefined' ||
        !PublicKeyCredential.isConditionalMediationAvailable ||
        !(await PublicKeyCredential.isConditionalMediationAvailable())
      ) {
        return;
      }

      if (cancelled) {
        return;
      }

      try {
        await authClient.signIn.passkey({
          autoFill: true,
        });
      } catch {
        // Intentionally swallow errors from conditional UI attempt
        // User might have cancelled or no passkeys available
      }
    };

    maybeAutofill();
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePasskeySignIn = async (): Promise<void> => {
    try {
      setIsPasskeySubmitting(true);
      const emailValue = form.store.state.values.email;

      // Create options object, only include email if provided
      const signInOptions = (emailValue ? { email: emailValue } : {}) as {
        autoFill?: boolean;
        email?: string;
        fetchOptions?: BetterFetchOption;
      };

      await authClient.signIn.passkey(signInOptions, {
        onSuccess: async () => {
          // Refetch session to update React state
          await refetch();
          toast.success('Signed in with passkey');
          router.push('/dashboard');
        },
        onError: (error) => {
          toast.error(error.error.message || error.error.statusText);
        },
      });
    } finally {
      setIsPasskeySubmitting(false);
    }
  };

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="m-auto w-full max-w-md p-4">
      <Card className="border-border/50 shadow-lg backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-bold text-3xl tracking-tight">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div>
              <form.Field name="email">
                {(field) => (
                  <div className="space-y-2">
                    <Label className="font-medium" htmlFor={field.name}>
                      Email
                    </Label>
                    <Input
                      autoComplete="username webauthn"
                      className="h-11 transition-shadow focus-visible:ring-2"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="you@example.com"
                      type="email"
                      value={field.state.value}
                    />
                    {field.state.meta.errors.map((error) => (
                      <p
                        className="font-medium text-destructive text-sm"
                        key={error?.message}
                      >
                        {error?.message}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>

            <div>
              <form.Field name="password">
                {(field) => (
                  <div className="space-y-2">
                    <Label className="font-medium" htmlFor={field.name}>
                      Password
                    </Label>
                    <Input
                      autoComplete="current-password webauthn"
                      className="h-11 transition-shadow focus-visible:ring-2"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter your password"
                      type="password"
                      value={field.state.value}
                    />
                    {field.state.meta.errors.map((error) => (
                      <p
                        className="font-medium text-destructive text-sm"
                        key={error?.message}
                      >
                        {error?.message}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>

            <form.Subscribe>
              {(state) => (
                <Button
                  className="h-11 w-full font-semibold shadow-sm transition-all hover:shadow-md"
                  disabled={!state.canSubmit || state.isSubmitting}
                  type="submit"
                >
                  {state.isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              )}
            </form.Subscribe>
          </form>

          <div className="relative my-6">
            <Separator className="my-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-card px-2 text-muted-foreground text-sm">
                or
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              aria-label="Sign in with a passkey"
              className="h-11 w-full font-semibold transition-all hover:bg-accent/80"
              disabled={isPasskeySubmitting}
              onClick={handlePasskeySignIn}
              type="button"
              variant="outline"
            >
              <Fingerprint className="mr-2 h-5 w-5" />
              {isPasskeySubmitting ? 'Processing…' : 'Sign in with Passkey'}
            </Button>
            <p className="text-center text-muted-foreground text-xs">
              Email is optional for passkey sign-in
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex-col space-y-2">
          <Separator />
          <div className="flex items-center justify-center gap-1 text-sm">
            <span className="text-muted-foreground">Need an account?</span>
            <Button
              className="h-auto p-0 font-semibold"
              onClick={onSwitchToSignUp}
              variant="link"
            >
              Sign Up
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
