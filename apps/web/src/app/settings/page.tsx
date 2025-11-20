'use client';

import { Laptop, LogOut, Shield, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loader from '@/components/loader';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth-client';
import ApiKeys from './api-keys';
import Appearance from './appearance';
import Passkeys from './passkeys';
import Profile from './profile';

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

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
          <Profile
            userEmail={session?.user.email}
            userName={session?.user.name}
          />

          <Separator />

          <Appearance />

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
