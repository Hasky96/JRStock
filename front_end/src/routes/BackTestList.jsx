import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBacktestList } from "../api/backtest";
import PageContainer from "../components/PageContainer";
import ListTitle from "../components/BackTestList/ListTitle";
import ListItem from "../components/BackTestList/ListItem";
import Pagenation2 from "../components/Pagenation2";
import SearchBar from "../components/BackTestList/SearchBar";
import { ReactComponent as Create } from "../assets/create.svg";

export default function BackTestList() {
  const [backTestItems, setbackTestItems] = useState([]);
  const [checkedList, setcheckedList] = useState([]);
  const [totalCount, setTotalCount] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function fetchAndSetBacktestList() {
      const res = await getBacktestList({ page: pageNo, size: pageSize });

      setTotalCount(res.data.count);
      setbackTestItems(res.data.results);
    }
    fetchAndSetBacktestList();
  }, [pageNo]);

  const onCheckedAll = (e) => {
    if (e.target.checked) {
      setcheckedList(backTestItems.map((item) => item.id));
    } else {
      setcheckedList([]);
    }
  };

  // 개별 체크 클릭 시
  const onChecked = (e, checkedId) => {
    if (e.target.checked) {
      setcheckedList([...checkedList, checkedId]);
    } else {
      setcheckedList(checkedList.filter((id) => id !== checkedId));
    }
  };

  const paintBackTestItems = backTestItems.map((item, index) => {
    const { id, title, created_at, final_asset } = item;
    const status = final_asset ? "완료" : "테스트 중";
    const newItem = {
      id,
      title,
      status: status,
      created_at: created_at.slice(0, 10),
    };
    return (
      <ListItem
        key={index}
        item={newItem}
        index={index}
        checked={checkedList.includes(item.id) ? true : false}
        onChecked={onChecked}
      />
    );
  });

  const onSearch = (word) => {};

  return (
    <PageContainer>
      <div className="flex justify-between">
        <Link to="create">
          <button className="flex gap-1 px-2 py-1.5 mr-2 border border-slate-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 hover:fill-indigo-600 rounded-lg duration-300">
            <Create />
            <div className="col-span-2 my-auto">백테스트 생성</div>
          </button>
        </Link>
        <div className="w-56">
          <SearchBar onSearch={onSearch} />
        </div>
      </div>

      <table className="table-auto w-full text-left mt-5">
        <colgroup>
          <col span="1" style={{ width: 5 + "%" }} />
          <col span="1" style={{ width: 5 + "%" }} />
          <col span="1" style={{ width: 60 + "%" }} />
          <col span="1" style={{ width: 10 + "%" }} />
          <col span="1" style={{ width: 15 + "%" }} />
        </colgroup>
        <ListTitle
          onCheckedAll={onCheckedAll}
          checked={
            checkedList.length && checkedList.length === backTestItems.length
              ? true
              : false
          }
          titles={["No", "테스트 이름", "상태", "생성일"]}
        />
        {backTestItems.length ? (
          <tbody>{paintBackTestItems}</tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan="4" className="text-center py-5">
                생성된 백테스트가 없습니다.
              </td>
            </tr>
          </tbody>
        )}
      </table>

      {backTestItems.length ? (
        <div className="relative w-full flex justify-center">
          <Pagenation2
            setPageNo={setPageNo}
            selectedNum={pageNo}
            totalCnt={totalCount}
            pageSize={pageSize}
          ></Pagenation2>
        </div>
      ) : (
        ""
      )}
    </PageContainer>
  );
}
