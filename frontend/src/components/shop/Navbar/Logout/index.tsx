import { BiLogOut } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import useAppDispatch from '@hooks/redux/useAppDispatch';
import { removeSession } from '@helpers/features/session/session.slice';

const Logout = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClickLogOut = () => {
    dispatch(removeSession());
    navigate('/');
  };
  return (
    <button
      type="button"
      onClick={handleClickLogOut}
      className="flex items-center justify-center p-2 px-3 py-2 -m-2 text-sm font-medium text-gray-100 rounded-lg bg-gray-50 bg-opacity-10 hover:bg-transparent hover:text-white w-full group"
    >
      <span className="mr-2">{t('navbar.logOut')}</span>
      <BiLogOut
        title="log out"
        className="flex-shrink-0 w-6 h-6 text-gray-100 group-hover:text-white"
        aria-hidden="true"
      />
    </button>
  );
};

export default Logout;
