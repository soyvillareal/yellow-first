import { PropsWithChildren, useCallback } from 'react';

import Loader from '@components/atoms/Loader';

import { IItemContainerProps } from './ItemContainer.types';

const ItemContainer = ({
  children,
  loading = false,
  skeletonElement,
}: PropsWithChildren<IItemContainerProps>) => {
  const loaderElement = useCallback(() => {
    return skeletonElement || <Loader />;
  }, [skeletonElement]);

  return (
    <div className="block relative">{loading ? loaderElement() : children}</div>
  );
};

export default ItemContainer;
