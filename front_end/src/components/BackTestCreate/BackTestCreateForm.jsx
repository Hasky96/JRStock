import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicCondition from "./BasicCondition";
import TradeCondition from "./TradeCondition";
import { paramConstructor, getParamDefault } from "../../config/backtestConfig";
import "./BackTestCreateForm.css";
import { toast } from "react-toastify";
import { startBacktest } from "../../api/backtest";

export default function BackTestCreateForm() {
  const navigate = useNavigate();
  const valueDefault = {
    commission: 0.015,
    buy_standard: 50,
    buy_ratio: 100,
    sell_standard: 50,
    sell_ratio: 100,
  };

  const [isStockSelected, setIsStockSelected] = useState(false);
  const [values, setValues] = useState({
    ...valueDefault,
    title: "",
    asset: "",
    start_date: "",
    end_date: "",
    company_name: "",
    company_code: "",
    buy_strategy: [
      {
        id: 0,
        strategy: "101",
        weight: 50,
        params: { ...paramConstructor, ...getParamDefault("101") },
      },
    ],
    sell_strategy: [
      {
        id: 0,
        strategy: "101",
        weight: 50,
        params: { ...paramConstructor, ...getParamDefault("101") },
      },
    ],
  });

  const handleInputChange = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;
    handleStateChange(name, value);
  };

  const handleStateChange = (name, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStockSelected) {
      toast.warning("종목을 선택해주세요!");
      return;
    }

    const data = { ...values, asset: values.asset.replace(/,/gi, "") };

    const res = await startBacktest(data).catch((err) =>
      console.log("err: ", err)
    );

    toast.success(
      "백테스트가 성공적으로 시작되었습니다. 설정 기간에 따라 최대 30초 이상 소요됩니다."
    );
    console.log(res);
    if (res.status === 201) {
      navigate(`/backtest/${res.data.id}`);
    }
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
      {/* setIsStockSelected, handleStateChange 는 StockSelectModal 에서 사용 */}
      <BasicCondition
        values={values}
        setIsStockSelected={setIsStockSelected}
        handleInputChange={handleInputChange}
        handleStateChange={handleStateChange}
      />
      <div className="w-full flex flex-col justify-center mt-3 gap-2">
        <TradeCondition
          type="buy"
          name="매수"
          color="red"
          values={values}
          setValues={setValues}
          handleInputChange={handleInputChange}
        />
        <TradeCondition
          type="sell"
          name="매도"
          color="blue"
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
