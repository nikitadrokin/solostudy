import { ScrollArea, Separator } from 'web';
const tags = Array.from({ length: 24 }, (_, i) => `Flashcard set ${i + 1}`);
export const VerticalList = () => (
  <ScrollArea className="h-56 w-64 rounded-md border">
    <div className="p-4">
      <div className="mb-2 font-medium text-sm">Decks</div>
      {tags.map((t) => (
        <div key={t}>
          <div className="py-1.5 text-sm">{t}</div>
          <Separator />
        </div>
      ))}
    </div>
  </ScrollArea>
);
