import { useEffect, useState } from "react";
import { paramDict, parameters } from "../../../config/backtestConfig";

export default function TradeStrategy({ condition, name, color, strategies }) {
  const paintParamInput = (strategy, i) => {
    const params = parameters[strategy];

    return params.map((param, index) => (
      <div key={index} className="flex flex-col w-20 text-xs">
        <label htmlFor={`${name}_${i}_${param}`} className="text-gray-500">
          {paramDict[param]}
        </label>
        <input
          id={`${name}_${i}_${param}`}
          name={`${name}_${i}_${param}`}
          type="text"
          disabled
          min={1}
          value={strategies[i]["params"][param]}
          className="h-8 shadow-sm focus:ring-active focus:border-active mt-1 block sm:text-sm border border-gray-300 rounded-md"
        />
      </div>
    ));
  };

  const paintStrategies = strategies.map((s, index) => (
    <div
      key={index}
      className="relative grid grid-cols-2 text-left px-3 py-5 bg-white rounded-sm min-w-32 gap-10"
    >
      <div className="flex flex-col text-center">
        <div className="font-semibold">{s.strategy}</div>
        <div className="font-semibold text-sm text-gray-500">
          {s.strategyDetail}
        </div>
      </div>
      <div className="flex gap-2 ml-5">
        {paintParamInput(s.strategyId, index)}
      </div>
    </div>
  ));

  return (
    <div className="w-full grid grid-cols-4 place-content-start border-0 border-b-1 border-gray-200 shadow-lg rounded text-center p-3 gap-2">
      <div
        className={`col-span-4 text-left text-lg font-semibold cursor-default text-${color}-600`}
      >
        {name} 조건
      </div>
      <div className="col-span-2 text-left px-5">
        <label className="pl-1">매매 기준 점수</label>
        <div className="flex items-center">
          <input
            type="number"
            required
            autoComplete="off"
            disabled
            value={condition.standard}
            className="h-8 shadow-sm focus:ring-active focus:border-active mt-1 sm:text-sm border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="col-span-2 text-left px-5">
        <label className="pl-1">매매 비율 (%)</label>
        <div className="flex items-center">
          <input
            type="number"
            required
            autoComplete="off"
            disabled
            value={condition.ratio}
            className="h-8 shadow-sm focus:ring-active focus:border-active mt-1 sm:text-sm border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="col-span-2 text-left px-5">
        <div className="p-1 border-b cursor-default">{name} 전략</div>
      </div>
      <div className="col-span-2 text-left px-5">
        <div className="p-1 border-b cursor-default">세부 설정</div>
      </div>
      <div className="col-span-4">{paintStrategies}</div>
    </div>
  );
}
// const [paintStrategies, setPaintStrategies] = useState([]);

// useEffect(() => {
//   const newPaintStrategies = strategy.map((s, index) => {
//     <div
//       key={index}
//       className="w-full outline-none focus:outline-none border px-3 py-1 bg-white rounded-sm flex items-center min-w-32"
//     >
//       {s.strategy}
//     </div>;
//   });
//   setPaintStrategies(newPaintStrategies);
// }, [strategy]);
