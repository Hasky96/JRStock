import { useEffect, useState } from "react";
import styles from "./BasicCondition.module.css";
import StockSelectModal from "./StockSelectModal";

export default function BasicCondition({
  handleInputChange,
  handleStateChange,
  values,
}) {
  const [isShowModal, setShowModal] = useState(false);
  const [profitRatio, setProfitRatio] = useState(0);
  const [assetErrorMessage, setAssetErrorMessage] = useState("");
  const toggleModal = () => {
    setShowModal((cur) => !cur);
  };

  const handleStockSelectButton = (e) => {
    e.preventDefault();
    toggleModal();
  };

  useEffect(() => {
    setProfitRatio(calProfit(values.asset, values.goal_asset));
  }, [values]);

  const calProfit = (asset, goal) => {
    if (parseInt(asset) && parseInt(goal)) {
      // setAssetErrorMessage("");
      return parseInt(goal / asset) * 100;
    }

    // setAssetErrorMessage("연금술은 안돼요!");
    return 0;
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
      <div className="w-full h-30 grid grid-cols-12 border-0 border-b-1 border-gray-200 shadow rounded text-center mt-3 p-3 gap-y-5">
        <div className="col-span-12 text-left text-xl">기본조건</div>
        <div className="col-span-6 xl:col-span-4 text-left">
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
        <div className="-ml-12 xl:ml-0 col-span-6 xl:col-span-5 flex text-left gap-2">
          <div>
            <label htmlFor="start_date">시작일</label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              required
              onChange={(e) => handleInputChange(e)}
              className="h-8 shadow-sm focus:ring-active focus:border-active mt-1 block sm:text-sm border border-gray-300 rounded-md"
            ></input>
          </div>
          <div>
            <label htmlFor="end_date">종료일</label>
            <input
              id="end_date"
              name="end_date"
              type="date"
              required
              onChange={(e) => handleInputChange(e)}
              className="h-8 shadow-sm focus:ring-active focus:border-active mt-1 block sm:text-sm border border-gray-300 rounded-md"
            ></input>
          </div>
        </div>

        <div className="col-span-6 xl:col-span-4 text-left">
          <label htmlFor="asset">투자 원금 (만원)</label>
          <div className="flex items-center">
            <input
              id="asset"
              name="asset"
              type="number"
              required
              autoComplete="off"
              className="h-8 shadow-sm focus:ring-active focus:border-active mt-1 sm:text-sm border border-gray-300 rounded-md"
              onChange={(e) => handleInputChange(e)}
            />
          </div>
        </div>
        <div className="-ml-12 xl:ml-0 col-span-6 xl:col-span-4 text-left">
          <label htmlFor="goal_asset">목표 자산 (만원)</label>
          <div className="flex items-center">
            <input
              id="goal_asset"
              name="goal_asset"
              type="number"
              required
              autoComplete="off"
              className="h-8 shadow-sm focus:ring-active focus:border-active mt-1 sm:text-sm border border-gray-300 rounded-md"
              onChange={(e) => handleInputChange(e)}
            />
          </div>
        </div>

        <div className="relative col-span-6 xl:col-span-2 text-left text-gray-500">
          <p className="absolute left-32 top-2 text-xs">{assetErrorMessage}</p>
          <label htmlFor="goal_profit">목표 수익률 (%)</label>
          <div className="flex items-center">
            <input
              id="goal_profit"
              name="goal_profit"
              type="number"
              value={profitRatio}
              disabled
              autoComplete="off"
              className="h-8 shadow-sm focus:ring-active focus:border-active mt-1 sm:text-sm border border-gray-300 rounded-md"
              onChange={(e) => handleInputChange(e)}
            />
          </div>
        </div>
        <div className="-ml-12 xl:ml-0 col-span-6 xl:col-span-3 text-left">
          <label htmlFor="commission">수수료 (%)</label>
          <div className="flex items-center">
            <input
              id="commission"
              name="commission"
              type="number"
              required
              autoComplete="off"
              step="0.01"
              className="h-8 shadow-sm focus:ring-active focus:border-active mt-1 sm:text-sm border border-gray-300 rounded-md"
              onChange={(e) => handleInputChange(e)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
