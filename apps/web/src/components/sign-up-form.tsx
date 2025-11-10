import { useForm } from '@tanstack/react-form';
import { useRouter } from 'next/navigation';
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

export default function SignUpForm({
  onSwitchToSignIn,
}: {
  onSwitchToSignIn: () => void;
}) {
  const router = useRouter();
  const { isPending, refetch } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
        },
        {
          onSuccess: async () => {
            // Refetch session to update React state
            await refetch();
            toast.success('Sign up successful');
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
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="m-auto w-full max-w-md p-4">
      <Card className="border-border/50 shadow-lg backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="font-bold text-3xl tracking-tight">
            Create Account
          </CardTitle>
          <CardDescription className="text-base">
            Get started with your new account
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
              <form.Field name="name">
                {(field) => (
                  <div className="space-y-2">
                    <Label className="font-medium" htmlFor={field.name}>
                      Name
                    </Label>
                    <Input
                      className="h-11 transition-shadow focus-visible:ring-2"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="John Doe"
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
                      autoComplete="new-password webauthn"
                      className="h-11 transition-shadow focus-visible:ring-2"
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Create a strong password"
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
                  {state.isSubmitting
                    ? 'Creating account...'
                    : 'Create Account'}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </CardContent>

        <CardFooter className="flex-col space-y-2">
          <Separator />
          <div className="flex items-center justify-center gap-1 text-sm">
            <span className="text-muted-foreground">
              Already have an account?
            </span>
            <Button
              className="h-auto p-0 font-semibold"
              onClick={onSwitchToSignIn}
              variant="link"
            >
              Sign In
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
