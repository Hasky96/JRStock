import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useIsAdmin from "../util/useIsAdmin";

export default function AdminRoute({ children, redirectPath }) {
  const location = useLocation();
  const isAdmin = useIsAdmin();
  if (!isAdmin) {
    return (
      <Navigate
        to="/login"
        replace="true"
        state={{ from: { pathname: "/" } }} // header.jsx 에서 is_admin을 등록하기 때문에 부득이하게 메인화면으로 이동
      />
    );
  }

  return children ? children : <Outlet />;
}
