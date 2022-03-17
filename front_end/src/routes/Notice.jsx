import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListHeader from "../components/ListHeader";
import PageContainer from "../components/PageContainer";
import Pagenation from "../components/Pagenation";
import { getItems } from "../api/notice";

export default function Announcement() {
  const navigate = useNavigate();
  const [checkedList, setcheckedList] = useState([]);
  const [noticeItems, setNoticeItems] = useState([]); // 공지사항 데이터
  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 10;

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

  // 전체 체크 클릭 시
  const onCheckedAll = (e) => {
    if (e.target.checked) {
      const checkedListArray = [];

      noticeItems.forEach((notice) => checkedListArray.push(notice.id));

      setcheckedList(checkedListArray);
    } else {
      setcheckedList([]);
    }
  };

  // 개별 체크 클릭 시
  const onChecked = (id, e) => {
    if (e.target.checked) {
      setcheckedList([...checkedList, id]);
    } else {
      setcheckedList(checkedList.filter((el) => el !== id));
    }
  };

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
          className="grid grid-cols-12 h-12 hover:bg-yellow-50 hover:cursor-pointer"
        >
          <div className="col-span-1 my-auto grid grid-cols-2">
            <p className="col-span-1">
              <input
                id="total-notice"
                name="total-notice"
                type="checkbox"
                className="h-4 w-4 text-amber-300 focus:ring-amber-500 border-gray-300 rounded"
                onChange={onChecked.bind(this, element.id)}
                checked={checkedList.includes(element.id) ? true : false}
              />
            </p>
            <p
              className="col-span-1"
              onClick={goDetailPage.bind(this, element.id)}
            >
              {element.id}
            </p>
          </div>
          <p
            className="col-span-5 my-auto"
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
      <ListHeader
        optionKind={["전체보기"]}
        onClickFilter={onClickFilter}
        onSearch={onSearch}
      />
      <div className="border-collapse w-full text-center my-10">
        <ul>
          <li className="grid grid-cols-12 h-12 bg-slate-100">
            <div className="col-span-1 my-auto grid grid-cols-2">
              <p className="col-span-1">
                <input
                  id="total-notice"
                  name="total-notice"
                  type="checkbox"
                  className="h-4 w-4 text-amber-300 focus:ring-amber-500 border-gray-300 rounded"
                  onChange={onCheckedAll}
                  checked={
                    checkedList.length === 0
                      ? false
                      : checkedList.length === noticeItems.length
                      ? true
                      : false
                  }
                />
              </p>
              <p className="col-span-1">No</p>
            </div>
            <p className="col-span-5 my-auto">제목</p>
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
    </PageContainer>
  );
}
