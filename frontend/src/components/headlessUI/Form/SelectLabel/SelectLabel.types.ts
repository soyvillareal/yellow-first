import { FieldPathValue, Path, Validate } from 'react-hook-form';

import { ICustomSelectProps } from '@components/headlessUI/CustomSelect/CustomSelect.types';

export interface ISelectLabelProps<
  TFieldValues extends Record<string, string>,
  TFieldName extends Path<TFieldValues>,
> extends ICustomSelectProps {
  id: TFieldName;
  validate?: Validate<FieldPathValue<TFieldValues, TFieldName>, TFieldValues>;
}
