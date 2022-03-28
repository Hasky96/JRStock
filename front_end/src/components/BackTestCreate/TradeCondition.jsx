import { useEffect, useState } from "react";
import StrategyConfig from "./StrategyConfig";
import { ReactComponent as Delete } from "../../assets/remove_circle.svg";

export default function TradeCondition({
  type,
  name,
  values,
  setValues,
  handleInputChange,
}) {
  const [strategyCount, setStrategyCount] = useState(1);
  const [paintSelect, setPaintSelect] = useState([]);

  const paramDict = {
    1: "period",
    2: "err",
    3: "weight",
    4: "short_period",
    5: "long_period",
    6: "signal",
    7: "index",
  };

  const parameters = {
    101: [1, 2, 3],
    102: [1, 2, 3],
    103: [4, 5, 3],
    104: [4, 5, 3],
    105: [4, 5, 3],
    106: [4, 5, 3],
    203: [4, 5, 6, 3],
    204: [4, 5, 6, 3],
    205: [4, 5, 6, 3],
    206: [4, 5, 6, 3],
    307: [1, 7, 3],
    308: [1, 7, 3],
    407: [1, 3],
    408: [1, 3],
  };

  const handleDeleteButton = (target) => {
    setValues((state) => {
      const newStrategy = state[`${type}_strategy`].map((obj) => ({ ...obj }));
      return {
        ...state,
        [`${type}_strategy`]: newStrategy.filter(
          (strategy) => strategy.id !== target
        ),
      };
    });

    setStrategyCount((state) => state + 1);
  };

  const handleAndButton = (e) => {
    e.preventDefault();
    setValues((state) => {
      const newStrategy = state[`${type}_strategy`].map((obj) => ({
        ...obj,
        params: { ...obj["params"] },
      }));
      newStrategy.push({
        id: strategyCount,
        strategy: "101",
        params: { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "" },
      });
      return {
        ...state,
        [`${type}_strategy`]: newStrategy,
      };
    });

    setStrategyCount((state) => state + 1);
  };

  const handleParamChange = (e, index, param) => {
    setValues((state) => {
      const newStrategy = state[`${type}_strategy`].map((obj) => ({
        ...obj,
        params: { ...obj["params"] },
      }));
      newStrategy[index]["params"][param] = e.target.value;

      return {
        ...state,
        [`${type}_strategy`]: newStrategy,
      };
    });
  };

  const paintDeleteButton = (i) => {
    return (
      <div
        onClick={() => handleDeleteButton(values[`${type}_strategy`][i]["id"])}
        className="absolute -left-2 top-3 hover:cursor-pointer"
      >
        <Delete className="hover:fill-active duration-300" />
      </div>
    );
  };

  const paintParamInput = (strategy, i) => {
    const params = parameters[strategy];
    return params.map((param, index) => (
      <div key={index} className="flex flex-col col-span-1">
        <label htmlFor={`${i}_${param}`}>{paramDict[param]}</label>
        <input
          id={`${i}_${param}`}
          name={`${i}_${param}`}
          type="number"
          required
          value={values[`${type}_strategy`][i]["params"][param]}
          onChange={(e) => handleParamChange(e, i, param)}
          className="h-8 shadow-sm focus:ring-active focus:border-active mt-1 block sm:text-sm border border-gray-300 rounded-md"
        />
      </div>
    ));
  };

  useEffect(() => {
    const paintSelect = [];
    const strategies = values[`${type}_strategy`]; // strategies: Array
    for (let i = 0; i < strategies.length; i++) {
      paintSelect.push(
        <div key={i} className="col-span-4">
          <div className="relative grid grid-cols-2 text-left pt-0">
            {/* <div className="absolute left-0 top-2">{i + 1}.</div> */}
            {i === 0 ? "" : paintDeleteButton(i)}

            <div className="col-span-1 px-5">
              <StrategyConfig
                type={type}
                values={values}
                setValues={setValues}
                index={i}
              />
            </div>
            <div className="col-span-1 grid grid-cols-3 px-5 gap-x-2 gap-y-1 text-xs text-gray-500">
              {paintParamInput(strategies[i]["strategy"], i)}
            </div>
          </div>
          {i === strategies.length - 1 ? "" : <div className="">AND</div>}
        </div>
      );
    }

    setPaintSelect(paintSelect);
  }, [values]);

  return (
    <div className="w-full grid grid-cols-4 place-content-start border-0 border-b-1 border-gray-200 shadow-lg rounded text-center p-3 gap-2">
      <div className="col-span-4 text-left text-lg">{name} 조건</div>
      <div className="col-span-2 text-left px-5">
        <label htmlFor="asset" className="pl-1">
          매매 기준 점수
        </label>
        <div className="flex items-center">
          <input
            id={`${type}_standard`}
            name={`${type}_standard`}
            type="number"
            required
            autoComplete="off"
            className="h-8 shadow-sm focus:ring-active focus:border-active mt-1 sm:text-sm border border-gray-300 rounded-md"
            onChange={(e) => handleInputChange(e)}
          />
        </div>
      </div>
      <div className="col-span-2 text-left px-5">
        <label htmlFor="asset" className="pl-1">
          매매 비율 (%)
        </label>
        <div className="flex items-center">
          <input
            id={`${type}_ratio`}
            name={`${type}_ratio`}
            type="number"
            required
            autoComplete="off"
            className="h-8 shadow-sm focus:ring-active focus:border-active mt-1 sm:text-sm border border-gray-300 rounded-md"
            onChange={(e) => handleInputChange(e)}
          />
        </div>
      </div>
      <div className="col-span-2 text-left px-5">
        <div className="p-1 border-b">{name} 전략</div>
      </div>
      <div className="col-span-2 text-left px-5">
        <div className="p-1 border-b">세부 설정</div>
      </div>
      {paintSelect}
      <div className="col-span-4 px-5">
        <button
          type="button"
          onClick={(e) => handleAndButton(e)}
          className="w-full py-1 bg-primary text-white shadow-sm text-sm font-medium rounded-md hover:bg-active duration-300"
        >
          and
        </button>
      </div>
    </div>
  );
}

{
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
