import { Label, Input, Checkbox } from 'web';
export const WithInput = () => (
  <div className="flex w-72 flex-col gap-2">
    <Label htmlFor="email">Email address</Label>
    <Input id="email" type="email" placeholder="you@example.com" />
  </div>
);
export const WithCheckbox = () => (
  <div className="flex items-center gap-2">
    <Checkbox id="remember" defaultChecked />
    <Label htmlFor="remember">Remember this device</Label>
  </div>
);
