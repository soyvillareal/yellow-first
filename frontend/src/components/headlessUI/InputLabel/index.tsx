import { forwardRef, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Controller, Path, useFormContext } from 'react-hook-form';
import { Description, Field, Input, Label } from '@headlessui/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

import { cn } from '@helpers/constants';

import { IInputLabelProps } from './InputLabel.types';

const InputLabel = forwardRef<
  HTMLInputElement,
  IInputLabelProps<Record<string, string>, Path<Record<string, string>>>
>(({ id, type, className, label, description, validate, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    formState: { errors },
  } = useFormContext();

  const hasError = errors[id];

  const inputType = useMemo(() => {
    if (type === 'password') {
      return showPassword ? 'text' : 'password';
    }
    return type;
  }, [type, showPassword]);

  return (
    <Controller
      name={id}
      control={control}
      rules={{
        validate,
      }}
      render={({ field, fieldState }) => (
        <div className={cn('relative w-full max-w-md', className)}>
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
            {type === 'password' &&
              (showPassword ? (
                <EyeIcon
                  onClick={() => setShowPassword(false)}
                  className="absolute w-6 h-6 text-gray-500 cursor-pointer right-2 bottom-2"
                />
              ) : (
                <EyeSlashIcon
                  onClick={() => setShowPassword(true)}
                  className="absolute w-6 h-6 text-gray-500 cursor-pointer right-2 bottom-2"
                />
              ))}
            <Input
              {...field}
              {...props}
              onChange={(e) => {
                field.onChange(e);
                props.onChange?.(e);
              }}
              ref={ref}
              type={inputType}
              className={clsx(
                'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
              )}
            />
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

InputLabel.displayName = 'InputLabel';

export default InputLabel;
