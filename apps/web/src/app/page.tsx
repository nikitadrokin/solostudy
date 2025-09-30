'use client';
import {
  Download,
  Focus,
  LayoutDashboard,
  Shield,
  Waves,
  Youtube,
} from 'lucide-react';
import Link from 'next/link';
import InstallPWAPrompt from '@/components/InstallPWAPrompt';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container m-auto max-w-6xl place-items-center px-4 py-10">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-bold text-4xl tracking-tight">
          Solo<span className="text-primary">Study</span>
        </h1>
        <p className="mx-auto mb-8 max-w-3xl text-muted-foreground text-xl">
          A distraction-free study environment with customizable video
          backgrounds, ambient audio controls, and offline PWA support.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/focus">Start Studying</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </div>

      {/* PWA Install */}
      <div className="mb-10">
        <InstallPWAPrompt />
      </div>

      {/* Features */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Focus aria-hidden className="inline-block" />
              Focus Room
            </CardTitle>
            <CardDescription>
              Minimize distractions with a full-screen study space.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost">
              <Link href="/focus">Open Focus Room</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Youtube aria-hidden className="inline-block" />
              YouTube Backgrounds
            </CardTitle>
            <CardDescription>
              Set any YouTube video as your ambient background.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost">
              <Link href="/focus">Pick a video</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves aria-hidden className="inline-block" />
              Ambient Audio
            </CardTitle>
            <CardDescription>
              Control background sounds to stay in the zone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost">
              <Link href="/focus">Adjust ambience</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download aria-hidden className="inline-block" />
              Installable PWA
            </CardTitle>
            <CardDescription>
              Install the app for offline-ready, native-like access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost">
              <Link href="#install">How to install</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard aria-hidden className="inline-block" />
              Personal Dashboard
            </CardTitle>
            <CardDescription>
              Track tasks and personalize your study setup.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield aria-hidden className="inline-block" />
              Privacy-first
            </CardTitle>
            <CardDescription>
              Your data stays secure and under your control.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              We only request what is necessary for a great experience.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
