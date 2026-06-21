import { Badge } from 'web';
import { Check } from 'lucide-react';

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Badge>Default</Badge>
    <Badge variant="secondary">Secondary</Badge>
    <Badge variant="destructive">Destructive</Badge>
    <Badge variant="outline">Outline</Badge>
  </div>
);

export const WithIcon = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Badge variant="secondary"><Check className="size-3" /> Verified</Badge>
    <Badge>3 streak</Badge>
  </div>
);
