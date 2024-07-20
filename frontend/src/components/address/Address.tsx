import useAppSelector from '@hooks/redux/useAppSelector';
import { selectUserSession } from '@helpers/features/session/session.selector';

const Address = () => {
  const selectedUserData = useAppSelector(selectUserSession);
  return (
    <div>
      <div className="rounded-lg">
        <div
          className={`flex relative flex-row p-6 mb-6 border-b border-gray-700 hover:rounded-lg bg-gray-800 rounded-lg`}
        >
          <div className="flex flex-row items-start justify-between w-full">
            <div>
              <div className="flex flex-col items-start w-full">
                <h2 className="text-lg text-gray-100 sm:text-xl">
                  {selectedUserData?.username}, {selectedUserData?.phoneNumber}
                </h2>
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-100">
                <p>
                  {selectedUserData?.firstAddress},{' '}
                  {selectedUserData?.secondAddress}
                </p>
                <p>
                  {selectedUserData?.city}-{selectedUserData?.pincode},{' '}
                  {selectedUserData?.state}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;
