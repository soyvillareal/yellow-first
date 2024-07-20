import { BiLogOut } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import useAppDispatch from '@hooks/redux/useAppDispatch';
import { removeSession } from '@helpers/features/session/session.slice';

const Logout = () => {
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
      className="flex items-center p-2 px-3 py-2 -m-2 text-sm font-medium text-gray-100 rounded-lg hover:bg-gray-50 hover:bg-opacity-10 hover:text-white group"
    >
      <span className="hidden mr-2 md:block">Log Out</span>
      <BiLogOut
        title="log out"
        className="flex-shrink-0 w-6 h-6 text-gray-100 group-hover:text-white"
        aria-hidden="true"
      />

      <span className="sr-only">log out</span>
    </button>
  );
};

export default Logout;
