import { useState } from "react";
import styles from "./BasicCondition.module.css";
import StockSelectModal from "./StockSelectModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";

const inputPriceFormat = (str) => {
  const comma = (str) => {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
  };
  const uncomma = (str) => {
    str = String(str);
    return str.replace(/[^\d]+/g, "");
  };
  return comma(uncomma(str));
};

export default function BasicCondition({
  handleInputChange,
  handleStateChange,
  setIsStockSelected,
  values,
}) {
  const [formattedAsset, setFormattedAsset] = useState(0);
  const [isShowModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date("2014/02/08"));
  const [endDate, setEndDate] = useState(new Date());
  const toggleModal = () => {
    setShowModal((cur) => !cur);
  };

  const handleStockSelectButton = (e) => {
    e.preventDefault();
    toggleModal();
  };

  const calProfit = (asset, goal) => {
    if (parseInt(asset) && parseInt(goal)) {
      return parseInt(goal / asset) * 100;
    }

    return 0;
  };

  return (
    <>
      {isShowModal && (
        <StockSelectModal
          toggleModal={toggleModal}
          setIsStockSelected={setIsStockSelected}
          handleStateChange={handleStateChange}
        />
      )}
      <div className="w-full">
        <div>
          <div className={styles.inputBox}>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="벡테스트 전략 제목을 입력해주세요."
              required
              autoComplete="off"
              className={styles.inputTag}
              onChange={(e) => handleInputChange(e)}
            />
            <label htmlFor="title" className={styles.inputLabel}></label>
          </div>
        </div>
      </div>
      <div className="w-full h-30 grid grid-cols-12 border-0 border-b-1 border-gray-200 shadow rounded text-center mt-3 p-3 gap-y-5">
        <div className="col-span-12 text-left text-xl font-semibold">
          기본 조건
        </div>
        <div className="col-span-6 xl:col-span-4 text-left px-5">
          <label>종목 선택</label>
          <div className="flex">
            {values.company_name ? (
              <div className="my-auto text-lg font-medium mr-3">
                {values.company_name}({values.company_code})
              </div>
            ) : (
              ""
            )}
            <button
              type="button"
              onClick={(e) => handleStockSelectButton(e)}
              className="mt-1 py-2 px-4 border text-primary shadow-sm text-xs font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-active focus:bg-active focus:text-white hover:bg-active hover:text-white duration-300"
            >
              {values.company_name ? "변경" : "검색"}
            </button>
          </div>
        </div>
        <div className="-ml-5 lg:ml-0 col-start-7 xl:col-start-5 flex text-left gap-2 date-picker-container">
          <div className="relative">
            <label htmlFor="start_date">시작일</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                handleStateChange("start_date", date);
                setStartDate(date);
              }}
              dateFormat="yyyy년 MM월 dd일"
              locale={ko}
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />
          </div>
          <div>
            <label htmlFor="end_date">종료일</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => {
                handleStateChange("end_date", date);
                setEndDate(date);
              }}
              dateFormat="yyyy년 MM월 dd일"
              locale={ko}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              maxDate={new Date()}
            />
          </div>
        </div>

        <div className="col-start-1 col-span-6 xl:col-start-1 xl:col-span-4 text-left px-5">
          <label htmlFor="asset">투자 원금 (원)</label>
          <div className="flex items-center">
            <input
              id="asset"
              name="asset"
              type="text"
              value={formattedAsset}
              required
              autoComplete="off"
              className="h-8 shadow-sm focus:ring-active focus:border-active mt-1 sm:text-sm border border-gray-300 rounded-md"
              onChange={(e) => {
                const formattedValue = inputPriceFormat(e.target.value);
                setFormattedAsset(formattedValue);
                handleStateChange("asset", formattedValue);
              }}
            />
          </div>
        </div>

        <div className="-ml-5 lg:ml-0 col-span-6 xl:col-span-3 text-left">
          <label htmlFor="commission">수수료 (%)</label>
          <div className="flex items-center">
            <input
              id="commission"
              name="commission"
              type="number"
              required
              autoComplete="off"
              step="0.001"
              value={values.commision || 0.015}
              className="h-8 shadow-sm focus:ring-active focus:border-active mt-1 sm:text-sm border border-gray-300 rounded-md"
              onChange={(e) => handleInputChange(e)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
