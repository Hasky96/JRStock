import { useState } from "react";
import styles from "./BasicCondition.module.css";
import StockSelectModal from "./StockSelectModal";

export default function BasicCondition({ handleInputChange }) {
  const [isShowModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal((cur) => !cur);
  };

  const handleStockSelectButton = () => {};

  return (
    <>
      {isShowModal && <StockSelectModal toggleModal={toggleModal} />}
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
            <div className={styles.inputLabel}></div>
          </div>
        </div>
      </div>
      <div className="w-full h-30 grid grid-cols-12 border-0 border-b-1 border-gray-200 shadow-lg rounded text-center mt-3 p-3 gap-2">
        <div className="col-span-12 text-left text-xl">기본조건</div>
        <div className="col-span-3 text-left">
          <div>투자 원금</div>
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
        <div className="col-span-4 flex text-left gap-2">
          <div>
            <label htmlFor="start_at" className="fw-bold ms-1">
              시작일
            </label>
            <input
              id="start_at"
              name="start_at"
              type="date"
              className="h-8 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block sm:text-sm border border-gray-300 rounded-md"
            ></input>
          </div>
          <div>
            <label htmlFor="start_at" className="fw-bold ms-1">
              종료일
            </label>
            <input
              id="end_at"
              name="end_at"
              type="date"
              className="h-8 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block sm:text-sm border border-gray-300 rounded-md"
            ></input>
          </div>
        </div>

        <div className="col-span-2 text-left">
          <div>수수료</div>
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
        <div className="col-start-1 col-span-3 text-left">
          <div>종목 선택</div>
          <button
            onClick={() => toggleModal()}
            className="mt-1 py-2 px-4 border border-transparent bg-indigo-600 text-white shadow-sm text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            선택
          </button>
        </div>
        <div className="col-span-4 text-left">
          <div>목표 자산</div>
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
          <div>목표 수익률</div>
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
