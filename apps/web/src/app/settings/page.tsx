'use client';

import { Laptop, LogOut, Shield, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BackToFocusLink from '@/components/back-to-focus-link';
import Loader from '@/components/loader';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import Appearance from './appearance';
import Passkeys from './passkeys';
import Profile from './profile';

const navigationItems = [
  {
    href: '#profile',
    label: 'Profile',
    icon: User,
  },
  {
    href: '#appearance',
    label: 'Appearance',
    icon: Laptop,
  },
  {
    href: '#security',
    label: 'Security',
    icon: Shield,
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('profile');
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!(session || isPending)) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const updateActiveSection = () => {
      setActiveSection(window.location.hash.slice(1) || 'profile');
    };

    updateActiveSection();
    window.addEventListener('hashchange', updateActiveSection);

    return () => {
      window.removeEventListener('hashchange', updateActiveSection);
    };
  }, []);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-10">
      <header className="space-y-4">
        <BackToFocusLink className="-ml-3" />
        <div className="space-y-2">
          <h1 className="font-bold text-3xl tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile, preferences, and security.
          </p>
        </div>
      </header>

      <Separator />

      <div className="grid items-start gap-8 md:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="md:sticky md:top-8">
          <nav
            aria-label="Settings sections"
            className="flex gap-1 overflow-x-auto rounded-xl border bg-card/70 p-2 shadow-sm backdrop-blur-sm md:flex-col md:overflow-visible"
          >
            {navigationItems.map(({ href, label, icon: Icon }) => {
              const section = href.slice(1);
              const isActive = activeSection === section;

              return (
                <Link
                  aria-current={isActive ? 'location' : undefined}
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'justify-start text-muted-foreground hover:text-foreground',
                    isActive && 'bg-accent text-foreground'
                  )}
                  href={href}
                  key={href}
                >
                  <Icon />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 space-y-6">
          <Profile
            userEmail={session?.user.email}
            userName={session?.user.name}
            userRole={(session?.user as { role?: string })?.role}
          />

          <Separator />

          <Appearance />

          <Separator />

          <section className="scroll-mt-16 space-y-4" id="security">
            <div className="space-y-1">
              <h2 className="font-semibold text-lg">Security</h2>
              <p className="text-muted-foreground text-sm">
                Manage your alternative authentication methods.
              </p>
            </div>
            <Passkeys userEmail={session?.user.email} />
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
