import { useTranslation } from 'react-i18next';

const CardConfigSkeleton = () => {
  const { t } = useTranslation();

  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-100">{t('cart.baseRate')}</p>
        <div className="w-20 h-4 bg-slate-700 rounded-lg" />
      </div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-100">{t('cart.shippingFee')}</p>
        <div className="w-20 h-4 bg-slate-700 rounded-lg" />
      </div>
      <hr className="my-4" />
      <div className="flex items-center justify-between text-gray-100">
        <p className="text-lg font-bold">{t('cart.total')}</p>
        <div className="w-20 h-4 bg-slate-700 rounded-lg" />
      </div>
    </div>
  );
};

export default CardConfigSkeleton;
