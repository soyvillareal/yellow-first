import { Navigate, useLocation } from "react-router-dom";

import { selectIsUserLoggedIn } from "@helpers/features/session/session.selector";
import useAppSelector from "@hooks/redux/useAppSelector";
import { PropsWithChildren } from "react";

const CanActivate = ({ children }: PropsWithChildren) => {
  const location = useLocation();

  const selectedIsUserLoggedIn = useAppSelector(selectIsUserLoggedIn);

  return selectedIsUserLoggedIn ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default CanActivate;
