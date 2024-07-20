import { InputProps } from '@headlessui/react';
import { FieldPathValue, Path, Validate } from 'react-hook-form';

export interface IInputLabelProps<
  TFieldValues extends Record<string, string>,
  TFieldName extends Path<TFieldValues>,
> extends InputProps {
  id: TFieldName;
  label?: string;
  description?: string;
  validate?: Validate<FieldPathValue<TFieldValues, TFieldName>, TFieldValues>;
}
