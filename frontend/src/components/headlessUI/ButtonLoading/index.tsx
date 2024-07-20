import { PropsWithChildren } from 'react';

import { cn } from '@helpers/constants';
import SpinnerLoading from '@components/atoms/SpinnerLoading';

import { IButtonLoadingProps } from './ButtonLoading.types';
import CustomButton from '../CustomButton';

const ButtonLoading = ({
  loading = false,
  className,
  variant,
  size,
  disabled,
  children,
  ...props
}: PropsWithChildren<IButtonLoadingProps>) => {
  return (
    <CustomButton
      {...props}
      className={cn('flex items-center justify-center', className)}
      variant={variant}
      size={size}
      disabled={disabled || loading}
    >
      {loading && <SpinnerLoading />}
      <span className="block ml-1">{children}</span>
    </CustomButton>
  );
};

export default ButtonLoading;
