import { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import Card from "../components/market/Card";
import TabBar from "../components/TabBar/TabBar";
import LineChart from "../components/LineChart";
import "../components/market/style.css";
import NewsList from "../components/market/NewsList";
import NewsTitle from "../components/market/NewsTitle";

import { CandleChart } from "../components/market/CandleChart";
import { candleData, volumeData } from "../components/BackTestDetail/data";

import {
  dayData,
  weekData,
  monthData,
  yearData,
  candleDayData,
  volumeDayData,
  candleWeekData,
  volumeWeekData,
  candleMonthData,
  volumeMonthData,
} from "../assets/marketChartTestData";
import NewsTable from "../components/market/NewsTable";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

var kospiSeriesesData = new Map([
  ["일봉", { candleData: candleDayData, volumeData: volumeDayData }],
  ["주봉", { candleData: candleWeekData, volumeData: volumeWeekData }],
  ["월봉", { candleData: candleMonthData, volumeData: volumeMonthData }],
  ["1D", dayData],
  ["1W", weekData],
  ["1M", monthData],
  ["1Y", yearData],
]);

var kosdaqSeriesesData = new Map([
  ["일봉", { candleData: candleData, volumeData: volumeData }],
  ["주봉", { candleData: candleData, volumeData: volumeData }],
  ["월봉", { candleData: candleData, volumeData: volumeData }],
  ["1D", dayData],
  ["1W", weekData],
  ["1M", monthData],
  ["1Y", yearData],
]);

const kospiInfo = {
  date: "2021-02-02 16:00:00",
  open: 2134.9307,
  low: 2134.9105,
  high: 2135.4215,
  close: 2135.0087,
  volume: 73591581,
};

const kosdaqInfo = {
  date: "2021-02-02 16:00:00",
  open: 2135.9307,
  low: 2134.9105,
  high: 2135.4215,
  close: 2134.0087,
  volume: 73591581,
};

export default function Market() {
  const [selectedChart, setSelectedChart] = useState("kospi");
  const [kospiTab, setKospiTab] = useState("정보");
  const kospiTabInfo = ["정보", "시황 뉴스"];
  const [kosdaqTab, setKosdaqTab] = useState("정보");
  const kosdaqTabInfo = ["정보", "시황 뉴스"];

  const [data, setData] = useState(dayData); // kospi dayData 로 초기화
  const [period, setPeriod] = useState("1D");

  useEffect(() => {
    // kospiSeriesData 초기화
    // kosdaqSeriesData 초기화
  }, []);

  const btnList = () => {
    const list = [];
    const intervals = ["일봉", "주봉", "월봉", "1D", "1W", "1M", "1Y"];
    intervals.forEach((el, idx) => {
      list.push(
        <button
          key={idx}
          onClick={(e) => {
            e.preventDefault();
            const seriesesData =
              selectedChart === "kospi"
                ? kospiSeriesesData
                : kosdaqSeriesesData;
            setData(seriesesData.get(e.target.innerText));
            setPeriod(e.target.innerText);
          }}
          className={classNames(
            "switcher-item",
            period === el ? "switcher-active-item" : ""
          )}
        >
          {el}
        </button>
      );
    });
    return list;
  };

  return (
    <PageContainer>
      <div className="m-5">
        <span
          id="kospi"
          className={classNames(
            "text-2xl font-bold",
            selectedChart === "kospi" ? "text-yellow-300" : "text-gray-300"
          )}
          onClick={() => {
            setSelectedChart("kospi");
            setKospiTab("정보");
            setData(dayData); // kospi dayData로 초기화
            setPeriod("1D");
          }}
        >
          코스피
        </span>
        <span className="text-2xl font-bold mx-3">|</span>
        <span
          id="kosdaq"
          className={classNames(
            "text-2xl font-bold",
            selectedChart === "kosdaq" ? "text-yellow-300" : "text-gray-300"
          )}
          onClick={() => {
            setSelectedChart("kosdaq");
            setKosdaqTab("정보");
            setData(dayData); // kosdaq dayData로 초기화
            setPeriod("1D");
          }}
        >
          코스닥
        </span>
      </div>
      {selectedChart === "kospi" && (
        <div>
          <div className="mx-5">
            <TabBar setCurrentTab={setKospiTab} tabInfo={kospiTabInfo} />
          </div>
          <div
            className={classNames(
              "grid grid-cols-2 h-96",
              kospiTab === "정보" ? "" : "hidden"
            )}
          >
            <div className="grid grid-cols-1">
              <div className="grid border-2 rounded-xl m-2 p-3 grid-rows-6">
                <div className="grid row-span-5">
                  {period.substring(0, 1) === "1" && (
                    <LineChart data={data}></LineChart>
                  )}
                  {period.substring(0, 1) !== "1" && (
                    <CandleChart
                      candleData={data.candleData}
                      volumeData={data.volumeData}
                      title={"코스피"}
                      period={period}
                    ></CandleChart>
                  )}
                </div>

                <div className="switcher row-span-1 pt-8">{btnList()}</div>
              </div>
            </div>
            <div className="grid grid-cols-1">
              <Card info={kospiInfo} />
            </div>
          </div>
          {kospiTab === "시황 뉴스" && <NewsTable kind="kospi" />}
        </div>
      )}
      {selectedChart === "kosdaq" && (
        <div>
          <div className="mx-5">
            <TabBar setCurrentTab={setKosdaqTab} tabInfo={kosdaqTabInfo} />
          </div>
          <div
            className={classNames(
              "grid grid-cols-2 h-96",
              kosdaqTab === "정보" ? "" : "hidden"
            )}
          >
            <div className="grid grid-cols-1">
              <div className="grid border-2 rounded-xl m-2 p-3 grid-rows-6">
                <div className="grid row-span-5">
                  {period.substring(0, 1) === "1" && (
                    <LineChart data={data}></LineChart>
                  )}
                  {period.substring(0, 1) !== "1" && (
                    <CandleChart
                      candleData={data.candleData}
                      volumeData={data.volumeData}
                      title={"코스닥"}
                      period={period}
                    ></CandleChart>
                  )}
                </div>

                <div className="switcher row-span-1 pt-8">{btnList()}</div>
              </div>
            </div>
            <div className="grid grid-cols-1">
              <Card info={kosdaqInfo} />
            </div>
          </div>
          {kosdaqTab === "시황 뉴스" && <NewsTable kind="kosdaq" />}
        </div>
      )}
    </PageContainer>
  );
}
