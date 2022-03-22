import React from "react";
import { Navigate } from "react-router-dom";
import useIsLoggedIn from "../util/useIsLoggedIn";

export default function PrivateRoute({ redirectPath, children }) {
  const isLoggedIn = useIsLoggedIn();
  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace="true"
        state={{ from: { pathname: redirectPath } }}
      />
    );
  }

  return children;
}
