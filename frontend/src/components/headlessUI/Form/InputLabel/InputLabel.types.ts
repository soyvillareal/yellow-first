import { FieldPathValue, Path, Validate } from 'react-hook-form';

import { ICustomInputProps } from '@components/headlessUI/CustomInput/CustomInput.types';

export interface IInputLabelProps<
  TFieldValues extends Record<string, string>,
  TFieldName extends Path<TFieldValues>,
> extends ICustomInputProps {
  id: TFieldName;
  validate?: Validate<FieldPathValue<TFieldValues, TFieldName>, TFieldValues>;
}
