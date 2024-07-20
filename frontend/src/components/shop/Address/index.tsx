import useAppSelector from '@hooks/redux/useAppSelector';
import { selectUserSession } from '@helpers/features/session/session.selector';

const Address = () => {
  const selectedUserData = useAppSelector(selectUserSession);
  return (
    <div className="max-w-xs mx-auto rounded-lg shadow-md overflow-hidden mb-6">
      <div className="flex flex-row items-start justify-between w-full">
        <div className="mt-4 space-y-2 text-sm text-gray-100">
          <h2 className="text-lg font-bold text-gray-100 sm:text-xl">
            Enviar al domicilio
          </h2>
          <p>
            {selectedUserData?.firstAddress}, {selectedUserData?.secondAddress}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Address;
