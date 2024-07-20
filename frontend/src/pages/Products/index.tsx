import { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { Pagination } from 'react-headless-pagination';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

import { useLazyGetProductsQuery } from '@helpers/features/product/product.api';
import { EPaginationOrder } from '@helpers/types';

import ProductCard from '../../components/shop/ProductCard';
import Loader from '../../components/atoms/Loader';

const Products = () => {
  const [page, setPage] = useState<number>(1);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const [
    getProducts,
    { data: dataGetProducts, isLoading: isLoadingGetProducts },
  ] = useLazyGetProductsQuery();

  useEffect(() => {
    document.title = 'Products | The Book Shelf';

    (async () => {
      try {
        await getProducts({
          page,
          limit: 10,
          order: EPaginationOrder.DESC,
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, [getProducts, page]);

  return isLoadingGetProducts ? (
    <Loader />
  ) : (
    <div className="relative py-24 px-24 mt-16 ">
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
        {dataGetProducts?.data && dataGetProducts.data.content.length > 0 && (
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {dataGetProducts.data.content.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                image={product.image}
                price={product.price}
                stock={product.stock}
              />
            ))}
          </div>
        )}
        <div className="flex items-center justify-center w-full">
          <Pagination
            totalPages={dataGetProducts?.data?.meta.pageCount || 0}
            edgePageCount={1}
            middlePagesSiblingCount={1}
            currentPage={page}
            setCurrentPage={handlePageChange}
            className="flex flex-row items-center justify-center mt-8 space-x-5 w-full max-w-[420px]"
            truncableText="..."
            truncableClassName="flex items-center justify-center w-[38px] h-[38px] text-gray-100 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:ring-opacity-50 bg-gray-800 rounded-full p-2 hover:bg-opacity-50 transition-all border cursor-pointer"
          >
            <Pagination.PrevButton
              className="text-gray-100 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:ring-opacity-50 bg-gray-800 rounded-full p-2 hover:bg-opacity-50 transition-all border cursor-pointer"
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1}
            >
              <ChevronLeftIcon className="size-5" />
            </Pagination.PrevButton>

            <nav className="flex justify-center flex-grow">
              <ul className="flex items-center gap-2">
                <Pagination.PageButton
                  activeClassName="bg-cyan-700"
                  inactiveClassName="!bg-gray-800"
                  className="flex items-center justify-center w-[38px] h-[38px] text-gray-100 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:ring-opacity-50 bg-gray-800 rounded-full p-2 hover:bg-opacity-50 transition-all border cursor-pointer"
                />
              </ul>
            </nav>

            <Pagination.NextButton
              className="text-gray-100 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:ring-opacity-50 bg-gray-800 rounded-full p-2 hover:bg-opacity-50 transition-all border cursor-pointer"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page === dataGetProducts?.data?.meta.pageCount}
            >
              <ChevronRightIcon className="size-5" />
            </Pagination.NextButton>
          </Pagination>
        </div>
      </Transition>
      {dataGetProducts &&
        dataGetProducts?.data &&
        dataGetProducts.data.meta.itemCount === 0 && (
          <div className="flex justify-center my-20 sm:my-32">
            <p className="text-2xl text-center text-gray-100 sm:text-4xl">
              Oops! Looks like our Book Shelf is empty. 😟
            </p>
          </div>
        )}
    </div>
  );
};

export default Products;
