import { useTranslation } from 'react-i18next';

import useAppSelector from '@hooks/redux/useAppSelector';
import { selectUserSession } from '@helpers/features/session/session.selector';

const Address = () => {
  const { t } = useTranslation();
  const selectedUserData = useAppSelector(selectUserSession);

  return (
    <div className="max-w-xs rounded-lg overflow-hidden mb-6">
      <div className="flex flex-row items-start justify-between w-full">
        <div className="space-y-2 text-sm text-gray-100">
          <h2 className="text-lg font-bold text-gray-100 sm:text-xl">
            {t('cart.sendToHome')}
          </h2>
          <p className="text-gray-400">
            {selectedUserData?.firstAddress}, {selectedUserData?.secondAddress}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Address;
