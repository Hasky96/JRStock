export default function Header({ category }) {
  const nameMap = new Map([
    ["market", "주요 시세 정보"],
    ["stock", "종목 리스트"],
    ["backtest", "백테스트"],
    ["mypage", "마이페이지"],
    ["notice", "공지사항"],
  ]);
  return (
    <div className="relative">
      {/* Header 상단 고정 */}
      <div className="fixed  w-full pl-4 pr-24 z-50">
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
            <div className="w-14 p-1">
              <img
                className="rounded-full"
                src="https://source.unsplash.com/random/200x200"
                alt="profile"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
