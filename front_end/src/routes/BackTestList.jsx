import { useEffect, useState } from "react";
import ListItem from "../components/BackTestList/ListItem";
import ListTitle from "../components/BackTestList/ListTitle";
import PageContainer from "../components/PageContainer";
import ListHeader from "../components/ListHeader";
import Pagenation from "../components/Pagenation";
import { getItems } from "../api/notice";

export default function BackTestList() {
  const data = [
    {
      id: 0,
      title: "나만의 전략1",
      created_at: "2022-03-08",
    },
    {
      id: 1,
      title: "나만의 전략2",
      created_at: "2022-03-09",
    },
  ];

  const [backTestItems, setbackTestItems] = useState(data);
  const [checkedList, setcheckedList] = useState([]);

  const onCheckedAll = (e) => {
    if (e.target.checked) {
      const checkedListArray = [];

      backTestItems.forEach((item) => checkedListArray.push(item.id));

      setcheckedList(checkedListArray);
    } else {
      setcheckedList([]);
    }
  };

  // 개별 체크 클릭 시
  const onChecked = (e, index) => {
    if (e.target.checked) {
      setcheckedList([...checkedList, index]);
    } else {
      setcheckedList(checkedList.filter((id) => id !== index));
    }
  };

  const paintBackTestItems = backTestItems.map((item, index) => {
    return (
      <ListItem
        key={index}
        item={item}
        index={index}
        checked={checkedList.includes(index) ? true : false}
        onChecked={onChecked}
      />
    );
  });

  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 10;

  const onClickFirst = async () => {
    setPageNo(1);
    const data = await getItems(1, pageSize);
    // 첫페이지 공지사항 아이템들
    setbackTestItems(data.results);
  };

  const onClickLeft = async () => {
    setPageNo((cur) => cur - 1);
    const data = await getItems(pageNo - 1, pageSize);
    setbackTestItems(data.results);
  };

  const onClickRight = async () => {
    setPageNo((cur) => cur + 1);
    const data = await getItems(pageNo + 1, pageSize);
    setbackTestItems(data.results);
  };

  const onClickLast = async () => {
    const lastPageNum =
      parseInt(totalCount / pageSize) + (totalCount % pageSize === 0 ? 0 : 1);
    setPageNo(lastPageNum);
    const data = await getItems(lastPageNum, pageSize);
    // 마지막 페이지 공지사항 아이템들
    setbackTestItems(data.results);
  };

  const onClickNumber = async (num) => {
    setPageNo(num);
    const data = await getItems(num, pageSize);
    setbackTestItems(data.results);
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
    <PageContainer>
      <ListHeader
        optionKind={["aaa", "bbb", "ccc"]}
        onClickFilter={onClickFilter}
        onSearch={onSearch}
      />
      <div className="mt-5">
        <table className="table-auto w-full text-left">
          <colgroup>
            <col span="1" style={{ width: 5 + "%" }} />
            <col span="1" style={{ width: 5 + "%" }} />
            <col span="1" style={{ width: 70 + "%" }} />
            <col span="1" style={{ width: 15 + "%" }} />
          </colgroup>
          <ListTitle
            onCheckedAll={onCheckedAll}
            checked={
              checkedList.length && checkedList.length === backTestItems.length
                ? true
                : false
            }
            titles={["No", "테스트 이름", "생성일"]}
          />
          <tbody>{backTestItems.length && paintBackTestItems}</tbody>
        </table>
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
