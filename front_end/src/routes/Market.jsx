import { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import Card from "../components/market/Card";
import TabBar from "../components/TabBar/TabBar";
import LineChart from "../components/market/LineChart";
import "../components/market/style.css";

import {
  getDayStock,
  getWeekStock,
  getMonthStock,
  getPredict,
} from "../api/market";

import { CandleChart } from "../components/market/CandleChart";
import NewsTable from "../components/market/NewsTable";

import {
  transCandleData,
  transVolumeData,
  transLineData,
} from "../util/stockDataUtil";
import Interested from "../components/market/Interested";

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
  const [isInit, setIsInit] = useState(true);

  // 처음 화면 변수 초기화
  const init = async () => {
    // 일봉
    // kospiSeriesData 초기화
    const kospiDayStock = await getDayStock("kospi");
    // 코스피 예측 종가
    const kospiPredict = await getPredict("kospi");

    // 코스피 카드 정보 초기화
    setKospiInfo({
      open: parseFloat(kospiDayStock[kospiDayStock.length - 1].start_price),
      close: parseFloat(kospiDayStock[kospiDayStock.length - 1].current_price),
      high: parseFloat(kospiDayStock[kospiDayStock.length - 1].high_price),
      low: parseFloat(kospiDayStock[kospiDayStock.length - 1].low_price),
      date: kospiDayStock[kospiDayStock.length - 1].date,
      volume: kospiDayStock[kospiDayStock.length - 1].volume,
      tradePrice:
        kospiDayStock[kospiDayStock.length - 1].trade_price.toString(),
      predict: kospiPredict,
    });

    setIsInit(false);

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

    // 주봉
    const kospiWeekStock = await getWeekStock("kospi");
    setKospiSeriesesData((cur) =>
      new Map(cur).set("주봉", {
        candleData: transCandleData(kospiWeekStock),
        volumeData: transVolumeData(kospiWeekStock),
      })
    );

    // 월봉
    const kospiMonthStock = await getMonthStock("kospi");

    setKospiSeriesesData((cur) =>
      new Map(cur).set("월봉", {
        candleData: transCandleData(kospiMonthStock),
        volumeData: transVolumeData(kospiMonthStock),
      })
    );

    //////// 코스닥
    // 일봉
    // kosdaqSeriesData 초기화
    const kosdaqDayStock = await getDayStock("kosdaq");
    // 코스피 예측 종가
    const kosdaqPredict = await getPredict("kosdaq");

    // 코스닥 카드 정보 초기화
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
      predict: kosdaqPredict,
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

    // 주봉
    const kosdaqWeekStock = await getWeekStock("kosdaq");
    setKosdaqSeriesesData((cur) =>
      new Map(cur).set("주봉", {
        candleData: transCandleData(kosdaqWeekStock),
        volumeData: transVolumeData(kosdaqWeekStock),
      })
    );

    // 월봉
    const kosdaqMonthStock = await getMonthStock("kosdaq");
    setKosdaqSeriesesData((cur) =>
      new Map(cur).set("월봉", {
        candleData: transCandleData(kosdaqMonthStock),
        volumeData: transVolumeData(kosdaqMonthStock),
      })
    );
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
    <div>
      <PageContainer>
        <div className="m-5">
          <span
            id="kospi"
            className={classNames(
              "text-2xl font-bold cursor-pointer",
              selectedChart === "kospi" ? "text-primary" : "text-gray-300"
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
              "text-2xl font-bold cursor-pointer",
              selectedChart === "kosdaq" ? "text-primary" : "text-gray-300"
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
            {isInit && (
              <div className="flex justify-center">
                <svg
                  role="status"
                  className="w-14 h-14 text-gray-200 animate-spin dark:text-gray-300 fill-primary mt-10"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            )}
            {data && (
              <div
                className={classNames(
                  "grid grid-cols-3",
                  kospiTab === "정보" ? "" : "hidden"
                )}
              >
                <div className="xl:col-span-2 col-span-3 grid grid-cols-1">
                  <div className="grid border-2 rounded-xl m-2 p-3 grid-rows-6">
                    <div className="grid row-span-5">
                      {period.substring(0, 1) === "1" && (
                        <div className="relative w-full h-96">
                          <LineChart data={data} period={period}></LineChart>
                        </div>
                      )}
                      {period.substring(0, 1) !== "1" && (
                        <div className="relative w-full h-96">
                          <CandleChart
                            candleData={data.candleData}
                            volumeData={data.volumeData}
                            title={"코스피"}
                            period={period}
                          ></CandleChart>
                        </div>
                      )}
                    </div>

                    <div className="switcher row-span-1 pt-8">{btnList()}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 xl:col-span-1 col-span-3">
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
                  "grid grid-cols-3",
                  kosdaqTab === "정보" ? "" : "hidden"
                )}
              >
                <div className="xl:col-span-2 col-span-3 grid grid-cols-1">
                  <div className="grid border-2 rounded-xl m-2 p-3 grid-rows-6">
                    <div className="grid row-span-5">
                      {period.substring(0, 1) === "1" && (
                        <div className="relative w-full h-96">
                          <LineChart data={data} period={period}></LineChart>
                        </div>
                      )}
                      {period.substring(0, 1) !== "1" && (
                        <div className="relative w-full h-96">
                          <CandleChart
                            candleData={data.candleData}
                            volumeData={data.volumeData}
                            title={"코스닥"}
                            period={period}
                          ></CandleChart>
                        </div>
                      )}
                    </div>

                    <div className="switcher row-span-1 pt-8">{btnList()}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 xl:col-span-1 col-span-3">
                  <Card info={kosdaqInfo} />
                </div>
              </div>
            )}
            {kosdaqTab === "시황 뉴스" && <NewsTable kind="kosdaq" />}
          </div>
        )}
      </PageContainer>
      {sessionStorage.getItem("access_token") && (
        <PageContainer pt={10}>
          <Interested />
        </PageContainer>
      )}
    </div>
  );
}
