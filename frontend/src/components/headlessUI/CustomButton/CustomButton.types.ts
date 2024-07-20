import { ButtonProps } from '@headlessui/react';
import { type VariantProps } from 'class-variance-authority';

import { buttonVariants } from './CustomButton.constants';

export interface ICustomButtonProps
  extends ButtonProps,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}
