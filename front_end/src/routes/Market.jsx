import { useState } from "react";
import PageContainer from "../components/PageContainer";
import Card from "../components/market/Card";
import TabBar from "../components/TabBar/TabBar";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

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
            <Card info={info} />
          </div>
          <div className="grid grid-cols-1">
            <Card info={info} />
          </div>
        </div>
      </div>
      <div className={classNames(selectedChart === "kosdaq" ? "" : "hidden")}>
        <div>코스닥 차트</div>
        <div>코스닥 카드</div>
      </div>
    </PageContainer>
  );
}
