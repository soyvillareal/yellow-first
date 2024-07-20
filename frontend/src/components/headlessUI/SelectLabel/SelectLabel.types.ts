import { SelectProps } from '@headlessui/react';
import { FieldPathValue, Path, Validate } from 'react-hook-form';

export interface ISelectLabelOptions {
  label: string;
  value: string | number;
}

export interface ISelectLabelProps<
  TFieldValues extends Record<string, string>,
  TFieldName extends Path<TFieldValues>,
> extends SelectProps {
  id: TFieldName;
  label?: string;
  description?: string;
  validate?: Validate<FieldPathValue<TFieldValues, TFieldName>, TFieldValues>;
  options: ISelectLabelOptions[];
}
