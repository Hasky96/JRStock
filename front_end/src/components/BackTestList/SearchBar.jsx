import { ReactComponent as SearchIcon } from "../../assets/search.svg";
export default function SearchBar({ onSearch, name }) {
  return (
    <div className="relative">
      <div className="absolute top-2 left-2">
        <SearchIcon />
      </div>
      <input
        id={name}
        name={name}
        type="text"
        className="hover:border-primary focus:ring-primary focus:border-primary hover:border-transparent text-xs block w-full h-9 pl-9 pr-8 border-gray-100 bg-gray-100 rounded"
        placeholder="search..."
        onChange={(e) => {
          e.preventDefault();
          onSearch(e.target.value);
        }}
      />
    </div>
  );
}
