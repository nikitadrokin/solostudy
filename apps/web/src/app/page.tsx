'use client';

import {
  CheckCircle2,
  Focus,
  LayoutDashboard,
  Shield,
  Smartphone,
  Waves,
  Youtube,
} from 'lucide-react';
import Link from 'next/link';
import InstallPWAPrompt from '@/components/InstallPWAPrompt';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-20 text-center md:py-32">
          <div className="-z-10 absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50" />
          <div className="container mx-auto max-w-4xl">
            <div className="mb-6 inline-flex items-center rounded-full border bg-background/50 px-3 py-1 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary" />
              <span className="ml-2 text-muted-foreground text-sm">
                v1.0 Now Available
              </span>
            </div>
            <h1 className="mb-6 font-bold text-4xl tracking-tight sm:text-6xl lg:text-7xl">
              Master Your Focus with{' '}
              <span className="text-primary">SoloStudy</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Create your perfect study environment. Combine ambient sounds,
              video backgrounds, and task management into one distraction-free
              space.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild className="h-12 px-8 text-lg" size="lg">
                <Link href="/focus">Start Focusing Now</Link>
              </Button>
              <Button
                asChild
                className="h-12 px-8 text-lg"
                size="lg"
                variant="outline"
              >
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-12 text-center font-bold text-3xl tracking-tight">
            Everything You Need to Stay Focused
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              description="A distraction-free full-screen environment designed to keep you in the flow state."
              icon={Focus}
              title="Immersive Focus Room"
            />
            <FeatureCard
              description="Choose from curated scenes or set any YouTube video as your study backdrop."
              icon={Youtube}
              title="Dynamic Backgrounds"
            />
            <FeatureCard
              description="Mix and match rain, cafe, and nature sounds to block out distracting noise."
              icon={Waves}
              title="Ambient Soundscapes"
            />
            <FeatureCard
              description="Keep track of your goals with a built-in todo list that stays out of your way."
              icon={CheckCircle2}
              title="Task Tracking"
            />
            <FeatureCard
              action={<InstallModal />}
              description="Install as a PWA on your phone or desktop for instant offline-ready access."
              icon={Smartphone}
              title="Install Anywhere"
            />
            <FeatureCard
              cta="View Dashboard"
              description="Track your progress and manage your settings from a central hub."
              href="/dashboard"
              icon={LayoutDashboard}
              title="Personal Dashboard"
            />
          </div>
        </section>

        {/* Trust/Privacy Section */}
        <section className="border-t bg-muted/30 px-4 py-16">
          <div className="container mx-auto max-w-4xl text-center">
            <Shield className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h2 className="mb-4 font-bold text-2xl">Privacy First Design</h2>
            <p className="text-muted-foreground">
              SoloStudy is built with your privacy in mind. Your data is yours.
              We only store what's necessary to sync your preferences across
              devices.
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} SoloStudy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
  cta,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href?: string;
  cta?: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-muted-foreground">{description}</p>
        {action}
        {href && cta && (
          <Button
            asChild
            className="group p-0 hover:bg-transparent"
            variant="ghost"
          >
            <Link className="flex items-center text-primary" href={href}>
              {cta}
              <span className="ml-1 transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function InstallModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          How to Install
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Install SoloStudy</DialogTitle>
          <DialogDescription>
            Get the app for quick access and offline usage
          </DialogDescription>
        </DialogHeader>
        <InstallPWAPrompt />
      </DialogContent>
    </Dialog>
  );
}
