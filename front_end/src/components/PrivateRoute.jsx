import { Navigate, useLocation, Outlet } from "react-router-dom";
import useIsLoggedIn from "../util/useIsLoggedIn";

export default function PrivateRoute({ children }) {
  const location = useLocation();
  const isLoggedIn = useIsLoggedIn();
  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace="true"
        state={{ from: { pathname: location.pathname } }}
      />
    );
  }

  return children ? children : <Outlet />;
}
