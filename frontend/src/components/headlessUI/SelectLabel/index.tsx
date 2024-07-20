import { forwardRef } from 'react';
import { Controller, Path, useFormContext } from 'react-hook-form';
import { Description, Field, Label, Select } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import { cn } from '@helpers/constants';

import { ISelectLabelProps } from './SelectLabel.types';

const SelectLabel = forwardRef<
  HTMLInputElement,
  ISelectLabelProps<Record<string, string>, Path<Record<string, string>>>
>(({ id, className, label, description, options, validate, ...props }, ref) => {
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
        <div className={cn("w-full max-w-md", className)}>
          <Field>
            {label && (
              <Label className="text-sm/6 font-medium text-white">
                {label}
              </Label>
            )}
            {description && (
              <Description className="text-sm/6 text-white/50">
                {description}
              </Description>
            )}
            <div className="relative">
              <Select
                {...field}
                {...props}
                onChange={(e) => {
                  field.onChange(e);
                  props.onChange?.(e);
                }}
                ref={ref}
                className={clsx(
                  'mt-3 block w-full appearance-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                  'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                  '*:text-black',
                )}
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <ChevronDownIcon
                className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                aria-hidden="true"
              />
            </div>
            {fieldState.invalid || hasError ? (
              <p className="mt-2 text-sm text-red-600">
                {fieldState.error?.message}
              </p>
            ) : null}
          </Field>
        </div>
      )}
    />
  );
});

SelectLabel.displayName = 'SelectLabel';

export default SelectLabel;
