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
    yesterdayPrice: "72200",
    volume: "17640567",
    marketPrice: "72400",
    highPrice: "72400",
    lowPrice: "72400",
    marketCapitalization: "430421300000000",
    transactionPrice: "70000",
    highPrice52: "90000",
    lowPrice52: "60000",
  };

  const statement = {
    PER: "41.14배",
    EPS: "2540원",
    estimationPER: "53.80배",
    estimationEPS: "1933원",
    PBR: "5.15배",
    BPS: "20276원",
    dividendRate: "0.05%",
    foreignLimit: "446112896",
    foreignOwn: "126976103",
    foreignRunout: "28.46%"
  }

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
          <PageContainer pl={2.5} pr={10} minH={60}>
            <div className="font-bold mb-2">{stock.name}</div>
            <div className="flex justify-between">
              <div>PER</div>
              <div>{statement.PER}</div>
            </div>
            <div className="flex justify-between">
              <div>EPS</div>
              <div>{statement.EPS}</div>
            </div>
            <div className="flex justify-between">
              <div>추정 PER</div>
              <div>{statement.estimationPER}</div>
            </div>
            <div className="flex justify-between">
              <div>추정 EPS</div>
              <div>{statement.estimationEPS}</div>
            </div>
            <div className="flex justify-between">
              <div>PBR</div>
              <div>{statement.PBR}</div>
            </div>
            <div className="flex justify-between">
              <div>BPS</div>
              <div>{statement.BPS}</div>
            </div>
            <div className="flex justify-between">
              <div>배당수익률</div>
              <div>{statement.dividendRate}</div>
            </div>
            <hr className="my-2"/>
            <div className="flex justify-between">
              <div>외국인한도주식수</div>
              <div>{statement.foreignLimit}</div>
            </div>
            <div className="flex justify-between">
              <div>외국인보유주식수</div>
              <div>{statement.foreignOwn}</div>
            </div>
            <div className="flex justify-between">
              <div>외국인소진율</div>
              <div>{statement.foreignRunout}</div>
            </div>
          </PageContainer>
        </div>
      )}
      {currentTab === "종합정보" && (
        <div className="col-span-12">
          <PageContainer pt={5} minH={20}>
            <div className="grid grid-cols-11">
              <div className="col-span-3 flex justify-between">
                <div>현재가</div>
                <div>{stock.currentPrice}</div>
              </div>
              <div className="col-start-5 col-end-8 flex justify-between">
                <div>전일대비</div>
                <div>{stock.volatility}</div>
              </div>
              <div className="col-start-9 col-end-12 flex justify-between">
                <div>등락률</div>
                <div>{stock.volatilityRate}</div>
              </div>
              <div className="col-span-3 flex justify-between">
                <div>전일</div>
                <div>{stock.yesterdayPrice}</div>
              </div>
              <div className="col-start-5 col-end-8 flex justify-between">
                <div>고가</div>
                <div>{stock.highPrice}</div>
              </div>
              <div className="col-start-9 col-end-12 flex justify-between">
                <div>거래량</div>
                <div>{stock.volume}</div>
              </div>
              <div className="col-span-3 flex justify-between">
                <div>시가</div>
                <div>{stock.marketPrice}</div>
              </div>
              <div className="col-start-5 col-end-8 flex justify-between">
                <div>저가</div>
                <div>{stock.lowPrice}</div>
              </div>
              <div className="col-start-9 col-end-12 flex justify-between">
                <div>거래대금</div>
                <div>{stock.transactionPrice}</div>
              </div>
              <div className="col-span-3 flex justify-between">
                <div>52주 최고</div>
                <div>{stock.highPrice52}</div>
              </div>
              <div className="col-start-5 col-end-8 flex justify-between">
                <div>52주 최저</div>
                <div>{stock.lowPrice52}</div>
              </div>
            </div>
          </PageContainer>
        </div>
      )}
    </div>
  );
}
