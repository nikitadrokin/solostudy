'use client';

import { useCallback, useMemo } from 'react';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { cn } from '@/lib/utils';

export type FocusTagOption = { slug: string; label: string };

type FocusRoomTagComboboxProps = {
  tags: FocusTagOption[];
  value: string;
  onValueChange: (slug: string) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  'aria-label'?: string;
};

/** Searchable tag picker backed by `focus.listFocusTags` (shadcn / Base UI combobox). */
export function FocusRoomTagCombobox({
  tags,
  value,
  onValueChange,
  disabled,
  id,
  className,
  'aria-label': ariaLabel,
}: FocusRoomTagComboboxProps) {
  const items = useMemo(() => tags.map((t) => t.slug), [tags]);
  const labelFor = useCallback(
    (slug: string) => tags.find((t) => t.slug === slug)?.label ?? slug,
    [tags]
  );

  return (
    <Combobox
      disabled={disabled ?? tags.length === 0}
      items={items}
      itemToStringLabel={labelFor}
      onValueChange={(next) => {
        if (next === null || next === undefined) {
          return;
        }
        onValueChange(typeof next === 'string' ? next : String(next));
      }}
      value={value}
    >
      <ComboboxInput
        aria-label={ariaLabel}
        className={cn('w-full min-w-[10rem]', className)}
        disabled={disabled ?? tags.length === 0}
        id={id}
        placeholder={
          tags.length === 0 ? 'No tags yet — add some above' : 'Search tags…'
        }
      />
      <ComboboxContent>
        <ComboboxList>
          {(slug: string) => (
            <ComboboxItem key={slug} value={slug}>
              {labelFor(slug)}
            </ComboboxItem>
          )}
        </ComboboxList>
        <ComboboxEmpty>No matching tags.</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  );
}
