import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Focus Room',
  description:
    'Start a private SoloStudy focus session with a flexible timer and ambient video background.',
  alternates: {
    canonical: '/focus',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function FocusLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
