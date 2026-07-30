import { ChevronDown, Clapperboard, Timer, User } from 'lucide-react';
import Link from 'next/link';
import AmbientBackdrop from '@/components/landing/ambient-backdrop';
import ControlChip from '@/components/landing/control-chip';
import LandingHeader from '@/components/landing/landing-header';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SoloStudy',
  url: 'https://study.nkdr.me/',
  description:
    'A calm online focus room with a flexible study timer, session planning, and ambient video backgrounds.',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  author: {
    '@type': 'Person',
    '@id': 'https://nikitadrokin.com/#person',
    name: 'Nikita Drokin',
    url: 'https://nikitadrokin.com/',
  },
};

const FEATURES = [
  {
    title: 'A timer that fits the work',
    description:
      'Set your own focus and break lengths, then leave the session running in the corner of the screen.',
    chip: (
      <>
        <Timer className="size-4" />
        <span className="font-mono">25:00</span>
        <span className="-right-1 -top-1 absolute size-2 rounded-full bg-primary" />
      </>
    ),
  },
  {
    title: 'Backgrounds that settle the room',
    description:
      'Pick from a small curated set of ambient videos, or paste any YouTube link you already study to.',
    chip: <Clapperboard className="size-4" />,
  },
  {
    title: 'Nothing to set up',
    description:
      'Open the room and start. Signing in is optional, and only so the room remembers where you left off.',
    chip: <User className="size-4" />,
  },
];

export default function Home() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(STRUCTURED_DATA)}
      </script>

      <main className="relative">
        <AmbientBackdrop />
        <LandingHeader />

        <section className="relative flex min-h-svh flex-col items-center justify-center px-6 py-24 text-center">
          <h1 className="fade-in slide-in-from-bottom-3 mt-6 max-w-3xl animate-in text-balance fill-mode-both font-semibold text-4xl tracking-tight delay-100 duration-700 ease-out motion-reduce:animate-none sm:text-6xl">
            Focus without the noise.
          </h1>

          <p className="fade-in slide-in-from-bottom-3 mt-5 max-w-xl animate-in text-balance fill-mode-both text-base text-foreground/75 leading-7 delay-200 duration-700 ease-out motion-reduce:animate-none sm:text-lg">
            SoloStudy is a quiet study room in your browser. Choose an ambient
            video, set a timer that matches what you are doing, and get to work.
          </p>

          <div className="fade-in slide-in-from-bottom-3 mt-9 flex animate-in flex-wrap items-center justify-center gap-3 fill-mode-both delay-300 duration-700 ease-out motion-reduce:animate-none">
            <Link
              className={cn(
                buttonVariants({ size: 'lg' }),
                'transition-transform duration-200 ease-out active:scale-[0.97]'
              )}
              href="/focus"
            >
              Enter the focus room
            </Link>
            <a
              className={cn(
                buttonVariants({ size: 'lg', variant: 'outline' }),
                'bg-background/80 backdrop-blur-xs transition-transform duration-200 ease-out'
              )}
              href="#inside"
            >
              See what's inside
            </a>
          </div>

          <a
            aria-label="Skip to what is inside the room"
            className="-translate-x-1/2 absolute bottom-8 left-1/2 rounded-full border bg-background/80 p-2 text-muted-foreground backdrop-blur-sm transition-colors duration-200 hover:text-foreground"
            href="#inside"
          >
            <ChevronDown className="size-4 motion-safe:animate-nudge" />
          </a>
        </section>

        {/* Sheet over the room: the ambient glow still bleeds through the edges. */}
        <div className="relative border-border/60 border-t bg-background/95">
          <section
            aria-labelledby="inside-heading"
            className="mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-20 sm:py-28"
            id="inside"
          >
            <h2
              className="max-w-2xl text-balance font-semibold text-2xl tracking-tight sm:text-3xl"
              id="inside-heading"
            >
              Three controls, and then the room gets out of your way.
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground text-sm leading-6">
              Everything sits in the corners of the screen, so the middle stays
              empty for whatever you are actually working on.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {FEATURES.map((feature) => (
                <Card
                  className="gap-0 border-border/60 bg-card/60 transition-colors duration-200 hover:bg-card/80"
                  key={feature.title}
                >
                  <CardContent>
                    <ControlChip>{feature.chip}</ControlChip>
                  </CardContent>
                  <CardHeader className="mt-5">
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                    <CardDescription className="leading-6">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          <section className="mx-auto w-full max-w-5xl px-6 pb-20 sm:pb-28">
            <Card className="items-center gap-4 border-border/60 bg-card/60 px-6 py-10 text-center">
              <CardTitle className="text-balance text-xl tracking-tight sm:text-2xl">
                Ready when you are.
              </CardTitle>
              <CardDescription className="max-w-md text-balance leading-6">
                No sign-up, no onboarding. Open the room and it stays out of the
                way for as long as you need it.
              </CardDescription>
              <Link
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'mt-2 transition-transform duration-200 ease-out active:scale-[0.97]'
                )}
                href="/focus"
              >
                Enter the focus room
              </Link>
            </Card>
          </section>

          <footer className="border-border/60 border-t">
            <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-muted-foreground text-xs">
              <p>SoloStudy — a private online focus room</p>
              <a
                className="transition-colors duration-200 hover:text-foreground"
                href="https://nikitadrokin.com/"
              >
                Made by Nikita Drokin
              </a>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
