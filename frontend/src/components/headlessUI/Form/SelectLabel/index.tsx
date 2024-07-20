import { forwardRef } from 'react';
import { Controller, Path, useFormContext } from 'react-hook-form';
import { isNotNilOrEmpty } from 'ramda-adjunct';

import CustomSelect from '@components/headlessUI/CustomSelect';

import { ISelectLabelProps } from './SelectLabel.types';

const SelectLabel = forwardRef<
  HTMLInputElement,
  ISelectLabelProps<Record<string, string>, Path<Record<string, string>>>
>(({ id, selectClassName, options, validate, ...props }, ref) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const hasError = errors[id];

  return (
    <Controller
      name={id}
      control={control}
      rules={{
        validate,
      }}
      render={({ field, fieldState }) => (
        <CustomSelect
          {...field}
          {...props}
          ref={ref}
          id={id}
          selectClassName={selectClassName}
          onChange={(e) => {
            field.onChange(e);
            props.onChange?.(e);
          }}
          options={options}
          error={{
            has: fieldState.invalid || isNotNilOrEmpty(hasError),
            message: fieldState.error?.message || (hasError?.message as string),
          }}
        />
      )}
    />
  );
});

SelectLabel.displayName = 'SelectLabel';

export default SelectLabel;
