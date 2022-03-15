import { useState } from "react";
import { ProfitChart } from "./ProfitChart";
import { PortfolioChart } from "./PortfolioChart";
import { PortfolioProfitChart } from "./PortfolioProfitChart";

import { dayData2, weekData2, monthData2, yearData2 } from "./data.js";
import "./ResultSummary.css";

import {
  dayData,
  weekData,
  monthData,
  yearData,
} from "../../../assets/marketChartTestData";

export default function ResultSummary() {
  const [portfolio, setPortfolio] = useState([
    "삼성전자",
    "SK하이닉스",
    "네이버",
  ]);
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

  const btnList = () => {
    const list = [];
    const intervals = ["1D", "1W", "1M", "1Y"];
    intervals.forEach((el, idx) => {
      list.push(
        <button
          key={idx}
          onClick={(e) => {
            e.preventDefault();
            setData1(seriesesData.get(e.target.innerText));
            setData2(seriesesData2.get(e.target.innerText));
            setPeriod(e.target.innerText);
          }}
          className={
            period === el
              ? "switcher-item switcher-active-item"
              : "switcher-item"
          }
        >
          {el}
        </button>
      );
    });
    return list;
  };

  const assetData = [
    {
      key: "투자 원금(만원)",
      value: "300",
    },
    {
      key: "총 손익(만원)",
      value: "+1996",
    },
    {
      key: "최종 자산(만원)",
      value: "2296",
    },
  ];

  const profitData = [
    {
      key: "누적 수익률",
      value: "+789%",
    },
    {
      key: "일평균 수익률",
      value: "+1.7%",
    },
    {
      key: "연이율(CAGR)",
      value: "+24.8%",
    },
    {
      key: "시장초과 수익률",
      value: "+543%",
    },
    {
      key: "최대 손실폭(MDD)",
      value: "-19%",
    },
  ];

  const paintAssets = assetData.map((result, index) => (
    <div key={index} className="col-span-1 mx-auto my-auto">
      <h2 className="text-xs ">{result.key}</h2>
      <p>{result.value}</p>
    </div>
  ));

  const paintProfits = profitData.map((result, index) => (
    <div key={index} className="col-span-1 mx-auto my-auto">
      <h2 className="text-xs">{result.key}</h2>
      <p>{result.value}</p>
    </div>
  ));

  // const paintSummaryData = summaryData.map((result, index) => (
  //   <div key={index} className="col-span-1 mx-auto my-auto">
  //     <h2 className="text-xs">{result.key}</h2>
  //     <p>{result.value}</p>
  //   </div>
  // ));

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="flex flex-col xl:flex-row gap-3">
        <div className="relative h-30 grid grid-cols-5 border-0 border-b-1 border-gray-200 shadow rounded gap-2 text-center p-3">
          <div className="col-span-5 text-left text-lg">운용자산</div>
          <div className="col-span-2 mx-auto my-auto">
            <h2 className="text-xs">기간</h2>
            <p>{"2012-01-01 ~ 2022-03-15"}</p>
          </div>
          {paintAssets}
        </div>
        <div className="relative h-30 grid grid-cols-5 border-0 border-b-1 border-gray-200 shadow rounded gap-2 text-center p-3">
          <div className="col-span-5 text-left text-lg">수익률</div>
          {paintProfits}
        </div>
      </div>

      <div className="xl:flex items-center gap-3">
        <div className="rounded shadow-lg p-3 mt-5">
          <div className="profit-chart-container text-lg">
            <div>자산 운용 차트</div>
            <ProfitChart marketData={data1} testData={data2} />
            <div className="switcher">{btnList()}</div>
          </div>
        </div>
        <div className="rounded shadow-lg p-3 mt-5">
          <div className="portfolio-chart-container text-lg">
            <div>포트폴리오</div>
            <PortfolioProfitChart labels={portfolio} />
          </div>
        </div>
      </div>
    </div>
  );
}

// 기간
