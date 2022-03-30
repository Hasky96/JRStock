import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBacktestDetail, getBacktestTradeRecord } from "../api/backtest";
import ResultSummary from "../components/BackTestDetail/ResultSummary/ResultSummary";
import Profit from "../components/BackTestDetail/Profit/Profit";
import TradingRecord from "../components/BackTestDetail/TradingRecord/TradingRecord";
import Strategy from "../components/BackTestDetail/Strategy/Strategy";
import PageContainer from "../components/PageContainer";
import TabBar from "../components/TabBar/TabBar";
import "../components/BackTestDetail/BackTestDetail.css";
import { trimResultSummary } from "../util/trimResult";

export default function BackTestDetail() {
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState("결과 요약");
  const tabInfo = ["결과 요약", "거래 내역", "전략 상세"];
  const [isLoading, setIsLoading] = useState(true);
  const [backtestResult, setBacktestResult] = useState("");

  const fetchBacktestDetail = async (backtestId) => {
    const res = await getBacktestDetail(backtestId);
    return res.data;
  };

  useEffect(() => {
    const fetching = setInterval(async () => {
      // 로딩이 끝난 경우 ()
      if (!isLoading) {
        clearInterval(fetching);
        return;
      }

      const result = await fetchBacktestDetail(id);
      if (result.final_asset) {
        setBacktestResult(result);
        setIsLoading(false);
        console.log("@loading over");
        console.log("set backtest result");
        clearInterval(fetching);
      } else {
        console.log("@loading");
      }
    }, 500);
  }, [isLoading]);

  return (
    <PageContainer>
      {isLoading ? (
        <>로딩중</>
      ) : (
        <div className="backtest-detail-container flex flex-col items-center">
          <TabBar setCurrentTab={setCurrentTab} tabInfo={tabInfo} />
          <div className="mt-5 w-full">
            {currentTab === "결과 요약" && (
              <ResultSummary
                resultSummary={trimResultSummary(backtestResult)}
                isLoading={isLoading}
                id={id}
              />
            )}
            {/* {currentTab === "수익률 상세" && <Profit />} */}
            {currentTab === "거래 내역" && (
              <TradingRecord isLoading={isLoading} id={id} />
            )}
            {currentTab === "전략 상세" && <Strategy isLoading={isLoading} />}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
