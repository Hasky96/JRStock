import { useState } from "react";
import styles from "./BasicCondition.module.css";
import StockSelectModal from "./StockSelectModal";

export default function BasicCondition({
  handleInputChange,
  handleStateChange,
  values,
}) {
  const [isShowModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal((cur) => !cur);
  };

  const handleStockSelectButton = () => {
    toggleModal();
  };

  return (
    <>
      {isShowModal && (
        <StockSelectModal
          toggleModal={toggleModal}
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
              className={styles.inputTag}
              placeholder="벡테스트 제목을 입력해주세요."
              autoComplete="off"
              onChange={(e) => handleInputChange(e)}
            />
            <label htmlFor="title" className={styles.inputLabel}></label>
          </div>
        </div>
      </div>
      <div className="w-full h-30 grid grid-cols-12 border-0 border-b-1 border-gray-200 shadow rounded text-center mt-3 p-3 gap-2 gap-y-5">
        <div className="col-span-12 text-left text-xl">기본조건</div>
        <div className="col-span-4 text-left">
          <label htmlFor="asset">투자 원금</label>
          <div className="flex items-center">
            <input
              id="asset"
              name="asset"
              type="number"
              className="h-8 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 sm:text-sm border border-gray-300 rounded-md"
              autoComplete="off"
              onChange={(e) => handleInputChange(e)}
            />
            <div className="pl-3">만원</div>
          </div>
        </div>
        <div className="col-span-5 flex text-left gap-2">
          <div>
            <label htmlFor="start_at">시작일</label>
            <input
              id="start_at"
              name="start_at"
              type="date"
              className="h-8 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block sm:text-sm border border-gray-300 rounded-md"
            ></input>
          </div>
          <div>
            <label htmlFor="end_at">종료일</label>
            <input
              id="end_at"
              name="end_at"
              type="date"
              className="h-8 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block sm:text-sm border border-gray-300 rounded-md"
            ></input>
          </div>
        </div>

        <div className="col-span-2 text-left">
          <label htmlFor="commission">수수료</label>
          <div className="flex items-center">
            <input
              id="commission"
              name="commission"
              type="number"
              className="h-8 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 sm:text-sm border border-gray-300 rounded-md"
              autoComplete="off"
              onChange={(e) => handleInputChange(e)}
            />
            <div className="pl-3">%</div>
          </div>
        </div>
        <div className="col-start-1 col-span-4 text-left">
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
              onClick={() => handleStockSelectButton()}
              className="mt-1 py-2 px-4 border border-indigo-500 bg-indigo-50 text-indigo shadow-sm text-sm font-medium rounded-md  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-indigo-700 hover:text-white duration-200"
            >
              {values.company_name ? "변경" : "검색"}
            </button>
          </div>
        </div>
        <div className="col-span-4 text-left">
          <label htmlFor="goal_asset">목표 자산</label>
          <div className="flex items-center">
            <input
              id="goal_asset"
              name="goal_asset"
              type="number"
              className="h-8 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 sm:text-sm border border-gray-300 rounded-md"
              autoComplete="off"
              onChange={(e) => handleInputChange(e)}
            />
            <div className="pl-3">만원</div>
          </div>
        </div>
        <div className="col-span-2 text-left">
          <label htmlFor="goal_profit">목표 수익률</label>
          <div className="flex items-center">
            <input
              id="goal_profit"
              name="goal_profit"
              type="number"
              className="h-8 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 sm:text-sm border border-gray-300 rounded-md"
              autoComplete="off"
              onChange={(e) => handleInputChange(e)}
            />
            <div className="pl-3">%</div>
          </div>
        </div>
      </div>
    </>
  );
}
