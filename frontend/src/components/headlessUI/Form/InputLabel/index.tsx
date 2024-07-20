import { forwardRef } from 'react';
import { isNotNilOrEmpty } from 'ramda-adjunct';
import { Controller, Path, useFormContext } from 'react-hook-form';

import { cn } from '@helpers/constants';
import CustomInput from '@components/headlessUI/CustomInput';

import { IInputLabelProps } from './InputLabel.types';

const InputLabel = forwardRef<
  HTMLInputElement,
  IInputLabelProps<Record<string, string>, Path<Record<string, string>>>
>(({ id, inputClassName, label, description, validate, ...props }, ref) => {
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
        <CustomInput
          {...field}
          {...props}
          ref={ref}
          id={id}
          label={label}
          description={description}
          onChange={(e) => {
            field.onChange(e);
            props.onChange?.(e);
          }}
          className={cn(
            'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
            inputClassName,
          )}
          error={{
            has: fieldState.invalid || isNotNilOrEmpty(hasError),
            message: fieldState.error?.message,
          }}
        />
      )}
    />
  );
});

InputLabel.displayName = 'InputLabel';

export default InputLabel;
