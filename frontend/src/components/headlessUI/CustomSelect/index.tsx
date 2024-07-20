import { forwardRef } from 'react';
import { Description, Field, Label, Select } from '@headlessui/react';

import { cn } from '@helpers/constants';

import { ICustomSelectProps } from './CustomSelect.types';

const CustomSelect = forwardRef<HTMLInputElement, ICustomSelectProps>(
  (
    {
      id,
      className,
      selectClassName,
      label,
      description,
      options,
      error,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn('w-full', className)}>
        <Field>
          {label && (
            <Label className="text-sm/6 font-medium text-white">{label}</Label>
          )}
          {description && (
            <Description className="text-sm/6 text-white/50">
              {description}
            </Description>
          )}
          <div className="relative">
            <Select
              {...props}
              ref={ref}
              id={id}
              className={cn(
                'block w-full appearance-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                '*:text-black',
                selectClassName,
              )}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          {error?.has && (
            <p className="mt-2 text-sm text-red-600">{error?.message}</p>
          )}
        </Field>
      </div>
    );
  },
);

export default CustomSelect;
