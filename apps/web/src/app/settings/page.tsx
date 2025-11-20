'use client';

import { Laptop, LogOut, Moon, Shield, Sun, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import Loader from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth-client';
import ApiKeys from './api-keys';
import Passkeys from './passkeys';

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!(session || isPending)) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-10">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile, preferences, and security.
        </p>
      </div>

      <Separator />

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <nav className="flex flex-col space-y-1">
          <Button className="justify-start hover:bg-muted" variant="ghost">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
          <Button className="justify-start hover:bg-muted" variant="ghost">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </Button>
          <Button className="justify-start hover:bg-muted" variant="ghost">
            <Laptop className="mr-2 h-4 w-4" />
            Appearance
          </Button>
        </nav>

        <div className="space-y-6">
          {/* Profile Section */}
          <section className="scroll-mt-16 space-y-4" id="profile">
            <div className="space-y-1">
              <h2 className="font-semibold text-lg">Profile</h2>
              <p className="text-muted-foreground text-sm">
                Manage your public profile information.
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your name and email address.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input defaultValue={session.user.name} disabled id="name" />
                  <p className="text-[0.8rem] text-muted-foreground">
                    This is your display name.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    defaultValue={session.user.email}
                    disabled
                    id="email"
                  />
                  <p className="text-[0.8rem] text-muted-foreground">
                    Your email address is managed by your authentication
                    provider.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Appearance Section */}
          <section className="scroll-mt-16 space-y-4" id="appearance">
            <div className="space-y-1">
              <h2 className="font-semibold text-lg">Appearance</h2>
              <p className="text-muted-foreground text-sm">
                Customize the look and feel of the application.
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Theme</CardTitle>
                <CardDescription>
                  Select your preferred theme for the application.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Button
                    className="w-32 justify-start"
                    onClick={() => setTheme('light')}
                    variant={theme === 'light' ? 'default' : 'outline'}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    className="w-32 justify-start"
                    onClick={() => setTheme('dark')}
                    variant={theme === 'dark' ? 'default' : 'outline'}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    className="w-32 justify-start"
                    onClick={() => setTheme('system')}
                    variant={theme === 'system' ? 'default' : 'outline'}
                  >
                    <Laptop className="mr-2 h-4 w-4" />
                    System
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <Separator />

          {/* Security Section */}
          <section className="scroll-mt-16 space-y-4" id="security">
            <div className="space-y-1">
              <h2 className="font-semibold text-lg">Security</h2>
              <p className="text-muted-foreground text-sm">
                Manage your alternative authentication methods.
              </p>
            </div>
            <Passkeys userEmail={session?.user.email} />
            <ApiKeys />
          </section>

          <Separator />

          <div className="flex justify-end">
            <Button
              onClick={async () => {
                await authClient.signOut();
                router.push('/login');
              }}
              variant="destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
