import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ListHeader from "../components/ListHeader";
import PageContainer from "../components/PageContainer";
import Pagenation from "../components/Pagenation2";
import { getItems } from "../api/notice";
import Tooltip from "../components/commons/Tooltip";
import Tooltip2 from "../components/commons/Tooltip2";
import { ReactComponent as NoticeWriteIcon } from "../assets/noticeWriteIcon.svg";
import useIsAdmin from "../util/useIsAdmin";
import ToolContent1 from "../components/commons/ToolContent1";
import NoticeListItem from "../components/notice/NoticeListItem";
import { ReactComponent as Spinner } from "../assets/spinner.svg";

// const contents = [
//   {
//     // title: "이동평균수렴확산지수\n(골든크로스)",
//     title: "이동평균선(상향돌파)",
//     src: "ma_high_graph.png",
//     alt: "content1",
//     content:
//       "이동평균선은 일정기간 동안의 주가를 산술 평균한 값이다. 주식에서는 주로 장기(120일), 중기(60일), 단기(5, 20일)의 이동평균선이 있다. 종가 기준으로 날짜를 합산하여 평균값을 구한다./n" +
//       "period: 이동평균선 기간 변수\nerr: 이동평균선 허용 오차 범위 변수\nweight: 가중치 변수",
//   },
// ];

export default function Announcement() {
  const navigate = useNavigate();
  const [noticeItems, setNoticeItems] = useState([]); // 공지사항 데이터
  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 10;
  const isAdmin = useIsAdmin();
  const [timer, setTimer] = useState();
  const inputRef = useRef();
  const [isLoading, setIsLoading] = useState(true);

  const getNotice = async (pN) => {
    setIsLoading(true);
    const data = await getItems(pN, pageSize, inputRef.current.value);
    setNoticeItems(data.results);
    setTotalCount(data.count);
    setIsLoading(false);
  };

  useEffect(() => {
    getNotice(pageNo);
  }, [pageNo]);

  const noticeList = () => {
    const list = [];
    noticeItems.forEach((element) => {
      list.push(<NoticeListItem element={element} key={element.id} />);
    });
    return list;
  }; // 화면에 그려줄 공지사항 목록

  const onClickFilter = (filter) => {
    console.log(filter);
    // 필터 state를 filter 로 변경
    // 전반적인 notice item 검색 api에 filter 조건 추가
    // pageNo 1로 초기화
  };

  const onSearch = (word) => {
    // 이전에 보내려던 요청 삭제
    clearTimeout(timer);
    const newTimer = setTimeout(async () => {
      if (pageNo === 1) getNotice(1);
      else setPageNo(1);
    }, 500);
    setTimer(newTimer);
  };

  return (
    <PageContainer>
      <div className="mt-5 flex">
        {isAdmin && (
          <div>
            <button
              className="px-2 py-1.5 mr-2 border border-slate-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 rounded-lg grid grid-cols-3 hover:fill-indigo-600"
              onClick={function () {
                navigate("create");
              }}
            >
              <NoticeWriteIcon />
              <div className="col-span-2 my-auto">&nbsp;글쓰기</div>
            </button>
          </div>
        )}
        <ListHeader
          optionKind={["전체 보기"]}
          onClickFilter={onClickFilter}
          onSearch={onSearch}
          inputRef={inputRef}
        />
      </div>
      <div className="border-collapse w-full text-center my-10 xl:text-base text-sm">
        <ul>
          <li className="grid grid-cols-12 h-12 bg-slate-100">
            <p className="col-span-6 my-auto">제목</p>
            <p className="col-span-3 my-auto">작성자</p>
            <p className="col-span-3 my-auto">등록일</p>
          </li>
          {isLoading && (
            <div className="flex justify-center my-10">
              <Spinner />
            </div>
          )}
          {noticeList()}
        </ul>
      </div>
      <Pagenation
        selectedNum={pageNo}
        totalCnt={totalCount}
        pageSize={pageSize}
        setPageNo={setPageNo}
      ></Pagenation>
      {/* <div className="relative float-right">
        <Tooltip iPos={"bottom-0 -left-6"} cPos={"bottom-[25px] -left-[400px]"}>
          <ToolContent1 contents={contents} />
        </Tooltip>
        <Tooltip2 title={"공지사항"} cPos={"-left-[200px]"}>
          <span>공지사항 내용 입니다.</span>
        </Tooltip2>
        <Tooltip iPos={"-bottom-[2px] left-[58px]"} cPos={"-left-[250px]"}>
          <ToolContent1 contents={contents} />
        </Tooltip>
      </div> */}
      {/* <div className="ml-20 relative">이동평균선</div> */}
    </PageContainer>
  );
}
