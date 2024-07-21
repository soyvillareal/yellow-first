import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Transition } from '@headlessui/react';
import { Pagination } from 'react-headless-pagination';
import toast from 'react-hot-toast';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

import { useLazyGetProductsQuery } from '@helpers/features/product/product.api';
import { EPaginationOrder } from '@helpers/types';
import CustomSelect from '@components/headlessUI/CustomSelect';
import ItemContainer from 'layouts/ItemContainer';
import ProductCard from '@components/shop/ProductCard';
import PageContainer from 'layouts/PageContainer';

import {
  initialProductFilter,
  limitProductOptions,
  sortProductOptions,
} from './Products.constants';
import { IProductFilterState } from './Products.types';
import ProductsSkeleton from './ProductsSkeleton';

const Products = () => {
  const { t } = useTranslation();
  const [filter, setFilter] =
    useState<IProductFilterState>(initialProductFilter);

  const [page, setPage] = useState<number>(1);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const [
    getProducts,
    { data: dataGetProducts, isFetching: isFetchingGetProducts },
  ] = useLazyGetProductsQuery();

  useEffect(() => {
    (async () => {
      try {
        await getProducts({
          page,
          limit: filter.limit,
          order: filter.order,
        });
      } catch (error) {
        toast.error(t('products.error.failedFetchProducts'));
      }
    })();
  }, [t, getProducts, page, filter]);

  const handleChangeLimit = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const limit = parseInt(event.target.value);
      setFilter((prev) => ({
        ...prev,
        limit,
      }));
    },
    [],
  );

  const handleChangeSort = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const order = event.target.value as EPaginationOrder;
      setFilter((prev) => ({
        ...prev,
        order,
      }));
    },
    [],
  );

  return (
    <PageContainer
      seo={{
        title: t('SEO.products.title'),
        subtitle: t('SEO.products.subtitle'),
        description: t('SEO.products.description'),
        keywords: ['products', 'books', 'stationery'],
      }}
    >
      <div className="w-full mb-4">
        <div className="flex flex-row items-center justify-end ml-auto gap-4 max-w-[360px]">
          <CustomSelect
            id="limit"
            className="w-1/5"
            options={limitProductOptions}
            onChange={handleChangeLimit}
            value={filter.limit}
            disabled={isFetchingGetProducts}
          />
          <CustomSelect
            id="order"
            className="w-1/3"
            options={sortProductOptions(t)}
            onChange={handleChangeSort}
            value={filter.order}
            disabled={isFetchingGetProducts}
          />
        </div>
      </div>
      <ItemContainer
        skeletonElement={<ProductsSkeleton itemsCount={filter.limit} />}
        loading={isFetchingGetProducts}
      >
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
            <div className="grid sm:grid-cols-2 gap-2 lg:grid-cols-4">
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
                disabled={page === 1 || isFetchingGetProducts}
              >
                <ChevronLeftIcon className="size-5" />
              </Pagination.PrevButton>

              <nav className="flex justify-center flex-grow">
                <ul className="flex items-center gap-2">
                  <Pagination.PageButton
                    activeClassName="bg-gray-900"
                    inactiveClassName="!bg-gray-600"
                    className="flex items-center justify-center w-[38px] h-[38px] text-gray-100 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:ring-opacity-50 bg-gray-800 rounded-full p-2 hover:bg-opacity-50 transition-all border cursor-pointer"
                    disabled={isFetchingGetProducts}
                  />
                </ul>
              </nav>

              <Pagination.NextButton
                className="text-gray-100 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:ring-opacity-50 bg-gray-800 rounded-full p-2 hover:bg-opacity-50 transition-all border cursor-pointer"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={
                  page === dataGetProducts?.data?.meta.pageCount ||
                  isFetchingGetProducts
                }
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
                {t('products.warehouseIsEmpty')}
              </p>
            </div>
          )}
      </ItemContainer>
    </PageContainer>
  );
};

export default Products;
