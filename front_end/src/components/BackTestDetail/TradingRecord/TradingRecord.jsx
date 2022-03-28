import { useEffect, useState, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, FilterIcon } from "@heroicons/react/solid";
import Pagenation from "../../Pagenation";
import { records } from "../data.js";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TradingRecord() {
  const pageSize = 10;
  const [totalRecords, setTotalRecords] = useState(records);
  const [currentRecords, setCurrentRecords] = useState(records.slice(0, 10));
  const [totalCount, setTotalCount] = useState(records.length);
  const [pageNo, setPageNo] = useState(1);

  // const handleFilterClick = (e) => {
  //   e.preventDefault();
  //   setFilterSelected(e.target.innerText);
  //   if (e.target.innerText === "전체") {
  //     setPageNo(1);
  //     setCurrentRecords(records);
  //     setTotalCount(records.length);
  //   } else {
  //     setCurrentRecords(
  //       records.filter((record) => record.name === e.target.innerText).slice()
  //     );
  //     setPageNo(1);
  //   }
  // };

  const [filterSelected, setFilterSelected] = useState("Options");
  const filterOptions = ["전체", "삼성전자", "네이버", "카카오"];
  const paintFilterOptions = filterOptions.map((element, idx) => (
    <Menu.Item key={idx}>
      {({ active }) => (
        <a
          href="#"
          className={classNames(
            active ? "bg-gray-100 text-gray-900" : "text-gray-700",
            "block px-4 py-2 text-sm"
          )}
          // onClick={(e) => handleFilterClick(e)}
        >
          {element}
        </a>
      )}
    </Menu.Item>
  ));

  const onClickFirst = async () => {
    setPageNo(1);
  };

  const onClickLeft = async () => {
    setPageNo((cur) => cur - 1);
  };

  const onClickRight = async () => {
    setPageNo((cur) => cur + 1);
  };

  const onClickLast = async () => {
    const lastPageNum =
      parseInt(totalCount / pageSize) + (totalCount % pageSize === 0 ? 0 : 1);
    setPageNo(lastPageNum);
  };

  const onClickNumber = async (num) => {
    setPageNo(num);
  };

  useEffect(() => {
    setCurrentRecords(
      totalRecords.slice((pageNo - 1) * pageSize, pageNo * pageSize)
    );
  }, [pageNo]);

  const paintRecords = currentRecords.map(
    (
      { id, time, buy, type, stock, stockCode, price, quantity, asset, profit },
      index
    ) => (
      <tr key={index} className="h-12 border-b hover:bg-indigo-50">
        <td>{id}</td>
        <td>{time}</td>
        <td>{buy}</td>
        <td>{type}</td>
        <td>{stock}</td>
        <td>{stockCode}</td>
        <td>{price}</td>
        <td>{quantity}</td>
        <td>{asset}</td>
        <td>{profit + "%"}</td>
      </tr>
    )
  );

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full mb-3">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex justify-center w-full rounded-md border hover:border-indigo-300 focus:border-indigo-300 border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-gray-100 focus:ring-primary">
              <FilterIcon
                className="h-5 w-5 -ml-1 mr-2 p-0"
                aria-hidden="true"
              />
              {filterSelected}
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
              <div className="py-1">{paintFilterOptions}</div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <table className="table-auto w-full text-center">
        <colgroup>
          <col span="1" style={{ width: 5 + "%" }} />
          <col span="1" style={{ width: 15 + "%" }} />
        </colgroup>
        <thead className="bg-gray-200 h-12">
          <th>No</th>
          <th>일시</th>
          <th>구분</th>
          <th>조건</th>
          <th>종목</th>
          <th>종목코드</th>
          <th>매매가(원)</th>
          <th>매매수량(주)</th>
          <th>현재자산(원)</th>
          <th>수익률</th>
        </thead>
        <tbody>{paintRecords}</tbody>
      </table>
      <Pagenation
        selectedNum={pageNo}
        totalCnt={totalCount}
        pageSize={pageSize}
        onClickFirst={onClickFirst}
        onClickLeft={onClickLeft}
        onClickRight={onClickRight}
        onClickLast={onClickLast}
        onClickNumber={onClickNumber}
      ></Pagenation>
    </div>
  );
}
