import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userDetail } from "../api/user";
import { getStockItemList } from "../api/stock";
import { API_MEDIA_URL } from "../config";
import { DotsVerticalIcon } from "@heroicons/react/solid";

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
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [selectedNum, setSelectedNum] = useState(0); // 현재 선택된 검색 리스트 아이템
  const [preword, setPreword] = useState("");
  const [timer, setTimer] = useState();

  const onKeyUp = async (e) => {
    e.preventDefault();

    // 선택된 아이템 이동
    if (e.key === "ArrowUp" && data.results) {
      if (selectedNum > 0) setSelectedNum((cur) => cur - 1);
      return;
    }

    if (e.key === "ArrowDown" && data.results) {
      if (selectedNum < data.results.length - 1)
        setSelectedNum((cur) => cur + 1);
      return;
    }

    // 엔터 입력시 검색
    if (e.key === "Enter" && data.results) {
      navigate(
        `/stock/${data.results[selectedNum].financial_info.basic_info.code_number}/detail`
      );
      e.target.blur();
      return;
    }

    // 불필요한 중복 검색 방지
    if (preword === e.target.value) return;
    setPreword(e.target.value);

    // 새로운 데이터 읽어오기
    clearTimeout(timer);
    const newTimer = setTimeout(async () => {
      // 빈 입력값은 data 초기화
      if (e.target.value === "") {
        setData({});
        setSelectedNum(0);
        return;
      }
      const result = await getStockItemList({
        page: "1",
        size: "5",
        company_name: e.target.value,
      })
        .then((res) => res.data)
        .catch((err) => console.log(err));

      // 읽어온 데이터 state 저장
      if (result) {
        setSelectedNum(0); // 글자 입력하다 방향키 누를 시 Process라는 키와 함께 방향키가 눌려서 문제가 발생 -> 이전 검색어 저장해서 해결
        setData(result);
      }
    }, 500);
    setTimer(newTimer);
  };

  const onBlur = (e) => {
    const el = document.getElementById("search-result");
    // 리스트 아이템이 눌렸을 경우
    if (!e.relatedTarget?.classList.contains("result-item"))
      el.classList.toggle("hidden");
  };

  const onFocus = () => {
    const el = document.getElementById("search-result");
    el.classList.toggle("hidden");
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (sessionStorage.getItem("access_token")) {
        const result = await userDetail().catch(() => {
          console.log("비로그인 접속");
          return null;
        });

        if (result === null) return;

        const { id, email, name, profile_img, profile_img_url, is_admin } =
          result;

        setUser({
          id,
          email,
          name,
          profile_img,
          profile_img_url,
        });

        sessionStorage.setItem("is_admin", is_admin);
      }
    };

    fetchUserInfo();

    return () => {};
  }, []);

  const paintSearchResult = () => {
    return data.results?.map(
      ({ changes, chages_ratio, financial_info }, index) => (
        <button
          key={index}
          type="button"
          className={`result-item w-full flex flex-col xl:flex-row py-2 justify-between items-center text-center rounded p-1 ${
            selectedNum === index ? "bg-indigo-100" : null
          }`}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/stock/${financial_info.basic_info.code_number}/detail`);
            setSelectedNum(index);
            const el = document.getElementById("search-result");
            el.classList.toggle("hidden");
          }}
          onMouseOver={() => {
            setSelectedNum(index);
          }}
        >
          <div className="col-span-2 text-left whitespace-nowrap">
            {`${financial_info.basic_info.company_name} (${financial_info.basic_info.code_number})`}
          </div>
          <div
            className={
              changes > 0
                ? "col-span-3 text-red-500"
                : changes < 0
                ? "col-span-3 text-blue-600"
                : "col-span-3 text-gray-600"
            }
          >
            {changes > 0
              ? "▲ " + changes.toLocaleString()
              : changes < 0
              ? "▼ " + (-changes).toLocaleString()
              : "- " + (+changes).toLocaleString()}{" "}
            ({chages_ratio + "%"})
          </div>
        </button>
      )
    );
  };

  return (
    <div className="relative">
      {/* Header 상단 고정 */}
      <div className="fixed w-full pl-4 pr-24 z-30">
        <div className="grid grid-cols-12 mt-6 mx-6 rounded-xl bg-primary h-[60px]">
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
                id="header-search-input"
                autoComplete="off"
                className="hover:border-primary focus:ring-primary focus:border-primary block w-full h-10 pl-10 pr-12 border-white rounded-lg duration-300 hover:shadow-inner"
                placeholder="Search..."
                onKeyUp={onKeyUp}
                // 검색창 포커스 사라졌을 때
                onBlur={onBlur}
                onFocus={onFocus}
              />
              <div
                className="mt-1 absolute top-full w-full hidden bg-white rounded shadow-xl border border-primary p-2"
                id="search-result"
              >
                {paintSearchResult()}
              </div>
            </div>
          </div>
          {/* 사진 그리드 */}
          <div className="grid justify-items-end mr-5">
            {/* 프로필 */}
            {user ? (
              // 로그인 시
              <button className="w-14 p-1 group duration-300 relative">
                <img
                  className="rounded-full w-[50px] h-[50px]"
                  src={
                    user.profile_img
                      ? API_MEDIA_URL + `${user.profile_img}`
                      : `${user.profile_img_url}`
                  }
                  alt="profile"
                />
                <div className="absolute -left-5 top-full invisible opacity-0 group-focus:visible group-focus:opacity-100 min-w-full w-max bg-white shadow-md mt-1 rounded duration-300">
                  <ul className="text-left border rounded ">
                    <li
                      className="px-4 py-1 hover:bg-primary hover:text-white border-b duration-300"
                      onClick={() => {
                        window.sessionStorage.removeItem("access_token");
                        window.sessionStorage.removeItem("is_admin");
                      }}
                    >
                      <Link to="/">로그아웃</Link>
                    </li>
                  </ul>
                </div>
              </button>
            ) : (
              // 비로그인 시
              <button className="p-1 group duration-300 relative">
                <DotsVerticalIcon className="w-5 fill-white cursor-pointer" />
                <div className="absolute -left-5 top-[50px] invisible opacity-0 group-focus:visible group-focus:opacity-100 min-w-full w-max bg-white shadow-md mt-1 rounded duration-300">
                  <ul className="text-left border rounded ">
                    <li className="px-4 py-1 hover:bg-primary hover:text-white border-b duration-300">
                      <Link to="/login">로그인</Link>
                    </li>
                    <li className="px-4 py-1 hover:bg-primary hover:text-white border-b duration-300">
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
