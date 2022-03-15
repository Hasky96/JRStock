import { useState, useEffect } from "react";
import ListHeader from "../ListHeader";
import Pagenation from "../Pagenation";

export default function Board() {
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const boards = [
    {
      title: "떡상 각",
      author: "[부울****",
      views: "70",
      date: "2022.03.14 13:48",
      like: "30",
      disLike: "2",
    },
    {
      title: "떡락 각",
      author: "[대전****",
      views: "50",
      date: "2022.03.14 15:48",
      like: "1",
      disLike: "20",
    },
    {
      title: "오늘 종가",
      author: "[서울****",
      views: "30",
      date: "2022.03.14 18:10",
      like: "3",
      disLike: "2",
    },
  ];

  const init = async () => {
    setTotalCount(boards.length);
  };

  useEffect(() => {
    init();
  });

  // 페이지네이션 동작
  const onClickFirst = async () => {
    setPageNo(1);
    // const data = await getItems(1, pageSize);
    // setNoticeItems(data.results);
  };

  const onClickLeft = async () => {
    setPageNo((cur) => cur - 1);
    // const data = await getItems(pageNo - 1, pageSize);
    // setNoticeItems(data.results);
  };

  const onClickRight = async () => {
    setPageNo((cur) => cur + 1);
    // const data = await getItems(pageNo + 1, pageSize);
    // setNoticeItems(data.results);
  };

  const onClickLast = async () => {
    const lastPageNum =
      parseInt(totalCount / pageSize) + (totalCount % pageSize === 0 ? 0 : 1);
    setPageNo(lastPageNum);
    // const data = await getItems(lastPageNum, pageSize);
    // setNoticeItems(data.results);
  };

  const onClickNumber = async (num) => {
    setPageNo(num);
    // const data = await getItems(num, pageSize);
    // setNoticeItems(data.results);
  };

  // 게시판 데이터로 li태그 만들기
  const boardList = () => {
    const result = [];
    for (let i = 0; i < boards.length; i++) {
      result.push(<hr key={i}></hr>);
      result.push(
        <li
          key={"board" + i}
          className="grid grid-cols-12 h-8 hover:bg-yellow-50 hover:cursor-pointer"
        >
          <p className="col-span-2 my-auto">{boards[i].date}</p>
          <p className="col-span-6 my-auto">{boards[i].title}</p>
          <p className="col-span-1 my-auto">{boards[i].author}</p>
          <p className="col-span-1 my-auto">{boards[i].views}</p>
          <p className="col-span-1 my-auto">{boards[i].like}</p>
          <p className="col-span-1 my-auto">{boards[i].disLike}</p>
        </li>
      );
    }
    return result;
  };

  const onClickFilter = (filter) => {
    console.log(filter);
    // 필터 state를 filter 로 변경
    // 전반적인 notice item 검색 api에 filter 조건 추가
    // pageNo 1로 초기화
  };

  const onSearch = (word) => {
    console.log(word);
    // 검색어 state을 word로 변경
    // 전반적으로 notice item 검색 api에 word 조건 추가
    // pageNo 1로 초기화
  };

  return (
    <div>
      <div className="mt-5">
        <ListHeader
          optionKind={["전체 보기", "내 글 보기"]}
          onClickFilter={onClickFilter}
          onSearch={onSearch}
        />
      </div>
      <div className="border-collapse w-full text-center my-5">
        <ul>
          <li className="grid grid-cols-12 h-12 bg-slate-100">
            <p className="col-span-2 my-auto">날짜</p>
            <p className="col-span-6 my-auto">제목</p>
            <p className="col-span-1 my-auto">글쓴이</p>
            <p className="col-span-1 my-auto">조회</p>
            <p className="col-span-1 my-auto">공감</p>
            <p className="col-span-1 my-auto">비공감</p>
          </li>
          {boardList()}
        </ul>
      </div>
      <Pagenation
        selectedNum={pageNo}
        totalCnt={totalCount}
        pageSize={pageSize}
        onClickFirst={onClickFirst}
        onClickLeft={onClickLeft}
        onClickRight={onClickRight}
        onClickLast={onClickLast}
        onClickNumber={onClickNumber}
      />
    </div>
  );
}
