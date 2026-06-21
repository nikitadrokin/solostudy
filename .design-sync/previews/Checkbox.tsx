import { Checkbox, Label } from 'web';
export const States = () => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-2"><Checkbox id="c1" /><Label htmlFor="c1">Unchecked</Label></div>
    <div className="flex items-center gap-2"><Checkbox id="c2" defaultChecked /><Label htmlFor="c2">Checked</Label></div>
    <div className="flex items-center gap-2"><Checkbox id="c3" disabled /><Label htmlFor="c3">Disabled</Label></div>
  </div>
);
