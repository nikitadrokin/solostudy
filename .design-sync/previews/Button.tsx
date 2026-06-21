import { Button } from 'web';
import { ArrowRight, Plus } from 'lucide-react';

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button>Default</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="destructive">Destructive</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="link">Link</Button>
  </div>
);

export const Sizes = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button size="sm">Small</Button>
    <Button size="default">Default</Button>
    <Button size="lg">Large</Button>
    <Button size="icon" aria-label="Add"><Plus /></Button>
  </div>
);

export const WithIconAndStates = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button icon={<Plus />}>New session</Button>
    <Button variant="secondary">Continue <ArrowRight /></Button>
    <Button isLoading>Saving</Button>
    <Button disabled>Disabled</Button>
  </div>
);
