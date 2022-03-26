import { useState } from "react";
import BasicCondition from "./BasicCondition";
import TradeCondition from "./TradeCondition";
import "./BackTestCreateForm.css";

export default function BackTestCreateForm() {
  const [values, setValues] = useState({
    title: "",
    start_date: "",
    end_date: "",
    company_name: "",
    company_code: "",
    commission: "",
    stock: "",
    goal: "",
    standard: "",
    buy_strategy: [
      {
        id: "0",
        strategy: "101",
        parameters: "",
      },
    ],
    sell_strategy: [
      {
        id: "0",
        strategy: "101",
        parameters: "",
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

  const types = {
    buy: "매수",
    sell: "매도",
  };
  return (
    <div className="bactestcreateform-container mx-auto flex flex-col justify-center items-center">
      <BasicCondition
        values={values}
        handleInputChange={handleInputChange}
        handleStateChange={handleStateChange}
      />
      <div className="w-full flex flex-col xl:flex-row justify-center mt-3 gap-2">
        <TradeCondition
          type="buy"
          name="매수"
          values={values}
          setValues={setValues}
        />
        <TradeCondition
          type="sell"
          name="매도"
          values={values}
          setValues={setValues}
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
