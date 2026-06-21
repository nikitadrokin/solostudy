import { Input } from 'web';

export const Default = () => (
  <div className="w-72"><Input placeholder="Search subjects…" /></div>
);
export const Types = () => (
  <div className="flex w-72 flex-col gap-3">
    <Input type="email" placeholder="you@example.com" />
    <Input type="password" defaultValue="secret" />
    <Input disabled placeholder="Disabled" />
    <Input aria-invalid defaultValue="invalid@" />
  </div>
);
