import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListHeader from "../components/ListHeader";
import PageContainer from "../components/PageContainer";
import Pagenation from "../components/Pagenation";
import { getItems } from "../api/notice";
import Tooltip from "../components/commons/Tooltip";
import { ReactComponent as NoticeWriteIcon } from "../assets/noticeWriteIcon.svg";
import useIsAdmin from "../util/useIsAdmin";

const contents = [
  {
    title: "제목1",
    src: "https://source.unsplash.com/random/400x400",
    alt: "content1",
    content: "paragraph1/nparagraph2/nparagraph3/nparagraph4",
  },
  {
    title: "제목2",
    src: "https://source.unsplash.com/random/400x400",
    alt: "content2",
    content: "paragraph1/nparagraph2/nparagraph3/nparagraph4",
  },
  {
    title: "제목3",
    src: "https://source.unsplash.com/random/400x400",
    alt: "content3",
    content: "paragraph1/nparagraph2/nparagraph3/nparagraph4",
  },
  {
    title: "제목4",
    src: "https://source.unsplash.com/random/400x400",
    alt: "content4",
    content: "paragraph1/nparagraph2/nparagraph3/nparagraph4",
  },
  {
    title: "제목5",
    src: "https://source.unsplash.com/random/400x400",
    alt: "content5",
    content: "paragraph1/nparagraph2/nparagraph3/nparagraph4",
  },
];

export default function Announcement() {
  const navigate = useNavigate();
  const [noticeItems, setNoticeItems] = useState([]); // 공지사항 데이터
  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 10;
  const isAdmin = useIsAdmin();

  // 처음 화면 변수 초기화
  const init = async () => {
    const data = await getItems(pageNo, pageSize);
    // 전체 공지사항 개수
    setTotalCount(data.count);
    // 첫페이지 공지사항 아이템들
    setNoticeItems(data.results);
  };

  useEffect(() => {
    init(pageNo, 10);
  }, []);

  // 종목 클릭 시 해당 종목 디테일 페이지로
  const goDetailPage = (id) => {
    navigate({ pathname: `/notice/${id}` });
  };

  const onClickFirst = async () => {
    setPageNo(1);
    const data = await getItems(1, pageSize);
    // 첫페이지 공지사항 아이템들
    setNoticeItems(data.results);
  };

  const onClickLeft = async () => {
    setPageNo((cur) => cur - 1);
    const data = await getItems(pageNo - 1, pageSize);
    setNoticeItems(data.results);
  };

  const onClickRight = async () => {
    setPageNo((cur) => cur + 1);
    const data = await getItems(pageNo + 1, pageSize);
    setNoticeItems(data.results);
  };

  const onClickLast = async () => {
    const lastPageNum =
      parseInt(totalCount / pageSize) + (totalCount % pageSize === 0 ? 0 : 1);
    setPageNo(lastPageNum);
    const data = await getItems(lastPageNum, pageSize);
    // 마지막 페이지 공지사항 아이템들
    setNoticeItems(data.results);
  };

  const onClickNumber = async (num) => {
    setPageNo(num);
    const data = await getItems(num, pageSize);
    setNoticeItems(data.results);
  };

  const noticeList = () => {
    const list = [];
    noticeItems.forEach((element, idx) => {
      list.push(
        <li
          key={element.id}
          className="grid grid-cols-12 h-12 hover:bg-indigo-50 hover:cursor-pointer border-b xl:text-base text-sm"
        >
          <p
            className="col-span-6 my-auto"
            onClick={goDetailPage.bind(this, element.id)}
          >
            {element.title}
          </p>
          <p
            className="col-span-3 my-auto"
            onClick={goDetailPage.bind(this, element.id)}
          >
            {element.user.name}
          </p>
          <p
            className="col-span-3 my-auto"
            onClick={goDetailPage.bind(this, element.id)}
          >
            {element.created_at.substring(0, 10)}
          </p>
        </li>
      );
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
    console.log(word);
    // 검색어 state을 word로 변경
    // 전반적으로 notice item 검색 api에 word 조건 추가
    // pageNo 1로 초기화
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
        />
      </div>
      <div className="border-collapse w-full text-center my-10 xl:text-base text-sm">
        <ul>
          <li className="grid grid-cols-12 h-12 bg-slate-100">
            <p className="col-span-6 my-auto">제목</p>
            <p className="col-span-3 my-auto">작성자</p>
            <p className="col-span-3 my-auto">등록일</p>
          </li>
          {noticeList()}
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
      ></Pagenation>
      <div className="relative float-right">
        <Tooltip contents={contents} pos={"-left-9"} right={false}></Tooltip>
        <span>공지사항</span>
        <Tooltip contents={contents} pos={"left-16"} right={true}></Tooltip>
      </div>
    </PageContainer>
  );
}
