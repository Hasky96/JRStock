import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, FilterIcon } from "@heroicons/react/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

ListHeader.propTypes = {
  optionKind: PropTypes.arrayOf(PropTypes.string).isRequired,
};

/**
 * optionKind: filter에 넣을 옵션 종류
 * onClickFilter: 해당 옵션의 필터가 선택됐을 때 작동시킬 함수
 * onSearch: 검색을 했을 때 작동시킬 함수
 */
export default function ListHeader({
  optionKind,
  onClickFilter,
  onSearch,
  inputRef,
}) {
  const [selected, setSelected] = useState(optionKind[0]);
  const optionList = [];
  optionKind.forEach((element, idx) => {
    optionList.push(
      <Menu.Item key={idx}>
        {({ active }) => (
          <a
            href="#"
            className={classNames(
              active ? "bg-gray-100 text-gray-900" : "text-gray-700",
              "block px-4 py-2 text-sm"
            )}
            onClick={(e) => {
              e.preventDefault();
              setSelected(e.target.innerText);
              onClickFilter(e.target.innerText);
            }}
          >
            {element}
          </a>
        )}
      </Menu.Item>
    );
  });
  return (
    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      {/* filter 부분 */}
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex justify-center w-full rounded-md border hover:border-primary focus:border-primary border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-gray-100 focus:ring-primary">
            <FilterIcon className="h-5 w-5 -ml-1 mr-2 p-0" aria-hidden="true" />
            {selected}
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">{optionList}</div>
          </Menu.Items>
        </Transition>
      </Menu>
      {/* 검색창  */}
      <div className="w-1/3">
        <div className="relative">
          {/* 검색 아이콘 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-2 top-2.5"
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
            className="hover:border-primary focus:ring-primary focus:border-primary text-xs block w-full h-9 pl-9 pr-9 border-gray-100 bg-gray-100 rounded-lg"
            placeholder="Search..."
            onChange={(e) => {
              e.preventDefault();
              onSearch(e.target.value);
            }}
            ref={inputRef}
          />
        </div>
      </div>
    </div>
  );
}
