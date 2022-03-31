/* This example requires Tailwind CSS v2.0+ */
import { useEffect, useState } from "react";
import {
  strategies,
  details,
  options,
  getParamDefault,
  paramConstructor,
} from "../../config/backtestConfig";
import { ReactComponent as Dropdown } from "../../assets/dropdown.svg";
import { ReactComponent as DropdownRight } from "../../assets/dropdown_right.svg";
import Tooltip from "../commons/Tooltip";
import ToolContent from "../commons/ToolContent2";

export default function StrategyConfig({ values, setValues, type, index }) {
  const [strategy, setStrategy] = useState(
    values[`${type}_strategy`][index]["strategy"] &&
      strategies[values[`${type}_strategy`][index]["strategy"].split("0")[0]]
  );
  const [detail, setDetail] = useState(
    values[`${type}_strategy`][index]["strategy"] &&
      details[values[`${type}_strategy`][index]["strategy"].split("0")[1]]
  );

  const updateStrategyDetail = () => {
    setStrategy(
      strategies[values[`${type}_strategy`][index]["strategy"].split("0")[0]]
    );
    setDetail(
      details[values[`${type}_strategy`][index]["strategy"].split("0")[1]]
    );
  };

  const handleDetailClick = (strategy, option) => {
    setValues((state) => {
      const newStrategy = state[`${type}_strategy`].map((obj) => ({
        ...obj,
        params: { ...obj["params"] },
      }));
      const strategyCode = strategy + "0" + option;
      newStrategy[index]["strategy"] = strategyCode;
      const paramDefaultConfig = { ...getParamDefault(strategyCode) };
      newStrategy[index]["params"] = {
        ...paramConstructor,
        ...paramDefaultConfig,
      };
      return {
        ...state,
        [`${type}_strategy`]: newStrategy,
      };
    });
    updateStrategyDetail();
  };

  const paintLevelTwo = (strategy, options) => {
    return options.map((option, index) => (
      <li
        onClick={() => handleDetailClick(strategy, option)}
        key={index}
        className="px-3 py-1 hover:bg-gray-100 hover:cursor-pointer"
      >
        {details[option]}
      </li>
    ));
  };

  useEffect(() => {
    updateStrategyDetail();
  }, [values]);

  const paintLevelOne = options.map((option, index) => (
    <li key={index} className="rounded-sm relative px-3 py-1 hover:bg-gray-100">
      <button
        type="button"
        className="w-full text-left flex items-center outline-none focus:outline-none"
      >
        <span className="pr-1 flex-1">{strategies[option[1]]}</span>
        <span className="mr-auto">
          <DropdownRight />
        </span>
      </button>
      <ul
        className="w-full bg-white border rounded-sm absolute top-0 right-1 
transition duration-300 ease-in-out origin-top-left z-[100]
min-w-32
"
      >
        {paintLevelTwo(option[1], option[2])}
      </ul>
    </li>
  ));

  return (
    <div className="group relative">
      <button
        type="button"
        className="w-full outline-none focus:outline-none border px-3 py-1 bg-white rounded-sm flex items-center min-w-32"
      >
        <div className="pr-1 flex flex-col flex-1 justify-center">
          <div className="pr-1 m-auto font-semibold flex-1">
            <span className="relative">
              <Tooltip iPos={"-right-[2px] top-0"} cPos={"top-6"}>
                <ToolContent
                  sId={values[`${type}_strategy`][index]["strategy"]}
                ></ToolContent>
              </Tooltip>
              {strategy}
            </span>
          </div>
          <div className="pr-1 font-semibold text-sm text-gray-500 flex-1 relative">
            {detail}
          </div>
        </div>
        <div>
          <Dropdown />
        </div>
      </button>
      <ul
        className="w-full bg-white border rounded-sm transform scale-0 group-hover:scale-100 absolute 
  transition duration-300 ease-in-out origin-top min-w-32 z-[100]"
      >
        {paintLevelOne}
      </ul>
    </div>
  );
}
