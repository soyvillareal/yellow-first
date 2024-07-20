import { numberWithCurrency } from '@helpers/constants';

import AddToCartButton from '../AddToCartButton';
import { IProductCardProps } from './ProductCard.types';

const ProductCard = ({
  id,
  name,
  description,
  image,
  price,
  stock,
}: IProductCardProps) => {
  return (
    <div className="flex flex-col items-center self-start border border-gray-700 rounded-lg bg-gray-900 hover:bg-gray-800 hover:border hover:border-gray-900">
      <div className="w-full relative">
        <img
          className="w-full h-56 p-4 rounded-t-lg lg:h-80 object-cover"
          src={image}
          alt={name}
        />
      </div>
      <div className="flex flex-col flex-wrap content-between justify-center px-5 pb-5 align-middle w-full">
        <h5 className="w-full text-base font-semibold tracking-tight text-gray-100 lg:text-lg line-clamp-2 min-h-[56px]">
          {name}
        </h5>
        <p className="text-sm font-normal text-gray-300 line-clamp-2">
          {description}
        </p>
        <div className="flex flex-col space-y-2 mt-4">
          <div className="text-lg lg:text-2xl relative font-bold text-gray-100">
            {numberWithCurrency(price)}

            <span className=" absolute text-xs right-0 bottom-1.5 font-semibold px-2.5 py-0.5 rounded bg-cyan-900 bg-opacity-80 text-gray-100">
              {stock}
            </span>
          </div>
          <AddToCartButton
            id={id}
            name={name}
            description={description}
            image={image}
            price={price}
            stock={stock}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
