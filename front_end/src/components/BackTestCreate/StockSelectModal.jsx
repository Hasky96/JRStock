import { ReactComponent as Search } from "../../assets/search.svg";
import { useState } from "react";
import { getStockItemList } from "../../api/stock";
import costMap from "../../util/costMap";
import "./StockSelectModal.css";

export default function StockSelectModal({ toggleModal, handleStateChange }) {
  const [searchWord, setSearchWord] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const handleCancelButton = () => {
    toggleModal();
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const result = await getStockItemList({
      page: "1",
      size: "20",
      company_name: searchWord,
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));

    if (result) {
      setSearchResult(result);
    }
  };

  const handleSearchChange = (e) => {
    setSearchWord(e.target.value);
  };

  const handleStockSelect = (company_name, company_code) => {
    handleStateChange("company_name", company_name);
    handleStateChange("company_code", company_code);
    toggleModal();
  };

  const paintSearchResult = searchResult.results
    ? searchResult.results.map(({ financial_info, market_cap }, index) => (
        <button
          key={index}
          type="button"
          className="w-full grid grid-cols-3 my-2 h-8 justify-between items-center text-center hover:bg-indigo-100 border-b rounded p-1"
          onClick={() =>
            handleStockSelect(
              financial_info.basic_info.company_name,
              financial_info.basic_info.code_number
            )
          }
        >
          <div className="col-span-1 text-left whitespace-nowrap">
            {financial_info.basic_info.company_name}
          </div>
          <div className="col-span-1">
            ({financial_info.basic_info.code_number})
          </div>
          <div className="col-span-1">{costMap(market_cap)}</div>
        </button>
      ))
    : [];

  return (
    <div
      className="fixed z-20000 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        ></span>

        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"></div>
              <div className="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  종목 선택
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    아래에서 원하는 국내 주식 종목을 검색하여 선택해주세요.
                  </p>
                </div>
                <div className="relative">
                  <form onSubmit={(e) => handleSearchSubmit(e)}>
                    <input
                      id="company_name"
                      name="company_name"
                      type="text"
                      onChange={(e) => handleSearchChange(e)}
                      className="w-full h-8 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 sm:text-sm border border-gray-300 rounded-md"
                    />
                    <button type="submit" className="absolute right-1 top-2">
                      <Search />
                    </button>
                  </form>
                </div>
                {searchResult.results && (
                  <div className="mt-1 border rounded p-3 overflow-y-scroll h-96 scroll-wrapper-box">
                    {paintSearchResult}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {/* <button
              type="button"
              onClick={() => toggleModal()}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              선택
            </button> */}
            <button
              type="button"
              onClick={() => handleCancelButton()}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white hover:bg-red-100 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:border-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
