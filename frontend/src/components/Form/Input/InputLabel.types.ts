import { FieldPathValue, Path, Validate } from "react-hook-form";

export interface IInputLabel<
  TFieldValues extends Record<string, string>,
  TFieldName extends Path<TFieldValues>,
> {
  id: TFieldName;
  type: HTMLInputElement["type"];
  label: string;
  placeholder?: string;
  validate: Validate<FieldPathValue<TFieldValues, TFieldName>, TFieldValues>;
  disabled?: boolean;
  required?: boolean;
}
