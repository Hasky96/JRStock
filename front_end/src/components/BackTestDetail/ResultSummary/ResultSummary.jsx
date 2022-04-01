import { useEffect, useState } from "react";
import {
  getBacktestAnnually,
  getBacktestDaily,
  getBacktestTradeRecord,
  getStockDaily,
} from "../../../api/backtest";
import {
  trimAnnually,
  trimDaily,
  trimRecords,
  trimStockDaily,
} from "../../../util/trimResult";
import { ProfitLineChart } from "./ProfitLineChart";
import { assetKey, profitKey } from "../../../config/backtestConfig";
import { AnnualProfit } from "../Profit/AnnualProfit";
import "./ResultSummary.css";
import ReactTooltip from "react-tooltip";
import { StockCandleChart } from "./StockCandleChart";

function date_ascending(a, b) {
  var dateA = new Date(a["time"]).getTime();
  var dateB = new Date(b["time"]).getTime();
  return dateA > dateB ? 1 : -1;
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ResultSummary({ resultSummary, isLoading, id }) {
  const [assetResult, setAssetResult] = useState([]);
  const [profitResult, setProfitResult] = useState([]);

  const [lineData, setLineData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [stockCandleData, setStockCandleData] = useState([]);
  const [stockVolumeData, setStockVolumeData] = useState([]);
  const [isDailyData, setIsDailyData] = useState(false);
  const [period, setPeriod] = useState("1W");
  const [isStockData, setIsStockData] = useState(true);
  const [isCandleData, setIsCandleData] = useState(false);

  const intervals = ["1D", "1W", "1M", "1Y"];
  const stockIntervals = ["일봉", "1D", "1W", "1M", "1Y"];
  // const stockIntervals = ["1D", "1W", "1M", "1Y"];
  const [nowIntervals, setNowIntervals] = useState(stockIntervals);

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
  const fetchStockDaily = async (code, start, end) => {
    const res = await getStockDaily(code, start, end);
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
      const stockData = await fetchStockDaily(
        resultSummary.basicInfo.code_number,
        resultSummary.assetResult[3],
        resultSummary.assetResult[4]
      );

      const { lineChartData, barChartData } = await trimDaily(data);
      const { trimmedStockData, candleData, candleVolumeData } =
        await trimStockDaily(stockData);

      setLineData(lineChartData);
      setBarData(barChartData);
      setStockData(trimmedStockData);
      setStockCandleData(candleData);
      setStockVolumeData(candleVolumeData);
      setIsDailyData(true);
    }

    async function fetchAndSetAnnually() {
      const data = await fetchBacktestAnnually(id);
      const { labels, marketData, backtestData } = await trimAnnually(data);
      setLabels(labels);
      setMarketAnnual(marketData);
      setBackTestAnnual(backtestData);
      setIsAnnualData(true);
    }

    async function fetchAndSetTradeRecord() {
      const data = await fetchBacktestTradeRecord(id);
      const timeSortedData = data.sort(date_ascending);
      const { records, markers } = await trimRecords(timeSortedData);
      setTradeRecord(records);
      setMarkers(markers);
      setIsTradeRecord(true);
    }

    if (!isLoading) {
      fetchAndSetDaily();
      fetchAndSetAnnually();
      fetchAndSetTradeRecord();
    }

    if (resultSummary.assetResult) {
      setAssetResult(resultSummary.assetResult);
      setProfitResult(resultSummary.profitResult);
    }
  }, [isLoading, resultSummary]);

  const handleSwitcherClick = (e) => {
    if (e.target.innerText === "일봉") {
      setIsCandleData(true);
      setPeriod(e.target.innerText);
    } else {
      setIsCandleData(false);
      setPeriod(e.target.innerText);
    }
    window.dispatchEvent(new Event("resize"));
  };

  const paintSwitcher = nowIntervals.map((el, idx) => (
    <button
      key={idx}
      onClick={(e) => handleSwitcherClick(e)}
      className={
        period === el
          ? "result-switcher-item result-switcher-active-item"
          : "result-switcher-item"
      }
    >
      {el}
    </button>
  ));

  const paintAssetKey = assetKey.map((key, index) => (
    <div key={index} className="col-span-1 mx-auto">
      <a className="text-xs text-gray-500">{key}</a>
    </div>
  ));

  const paintProfitKey = profitKey.map(
    ({ title, isToolTip, content }, index) => (
      <div key={index} className="col-span-1 mx-auto">
        {isToolTip ? (
          <>
            <a
              className="text-xs text-gray-500"
              data-tip
              data-for={`${title}-${index}`}
            >
              {title}
            </a>
            <ReactTooltip
              className="tooltipExtra"
              id={`${title}-${index}`}
              type="dark"
              effect="solid"
              backgroundColor="#E69A8DFF"
            >
              <span>{content}</span>
            </ReactTooltip>
          </>
        ) : (
          <a className="text-xs text-gray-500">{title}</a>
        )}
      </div>
    )
  );

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
      <div className="relative w-[600px] h-30 grid grid-cols-6 border-0 border-b-1 border-gray-200 rounded text-center p-3 gap-x-2">
        <div className="col-span-6 text-left text-lg font-semibold pb-2 flex items-end justify-between">
          <div className="flex items-end mr-10">
            <img
              className="rounded-full w-8 mr-2"
              src={resultSummary.basicInfo.profile}
              alt="profile_img"
            />
            {resultSummary.basicInfo.user} <p className="text-sm mr-5">님의</p>
            <span className="underline decoration-secondary decoration-4 underline-offset-2">
              {resultSummary.basicInfo.title}
            </span>
          </div>
          <p className="text-sm">
            {resultSummary.basicInfo.created_at.slice(0, 10)}
          </p>
        </div>
      </div>
      <div className="flex flex-col xl:flex-row gap-3">
        <div className="relative h-30 grid grid-cols-6 border-0 border-b-1 border-gray-200 shadow rounded text-center p-3 gap-x-2">
          <div className="col-span-6 text-left text-lg pb-2 font-semibold flex">
            {resultSummary.basicInfo.company_name} (
            {resultSummary.basicInfo.code_number})
          </div>

          {paintAssetKey}
          {paintAssetValue}
        </div>
        <div className="relative h-30 grid grid-cols-6 border-0 border-b-1 border-gray-200 shadow rounded text-center p-3 gap-x-2">
          <div className="col-span-6 text-left text-lg pb-2 font-semibold">
            수익률 <span className="text-sm text-gray-500">(%)</span>
          </div>
          {paintProfitKey}
          {paintProfitValue}
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center gap-3">
        <div className="chart-container rounded shadow-lg p-3 mt-5 text-lg">
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsStockData((state) => !state);
                setNowIntervals(stockIntervals);
              }}
              className={classNames(
                "font-semibold",
                isStockData ? "" : "text-gray-300"
              )}
            >
              종목 차트
            </button>
            <div>|</div>
            <button
              onClick={() => {
                setIsStockData((state) => !state);
                setNowIntervals(intervals);
                setIsCandleData(false);
                setPeriod("1W");
              }}
              className={classNames(
                "font-semibold",
                isStockData ? "text-gray-300" : ""
              )}
            >
              자산 운용 차트
            </button>
          </div>
          {isDailyData && isTradeRecord && (
            <>
              {isStockData ? (
                isCandleData ? (
                  <StockCandleChart
                    candleData={stockCandleData}
                    volumeData={stockVolumeData}
                    markers={markers}
                    period={6}
                  />
                ) : (
                  <ProfitLineChart
                    priceData={stockData}
                    dayEarnData={barData}
                    period={period}
                    records={tradeRecord}
                    markers={markers}
                  />
                )
              ) : (
                <ProfitLineChart
                  priceData={lineData}
                  dayEarnData={barData}
                  period={period}
                  records={tradeRecord}
                  markers={markers}
                />
              )}

              {paintSwitcher}
            </>
          )}
        </div>
        <div className="chart-container rounded shadow-lg p-3 mt-5">
          <div className="text-lg">
            <div className="font-semibold">연도별 수익률</div>
            {labels.length ? (
              isAnnualData && (
                <AnnualProfit
                  labels={labels}
                  market={marketAnnual}
                  backtest={backTestAnnual}
                />
              )
            ) : (
              <div className="w-full flex justify-center text-center">
                <div>
                  <p className="text-xl">연도별 데이터가 존재하지 않습니다.</p>
                  <p>설정한 기간이 너무 짧거나, 조건 설정이 잘못되었습니다.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 기간
