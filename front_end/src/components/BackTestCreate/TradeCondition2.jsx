import { useEffect, useState } from "react";
import { CheckIcon } from "@heroicons/react/solid";
import FormSelect from "./FormSelect";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TradeCondition({
  type,
  name,
  values,
  handleInputChange,
  handleStateChange,
}) {
  const strategies = {
    1: "이동평균선(MA)",
    2: "이동평균수렴확산지수(MACD)",
    3: "상대적강도지수(RSI)",
    4: "누적평균거래량(OBV)",
  };

  const details = {
    "01": "상향돌파",
    "02": "하향돌파",
    "03": "골든크로스(golden cross)",
    "04": "데드크로스(dead cross)",
    "05": "정배열",
    "06": "역배열",
    "07": "high",
    "08": "low",
  };

  const [currentDetails, setCurrentDetails] = useState(
    Object.fromEntries(Object.entries(details).slice(0, 6))
  );
  const [paintStrategyDetails, setPaintStrategyDetails] = useState([]);

  const handleStrategyChange = (key) => {
    switch (key) {
      case "1":
        setCurrentDetails(
          Object.fromEntries(Object.entries(details).slice(0, 6))
        );
        handleStateChange(`${type}_strategy_detail`, "01");
        break;
      case "2":
        setCurrentDetails(
          Object.fromEntries(Object.entries(details).slice(2, 6))
        );
        handleStateChange(`${type}_strategy_detail`, "03");
        break;
      case "3":
        setCurrentDetails(
          Object.fromEntries(Object.entries(details).slice(-2))
        );
        handleStateChange(`${type}_strategy_detail`, "07");
        break;
      case "4":
        setCurrentDetails(
          Object.fromEntries(Object.entries(details).slice(-2))
        );
        handleStateChange(`${type}_strategy_detail`, "07");
        break;
    }
  };

  const paintStrategies = [];
  for (const [key, value] of Object.entries(strategies)) {
    paintStrategies.push(
      <button
        key={key}
        className={classNames(
          values[`${type}_strategy`] === key
            ? "bg-active text-white"
            : "text-primary",
          "w-full text-left hover:text-white hover:bg-active rounded p-2 duration-300 flex justify-between"
        )}
        onClick={() => {
          handleStrategyChange(key);
          handleStateChange(`${type}_strategy`, key);
        }}
      >
        {value}
      </button>
    );
  }

  useEffect(() => {
    const paintStrategyDetails = [];
    for (const [key, value] of Object.entries(currentDetails)) {
      paintStrategyDetails.push(
        <button
          key={key}
          className={classNames(
            values[`${type}_strategy_detail`] === key
              ? "bg-active text-white"
              : "text-primary",
            "w-full text-left hover:text-white hover:bg-active rounded p-2 duration-300"
          )}
          onClick={() => {
            handleStateChange(`${type}_strategy_detail`, key);
          }}
        >
          {value}
        </button>
      );
    }

    setPaintStrategyDetails(paintStrategyDetails);
  }, [values, currentDetails]);

  return (
    <div className="w-full grid grid-cols-2 border-0 border-b-1 border-gray-200 shadow-lg rounded text-center p-3 gap-2">
      <div className="col-span-2 text-left text-xl">{name} 조건</div>
      <div className="col-span-2 text-left px-5">
        <label htmlFor="asset">매매 기준 점수</label>
        <div className="flex items-center">
          <input
            id="buy_standard"
            name="buy_standard"
            type="number"
            className="h-8 shadow-sm focus:ring-active focus:border-active mt-1 sm:text-sm border border-gray-300 rounded-md"
            autoComplete="off"
            onChange={(e) => handleInputChange(e)}
          />
        </div>
      </div>
      <div className="col-span-1 text-left p-5 pt-0">
        <div className="mb-3 p-1 border-b">{name} 전략</div>
        <div className="flex flex-col w-60">{paintStrategies}</div>
      </div>
      <div className="col-span-1 text-left p-5 pt-0">
        <div className="mb-3 p-1 border-b">세부 전략</div>
        <div className="flex flex-col w-60">{paintStrategyDetails}</div>
      </div>
    </div>
  );
}

{
  {
    /* <FormSelect
    name={`${type}_condition`}
    options={Object.values(maOptions)}
    handleInputChange={handleInputChange}
    handleStateChange={handleStateChange}
  /> */
  }

  /* <label htmlFor="buy_strategy">전략</label>
<div className="flex items-center">
  <select
    id="buy_strategy"
    name="buy_strategy"
    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    autoComplete="off"
    onChange={(e) => handleInputChange(e)}
  >
    <option>이동평균선</option>
    <option>일목균형표</option>
    <option>볼린저밴드</option>
    <option>4</option>
  </select>
</div> */
}
