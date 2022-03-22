import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userDetail } from "../api/user";

export default function Header({ category }) {
  const nameMap = new Map([
    ["market", "주요 시세 정보"],
    ["stock", "종목 리스트"],
    ["backtest", "백테스트"],
    ["mypage", "마이페이지"],
    ["notice", "공지사항"],
    ["ranking", "랭킹"],
  ]);

  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { id, email, name, profile_img_url } = await userDetail();
      setUser({
        id,
        email,
        name,
        profile_img_url,
      });
    };
    fetchUserInfo();
  }, []);

  return (
    <div className="relative">
      {/* Header 상단 고정 */}
      <div className="fixed  w-full pl-4 pr-24 z-30">
        <div className="grid grid-cols-12 m-6 rounded-xl bg-indigo-900">
          {/* 카테고리 그리드 */}
          <div className="col-span-7 text-3xl my-auto ml-5 text-indigo-50">
            {nameMap.get(category)}
          </div>
          {/* 검색 그리드 */}
          <div className="col-span-4 grid content-center">
            <div className="relative">
              {/* 검색 아이콘 */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 absolute left-2 top-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#d1d5db"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {/* 검색창 */}
              <input
                type="text"
                name="price"
                id="price"
                className="hover:border-indigo-900 focus:ring-indigo-900 focus:border-indigo-900 text-xl block w-full h-10 pl-10 pr-12 border-white rounded-lg"
                placeholder="Search..."
              />
            </div>
          </div>
          {/* 사진 그리드 */}
          <div className="grid justify-items-end mr-5">
            {/* 프로필 */}
            {user ? (
              <button className="w-14 p-1 group duration-300 relative">
                <img
                  className="rounded-full w-[50px] h-[50px]"
                  src={`${user.profile_img_url}`}
                  alt="profile"
                />
                <div class="absolute -left-5 top-full invisible opacity-0 group-focus:visible group-focus:opacity-100 min-w-full w-max bg-white shadow-md mt-1 rounded duration-300">
                  <ul class="text-left border rounded ">
                    <li
                      class="px-4 py-1 hover:bg-indigo-900 hover:text-white border-b duration-300"
                      onClick={() => {
                        window.sessionStorage.removeItem("access_token");
                      }}
                    >
                      <Link to="/">로그아웃</Link>
                    </li>
                  </ul>
                </div>
              </button>
            ) : (
              <button className="w-14 p-1 group duration-300 relative">
                <img
                  className="rounded-full w-[50px] h-[50px]"
                  src={require("../assets/profile1.jpg")}
                  alt="profile"
                />
                <div class="absolute top-full invisible opacity-0 group-focus:visible group-focus:opacity-100 min-w-full w-max bg-white shadow-md mt-1 rounded duration-300">
                  <ul class="text-left border rounded ">
                    <li class="px-4 py-1 hover:bg-indigo-900 hover:text-white border-b duration-300">
                      <Link to="/login">로그인</Link>
                    </li>
                    <li class="px-4 py-1 hover:bg-indigo-900 hover:text-white border-b duration-300">
                      <Link to="/signup">회원가입</Link>
                    </li>
                  </ul>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
