import { SelectProps } from '@headlessui/react';

export interface ICustomSelectError {
  has: boolean;
  message: string | undefined;
}

export interface ICustomSelectOptions {
  label: string;
  value: string | number;
}

export interface ICustomSelectProps extends SelectProps {
  id: string;
  selectClassName?: string;
  label?: string;
  description?: string;
  options: ICustomSelectOptions[];
  error?: ICustomSelectError;
}
