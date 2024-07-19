import { useEffect } from "react";
// import { BooksContext } from "../../contexts/BooksProvider";

import ProductCard from "../../components/products/ProductCard";
import Loader from "../../components/loader/Loader";
import { Transition } from "@headlessui/react";
import { useLazyGetProductsQuery } from "@helpers/features/product/product.api";
import { EPaginationOrder } from "@helpers/types";

const Products = () => {
  // const { booksState, allSortsAndFilters } = useContext(BooksContext);

  const [
    getProducts,
    { data: dataGetProducts, isLoading: isLoadingGetProducts },
  ] = useLazyGetProductsQuery();

  useEffect(() => {
    document.title = "Products | The Book Shelf";

    (async () => {
      try {
        await getProducts({
          page: 1,
          limit: 10,
          order: EPaginationOrder.DESC,
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return isLoadingGetProducts ? (
    <Loader />
  ) : (
    <div className="relative py-24 mt-16 ">
      <Transition
        appear={true}
        enter="transition-all ease-in-out duration-500 delay-[100ms]"
        enterFrom="opacity-0 translate-y-6"
        show={true}
        enterTo="opacity-100 translate-y-0"
        leave="transition-all ease-in-out duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
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
