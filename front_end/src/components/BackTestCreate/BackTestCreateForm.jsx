import { useState } from "react";
import BasicCondition from "./BasicCondition";
import TradeCondition from "./TradeCondition";
import "./BackTestCreateForm.css";

export default function BackTestCreateForm() {
  const [values, setValues] = useState({
    title: "",
    start_at: "",
    end_at: "",
    company_name: "",
    company_code: "",
    commission: "",
    stock: "",
    goal: "",
    buy_strategy: "",
    buy_strategy_detail: "",
    sell_strategy: "",
    sell_strategy_detail: "",
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

  return (
    <div className="bactestcreateform-container mx-auto flex flex-col justify-center items-center">
      <BasicCondition
        values={values}
        handleInputChange={handleInputChange}
        handleStateChange={handleStateChange}
      />
      <div className="w-full flex justify-center mt-3 gap-2">
        <TradeCondition
          type="매수"
          handleInputChange={handleInputChange}
          handleStateChange={handleStateChange}
        />
        <TradeCondition
          type="매도"
          handleInputChange={handleInputChange}
          handleStateChange={handleStateChange}
        />
      </div>
      <div className="w-full flex justify-center mt-3">
        <button className="w-32 mt-1 py-2 px-4 border border-transparent bg-primary text-white shadow-sm text-sm font-medium rounded-md hover:bg-active duration-300">
          백테스트 시작
        </button>
      </div>
    </div>
  );
}
