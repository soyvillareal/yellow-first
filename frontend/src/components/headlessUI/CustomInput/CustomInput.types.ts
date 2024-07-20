import { InputProps } from '@headlessui/react';

export interface ICustomInputError {
  has: boolean;
  message: string | undefined;
}

export interface ICustomInputProps extends InputProps {
  id: string;
  label?: string;
  description?: string;
  error?: ICustomInputError;
  inputClassName?: string;
}
