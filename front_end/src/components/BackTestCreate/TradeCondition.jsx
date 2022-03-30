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
import ToolContent1 from "../commons/ToolContent1";

const contents = [
  {
    // title: "이동평균수렴확산지수\n(골든크로스)",
    title: "이동평균선(상향돌파)",
    src: "ma_high_graph.png",
    alt: "content1",
    content:
      "이동평균선은 일정기간 동안의 주가를 산술 평균한 값이다. 주식에서는 주로 장기(120일), 중기(60일), 단기(5, 20일)의 이동평균선이 있다. 종가 기준으로 날짜를 합산하여 평균값을 구한다./n" +
      "period: 이동평균선 기간 변수\nerr: 이동평균선 허용 오차 범위 변수\nweight: 가중치 변수",
  },
];

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
        className="absolute -left-2 top-4 hover:cursor-pointer"
      >
        <Delete className="fill-active hover:fill-red-700 duration-300" />
      </div>
    );
  };

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
          min={1}
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
            {i === 0 ? "" : paintDeleteButton(i)}
            <Tooltip iPos={"left-5 top-7"} cPos={"top-6"}>
              <ToolContent1 contents={contents}></ToolContent1>
            </Tooltip>
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
        className={`col-span-4 text-left text-lg font-semibold cursor-default text-${color}-600`}
      >
        {name} 조건
      </div>
      <div className="col-span-2 text-left px-5">
        <label htmlFor={`${type}_standard`} className="pl-1">
          매매 기준 점수
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
          매매 비율 (%)
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
