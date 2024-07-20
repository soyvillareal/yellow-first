import { PropsWithChildren } from 'react';
import { Helmet, HelmetProps, HelmetProvider } from 'react-helmet-async';

const HelmetAsync = ({
  children,
  ...props
}: PropsWithChildren<HelmetProps>) => {
  return (
    <HelmetProvider>
      <Helmet {...props}>{children}</Helmet>
    </HelmetProvider>
  );
};

export default HelmetAsync;
