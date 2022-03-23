import { useState } from "react";
import ResultSummary from "../components/BackTestDetail/ResultSummary/ResultSummary";
import Profit from "../components/BackTestDetail/Profit/Profit";
import TradingRecord from "../components/BackTestDetail/TradingRecord/TradingRecord";
import Strategy from "../components/BackTestDetail/Strategy/Strategy";
import Portfolio from "../components/BackTestDetail/Portfolio/Portfolio";
import PageContainer from "../components/PageContainer";
import TabBar from "../components/TabBar/TabBar";

export default function BackTestDetail() {
  const [currentTab, setCurrentTab] = useState("결과 요약");
  const tabInfo = [
    "결과 요약",
    "수익률 상세",
    "거래 내역",
    "전략 상세",
    "포트폴리오",
  ];

  return (
    <PageContainer>
      <div className="flex flex-col items-center">
        <TabBar setCurrentTab={setCurrentTab} tabInfo={tabInfo} />
        <div className="mt-5 w-full">
          {currentTab === "결과 요약" && <ResultSummary />}
          {currentTab === "수익률 상세" && <Profit />}
          {currentTab === "거래 내역" && <TradingRecord />}
          {currentTab === "전략 상세" && <Strategy />}
          {currentTab === "포트폴리오" && <Portfolio />}
        </div>
      </div>
    </PageContainer>
  );
}
