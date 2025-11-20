'use client';

import { Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const Appearance: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
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
  );
};

export default Appearance;
