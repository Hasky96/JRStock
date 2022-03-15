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
      <div className="fixed ml-10 w-11/12 z-50">
        <div className="grid grid-cols-6 m-6 mx-12 rounded-xl bg-yellow-300">
          {/* 카테고리 그리드 */}
          <div className="col-span-2 text-4xl my-auto ml-5 text-yellow-50">
            {nameMap.get(category)}
          </div>
          {/* 검색 그리드 */}
          <div className="col-span-3 grid content-center">
            <div className="relative">
              {/* 검색 아이콘 */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 absolute left-2 top-3.5"
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
                className="hover:border-yellow-300 focus:ring-yellow-300 focus:border-yellow-300 text-2xl block w-full h-16 pl-12 pr-12 border-white rounded-lg"
                placeholder="Search..."
              />
            </div>
          </div>
          {/* 사진 그리드 */}
          <div className="grid justify-items-end mr-5">
            {/* 프로필 */}
            <div className="w-20 p-1">
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
