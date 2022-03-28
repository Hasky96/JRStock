import { useEffect, useState } from "react";
import StrategyConfig from "./StrategyConfig";
import {
  paramDict,
  configDefault,
  parameters,
  getParamDefault,
  paramConstructor,
} from "../../config/backtestConfig";
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
      const paramDefaultConfig = { ...getParamDefault("101") };
      newStrategy.push({
        id: strategyCount,
        strategy: "101",
        weight: configDefault.weight,
        params: { ...paramConstructor, ...paramDefaultConfig },
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

  const handleWeightChange = (e, index) => {
    setValues((state) => {
      const newStrategy = state[`${type}_strategy`].map((obj) => ({
        ...obj,
        params: { ...obj["params"] },
      }));
      newStrategy[index]["weight"] = e.target.value;

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

  const getParamDefaultValue = (i, s, p) => {
    const defaultValue = configDefault["params"][s][p];
    return values[`${type}_strategy`][i]["params"][p] || defaultValue;
  };

  const paintParamInput = (strategy, i) => {
    const params = parameters[strategy];
    return params.map((param, index) => (
      <div key={index} className="flex flex-col col-span-1">
        <label htmlFor={`${i}_${param}`} className="text-gray-500">
          {paramDict[param]}
        </label>
        <input
          id={`${i}_${param}`}
          name={`${i}_${param}`}
          type="number"
          required
          value={getParamDefaultValue(i, strategy, param)}
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
            {i === 0 ? "" : paintDeleteButton(i)}

            <div className="col-span-1 px-5">
              <StrategyConfig
                type={type}
                values={values}
                setValues={setValues}
                index={i}
              />
            </div>
            <div className="col-span-1 grid grid-cols-3 px-6 gap-x-2 gap-y-1 text-xs">
              {paintParamInput(strategies[i]["strategy"], i)}
              <div className="flex flex-col col-span-1">
                <label htmlFor={`${i}_weight`} className="text-gray-500">
                  weight
                </label>
                <input
                  id={`${i}_weight`}
                  name={`${i}_weight`}
                  type="number"
                  required
                  value={
                    values[`${type}_strategy`][i]["weight"] ||
                    configDefault.weight
                  }
                  onChange={(e) => handleWeightChange(e, i)}
                  className="h-8 shadow-sm focus:ring-active focus:border-active mt-1 block sm:text-sm border border-gray-300 rounded-md"
                />
              </div>
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
            value={values[`${type}_standard`] || configDefault.standard}
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
            value={values[`${type}_ratio`] || configDefault.percent}
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
