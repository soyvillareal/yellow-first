import { useMemo } from 'react';

import { selectCard } from '@helpers/features/transaction/transaction.selector';
import useAppSelector from '@hooks/redux/useAppSelector';
import CustomButton from '@components/headlessUI/CustomButton';

import { ICardInfoProps } from './CardInfo.types';

const CardInfo = ({ handleClickEditCard }: ICardInfoProps) => {
  const selectedCard = useAppSelector(selectCard);

  const useCardType = useMemo(() => {
    return selectedCard.cardInfo?.brand.toLowerCase();
  }, [selectedCard.cardInfo?.brand]);

  return (
    selectedCard.cardInfo && (
      <div className="max-w-xs mx-auto border rounded-lg shadow-md overflow-hidden mt-6">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-full px-4 py-5 sm:p-6">
            <div className="flex flex-row items-center justify-between mb-6">
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-white">
                  Cardholder Name
                </span>
                <span className="text-lg font-medium text-gray-400">
                  {selectedCard.cardInfo?.cardHolder}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <img
                  className="w-16"
                  alt={useCardType}
                  src={`/card-type/${useCardType}.png`}
                />
              </div>
            </div>
            <div className="flex flex-col items-start justify-between mb-6">
              <span className="text-sm font-medium text-white">
                Card Number
              </span>
              <span className="text-lg font-medium text-gray-400">
                **** **** **** {selectedCard.cardInfo?.lastFour}
              </span>
            </div>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-white">
                  Expiration Date
                </span>
                <span className="text-lg font-medium text-gray-400">
                  {selectedCard.cardInfo?.expMonth}/
                  {selectedCard.cardInfo?.expYear}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-white">CVV</span>
                <span className="text-lg font-medium text-gray-400">***</span>
              </div>
            </div>
          </div>

          <CustomButton
            className="w-[175px] mb-6"
            onClick={handleClickEditCard}
            variant="secondary"
          >
            Editar tarjeta
          </CustomButton>
        </div>
      </div>
    )
  );
};

export default CardInfo;
