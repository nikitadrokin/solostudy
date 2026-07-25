import Link from 'next/link';

export default function Home() {
  const structuredData = {
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
      name: 'Nikita Drokin',
      url: 'https://nikitadrokin.com/',
    },
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <main className="relative min-h-svh overflow-hidden bg-[#080b12] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(circle at 20% 10%, rgba(68, 88, 135, 0.35), transparent 32%), radial-gradient(circle at 80% 35%, rgba(76, 55, 114, 0.24), transparent 28%)',
          }}
        />
        <div className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col px-6 sm:px-10">
          <header className="flex items-center justify-between border-white/10 border-b py-6">
            <Link
              className="font-semibold text-lg tracking-tight"
              href="/"
              title="SoloStudy home"
            >
              SoloStudy
            </Link>
            <Link
              className="rounded-full border border-white/20 px-4 py-2 font-medium text-sm transition-colors hover:border-white/40 hover:bg-white/10"
              href="/focus"
            >
              Open focus room
            </Link>
          </header>

          <section className="grid flex-1 items-center gap-14 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
            <div>
              <p className="mb-5 font-medium text-blue-200 text-sm uppercase tracking-[0.2em]">
                Your space to focus
              </p>
              <h1 className="max-w-3xl text-balance font-semibold text-5xl leading-[0.96] tracking-[-0.055em] sm:text-7xl">
                Focus without the noise.
              </h1>
              <p className="mt-7 max-w-xl text-balance text-lg text-white/65 leading-8 sm:text-xl">
                SoloStudy is a calm online study room with an adaptable focus
                timer, simple session planning, and ambient video backgrounds.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  className="hover:-translate-y-0.5 rounded-full bg-white px-6 py-3 font-semibold text-[#080b12] text-sm transition-transform"
                  href="/focus"
                >
                  Start focusing
                </Link>
                <a
                  className="px-3 py-3 font-medium text-sm text-white/65 transition-colors hover:text-white"
                  href="https://nikitadrokin.com/"
                >
                  Made by Nikita Drokin
                </a>
              </div>
            </div>

            <div
              aria-label="A 25 minute SoloStudy focus session"
              className="relative mx-auto aspect-square w-full max-w-md rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/40 backdrop-blur-sm"
              role="img"
            >
              <div className="flex h-full flex-col justify-between rounded-[2rem] border border-white/10 bg-black/25 p-7">
                <div className="flex items-center justify-between text-white/45 text-xs uppercase tracking-[0.18em]">
                  <span>Focus session</span>
                  <span>25 min</span>
                </div>
                <div className="text-center">
                  <p className="font-mono text-6xl tracking-[-0.06em] sm:text-7xl">
                    25:00
                  </p>
                  <p className="mt-4 text-sm text-white/45">
                    One task. One session.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="h-1 rounded-full bg-blue-300/70" />
                  <span className="h-1 rounded-full bg-white/15" />
                  <span className="h-1 rounded-full bg-white/15" />
                </div>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="features-heading"
            className="border-white/10 border-t py-16"
          >
            <h2 className="sr-only" id="features-heading">
              SoloStudy features
            </h2>
            <div className="grid gap-10 md:grid-cols-3">
              <article>
                <p className="font-mono text-blue-200/70 text-xs">01</p>
                <h3 className="mt-3 font-medium text-lg">Flexible sessions</h3>
                <p className="mt-2 text-sm text-white/50 leading-6">
                  Set a focus and break rhythm that fits the work in front of
                  you.
                </p>
              </article>
              <article>
                <p className="font-mono text-blue-200/70 text-xs">02</p>
                <h3 className="mt-3 font-medium text-lg">Ambient space</h3>
                <p className="mt-2 text-sm text-white/50 leading-6">
                  Choose a video background that helps the room feel settled and
                  intentional.
                </p>
              </article>
              <article>
                <p className="font-mono text-blue-200/70 text-xs">03</p>
                <h3 className="mt-3 font-medium text-lg">Start immediately</h3>
                <p className="mt-2 text-sm text-white/50 leading-6">
                  Open a private focus room in your browser and begin without
                  setting anything up.
                </p>
              </article>
            </div>
          </section>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-white/10 border-t py-6 text-white/40 text-xs">
            <p>SoloStudy</p>
            <p>A private online focus room</p>
          </footer>
        </div>
      </main>
    </>
  );
}
