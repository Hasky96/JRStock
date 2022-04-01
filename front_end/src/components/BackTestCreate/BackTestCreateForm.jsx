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
    commission: 0.15,
    buy_standard: 10,
    buy_ratio: 100,
    sell_standard: 10,
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
        weight: 10,
        params: { ...paramConstructor, ...getParamDefault("101") },
      },
    ],
    sell_strategy: [
      {
        id: 0,
        strategy: "101",
        weight: 10,
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
    const isConfirm = window.confirm("백테스트를 신청하시겠습니까?");
    if (!isConfirm) {
      toast.error("백테스트 신청 취소");
      return;
    }

    if (!isStockSelected) {
      toast.warning("종목을 선택해주세요!");
      return;
    }

    const data = { ...values, asset: values.asset.replace(/,/gi, "") };
    const res = await startBacktest(data).catch((err) => {
      if (err.response) {
        return err.response;
      }
    });

    if (res.status === 201) {
      toast.success(
        "백테스트가 성공적으로 시작되었습니다. 설정 기간에 따라 최대 30초 이상 소요됩니다."
      );
      navigate(`/backtest/`);
    } else if (res.statue === 403) {
      toast.error(
        "아직 완료되지 않은 회원님의 백테스트가 존재합니다. 백테스트 완료 후 다시 시도해주세요."
      );
    } else {
      toast.error("백테스트 신청에 실패하였습니다.");
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
