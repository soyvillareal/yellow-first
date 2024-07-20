import { Button } from '@headlessui/react';
import { PropsWithChildren } from 'react';

import { cn } from '@helpers/constants';

import { buttonVariants } from './CustomButton.constants';
import { ICustomButtonProps } from './CustomButton.types';

const CustomButton = ({
  loading = false,
  className,
  variant,
  size,
  disabled,
  children,
  ...props
}: PropsWithChildren<ICustomButtonProps>) => {
  return (
    <Button
      {...props}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
