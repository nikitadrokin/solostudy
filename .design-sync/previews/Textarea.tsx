import { Textarea } from 'web';
export const Default = () => (
  <div className="w-80"><Textarea placeholder="Write your study notes…" rows={4} /></div>
);
export const Disabled = () => (
  <div className="w-80"><Textarea disabled defaultValue="Notes are locked during a focus session." rows={4} /></div>
);
