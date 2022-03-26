/* This example requires Tailwind CSS v2.0+ */
import { useEffect, useState } from "react";
import { ReactComponent as Dropdown } from "../../assets/dropdown.svg";
import { ReactComponent as DropdownRight } from "../../assets/dropdown_right.svg";

export default function StrategyConfig({ values, setValues, type, index }) {
  const strategies = {
    1: "이동평균선(MA)",
    2: "이동평균수렴확산지수(MACD)",
    3: "상대적강도지수(RSI)",
    4: "누적평균거래량(OBV)",
  };

  const details = {
    1: "상향돌파",
    2: "하향돌파",
    3: "골든크로스(golden cross)",
    4: "데드크로스(dead cross)",
    5: "정배열",
    6: "역배열",
    7: "high",
    8: "low",
  };

  const options = [
    {
      1: 1,
      2: [1, 2, 3, 4, 5, 6],
    },
    {
      1: 2,
      2: [3, 4, 5, 6],
    },
    {
      1: 3,
      2: [7, 8],
    },
    {
      1: 4,
      2: [7, 8],
    },
  ];

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
      const newStrategy = state[`${type}_strategy`];
      newStrategy[index]["strategy"] = strategy + "0" + option;
      state[`${type}_strategy`] = newStrategy;
      return state;
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
  }, [values[`${type}_strategy`]]);

  const paintLevelOne = options.map((option, index) => (
    <li key={index} className="rounded-sm relative px-3 py-1 hover:bg-gray-100">
      <button className="w-full text-left flex items-center outline-none focus:outline-none">
        <span className="pr-1 flex-1">{strategies[option[1]]}</span>
        <span className="mr-auto">
          <DropdownRight />
        </span>
      </button>
      <ul
        className="w-full bg-white border rounded-sm absolute top-0 right-1 
transition duration-300 ease-in-out origin-top-left
min-w-32
"
      >
        {paintLevelTwo(option[1], option[2])}
      </ul>
    </li>
  ));

  return (
    <div className="group relative">
      <button className="w-full outline-none focus:outline-none border px-3 py-1 bg-white rounded-sm flex items-center min-w-32">
        <div className="pr-1 flex flex-col flex-1 justify-center">
          <div className="pr-1 font-semibold flex-1">{strategy}</div>
          <div className="pr-1 font-semibold text-sm flex-1">{detail}</div>
        </div>
        <div>
          <Dropdown />
        </div>
      </button>
      <ul
        className="w-full bg-white border rounded-sm transform scale-0 group-hover:scale-100 absolute 
  transition duration-300 ease-in-out origin-top min-w-32 z-50"
      >
        {paintLevelOne}
      </ul>
    </div>
  );
}
