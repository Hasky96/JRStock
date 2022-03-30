import { ReactComponent as RankingSearchIcon } from "../../assets/rankingSearch.svg";

export default function Searchbar({ onKeyUp, inputRef }) {
  return (
    <div
      className="flex h-9 w-1/2 invisible opacity-0 duration-500"
      id="rank-search-bar"
    >
      <div className="flex w-full justify-end xl:gap-4 gap-1">
        <label
          className="xl:text-xl text-sm flex items-center text-black"
          htmlFor="rank-search"
        >
          순위 검색
        </label>
        <div className="relative w-4/5">
          {/* 검색 아이콘 */}
          <RankingSearchIcon />
          {/* 검색창 */}
          <input
            type="text"
            name="price"
            id="rank-search"
            className="hover:border-active focus:ring-active focus:border-active text-xl block w-full h-9 pl-9 pr-9 border-gray-100 bg-gray-100 rounded-lg"
            placeholder="Search..."
            onKeyUp={onKeyUp}
            ref={inputRef}
          />
        </div>
      </div>
    </div>
  );
}
