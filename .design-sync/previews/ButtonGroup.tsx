import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, Button } from 'web';
import { Bold, Italic, Underline } from 'lucide-react';
export const Toolbar = () => (
  <ButtonGroup>
    <Button variant="outline" size="icon" aria-label="Bold"><Bold /></Button>
    <Button variant="outline" size="icon" aria-label="Italic"><Italic /></Button>
    <Button variant="outline" size="icon" aria-label="Underline"><Underline /></Button>
  </ButtonGroup>
);
export const WithText = () => (
  <ButtonGroup>
    <ButtonGroupText>Sort</ButtonGroupText>
    <ButtonGroupSeparator />
    <Button variant="outline">Newest</Button>
    <Button variant="outline">Oldest</Button>
  </ButtonGroup>
);
