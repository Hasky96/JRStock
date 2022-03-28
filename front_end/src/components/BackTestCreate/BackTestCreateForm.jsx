import { useState } from "react";
import BasicCondition from "./BasicCondition";
import TradeCondition from "./TradeCondition";
import "./BackTestCreateForm.css";

export default function BackTestCreateForm() {
  const [values, setValues] = useState({
    title: "",
    asset: "",
    start_date: "",
    end_date: "",
    company_name: "",
    company_code: "",
    commission: "",
    asset: "",
    goal_asset: "",
    buy_standard: "",
    buy_ratio: "",
    sell_standard: "",
    sell_ratio: "",
    buy_strategy: [
      {
        id: 0,
        strategy: "101",
        params: { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "" },
      },
    ],
    sell_strategy: [
      {
        id: 0,
        strategy: "101",
        params: { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "" },
      },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleStateChange(name, value);
  };

  const handleStateChange = (name, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("--------------------");
    console.log("values: ");
    console.log(values);
  };

  const types = {
    buy: "매수",
    sell: "매도",
  };
  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="bactestcreateform-container mx-auto flex flex-col justify-center items-center"
    >
      {/* 기본 조건 handleStateChange 는 StockSelectModal 에서 사용 */}
      <BasicCondition
        values={values}
        handleInputChange={handleInputChange}
        handleStateChange={handleStateChange}
      />
      <div className="w-full flex flex-col justify-center mt-3 gap-2">
        <TradeCondition
          type="buy"
          name="매수"
          values={values}
          setValues={setValues}
          handleInputChange={handleInputChange}
        />
        <TradeCondition
          type="sell"
          name="매도"
          values={values}
          setValues={setValues}
          handleInputChange={handleInputChange}
        />
      </div>
      <div className="w-full flex justify-center mt-3">
        <button className="w-32 mt-1 py-2 px-4 border border-transparent bg-primary text-white shadow-sm text-sm font-medium rounded-md hover:bg-active duration-300">
          백테스트 시작
        </button>
      </div>
    </form>
  );
}
