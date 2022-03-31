import { useEffect, useState, Fragment } from "react";
import { getBacktestTradeRecord } from "../../../api/backtest";
import Pagenation2 from "../../Pagenation2";
import { nameDict } from "../../../config/backtestConfig";

export default function TradingRecord({ id, isLoading }) {
  const [currentRecords, setCurrentRecords] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 10;

  const fetchBacktestTradeRecord = async (backtestId, params) => {
    const res = await getBacktestTradeRecord(backtestId, params);
    return res.data;
  };

  useEffect(() => {
    async function fetchAndSetTradeRecord() {
      const data = await fetchBacktestTradeRecord(id, {
        page: pageNo,
        size: pageSize,
      });
      const { count, results } = data;
      setTotalCount(count);
      setCurrentRecords(results);
    }

    if (!isLoading) {
      fetchAndSetTradeRecord();
    }
  }, [pageNo]);

  const paintRecords = currentRecords.map(
    (
      {
        id,
        date,
        isBuy,
        isWin,
        stock_amount,
        stock_price,
        current_rate,
        current_asset,
        company_name,
        company_code,
        buy_sell_option,
      },
      index
    ) => (
      <tr key={index} className="h-12 border-b hover:bg-indigo-50">
        <td>{index + 1 + (pageNo - 1) * 10}</td>
        <td>{date}</td>
        <td>{isBuy ? "매수" : "매도"}</td>
        <td>{nameDict[buy_sell_option.slice(0, -1)]}</td>
        <td>{stock_amount}</td>
        <td>{stock_price.toLocaleString()}</td>
        <td
          className={!isBuy ? (isWin ? "text-red-600" : "text-blue-600") : ""}
        >
          {!isBuy ? (isWin ? "승" : "패") : ""}
        </td>
        <td className={current_rate >= 0 ? "text-red-600" : "text-blue-600"}>
          {current_rate}
        </td>
        <td>{current_asset.toLocaleString()}</td>
      </tr>
    )
  );

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full overflow-x-scroll">
        <table className="table-auto w-full text-center min-w-[1000px]">
          <colgroup>
            <col span="1" style={{ width: 5 + "%" }} />
            <col span="1" style={{ width: 15 + "%" }} />
          </colgroup>
          <thead className="bg-gray-200 h-12">
            <tr>
              <th>No</th>
              <th>일시</th>
              <th>구분</th>
              <th>매매 조건</th>
              <th>수량(주)</th>
              <th>매매가(원)</th>
              <th>승패</th>
              <th>수익률(%)</th>
              <th>현재 자산(원)</th>
            </tr>
          </thead>
          {currentRecords.length ? (
            <tbody>{paintRecords}</tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="10" className="text-center py-5">
                  거래 내역이 존재하지 않습니다.
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      <Pagenation2
        setPageNo={setPageNo}
        selectedNum={pageNo}
        totalCnt={totalCount}
        pageSize={pageSize}
      ></Pagenation2>
    </div>
  );
}

// import { Menu, Transition } from "@headlessui/react";
// import { ChevronDownIcon, FilterIcon } from "@heroicons/react/solid";
// import { getBacktestTradeRecord } from "../../../api/backtest";

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

// const [filterSelected, setFilterSelected] = useState("Options");
// const filterOptions = ["전체", "삼성전자", "네이버", "카카오"];
// const paintFilterOptions = filterOptions.map((element, idx) => (
//   <Menu.Item key={idx}>
//     {({ active }) => (
//       <a
//         href="#"
//         className={classNames(
//           active ? "bg-gray-100 text-gray-900" : "text-gray-700",
//           "block px-4 py-2 text-sm"
//         )}
//         // onClick={(e) => handleFilterClick(e)}
//       >
//         {element}
//       </a>
//     )}
//   </Menu.Item>
// ));

//   <div className="w-full mb-3">
//   <Menu as="div" className="relative inline-block text-left">
//     <div>
//       <Menu.Button className="inline-flex justify-center w-full rounded-md border hover:border-indigo-300 focus:border-indigo-300 border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-gray-100 focus:ring-primary">
//         <FilterIcon
//           className="h-5 w-5 -ml-1 mr-2 p-0"
//           aria-hidden="true"
//         />
//         {filterSelected}
//         <ChevronDownIcon
//           className="-mr-1 ml-2 h-5 w-5"
//           aria-hidden="true"
//         />
//       </Menu.Button>
//     </div>

//     <Transition
//       as={Fragment}
//       enter="transition ease-out duration-100"
//       enterFrom="transform opacity-0 scale-95"
//       enterTo="transform opacity-100 scale-100"
//       leave="transition ease-in duration-75"
//       leaveFrom="transform opacity-100 scale-100"
//       leaveTo="transform opacity-0 scale-95"
//     >
//       <Menu.Items className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
//         <div className="py-1">{paintFilterOptions}</div>
//       </Menu.Items>
//     </Transition>
//   </Menu>
// </div>

// const fetchTradeRecord = async (backtestId) => {
//   const res = await getBacktestTradeRecord(backtestId);
//   return res.data;
// };

// useEffect(() => {
//   const fetchAndSetTradeRecord = async () => {
//     const data = fetchTradeRecord(id);
//   };
//   const result = fetchTradeRecord(id);
// }, [isLoading]);
