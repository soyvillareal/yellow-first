import { Transition } from '@headlessui/react';

import { fillArray } from '@helpers/constants';

import { IProductsSkeletonProps } from './ProductsSkeleton.types';

const ProductsSkeleton = ({ itemsCount = 10 }: IProductsSkeletonProps) => {
  return (
    <Transition
      appear={true}
      enter="transition-all ease-in-out duration-500 delay-[100ms]"
      enterFrom="opacity-0 translate-y-6"
      show={true}
      enterTo="opacity-100 translate-y-0"
      leave="transition-all ease-in-out duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      as="div"
    >
      <div className="grid sm:grid-cols-2 gap-2 lg:grid-cols-4">
        {fillArray(itemsCount).map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center self-start border border-gray-700 rounded-lg bg-gray-900 hover:bg-gray-800 hover:border hover:border-gray-900 animate-pulse "
          >
            <div className="w-full relative p-4">
              <div className="bg-slate-700 w-full h-56 rounded-t-lg lg:h-80" />
            </div>
            <div className="flex flex-col flex-wrap content-between justify-center px-5 pb-5 align-middle w-full">
              <div className="w-full">
                <div className="bg-slate-700 w-[80%] mt-[8px] min-h-[20px] rounded-lg" />
                <div className="bg-slate-700 w-[35%] mt-[8px] min-h-[20px] rounded-lg" />
              </div>
              <div className="bg-slate-700" />
              <div className="flex flex-col space-y-2 mt-4">
                <div className="flex flex-row items-center justify-between">
                  <span className="bg-slate-700 w-[120px] h-[25px] rounded-lg" />
                  <span className="bg-slate-700 px-2.5 py-0.5 rounded w-[40px] h-[20px]" />
                </div>
                <div className="bg-slate-700 w-full h-[38px] rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Transition>
  );
};

export default ProductsSkeleton;
