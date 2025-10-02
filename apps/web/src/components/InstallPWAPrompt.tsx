'use client';
import { Download, Plus, Share } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * Describes the non-standard `beforeinstallprompt` event fired by Chromium-based browsers
 * when a Progressive Web App meets installability criteria.
 */
type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt: () => Promise<void>;
};

export default function InstallPWAPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<
    BeforeInstallPromptEvent | undefined
  >(undefined);

  // Compute whether install UI should show
  const canShowInstall = useMemo(() => {
    if (isStandalone) {
      return false;
    }
    return isIOS || Boolean(deferredPrompt);
  }, [isIOS, isStandalone, deferredPrompt]);

  useEffect(() => {
    const mediaStandalone = window.matchMedia(
      '(display-mode: standalone)'
    ).matches;
    const navigatorStandalone = (
      window.navigator as Navigator & { standalone?: boolean }
    ).standalone;
    setIsStandalone(Boolean(mediaStandalone || navigatorStandalone));

    // Simple iOS detection for Safari A2HS flow
    // biome-ignore lint/performance/useTopLevelRegex: pattern compiled once in effect
    setIsIOS(/iPad|iPhone|iPod/.test(window.navigator.userAgent));

    const handleBeforeInstall = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(undefined);
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstall as EventListener
    );
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstall as EventListener
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!canShowInstall) {
    return null;
  }

  const onInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    await deferredPrompt.prompt();
  };

  return (
    <Card aria-live="polite" className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-balance text-lg">
          Install SoloStudy
        </CardTitle>
        <CardDescription>
          Install the app for quick access, offline usage, and a more native
          experience.
        </CardDescription>
        {!isIOS && (
          <CardAction>
            <Button
              aria-label="Install application"
              onClick={onInstallClick}
              size="sm"
              type="button"
            >
              <Download />
              Install app
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {isIOS ? (
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              On iOS, add this app to your Home Screen:
            </p>
            <ol className="list-inside list-decimal space-y-1">
              <li className="flex items-center gap-2">
                Tap <Share aria-hidden className="inline-block" /> Share in
                Safari
              </li>
              <li className="flex items-center gap-2">
                Choose <Plus aria-hidden className="inline-block" /> Add to Home
                Screen
              </li>
            </ol>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm">
              Click Install to add SoloStudy to your device. You can also
              install from your browser menu.
            </p>
            <div className="rounded-md bg-muted p-3">
              <p className="font-medium text-sm">Need help installing?</p>
              <p className="mt-1 text-muted-foreground text-xs">
                Search for "how to install PWA on [your browser]" for detailed
                instructions specific to your browser and operating system.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
