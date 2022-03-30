import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar/SideBar";

export default function Layout() {
  const [category, setCategory] = useState("");

  const location = useLocation();

  useEffect(() => {
    // 카테고리 셋팅
    setCategory(location.pathname.split("/")[1]);
  }, [location.pathname]);
  return (
    <>
      <div>
        <SideBar />
      </div>
      <div className="ml-20 bg-gray-50 min-h-screen">
        <div>
          <Header category={category}></Header>
        </div>
        <Outlet />
      </div>
    </>
  );
}
