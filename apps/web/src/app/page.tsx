'use client';

import {
  ArrowRight,
  CheckCircle2,
  CloudRain,
  Focus,
  Headphones,
  LayoutDashboard,
  Shield,
  Smartphone,
  TreePine,
  Waves,
  Youtube,
} from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InstallPWAPrompt from '@/components/InstallPWAPrompt';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useFocusStore } from '@/stores/focus-store';

const FOCUS_PRESETS = [
  {
    id: 'jfKfPfyJRdk',
    title: 'Lofi Beats',
    description: 'Chill beats for studying and relaxing',
    icon: Headphones,
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    id: 'xNN7iTA57jM',
    title: 'Forest Ambience',
    description: 'Peaceful sounds of nature',
    icon: TreePine,
    color: 'bg-green-500/10 text-green-500',
  },
  {
    id: 'mPZkdNFkNps',
    title: 'Rainy Mood',
    description: 'Calming rain sounds',
    icon: CloudRain,
    color: 'bg-blue-500/10 text-blue-500',
  },
];

export default function Home() {
  const router = useRouter();
  const setVideoId = useFocusStore((state) => state.setVideoId);

  const startSession = (videoId: string) => {
    setVideoId(videoId);
    router.push('/focus');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-12 md:py-24">
          <div className="-z-10 absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50" />
          <div className="container mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <div className="mb-6 inline-flex items-center rounded-full border bg-background/50 px-3 py-1 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary" />
                <span className="ml-2 text-muted-foreground text-sm">
                  v1.0 Now Available
                </span>
              </div>
              <h1 className="mb-6 font-bold text-4xl tracking-tight sm:text-6xl lg:text-7xl">
                Your Personal <span className="text-primary">Focus Space</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
                No distractions. Just you, your tasks, and the perfect
                environment. Choose a vibe to get started immediately.
              </p>
            </div>

            {/* Focus Launcher */}
            <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
              {FOCUS_PRESETS.map((preset) => (
                <Card
                  className="cursor-pointer transition-all hover:border-primary/50 hover:bg-muted/50 hover:shadow-lg"
                  key={preset.id}
                  onClick={() => startSession(preset.id)}
                >
                  <CardHeader className="pb-2">
                    <div
                      className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg ${preset.color}`}
                    >
                      <preset.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{preset.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {preset.description}
                    </p>
                    <div className="mt-4 flex items-center font-medium text-primary text-sm">
                      Start Session <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 flex justify-center gap-4">
              <Link
                className={buttonVariants({ size: 'lg', variant: 'outline' })}
                href="/dashboard"
              >
                View Dashboard
              </Link>
              <Link
                className={buttonVariants({ size: 'lg', variant: 'ghost' })}
                href="/focus"
              >
                Start Focus Session
                <ArrowRight />
              </Link>
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
            <Link
              className="flex items-center text-primary"
              href={href as Route}
            >
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
