import { useForm } from '@tanstack/react-form';
import type { BetterFetchOption } from 'better-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import z from 'zod';
import { authClient } from '@/lib/auth-client';
import Loader from './loader';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

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
    <div className="m-auto w-full max-w-md p-6">
      <h1 className="mb-6 text-center font-bold text-3xl">Welcome Back</h1>

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
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  autoComplete="username webauthn"
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="email"
                  value={field.state.value}
                />
                {field.state.meta.errors.map((error) => (
                  <p className="text-red-500" key={error?.message}>
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
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  autoComplete="current-password webauthn"
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="password"
                  value={field.state.value}
                />
                {field.state.meta.errors.map((error) => (
                  <p className="text-red-500" key={error?.message}>
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
              className="w-full"
              disabled={!state.canSubmit || state.isSubmitting}
              type="submit"
            >
              {state.isSubmitting ? 'Submitting...' : 'Sign In'}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4">
        <Button
          aria-label="Sign in with a passkey"
          className="w-full"
          disabled={isPasskeySubmitting}
          onClick={handlePasskeySignIn}
          type="button"
          variant="outline"
        >
          {isPasskeySubmitting ? 'Processing…' : 'Sign in with Passkey'}
        </Button>
        <p className="mt-2 text-center text-muted-foreground text-xs">
          Email is optional for passkey sign-in
        </p>
      </div>

      <div className="mt-4 text-center">
        <Button
          className="text-indigo-600 hover:text-indigo-800"
          onClick={onSwitchToSignUp}
          variant="link"
        >
          Need an account? Sign Up
        </Button>
      </div>
    </div>
  );
}
