import PageContainer from "../components/PageContainer";
import { useParams } from "react-router-dom";
import TabBar from "../components/TabBar/TabBar";
import { useState, useEffect } from "react";
import Chart from "../components/StockItemDetail/Chart";
import News from "../components/StockItemDetail/News";
import BoardList from "../components/StockItemDetail/BoardList";
import { getDetail, getDayStock, getLive } from "../api/stock";
import costMap from "../util/costMap";

export default function StockItemDetail() {
  const { stockTab, id } = useParams();
  const [detail, setDetail] = useState({ basic_info: "" });
  const [stock, setStock] = useState({ market_cap: "" });
  const [live, setLive] = useState({ current_price: "" });

  const setting = {
    detail: "종합정보",
    news: "뉴스",
    board: "종목토론 게시판",
  };

  const [currentTab, setCurrentTab] = useState(setting[stockTab]);
  const tabInfo = ["종합정보", "뉴스", "종목토론 게시판"];

  const init = async () => {
    const resDetail = await getDetail(id);
    setDetail(resDetail.data);
    const resStock = await getDayStock(id);
    setStock(resStock.data[resStock.data.length - 1]);
    const resLive = await getLive(id);
    setLive(resLive.data);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setCurrentTab(setting[stockTab]);
  }, [stockTab]);

  return (
    <div className="grid grid-cols-12">
      <div className="mt-28 ml-11 pt-0.5">
        <TabBar
          setCurrentTab={setCurrentTab}
          tabInfo={tabInfo}
          baseURL={`/stock/${id}`}
          currentTab={currentTab}
        />
      </div>
      {currentTab === "종합정보" && (
        <div className="col-span-12 pt-px">
          <PageContainer minH={15} pt={5}>
            <div className="grid grid-cols-11">
              <div className="col-span-2">
                <div>현재가</div>
                <div
                  className={
                    "text-5xl " +
                    (live.changes &&
                      (parseInt(live.changes) > 0
                        ? "text-red-500"
                        : parseInt(live.changes) < 0
                        ? "text-blue-600"
                        : "text-gray-600"))
                  }
                >
                  {live.current_price}
                </div>
                {live.changes && (
                  <div className="flex mt-2">
                    <div className="mr-3">전일대비</div>
                    <div
                      className={
                        "flex " +
                        (live.changes &&
                          (parseInt(live.changes) > 0
                            ? "text-red-500"
                            : parseInt(live.changes) < 0
                            ? "text-blue-600"
                            : "text-gray-600"))
                      }
                    >
                      <div>
                        {live.changes &&
                          (parseInt(live.changes) > 0
                            ? "▲ " + live.changes.substr(1)
                            : parseInt(live.changes) < 0
                            ? "▼ " + live.changes.substr(1)
                            : "- " + live.changes)}
                      </div>
                      <div className="text-gray-700">&nbsp;|&nbsp;</div>
                      <div>
                        {live.changes &&
                          (parseInt(live.changes) > 0
                            ? "▲ " + live.changes_ratio.substr(1)
                            : parseInt(live.changes) < 0
                            ? "▼ " + live.changes_ratio.substr(1)
                            : "- " + live.changes_ratio)}
                      </div>
                    </div>
                  </div>
                )}
                <div className="text-gray-400">{live.time} 기준</div>
              </div>
              <div className="col-start-4 col-end-6 font-bold">
                <div className="flex justify-between mb-2">
                  <div>전일</div>
                  <div>{live.prev}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div>상한가</div>
                  <div>{live.upper_limit}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div>고가</div>
                  <div
                    className={
                      live.prev &&
                      parseInt(live.prev.replace(/,/g, "")) <
                        parseInt(live.high.replace(/,/g, ""))
                        ? "text-red-500"
                        : live.prev &&
                          parseInt(live.prev.replace(/,/g, "")) >
                            parseInt(live.high.replace(/,/g, ""))
                        ? "text-blue-600"
                        : "text-gray-600"
                    }
                  >
                    {live.high}
                  </div>
                </div>
              </div>
              <div className="col-start-7 col-end-9 font-bold">
                <div className="flex justify-between mb-2">
                  <div>시가</div>
                  <div
                    className={
                      live.prev &&
                      parseInt(live.prev.replace(/,/g, "")) <
                        parseInt(live.open.replace(/,/g, ""))
                        ? "text-red-500"
                        : live.prev &&
                          parseInt(live.prev.replace(/,/g, "")) >
                            parseInt(live.open.replace(/,/g, ""))
                        ? "text-blue-600"
                        : "text-gray-600"
                    }
                  >
                    {live.open}
                  </div>
                </div>
                <div className="flex justify-between mb-2">
                  <div>하한가</div>
                  <div>{live.lower_limit}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div>저가</div>
                  <div
                    className={
                      live.prev &&
                      parseInt(live.prev.replace(/,/g, "")) <
                        parseInt(live.low.replace(/,/g, ""))
                        ? "text-red-500"
                        : live.prev &&
                          parseInt(live.prev.replace(/,/g, "")) >
                            parseInt(live.low.replace(/,/g, ""))
                        ? "text-blue-600"
                        : "text-gray-600"
                    }
                  >
                    {live.low}
                  </div>
                </div>
              </div>
              <div className="col-start-10 col-end-12 font-bold">
                <div className="flex justify-between mb-2">
                  <div>연중최고</div>
                  <div>
                    {detail.year_high_price &&
                      (+detail.year_high_price).toLocaleString()}
                  </div>
                </div>
                <div className="flex justify-between mb-2">
                  <div>연중최저</div>
                  <div>
                    {detail.year_low_price &&
                      (+detail.year_low_price).toLocaleString()}
                  </div>
                </div>
                <div className="flex justify-between mb-2">
                  <div>거래량</div>
                  <div>{live.volume}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div>거래대금</div>
                  <div>{live.volume_price}</div>
                </div>
              </div>
            </div>
          </PageContainer>
        </div>
      )}
      <div className={currentTab === "종합정보" ? "col-span-9" : "col-span-12"}>
        <PageContainer
          pr={currentTab === "종합정보" ? 2.5 : undefined}
          pt={currentTab === "종합정보" ? 5 : 5}
          minH={currentTab === "종합정보" ? 55 : 73}
        >
          {currentTab === "종합정보" && (
            <Chart title={detail.basic_info.company_name} />
          )}
          {currentTab === "뉴스" && <News />}
          {currentTab === "종목토론 게시판" && <BoardList />}
        </PageContainer>
      </div>

      {currentTab === "종합정보" && (
        <div className="col-span-3">
          <PageContainer pl={2.5} pr={10} minH={55} pt={5}>
            <div className="font-extrabold mb-2 text-lg">
              {detail.basic_info.company_name}
            </div>
            <div className="flex justify-between font-bold">
              <div>시가총액</div>
              <div>{costMap(stock.market_cap)}원</div>
            </div>
            <div className="flex justify-between">
              <div>상장주식수</div>
              <div>{(+detail.number_of_listings).toLocaleString()}천주</div>
            </div>
            <div className="flex justify-between">
              <div>액면가</div>
              <div>{detail.face_value}원</div>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between">
              <div>자본금</div>
              <div>{(+detail.capital_stock).toLocaleString()}억원</div>
            </div>
            <div className="flex justify-between">
              <div>신용비율</div>
              <div>{Math.round(detail.credit_rate * 100) / 100}%</div>
            </div>
            <div className="flex justify-between">
              <div>대용가</div>
              <div>{(+detail.substitute_price).toLocaleString()}원</div>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between">
              <div>PER | EPS</div>
              <div>
                {Math.round(detail.per * 100) / 100}배 |{" "}
                {(+detail.eps).toLocaleString()}원
              </div>
            </div>
            <div className="flex justify-between">
              <div>PBR | BPS</div>
              <div>
                {Math.round(detail.pbr * 100) / 100}배 |{" "}
                {(+detail.bps).toLocaleString()}원
              </div>
            </div>
            <div className="flex justify-between">
              <div>ROE</div>
              <div>{Math.round(detail.roe * 100) / 100}%</div>
            </div>
            <div className="flex justify-between">
              <div>EV</div>
              <div>{Math.round(detail.ev * 100) / 100}배</div>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between">
              <div>매출액</div>
              <div>{(+detail.sales_revenue).toLocaleString()}억원</div>
            </div>
            <div className="flex justify-between">
              <div>영업이익</div>
              <div>{(+detail.operating_income).toLocaleString()}억원</div>
            </div>
            <div className="flex justify-between">
              <div>당기순이익</div>
              <div>{(+detail.net_income).toLocaleString()}억원</div>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold">
              <div>외인소진율</div>
              <div>{Math.round(detail.foreigner_percent * 100) / 100}%</div>
            </div>
            <div className="flex justify-between">
              <div>유통주식</div>
              <div>{(+detail.shares_outstanding).toLocaleString()}천주</div>
            </div>
            <div className="flex justify-between">
              <div>유통비율</div>
              <div>
                {Math.round(detail.shares_outstanding_rate * 100) / 100}%
              </div>
            </div>
          </PageContainer>
        </div>
      )}
    </div>
  );
}
