import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ComboboxEmpty } from 'web';
const subjects = ['Calculus', 'Chemistry', 'History', 'Physics', 'Biology'];
export const Default = () => (
  <div className="w-72">
    <Combobox items={subjects}>
      <ComboboxInput placeholder="Pick a subject…" />
      <ComboboxContent>
        <ComboboxEmpty>No subjects found.</ComboboxEmpty>
        <ComboboxList>
          {subjects.map((s) => (
            <ComboboxItem key={s} value={s}>{s}</ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  </div>
);
