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
import Tooltip from "../commons/Tooltip";
import Tooltip2 from "../commons/Tooltip2";
import ToolContent from "../commons/ToolContent2";

export default function TradeCondition({
  type,
  name,
  color,
  values,
  setValues,
  handleInputChange,
}) {
  const [strategyId, setStrategyId] = useState(1);
  const [strategyCount, setStrategyCount] = useState(1);
  const [paintSelect, setPaintSelect] = useState([]);

  // 삭제 버튼 클릭 시
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

    setStrategyId((state) => state + 1);
    setStrategyCount((state) => state - 1);
  };

  // 추가 and 버튼 클릭 시
  const handleAndButton = (e) => {
    e.preventDefault();
    setValues((state) => {
      const newStrategy = state[`${type}_strategy`].map((obj) => ({
        ...obj,
        params: { ...obj["params"] },
      }));
      const paramDefaultConfig = { ...getParamDefault("101") };
      newStrategy.push({
        id: strategyId,
        strategy: "101",
        weight: configDefault.weight,
        params: { ...paramConstructor, ...paramDefaultConfig },
      });
      return {
        ...state,
        [`${type}_strategy`]: newStrategy,
      };
    });

    setStrategyId((state) => state + 1);
    setStrategyCount((state) => state + 1);
  };

  // 전략 변수들 (params) input 변경 시
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

  // 전략 점수 변경 시
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

  // 전략 삭제 버튼 그리기
  const paintDeleteButton = (i) => {
    return (
      <div
        onClick={() => handleDeleteButton(values[`${type}_strategy`][i]["id"])}
        className="absolute -left-2 top-7 hover:cursor-pointer"
      >
        <Delete className="fill-active hover:fill-red-700 duration-300" />
      </div>
    );
  };

  // 전략 변수 input form 그리기
  const paintParamInput = (strategy, i) => {
    const params = parameters[strategy];
    return params.map((param, index) => (
      <div key={index} className="flex flex-col col-span-1">
        <label htmlFor={`${type}_${i}_${param}`} className="text-gray-500">
          {paramDict[param]}
        </label>
        <input
          id={`${type}_${i}_${param}`}
          name={`${type}_${i}_${param}`}
          type="number"
          required
          min={param === 2 ? 0 : 1}
          step={param === 2 ? 0.1 : 1}
          value={values[`${type}_strategy`][i]["params"][param]}
          onChange={(e) => handleParamChange(e, i, param)}
          className="h-8 shadow-sm focus:ring-active focus:border-active mt-1 block sm:text-sm border border-gray-300 rounded-md"
        />
      </div>
    ));
  };

  // values 변경 시마다 선택된 전략 다시 그리기
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
                  점수
                </label>
                <input
                  id={`${i}_weight`}
                  name={`${i}_weight`}
                  type="number"
                  required
                  min={1}
                  max={values[`${type}_standard`]}
                  value={values[`${type}_strategy`][i]["weight"]}
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
      <div
        className={`relative col-span-4 text-left text-lg font-semibold cursor-default text-${color}-600`}
      >
        {name} 조건
      </div>
      <div className="col-span-2 text-left px-5">
        <label htmlFor={`${type}_standard`} className="relative pl-1">
          매매 기준 점수
          <Tooltip iPos={"left-[100px] top-0"} cPos={"top-6"}>
            <div className="text-black text-base font-normal">
              {name} 전략들의 세부 설정 점수 총 합계가{" "}
              <strong>매매 기준 점수</strong> 이상일 경우 {name}를 진행합니다.
            </div>
          </Tooltip>
        </label>
        <div className="flex items-center">
          <input
            id={`${type}_standard`}
            name={`${type}_standard`}
            type="number"
            required
            autoComplete="off"
            max={100}
            min={1}
            placeholder="1 ~ 100 "
            defaultValue={configDefault.standard}
            className="h-8 shadow-sm focus:ring-active focus:border-active mt-1 sm:text-sm border border-gray-300 rounded-md"
            onChange={(e) => handleInputChange(e)}
          />
        </div>
      </div>
      <div className="col-span-2 text-left px-5">
        <label htmlFor={`${type}_ratio`} className="pl-1">
          {name} 비율 (%)
        </label>
        <div className="flex items-center">
          <input
            id={`${type}_ratio`}
            name={`${type}_ratio`}
            type="number"
            required
            autoComplete="off"
            max={100}
            min={1}
            defaultValue={configDefault.percent}
            className="h-8 shadow-sm focus:ring-active focus:border-active mt-1 sm:text-sm border border-gray-300 rounded-md"
            onChange={(e) => handleInputChange(e)}
          />
        </div>
      </div>
      <div className="col-span-2 text-left px-5">
        <div className="p-1 border-b cursor-default">{name} 전략</div>
      </div>
      <div className="col-span-2 text-left px-5">
        <div className="p-1 border-b cursor-default">세부 설정</div>
      </div>
      {paintSelect}
      <div className="col-span-4 px-5">
        {strategyCount < 10 ? (
          <button
            type="button"
            onClick={(e) => handleAndButton(e)}
            className="w-full py-1 bg-primary text-white shadow-sm text-sm font-medium rounded-md hover:bg-active duration-300"
          >
            and
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="w-full py-1 bg-active text-white shadow-sm text-sm font-medium rounded-md hover:bg-primary duration-300 cursor-not-allowed"
          >
            전략은 최대 10개까지 사용 가능합니다.
          </button>
        )}
      </div>
    </div>
  );
}
