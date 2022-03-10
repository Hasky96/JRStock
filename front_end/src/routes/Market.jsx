import { useState } from "react";
import PageContainer from "../components/PageContainer";
import Card from "../components/market/Card";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Market() {
  const [selectedChart, setSelectedChart] = useState("kospi");
  const info = {
    stockFullName: "SW Limited.",
    stockShortName: "ASX:SFW",
    price: {
      current: 2.321,
      low: 2.215,
      high: 2.325,
      open: 2.23,
      cap: 93.8,
      ratio: 20.1,
      dividend: 1.67,
    },
  };
  return (
    <PageContainer>
      <div>
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
      <div
        className={classNames(
          selectedChart === "kospi" ? "" : "hidden",
          "grid grid-cols-2",
          "h-96"
        )}
      >
        <div className="grid grid-cols-1">
          <Card info={info} />
        </div>
        <div className="grid grid-cols-1">
          <Card info={info} />
        </div>
      </div>
      <div className={classNames(selectedChart === "kosdaq" ? "" : "hidden")}>
        <div>코스닥 차트</div>
        <div>코스닥 카드</div>
      </div>
    </PageContainer>
  );
}
