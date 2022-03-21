import { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import Card from "../components/market/Card";
import TabBar from "../components/TabBar/TabBar";
import LineChart from "../components/market/LineChart";
import "../components/market/style.css";
import NewsList from "../components/market/NewsList";
import NewsTitle from "../components/market/NewsTitle";

import { getDayStock, getWeekStock, getMonthStock } from "../api/market";

import { CandleChart } from "../components/market/CandleChart";
import NewsTable from "../components/market/NewsTable";

import {
  transCandleData,
  transVolumeData,
  transLineData,
} from "../util/stockDataUtil";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Market() {
  const [selectedChart, setSelectedChart] = useState("kospi");
  const [kospiTab, setKospiTab] = useState("정보");
  const kospiTabInfo = ["정보", "시황 뉴스"];
  const [kosdaqTab, setKosdaqTab] = useState("정보");
  const kosdaqTabInfo = ["정보", "시황 뉴스"];

  const [data, setData] = useState(); // kospi dayData 로 초기화
  const [period, setPeriod] = useState("1D");

  const [kospiSeriesesData, setKospiSeriesesData] = useState(new Map());
  const [kosdaqSeriesesData, setKosdaqSeriesesData] = useState(new Map());
  const [kospiInfo, setKospiInfo] = useState();
  const [kosdaqInfo, setKosdaqInfo] = useState();

  // 처음 화면 변수 초기화
  const init = async () => {
    // 일봉
    // kospiSeriesData 초기화
    const kospiDayStock = await getDayStock("kospi");
    console.log(kospiDayStock);

    setKospiInfo({
      open: parseFloat(kospiDayStock[kospiDayStock.length - 1].start_price),
      close: parseFloat(kospiDayStock[kospiDayStock.length - 1].current_price),
      high: parseFloat(kospiDayStock[kospiDayStock.length - 1].high_price),
      low: parseFloat(kospiDayStock[kospiDayStock.length - 1].low_price),
      date: kospiDayStock[kospiDayStock.length - 1].date,
      volume: kospiDayStock[kospiDayStock.length - 1].volume,
      tradePrice:
        kospiDayStock[kospiDayStock.length - 1].trade_price.toString(),
    });

    const kospiLineData = transLineData(kospiDayStock);

    setKospiSeriesesData((cur) =>
      new Map(cur)
        .set("일봉", {
          candleData: transCandleData(kospiDayStock),
          volumeData: transVolumeData(kospiDayStock),
        })
        .set("1D", kospiLineData)
        .set("1W", kospiLineData)
        .set("1M", kospiLineData)
        .set("1Y", kospiLineData)
    );

    console.log("코스피 일별 데이터 전처리 끝");

    // 주봉
    const kospiWeekStock = await getWeekStock("kospi");
    console.log(kospiWeekStock);
    setKospiSeriesesData((cur) =>
      new Map(cur).set("주봉", {
        candleData: transCandleData(kospiWeekStock),
        volumeData: transVolumeData(kospiWeekStock),
      })
    );

    console.log("코스피 주별 데이터 전처리 끝");

    // 월봉
    const kospiMonthStock = await getMonthStock("kospi");
    console.log(kospiMonthStock);

    setKospiSeriesesData((cur) =>
      new Map(cur).set("월봉", {
        candleData: transCandleData(kospiMonthStock),
        volumeData: transVolumeData(kospiMonthStock),
      })
    );

    console.log("코스피 월별 데이터 전처리 끝");

    //////// 코스닥
    // 일봉
    // kospiSeriesData 초기화
    const kosdaqDayStock = await getDayStock("kosdaq");
    console.log(kosdaqDayStock);

    setKosdaqInfo({
      open: parseFloat(kosdaqDayStock[kosdaqDayStock.length - 1].start_price),
      close: parseFloat(
        kosdaqDayStock[kosdaqDayStock.length - 1].current_price
      ),
      high: parseFloat(kosdaqDayStock[kosdaqDayStock.length - 1].high_price),
      low: parseFloat(kosdaqDayStock[kosdaqDayStock.length - 1].low_price),
      date: kosdaqDayStock[kosdaqDayStock.length - 1].date,
      volume: kosdaqDayStock[kosdaqDayStock.length - 1].volume,
      tradePrice:
        kosdaqDayStock[kosdaqDayStock.length - 1].trade_price.toString(),
    });

    const kosdaqLineData = transLineData(kosdaqDayStock);

    setKosdaqSeriesesData((cur) =>
      new Map(cur)
        .set("일봉", {
          candleData: transCandleData(kosdaqDayStock),
          volumeData: transVolumeData(kosdaqDayStock),
        })
        .set("1D", kosdaqLineData)
        .set("1W", kosdaqLineData)
        .set("1M", kosdaqLineData)
        .set("1Y", kosdaqLineData)
    );

    console.log("코스닥 일별 데이터 전처리 끝");

    // 주봉
    const kosdaqWeekStock = await getWeekStock("kosdaq");
    console.log(kosdaqWeekStock);
    setKosdaqSeriesesData((cur) =>
      new Map(cur).set("주봉", {
        candleData: transCandleData(kosdaqWeekStock),
        volumeData: transVolumeData(kosdaqWeekStock),
      })
    );

    console.log("코스닥 주별 데이터 전처리 끝");

    // 월봉
    const kosdaqMonthStock = await getMonthStock("kosdaq");
    console.log(kosdaqMonthStock);
    setKosdaqSeriesesData((cur) =>
      new Map(cur).set("월봉", {
        candleData: transCandleData(kosdaqMonthStock),
        volumeData: transVolumeData(kosdaqMonthStock),
      })
    );

    console.log("코스닥 월별 데이터 전처리 끝");
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (selectedChart === "kospi") setData(kospiSeriesesData.get(period));
    else setData(kosdaqSeriesesData.get(period));
  }, [kospiSeriesesData, kosdaqSeriesesData]);

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
            selectedChart === "kospi" ? "text-indigo-900" : "text-gray-300"
          )}
          onClick={() => {
            setSelectedChart("kospi");
            setKospiTab("정보");
            setData(kospiSeriesesData.get("1D")); // kospi dayData로 초기화
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
            selectedChart === "kosdaq" ? "text-indigo-900" : "text-gray-300"
          )}
          onClick={() => {
            setSelectedChart("kosdaq");
            setKosdaqTab("정보");
            setData(kosdaqSeriesesData.get("1D")); // kosdaq dayData로 초기화
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
          {data && (
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
                      <LineChart data={data} period={period}></LineChart>
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
          )}
          {kospiTab === "시황 뉴스" && <NewsTable kind="kospi" />}
        </div>
      )}
      {selectedChart === "kosdaq" && (
        <div>
          <div className="mx-5">
            <TabBar setCurrentTab={setKosdaqTab} tabInfo={kosdaqTabInfo} />
          </div>
          {data && (
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
                      <LineChart data={data} period={period}></LineChart>
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
          )}
          {kosdaqTab === "시황 뉴스" && <NewsTable kind="kosdaq" />}
        </div>
      )}
    </PageContainer>
  );
}
