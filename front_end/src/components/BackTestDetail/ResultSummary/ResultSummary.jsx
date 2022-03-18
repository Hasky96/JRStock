import { useState } from "react";
import { ProfitLineChart } from "./ProfitLineChart";
import { PortfolioChart } from "../Portfolio/PortfolioChart";
// import { PortfolioProfitChart } from "./PortfolioProfitChart";

import {
  dayData,
  weekData,
  monthData,
  yearData,
  dayData2,
  weekData2,
  monthData2,
  yearData2,
  assetData,
  profitData,
} from "../data.js";
import "./ResultSummary.css";

export default function ResultSummary() {
  const portfolio = ["삼성전자", "SK하이닉스", "네이버"];
  const [data1, setData1] = useState(dayData);
  const [data2, setData2] = useState(dayData2);
  const [period, setPeriod] = useState("1D");

  var seriesesData = new Map([
    ["1D", dayData],
    ["1W", weekData],
    ["1M", monthData],
    ["1Y", yearData],
  ]);

  var seriesesData2 = new Map([
    ["1D", dayData2],
    ["1W", weekData2],
    ["1M", monthData2],
    ["1Y", yearData2],
  ]);

  const intervals = ["1D", "1W", "1M", "1Y"];
  const paintSwitcher = intervals.map((el, idx) => (
    <button
      key={idx}
      onClick={(e) => {
        e.preventDefault();
        setData1(seriesesData.get(e.target.innerText));
        setData2(seriesesData2.get(e.target.innerText));
        setPeriod(e.target.innerText);
      }}
      className={
        period === el ? "switcher-item switcher-active-item" : "switcher-item"
      }
    >
      {el}
    </button>
  ));

  const paintAssets = assetData.map((result, index) => (
    <div key={index} className="col-span-1 mx-auto my-auto">
      <h2 className="text-xs text-gray-500">{result.key}</h2>
      <p>{result.value}</p>
    </div>
  ));

  const paintProfits = profitData.map((result, index) => (
    <div key={index} className="col-span-1 mx-auto my-auto">
      <h2 className="text-xs text-gray-500">{result.key}</h2>
      <p>{result.value}</p>
    </div>
  ));

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="flex flex-col xl:flex-row gap-3">
        <div className="relative h-30 grid grid-cols-5 border-0 border-b-1 border-gray-200 shadow rounded gap-2 text-center p-3">
          <div className="col-span-5 text-left text-lg">운용자산</div>
          {paintAssets}
        </div>
        <div className="relative h-30 grid grid-cols-5 border-0 border-b-1 border-gray-200 shadow rounded gap-2 text-center p-3">
          <div className="col-span-5 text-left text-lg">수익률</div>
          {paintProfits}
        </div>
      </div>

      <div className="flex flex-col 2xl:flex-row items-center gap-3">
        <div className="rounded shadow-lg p-3 mt-5">
          <div className="profit-chart-container text-lg">
            <div>자산 운용 차트</div>
            <ProfitLineChart marketData={data1} testData={data2} />
            <div className="switcher">{paintSwitcher}</div>
          </div>
        </div>
        <div className="rounded shadow-lg p-3 mt-5">
          <div className="portfolio-chart-container text-lg">
            <div>포트폴리오 구성</div>
            <PortfolioChart labels={portfolio} />
          </div>
        </div>
      </div>
    </div>
  );
}

// 기간
