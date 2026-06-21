import { FieldSet, FieldLegend, FieldGroup, Field, FieldLabel, FieldDescription, FieldError, Input } from 'web';
export const Form = () => (
  <div className="w-96">
    <FieldSet>
      <FieldLegend>Profile</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Display name</FieldLabel>
          <Input id="name" defaultValue="Ada Lovelace" />
          <FieldDescription>Shown on your public study profile.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="handle">Handle</FieldLabel>
          <Input id="handle" aria-invalid defaultValue="@ada lovelace" />
          <FieldError>Handles can't contain spaces.</FieldError>
        </Field>
      </FieldGroup>
    </FieldSet>
  </div>
);
