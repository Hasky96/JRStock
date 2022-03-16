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
      <div className="mt-5 flex">
        <div>
          <button className="px-2 py-1.5 mr-2 border border-slate-300 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-600 rounded-lg grid grid-cols-3 hover:fill-yellow-600">
            <svg
              enable-background="new 0 0 64 64"
              id="Layer_1"
              version="1.1"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              className="col-span-1"
            >
              <g>
                <path d="M55.736,13.636l-4.368-4.362c-0.451-0.451-1.044-0.677-1.636-0.677c-0.592,0-1.184,0.225-1.635,0.676l-3.494,3.484   l7.639,7.626l3.494-3.483C56.639,15.998,56.639,14.535,55.736,13.636z" />
                <polygon points="21.922,35.396 29.562,43.023 50.607,22.017 42.967,14.39  " />
                <polygon points="20.273,37.028 18.642,46.28 27.913,44.654  " />
                <path d="M41.393,50.403H12.587V21.597h20.329l5.01-5H10.82c-1.779,0-3.234,1.455-3.234,3.234v32.339   c0,1.779,1.455,3.234,3.234,3.234h32.339c1.779,0,3.234-1.455,3.234-3.234V29.049l-5,4.991V50.403z" />
              </g>
            </svg>
            <div className="col-span-2 my-auto">&nbsp;글쓰기</div>
          </button>
        </div>
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
