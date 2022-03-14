import { useState } from "react";
import PageContainer from "../components/PageContainer";
import Card from "../components/market/Card";
import TabBar from "../components/TabBar/TabBar";
import LineChart from "../components/LineChart";
import "../components/market/style.css";
import NewsList from "../components/market/NewsList";
import NewsTitle from "../components/market/NewsTitle";

import {
  dayData,
  weekData,
  monthData,
  yearData,
} from "../assets/marketChartTestData";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const newsDatas = [
  {
    title: "뉴스1",
    press: "네이버",
    created_at: "220314",
    url: "https://naver.com",
  },
  {
    title: "뉴스2",
    press: "네이버",
    created_at: "220314",
    url: "https://naver.com",
  },
  {
    title: "뉴스3",
    press: "네이버",
    created_at: "220314",
    url: "https://naver.com",
  },
];

export default function Market() {
  const [selectedChart, setSelectedChart] = useState("kospi");
  const info = {
    date: "2021-02-02 16:00:00",
    open: 2134.9307,
    low: 2134.9105,
    high: 2135.4215,
    close: 2135.0087,
    volume: 73591581,
  };
  const [kospiTab, setKospiTab] = useState("정보");
  const kospiTabInfo = ["정보", "시황 뉴스"];
  const [kosdaqTab, setKosdaqTab] = useState("정보");
  const kosdaqTabInfo = ["정보", "시황 뉴스"];

  const [data, setData] = useState(dayData);
  const [period, setPeriod] = useState("1D");

  var seriesesData = new Map([
    ["1D", dayData],
    ["1W", weekData],
    ["1M", monthData],
    ["1Y", yearData],
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

  const newsList = () => {
    const list = [];
    newsDatas.forEach((el, idx) => {
      list.push(<NewsList item={el} index={idx} />);
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
          }}
        >
          코스닥
        </span>
      </div>
      <div className={classNames(selectedChart === "kospi" ? "" : "hidden")}>
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
                <LineChart data={data}></LineChart>
              </div>

              <div className="switcher row-span-1 pt-8">{btnList()}</div>
            </div>
          </div>
          <div className="grid grid-cols-1">
            <Card info={info} />
          </div>
        </div>
        <div
          className={classNames(
            "h-96",
            "mx-5",
            kospiTab === "시황 뉴스" ? "" : "hidden"
          )}
        >
          <table className="table-auto w-full">
            <colgroup>
              <col span="1" style={{ width: 5 + "%" }} />
              <col span="1" style={{ width: 70 + "%" }} />
              <col span="1" style={{ width: 15 + "%" }} />
              <col span="1" style={{ width: 10 + "%" }} />
            </colgroup>
            <NewsTitle titles={["No", "제목", "언론사", "작성일"]} />
            <tbody className="text-center">
              {newsDatas.length && newsList()}
            </tbody>
          </table>
        </div>
      </div>
      <div className={classNames(selectedChart === "kosdaq" ? "" : "hidden")}>
        <div>코스닥 차트</div>
        <div>코스닥 카드</div>
      </div>
    </PageContainer>
  );
}
