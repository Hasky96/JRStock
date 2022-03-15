import { AnnualProfit } from "./AnnualProfit";
import { PortfolioProfitChart } from "../ResultSummary/PortfolioProfitChart";
import "./Profit.css";

export default function Profit() {
  const yearLabels = [
    2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022,
  ];

  const portfolio = ["삼성전자", "SK하이닉스", "네이버"];
  const stockLabels = [];
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

  const paintProfits = profitData.map((result, index) => (
    <div key={index} className="col-span-1 mx-auto my-auto">
      <h2 className="text-xs">{result.key}</h2>
      <p>{result.value}</p>
    </div>
  ));

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="relative h-30 grid grid-cols-5 border-0 border-b-1 border-gray-200 shadow rounded gap-2 text-center p-3">
        <div className="col-span-5 text-left text-lg">수익률</div>
        {paintProfits}
      </div>
      <div className="w-full flex">
        <div className="chart-container rounded shadow-lg p-3 mt-5">
          <div className="text-lg">
            <div>종목별 수익률</div>
            <PortfolioProfitChart labels={portfolio} />
          </div>
        </div>
        <div className="chart-container rounded shadow-lg p-3 mt-5">
          <div className="text-lg">
            <div>연도별 수익률</div>
            <AnnualProfit labels={yearLabels} />
          </div>
        </div>
      </div>
    </div>
  );
}
