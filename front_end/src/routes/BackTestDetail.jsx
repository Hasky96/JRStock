import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBacktestDetail } from "../api/backtest";
import ResultSummary from "../components/BackTestDetail/ResultSummary/ResultSummary";
import TradingRecord from "../components/BackTestDetail/TradingRecord/TradingRecord";
import Strategy from "../components/BackTestDetail/Strategy/Strategy";
import PageContainer from "../components/PageContainer";
import TabBar from "../components/TabBar/TabBar";
import "../components/BackTestDetail/BackTestDetail.css";
import { trimResultSummary } from "../util/trimResult";
import { ReactComponent as Spinner } from "../assets/spinner.svg";

export default function BackTestDetail() {
  const { id } = useParams();
  const [isTesting, setIsTesting] = useState(false);
  const [currentTab, setCurrentTab] = useState("결과 요약");
  const tabInfo = ["결과 요약", "거래 내역", "전략 상세"];
  const [isLoading, setIsLoading] = useState(true);
  const [backtestResult, setBacktestResult] = useState("");
  const [basicCondition, setBasicCondition] = useState("");
  const [firstAccess, setFirstAccess] = useState(true);

  const fetchBacktestDetail = async (backtestId) => {
    const res = await getBacktestDetail(backtestId);
    return res.data;
  };

  const fetchAndSetDetail = async () => {
    const result = await fetchBacktestDetail(id);
    if (result.final_asset) {
      const { resultSummary, conditions } = await trimResultSummary(result);
      setBacktestResult(resultSummary);
      setBasicCondition(conditions);
      setIsLoading(false);
      console.log("@loading over");
    } else {
      console.log("@loading");
      setIsTesting(true);
    }
  };

  useEffect(() => {
    if (!firstAccess) {
      return;
    }

    if (!isLoading) {
      return;
    }

    // 처음 들어왔을 때 요청 보냄 (setInterval 은 5초 뒤에 보내게 됨..)
    fetchAndSetDetail();

    const fetching = setInterval(async () => {
      // 로딩이 끝난 경우
      if (!isLoading) {
        clearInterval(fetching);
        return;
      }

      const result = await fetchBacktestDetail(id);
      if (result.final_asset) {
        clearInterval(fetching);
        const { resultSummary, conditions } = await trimResultSummary(result);
        setBacktestResult(resultSummary);
        setBasicCondition(conditions);
        setIsLoading(false);
        console.log("@loading over");
      } else {
        console.log("@loading");
        console.log(result);
        setIsTesting(true);
      }
    }, 3000);

    setFirstAccess(false);
    return () => clearInterval(fetching);
  }, [isLoading]);

  return (
    <PageContainer>
      {isLoading ? (
        <div className="w-full h-[80vh] flex flex-col justify-center items-center gap-5">
          <Spinner />
          <div className="font-semibold">
            {isTesting &&
              "백테스트가 진행 중입니다. 설정 기간에 따라 최대 30초 이상 소요됩니다."}
          </div>
        </div>
      ) : (
        <div className="backtest-detail-container flex flex-col items-center">
          <TabBar setCurrentTab={setCurrentTab} tabInfo={tabInfo} />
          <div className="mt-5 w-full">
            {currentTab === "결과 요약" && (
              <ResultSummary
                resultSummary={backtestResult}
                isLoading={isLoading}
                id={id}
              />
            )}
            {/* {currentTab === "수익률 상세" && <Profit />} */}
            {currentTab === "거래 내역" && (
              <TradingRecord isLoading={isLoading} id={id} />
            )}
            {currentTab === "전략 상세" && (
              <Strategy
                conditions={basicCondition}
                isLoading={isLoading}
                id={id}
              />
            )}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
