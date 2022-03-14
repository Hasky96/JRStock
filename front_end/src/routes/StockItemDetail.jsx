import PageContainer from "../components/PageContainer";
import { useParams } from "react-router-dom";
import TabBar from "../components/TabBar/TabBar";
import { useState } from "react";
import Chart from "../components/StockItemDetail/Chart";
import News from "../components/StockItemDetail/News";
import Board from "../components/StockItemDetail/Board";

export default function StockItemDetail() {
  // const { id } = useParams();
  // console.log(id);

  const [currentTab, setCurrentTab] = useState("종합정보");
  const tabInfo = ["종합정보", "뉴스", "종목토론 게시판"];

  // console.log(currentTab);

  const stock = {
    id: 1351,
    chart: "charinfo",
    name: "삼성전자",
    currentPrice: "72400",
    volatility: 200,
    volatilityRate: "+0.28%",
    volume: "17640567",
    marketPrice: "72400",
    highPrice: "72400",
    lowPrice: "72400",
    marketCapitalization: "430421300000000",
  };

  return (
    <div className="grid grid-cols-12">
      <div className={currentTab === "종합정보" ? "col-span-9" : "col-span-12"}>
        <PageContainer
          pr={currentTab === "종합정보" ? 2.5 : undefined}
          minH={currentTab === "종합정보" ? 60 : undefined}
        >
          <TabBar setCurrentTab={setCurrentTab} tabInfo={tabInfo} />
          {currentTab === "종합정보" && <Chart />}
          {currentTab === "뉴스" && <News />}
          {currentTab === "종목토론 게시판" && <Board />}
        </PageContainer>
      </div>
      {currentTab === "종합정보" && (
        <div className="col-span-3">
          <PageContainer pl={2.5} pr={10} minH={60}></PageContainer>
        </div>
      )}
      {currentTab === "종합정보" && (
        <div className="col-span-12">
          <PageContainer pt={5} minH={20}>
            <div className="grid grid-cols-11">
              <div className="col-span-3 flex justify-between">
                <div>현재가</div>
                <div>124</div>
              </div>
              <div className="col-start-5 col-end-8 flex justify-between">
                <div>전일대비</div>
                <div>124</div>
              </div>
              <div className="col-start-9 col-end-12 flex justify-between">
                <div>등락률</div>
                <div>124</div>
              </div>
              <div className="col-span-3 flex justify-between">
                <div>전일</div>
                <div>124</div>
              </div>
              <div className="col-start-5 col-end-8 flex justify-between">
                <div>고가</div>
                <div>124</div>
              </div>
              <div className="col-start-9 col-end-12 flex justify-between">
                <div>거래량</div>
                <div>124</div>
              </div>
              <div className="col-span-3 flex justify-between">
                <div>시가</div>
                <div>124</div>
              </div>
              <div className="col-start-5 col-end-8 flex justify-between">
                <div>저가</div>
                <div>124</div>
              </div>
              <div className="col-start-9 col-end-12 flex justify-between">
                <div>거래대금</div>
                <div>124</div>
              </div>
              <div className="col-span-3 flex justify-between">
                <div>52주 최고</div>
                <div>124</div>
              </div>
              <div className="col-start-5 col-end-8 flex justify-between">
                <div>52주 최저</div>
                <div>124</div>
              </div>
            </div>
          </PageContainer>
        </div>
      )}
    </div>
  );
}
