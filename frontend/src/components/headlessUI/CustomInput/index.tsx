import { forwardRef, useMemo, useState } from 'react';
import { Description, Field, Input, Label } from '@headlessui/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

import { cn } from '@helpers/constants';

import { ICustomInputProps } from './CustomInput.types';

const CustomInput = forwardRef<HTMLInputElement, ICustomInputProps>(
  (
    {
      id,
      type,
      className,
      inputClassName,
      label,
      description,
      error,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = useMemo(() => {
      if (type === 'password') {
        return showPassword ? 'text' : 'password';
      }
      return type;
    }, [type, showPassword]);

    return (
      <div className={cn('relative w-full max-w-md', className)}>
        <Field>
          {label && (
            <Label className="text-sm/6 font-medium text-white">{label}</Label>
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
            {...props}
            id={id}
            ref={ref}
            type={inputType}
            className={cn(
              'block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
              inputClassName,
            )}
          />
          {error?.has && (
            <p className="mt-2 text-sm text-red-600">{error?.message}</p>
          )}
        </Field>
      </div>
    );
  },
);

export default CustomInput;
