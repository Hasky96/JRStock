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
} from "../../assets/marketChartTestData";

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

  const summaryData = [
    {
      key: "투자 원금(원)",
      value: "300",
    },
    {
      key: "총 손익(원)",
      value: "+1996",
    },
    {
      key: "최종 자산(원)",
      value: "2296",
    },
    {
      key: "누적 수익률(%)",
      value: "+789",
    },
    {
      key: "일평균 수익률(%)",
      value: "+1.7",
    },
    {
      key: "연평균 수익률(%)",
      value: "+24.8",
    },
    {
      key: "시장초과 수익률(%)",
      value: "+543",
    },
  ];

  // const paintAssets = assetResult.map((result) => (
  //   <div className="mx-auto my-auto">
  //     <h2 className="text-lg ">{result.key}</h2>
  //     <p>{result.value}</p>
  //   </div>
  // ));

  // const paintProfits = profitResult.map((result) => (
  //   <div className="mx-auto my-auto">
  //     <h2 className="text-lg">{result.key}</h2>
  //     <p>{result.value}</p>
  //   </div>
  // ));

  const paintSummaryData = summaryData.map((result, index) => (
    <div key={index} className="col-span-1 mx-auto my-auto">
      <h2 className="text-xs">{result.key}</h2>
      <p>{result.value}</p>
    </div>
  ));

  return (
    <div className="flex flex-col items-center summary-container">
      <div className="w-full flex flex-col md:flex-row gap-3">
        <div className="w-full grid grid-cols-10 border border-gray-200 shadow-lg rounded gap-2 text-center">
          {/* <h1 className="text-2xl col-span-3 text-left ml-3">자본</h1> */}
          {paintSummaryData}
        </div>
        {/* <div className="w-full border border-gray-200 shadow-lg rounded grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
          <h1 className="text-2xl font-bold col-span-2 md:col-span-4 text-left ml-3">
            수익률
          </h1>
          {paintProfits}
        </div> */}
      </div>

      <div className="w-full xl:flex items-center gap-3">
        <div className="profit-chart-container border rounded shadow-lg mt-5">
          <ProfitChart marketData={data1} testData={data2} />

          <div className="switcher">{btnList()}</div>
        </div>
        <div className="portfolio-chart-container border rounded shadow-lg mt-5">
          <PortfolioChart labels={portfolio} />
        </div>
      </div>
    </div>
  );
}

// 기간
