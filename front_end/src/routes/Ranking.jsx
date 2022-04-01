import { useEffect, useState, useRef } from "react";

import TabBar from "../components/TabBar/TabBar";

import Pagenation from "../components/Pagenation2";
import PageContainer from "../components/PageContainer";
import { getBacktestRank } from "../api/ranking";
import OnOffToggle from "../components/OnOffToggle";
import Searchbar from "../components/ranking/Searchbar";
import { RankingTable } from "../components/ranking/RankingTable";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const tabMap = new Map([
  ["월간", "today"],
  ["주간", "week"],
  ["월간", "month"],
]);

export default function Ranking() {
  const [currentTab, setCurrentTab] = useState("일간");
  const tabInfo = ["일간", "주간", "월간"];
  const [toggle, setToggle] = useState(false); // 필터 미적용
  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const pageSize = 10;
  const [timer, setTimer] = useState();
  const inputRef = useRef();
  const [isLoading, setIsLoading] = useState(true);

  // 탭, 토글, 검색어가 바뀌면 초기 데이터 다시 설정
  const init = async () => {
    if (pageNo === 1) getData(1);
    else setPageNo(1);
  };

  useEffect(() => {
    // 초기에 검색창 잠깐 보이는 것 방지
    const el = document.getElementById("rank-search-bar");
    el.classList.toggle("opacity-0");
    el.classList.toggle("invisible");
  }, []);

  // 탭, 토글이 바뀌면 초기 데이터 다시 설정
  useEffect(() => {
    init();
  }, [toggle, currentTab]);

  // 검색창 on/off
  useEffect(() => {
    const el = document.getElementById("rank-search-bar");
    el.classList.toggle("opacity-0");
    el.classList.toggle("invisible");
  }, [toggle]);

  // 페이지 바뀔 때 데이터 요청
  useEffect(() => {
    getData(pageNo);
  }, [pageNo]);

  const getData = async (pN) => {
    setIsLoading(true);
    let resData = await getBacktestRank(
      pN,
      pageSize,
      tabMap.get(currentTab),
      toggle,
      inputRef.current.value
    );
    setData(resData.results);
    setTotalCount(resData.count);
    setIsLoading(false);
  };

  const onKeyUp = (e) => {
    e.preventDefault();

    // 새로운 데이터 읽어오기
    clearTimeout(timer);
    const newTimer = setTimeout(async () => {
      init();
    }, 500);
    setTimer(newTimer);
  };

  return (
    <PageContainer>
      <div className="flex justify-between  items-center">
        {/* 제목 */}
        <div className="flex m-5 gap-2">
          <span
            id="kospi"
            className={classNames("text-2xl font-bold", "text-black")}
          >
            수익률 순위
          </span>
          <OnOffToggle toggle={toggle} setToggle={setToggle} />
        </div>
        {/* 검색창  */}
        {<Searchbar onKeyUp={onKeyUp} inputRef={inputRef} />}
      </div>
      {/* 탭바 */}
      <div className="text-black">
        <TabBar setCurrentTab={setCurrentTab} tabInfo={tabInfo} />
      </div>

      {/* 랭킹 테이블 */}
      <div className="mt-5 overflow-y-scroll">
        <RankingTable data={data} isLoading={isLoading} />
      </div>
      {/* 페이지 네이션 */}
      <Pagenation
        selectedNum={pageNo}
        totalCnt={totalCount}
        pageSize={pageSize}
        setPageNo={setPageNo}
      ></Pagenation>
    </PageContainer>
  );
}
