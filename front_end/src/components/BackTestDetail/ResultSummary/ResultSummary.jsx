import { useEffect, useState } from "react";
import {
  getBacktestAnnually,
  getBacktestDaily,
  getBacktestTradeRecord,
} from "../../../api/backtest";
import { trimAnnually, trimDaily, trimRecords } from "../../../util/trimResult";
import { ProfitLineChart } from "./ProfitLineChart";
import { assetKey, profitKey } from "../../../config/backtestConfig";
import { AnnualProfit } from "../Profit/AnnualProfit";

function date_ascending(a, b) {
  var dateA = new Date(a["time"]).getTime();
  var dateB = new Date(b["time"]).getTime();
  return dateA > dateB ? 1 : -1;
}

export default function ResultSummary({ resultSummary, isLoading, id }) {
  const [assetResult, setAssetResult] = useState(resultSummary.assetResult);
  const [profitResult, setProfitResult] = useState(resultSummary.profitResult);

  const [lineData, setLineData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [isDailyData, setIsDailyData] = useState(false);
  const [period, setPeriod] = useState("1Y");

  const [labels, setLabels] = useState([]);
  const [marketAnnual, setMarketAnnual] = useState([]);
  const [backTestAnnual, setBackTestAnnual] = useState([]);
  const [isAnnualData, setIsAnnualData] = useState(false);

  const [tradeRecord, setTradeRecord] = useState("");
  const [markers, setMarkers] = useState("");
  const [isTradeRecord, setIsTradeRecord] = useState("");

  const fetchBacktestDaily = async (backtestId) => {
    const res = await getBacktestDaily(backtestId);
    return res.data;
  };

  const fetchBacktestAnnually = async (backtestId) => {
    const res = await getBacktestAnnually(backtestId);
    return res.data;
  };

  const fetchBacktestTradeRecord = async (backtestId) => {
    const res = await getBacktestTradeRecord(backtestId);
    return res.data;
  };

  useEffect(() => {
    async function fetchAndSetDaily() {
      const data = await fetchBacktestDaily(id);
      const { lineChartData, barChartData } = await trimDaily(data);

      setLineData(lineChartData);
      setBarData(barChartData);
      setIsDailyData(true);
      console.log("set daily data");
    }

    async function fetchAndSetAnnually() {
      const data = await fetchBacktestAnnually(id);
      const { labels, marketData, backtestData } = await trimAnnually(data);

      setLabels(labels);
      setMarketAnnual(marketData);
      setBackTestAnnual(backtestData);
      setIsAnnualData(true);
      console.log("set annual data");
    }

    async function fetchAndSetTradeRecord() {
      const data = await fetchBacktestTradeRecord(id);
      const timeSortedData = data.sort(date_ascending);
      const { records, markers } = await trimRecords(timeSortedData);

      setTradeRecord(records);
      setMarkers(markers);
      setIsTradeRecord(true);

      console.log("set trade records");
    }

    if (!isLoading) {
      fetchAndSetDaily();
      fetchAndSetAnnually();
      fetchAndSetTradeRecord();
    }
  }, [isLoading]);

  const intervals = ["1D", "1W", "1M", "1Y"];
  const paintSwitcher = intervals.map((el, idx) => (
    <button
      key={idx}
      onClick={(e) => {
        setPeriod(e.target.innerText);
        window.dispatchEvent(new Event("resize"));
      }}
      className={
        period === el ? "switcher-item switcher-active-item" : "switcher-item"
      }
    >
      {el}
    </button>
  ));

  const paintAssetKey = assetKey.map((key, index) => (
    <div key={index} className="col-span-1 mx-auto">
      <h2 className="text-xs text-gray-500">{key}</h2>
    </div>
  ));

  const paintProfitKey = profitKey.map((key, index) => (
    <div key={index} className="col-span-1 mx-auto">
      <h2 className="text-xs text-gray-500">{key}</h2>
    </div>
  ));

  const paintAssetValue = assetResult.map((value, index) => (
    <div key={index} className="col-span-1 mx-auto">
      <p>{value}</p>
    </div>
  ));

  const paintProfitValue = profitResult.map((value, index) => (
    <div key={index} className="col-span-1 mx-auto">
      <p>{value}</p>
    </div>
  ));

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="flex flex-col xl:flex-row gap-3">
        <div className="xl:w-1/2 relative h-30 grid grid-cols-6 border-0 border-b-1 border-gray-200 shadow rounded text-center p-3">
          <div className="col-span-6 text-left text-lg pb-2 font-semibold">
            운용자산
          </div>
          {paintAssetKey}
          {paintAssetValue}
        </div>
        <div className="xl:w-1/2 relative h-30 grid grid-cols-6 border-0 border-b-1 border-gray-200 shadow rounded text-center p-3">
          <div className="col-span-6 text-left text-lg pb-2 font-semibold">
            수익률 <span className="text-sm text-gray-500">(%)</span>
          </div>
          {paintProfitKey}
          {paintProfitValue}
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center gap-3">
        <div className="chart-container rounded shadow-lg p-3 mt-5 text-lg">
          <div className="font-semibold">자산 운용 차트</div>
          {isDailyData && isTradeRecord && (
            <>
              <ProfitLineChart
                priceData={lineData}
                dayEarnData={barData}
                period={period}
                records={tradeRecord}
                markers={markers}
              />
              {paintSwitcher}
            </>
          )}
        </div>
        <div className="chart-container rounded shadow-lg p-3 mt-5">
          <div className="text-lg">
            <div className="font-semibold">연도별 수익률</div>
            {isAnnualData && (
              <AnnualProfit
                labels={labels}
                market={marketAnnual}
                backtest={backTestAnnual}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 기간
