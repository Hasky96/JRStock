import { useEffect, useState } from "react";
import ListTitle from "../components/ranking/ListTitle";
import TabBar from "../components/TabBar/TabBar";
import styles from "../components/ranking/list.module.css";
import RankItem from "../components/ranking/RankItem";
import Pagenation from "../components/Pagenation";
import PageContainer from "../components/PageContainer";
import {
  dayData,
  weekData,
  monthData,
  dayData2,
  weekData2,
  monthData2,
} from "../components/ranking/data.js";
import OnOffToggle from "../components/OnOffToggle";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Ranking() {
  const [currentTab, setCurrentTab] = useState("일간");
  const tabInfo = ["일간", "주간", "월간"];
  const [searchWord, setSearchWord] = useState("");
  const [toggle, setToggle] = useState(false); // 필터 미적용

  const initToggleOff = async () => {
    // 데이터 요청
    // 탭 종류에 따라 다르게 요청
    let resData;
    if (currentTab === "일간") {
      resData = dayData;
    } else if (currentTab === "주간") {
      resData = weekData;
    } else if (currentTab === "월간") {
      resData = monthData;
    }
    // 데이터 설정
    setPageNo(1);
    setData(resData);
    setTotalCount(resData.length);
  };

  const initToggleOn = async () => {
    // 데이터 요청
    // 탭 종류에 따라 다르게 요청
    // search word 필터를 적용한 호출
    let resData;
    if (currentTab === "일간") {
      resData = dayData2;
    } else if (currentTab === "주간") {
      resData = weekData2;
    } else if (currentTab === "월간") {
      resData = monthData2;
    }
    // 데이터 설정
    setPageNo(1);
    setData(resData);
    setTotalCount(resData.length);
  };

  useEffect(() => {
    // 초기 데이터 설정
    initToggleOff();

    // 초기에 검색창 잠깐 보이는 것 방지
    const el = document.getElementById("rank-search-bar");
    el.classList.toggle("opacity-0");
    el.classList.toggle("invisible");
  }, []);

  // 탭이 바뀌면 초기 데이터 다시 설정
  useEffect(() => {
    console.log(toggle);
    if (toggle) {
      initToggleOn();
    } else {
      // 데이터 초기화
      initToggleOff();
    }
  }, [currentTab]);

  // 검색창 on/off 시
  useEffect(() => {
    // 검색어 초기화
    setSearchWord("");

    const el = document.getElementById("rank-search-bar");
    el.classList.toggle("opacity-0");
    el.classList.toggle("invisible");

    if (toggle) {
      initToggleOn();
    } else {
      // 데이터 초기화
      initToggleOff();
    }
  }, [toggle]);

  const rankList = () => {
    const list = [];
    data.forEach((el, idx) => {
      list.push(<RankItem item={el} index={idx} key={idx} />);
    });
    return list;
  };

  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState();
  const pageSize = 10;

  const onClickFirst = () => {
    if (toggle) {
      initToggleOn();
    } else {
      initToggleOff();
    }
  };

  // toggle 에 따라 다르게 api 호출
  const onClickLeft = async () => {
    setPageNo((cur) => cur - 1);
  };

  // toggle 에 따라 다르게 api 호출
  const onClickRight = async () => {
    setPageNo((cur) => cur + 1);
  };

  // toggle 에 따라 다르게 api 호출
  const onClickLast = async () => {
    const lastPageNum =
      parseInt(totalCount / pageSize) + (totalCount % pageSize === 0 ? 0 : 1);
    setPageNo(lastPageNum);
  };

  // toggle 에 따라 다르게 api 호출
  const onClickNumber = async (num) => {
    setPageNo(num);
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
        {
          <div
            className="flex h-9 w-1/2 invisible opacity-0 duration-500"
            id="rank-search-bar"
          >
            <div className="flex w-full justify-end xl:gap-4 gap-1">
              <label
                className="xl:text-xl text-sm flex items-center text-black"
                htmlFor="rank-search"
              >
                순위 검색
              </label>
              <div className="relative w-4/5">
                {/* 검색 아이콘 */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-2 top-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#d1d5db"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {/* 검색창 */}
                <input
                  type="text"
                  name="price"
                  id="rank-search"
                  className="hover:border-active focus:ring-active focus:border-active text-xl block w-full h-9 pl-9 pr-9 border-gray-100 bg-gray-100 rounded-lg"
                  placeholder="Search..."
                  onKeyUp={(e) => {
                    e.preventDefault();
                    setSearchWord(e.target.value);
                    initToggleOn();
                  }}
                />
              </div>
            </div>
          </div>
        }
      </div>
      {/* 탭바 */}
      <div className="text-black">
        <TabBar setCurrentTab={setCurrentTab} tabInfo={tabInfo} />
      </div>
      {/* 랭킹 테이블 */}
      <div className="mt-5">
        <table className={styles.table}>
          <colgroup>
            <col span="1" style={{ width: 8 + "%" }} />
            <col span="1" style={{ width: 8 + "%" }} />
            <col span="1" style={{ width: 15 + "%" }} />
            <col span="1" style={{ width: 10 + "%" }} />
            <col span="1" style={{ width: 15 + "%" }} />
            <col span="1" style={{ width: 15 + "%" }} />
            <col span="1" style={{ width: 15 + "%" }} />
            <col span="1" style={{ width: 10 + "%" }} />
          </colgroup>
          <ListTitle
            titles={[
              "순위",
              "프로필",
              "이름",
              "수익율",
              "투자원금",
              "총 손익",
              "최종 자산",
              "매매일수",
            ]}
          />
          <tbody>{data && rankList()}</tbody>
        </table>
      </div>
      {/* 페이지 네이션 */}
      <Pagenation
        selectedNum={pageNo}
        totalCnt={totalCount}
        pageSize={pageSize}
        onClickFirst={onClickFirst}
        onClickLeft={onClickLeft}
        onClickRight={onClickRight}
        onClickLast={onClickLast}
        onClickNumber={onClickNumber}
      ></Pagenation>
    </PageContainer>
  );
}
