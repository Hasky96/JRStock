export default function Header({ category }) {
  return (
    <div className="relative">
      {/* Header 상단 고정 */}
      <div className="fixed w-full">
        <div className="grid grid-cols-6 p-6 px-12">
          {/* 카테고리 그리드 */}
          <div className="col-span-2 text-4xl my-auto">category</div>
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
          <div className="grid justify-items-center mr-8">
            {/* 프로필 */}
            <div class="w-20">
              <img
                class="rounded-full"
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
