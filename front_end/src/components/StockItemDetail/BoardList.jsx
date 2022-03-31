import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ListHeader from "../ListHeader";
import Pagenation from "../Pagenation";
import { getBoardList, getMyBoardList } from "../../api/stock";
import { timeMark } from "../../config/datetime";

export default function BoardList() {
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [boards, setBoards] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [filterState, setFilterState] = useState("전체 보기");
  const [search, setSearch] = useState("");
  const [timer, setTimer] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const pageSize = 14;

  const init = async () => {
    let res;
    if (filterState === "전체 보기") {
      res = await getBoardList(id, pageNo, pageSize, search);
    } else if (filterState === "내 글 보기") {
      res = await getMyBoardList(id, pageNo, pageSize, search);
    }
    setBoards(res.data.results);
    setTotalCount(res.data.count);

    if (sessionStorage.getItem("access_token")) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  };

  useEffect(() => {
    init();
  }, [pageNo, filterState, search]);

  // 페이지네이션 동작
  const onClickFirst = async () => {
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

  // 게시글 상세 페이지로 이동
  const goDetail = (board) => {
    navigate(`${board.id}`);
  };

  // 게시판 데이터로 li태그 만들기
  const boardList = () => {
    const result = [];
    for (let i = 0; i < boards.length; i++) {
      result.push(<hr key={i}></hr>);
      result.push(
        <li
          key={"board" + i}
          className="grid grid-cols-12 h-8 hover:bg-indigo-50 hover:cursor-pointer"
          onClick={goDetail.bind(this, boards[i])}
        >
          <p className="col-span-2 my-auto">{boards[i].user.name}</p>
          <p className="col-span-6 my-auto">{boards[i].title}</p>
          <p className="col-span-2 my-auto">{timeMark(boards[i].created_at)}</p>
          <p className="col-span-2 my-auto">{timeMark(boards[i].updated_at)}</p>
        </li>
      );
    }
    return result;
  };

  // 필터
  const onClickFilter = (filter) => {
    setPageNo(1);
    setFilterState(filter);
  };

  // 검색
  const onSearch = (word) => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      setPageNo(1);
      setSearch(word);
    }, 500);
    setTimer(newTimer);
  };

  return (
    <div>
      <div className="mt-5 flex">
        <div>
          <button
            className="px-2 py-1.5 mr-2 border border-slate-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 rounded-lg grid grid-cols-3 hover:fill-indigo-600"
            onClick={function () {
              navigate("new");
            }}
          >
            <svg
              enableBackground="new 0 0 64 64"
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
          optionKind={isLogin ? ["전체 보기", "내 글 보기"] : ["전체 보기"]}
          onClickFilter={onClickFilter}
          onSearch={onSearch}
        />
      </div>
      <div className="border-collapse w-full text-center my-5">
        <ul className="xl:text-base lg:text-sm text-xs">
          <li className="grid grid-cols-12 h-12 bg-slate-100">
            <p className="col-span-2 my-auto">글쓴이</p>
            <p className="col-span-6 my-auto">제목</p>
            <p className="col-span-2 my-auto">작성시간</p>
            <p className="col-span-2 my-auto">수정시간</p>
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
