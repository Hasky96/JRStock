import { useEffect, useState } from "react";
import ListTitle from "../components/ranking/ListTitle";
import TabBar from "../components/TabBar/TabBar";
import styles from "../components/ranking/list.module.css";
import RankItem from "../components/ranking/RankItem";
import Pagenation from "../components/Pagenation";
import { dayData, weekData, monthData } from "../components/ranking/data.js";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Ranking() {
  const [currentTab, setCurrentTab] = useState("일간");
  const tabInfo = ["일간", "주간", "월간"];

  const init = async () => {
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

  useEffect(() => {
    // 초기 데이터 설정
    init();
  }, []);

  // 탭이 바뀌면 초기 데이터 다시 설정
  useEffect(() => {
    init();
  }, [currentTab]);

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
    setPageNo(1);
  };
  const onClickLeft = async () => {
    setPageNo((cur) => cur - 1);
  };

  const onClickRight = async () => {
    setPageNo((cur) => cur + 1);
  };

  const onClickLast = async () => {
    const lastPageNum =
      parseInt(totalCount / pageSize) + (totalCount % pageSize === 0 ? 0 : 1);
    setPageNo(lastPageNum);
  };

  const onClickNumber = async (num) => {
    setPageNo(num);
  };

  return (
    <div className={"my-pt-28 my-pl-10 my-pr-10"}>
      <div className={"bg-indigo-900 rounded-lg shadow-lg p-5 my-h-80"}>
        {/* 제목 */}
        <div className="m-5">
          <span
            id="kospi"
            className={classNames("text-2xl font-bold", "text-white")}
          >
            수익률 순위
          </span>
        </div>
        {/* 탭바 */}
        <div className="text-white">
          <TabBar setCurrentTab={setCurrentTab} tabInfo={tabInfo} />
        </div>
        {/* 랭킹 테이블 */}
        <div className="mt-5">
          <table className={styles.table}>
            <colgroup>
              <col span="1" style={{ width: 8 + "%" }} />
              <col span="1" style={{ width: 8 + "%" }} />
              <col span="1" style={{ width: 15 + "%" }} />
              <col span="1" style={{ width: 15 + "%" }} />
              <col span="1" style={{ width: 15 + "%" }} />
              <col span="1" style={{ width: 15 + "%" }} />
              <col span="1" style={{ width: 15 + "%" }} />
              <col span="1" style={{ width: 6 + "%" }} />
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
      </div>
    </div>
  );
}
