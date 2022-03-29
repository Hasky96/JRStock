import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBacktest } from "../api/backtest";
import PageContainer from "../components/PageContainer";
import ListHeader from "../components/ListHeader";
import ListTitle from "../components/BackTestList/ListTitle";
import ListItem from "../components/BackTestList/ListItem";
import Pagenation from "../components/Pagenation";
import { ReactComponent as Create } from "../assets/create.svg";

export default function BackTestList() {
  const [backTestItems, setbackTestItems] = useState([]);
  const [checkedList, setcheckedList] = useState([]);
  const [totalCount, setTotalCount] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 10;

  const fetchBackTestItems = async () => {
    const res = await getBacktest({ page: pageNo, size: pageSize });
    return res.data;
  };

  useEffect(async () => {
    const { count, results } = await fetchBackTestItems();
    setTotalCount(count);
    setbackTestItems(results);
  }, [pageNo]);

  const onCheckedAll = (e) => {
    if (e.target.checked) {
      setcheckedList(backTestItems.map((item) => item.id));
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
      <div className="flex">
        <Link to="create">
          <button className="flex gap-1 px-2 py-1.5 mr-2 border border-slate-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 hover:fill-indigo-600 rounded-lg duration-300">
            <Create />
            <div className="col-span-2 my-auto">백테스트 생성</div>
          </button>
        </Link>
        <ListHeader
          optionKind={["aaa", "bbb", "ccc"]}
          onClickFilter={onClickFilter}
          onSearch={onSearch}
        />
      </div>

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
          {backTestItems.length ? (
            <tbody>{paintBackTestItems}</tbody>
          ) : (
            <td colSpan="4" className="text-center py-5">
              생성된 백테스트가 없습니다.
            </td>
          )}
        </table>
      </div>
      {backTestItems.length ? (
        <div className="relative w-full flex justify-center">
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
      ) : (
        ""
      )}
    </PageContainer>
  );
}
