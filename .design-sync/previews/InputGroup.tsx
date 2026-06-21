import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton, InputGroupText } from 'web';
import { Search, ArrowRight } from 'lucide-react';
export const WithIcon = () => (
  <div className="w-80">
    <InputGroup>
      <InputGroupAddon align="inline-start"><Search /></InputGroupAddon>
      <InputGroupInput placeholder="Search lessons…" />
    </InputGroup>
  </div>
);
export const WithButton = () => (
  <div className="w-80">
    <InputGroup>
      <InputGroupAddon align="inline-start"><InputGroupText>https://</InputGroupText></InputGroupAddon>
      <InputGroupInput placeholder="study.nkdr.me" />
      <InputGroupAddon align="inline-end"><InputGroupButton aria-label="Go"><ArrowRight /></InputGroupButton></InputGroupAddon>
    </InputGroup>
  </div>
);
