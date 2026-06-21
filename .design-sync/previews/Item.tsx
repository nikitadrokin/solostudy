import { ItemGroup, Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions, Button, Badge } from 'web';
import { BookOpen, ChevronRight } from 'lucide-react';
export const List = () => (
  <div className="w-96">
    <ItemGroup className="gap-2">
      <Item variant="outline">
        <ItemMedia variant="icon"><BookOpen /></ItemMedia>
        <ItemContent>
          <ItemTitle>Linear Algebra</ItemTitle>
          <ItemDescription>Chapter 4 · Eigenvalues</ItemDescription>
        </ItemContent>
        <ItemActions><Badge variant="secondary">New</Badge></ItemActions>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon"><BookOpen /></ItemMedia>
        <ItemContent>
          <ItemTitle>Organic Chemistry</ItemTitle>
          <ItemDescription>Chapter 2 · Reactions</ItemDescription>
        </ItemContent>
        <ItemActions><Button size="icon" variant="ghost" aria-label="Open"><ChevronRight /></Button></ItemActions>
      </Item>
    </ItemGroup>
  </div>
);
