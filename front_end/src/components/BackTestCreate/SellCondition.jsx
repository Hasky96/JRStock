import { toHaveFormValues } from "@testing-library/jest-dom/dist/matchers";
import FormSelect from "./FormSelect";

export default function SellCondition({
  handleInputChange,
  handleStateChange,
}) {
  const strategyOptions = [
    "MA(이동평균선)",
    "MACD(이동평균 수렴확산 지수)",
    "볼린저밴드",
    "일목균형표",
  ];

  const strategyDetailOptions = ["5일선", "20일선", "60일선", ,];

  return (
    <div className="w-1/2 grid grid-cols-2 border-0 border-b-1 border-gray-200 shadow-lg rounded text-center p-3 gap-2">
      <div className="col-span-2 text-left text-lg">매도 조건</div>
      <div className="col-span-2 xl:col-span-1 text-left">
        매도 전략
        <FormSelect
          name="buy_strategy"
          options={strategyOptions}
          handleInputChange={handleInputChange}
          handleStateChange={handleStateChange}
        />
      </div>
      <div className="col-span-2 xl:col-span-1 text-left">
        세부 전략
        <FormSelect
          name="buy_strategy_detail"
          options={strategyDetailOptions}
          handleInputChange={handleInputChange}
          handleStateChange={handleStateChange}
        />
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
