import ListTitle from "../BackTestList/ListTitle";
import ListItem from "../BackTestList/ListItem";
import { useEffect, useState } from "react";
import { getInterest } from "../../api/stock";
import Pagenation from "../Pagenation";
import costMap from "../../util/costMap";

export default function MyStock() {
  const [stockItems, setStockItems] = useState([]);
  const [checkedList, setcheckedList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 10;
  const [sortBy, setSortBy] = useState("-market_cap");

  const fetchMyStock = async () => {
    const res = await getInterest({ page: pageNo, size: pageSize });
    return res.data;
  };

  useEffect(async () => {
    const { count, results } = await fetchMyStock();

    const trimmedResults = results.map((item, index) => {
      const {
        current_price,
        changes,
        volume,
        start_price,
        high_price,
        low_price,
        market_cap,
      } = item;

      const changeIcon = changes > 0 ? "▲ " : changes < 0 ? "▼ " : "- ";

      return {
        company_name: item.financial_info.basic_info.company_name,
        current_price: parseInt(current_price).toLocaleString(),
        changes: changeIcon + parseInt(changes).toLocaleString(),
        volume: parseInt(volume).toLocaleString(),
        start_price: parseInt(start_price).toLocaleString(),
        high_price: parseInt(high_price).toLocaleString(),
        low_price: parseInt(low_price).toLocaleString(),
        market_cap: costMap(market_cap),
      };
    });

    setTotalCount(count);
    setStockItems(trimmedResults);
  }, [sortBy, searchInput, pageNo]);

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

  const onCheckedAll = (e) => {
    if (e.target.checked) {
      setcheckedList(stockItems.map((item) => item.id));
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

  const paintStockItems = stockItems.map((item, index) => {
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

  return (
    <>
      <div className="flex"></div>
      <div className="mt-5 overflow-x-scroll w-full">
        <table className="table-auto text-center min-w-[1200px] w-full">
          <colgroup>
            <col span="1" style={{ width: 4 + "%" }} />
            <col span="1" style={{ width: 4 + "%" }} />
            <col span="1" style={{ width: 16 + "%" }} />
            <col span="1" style={{ width: 8 + "%" }} />
            <col span="1" style={{ width: 16 + "%" }} />
            <col span="1" style={{ width: 8 + "%" }} />
            <col span="1" style={{ width: 8 + "%" }} />
            <col span="1" style={{ width: 8 + "%" }} />
            <col span="1" style={{ width: 8 + "%" }} />
            <col span="1" style={{ width: 16 + "%" }} />
          </colgroup>
          <ListTitle
            onCheckedAll={onCheckedAll}
            checked={
              checkedList.length && checkedList.length === stockItems.length
                ? true
                : false
            }
            titles={[
              "No",
              "종목명",
              "현재가",
              "변동률(전일대비)",
              "거래량",
              "시가",
              "고가",
              "저가",
              "시가총액",
            ]}
          />
          <tbody>{paintStockItems}</tbody>
        </table>
      </div>
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
    </>
  );
}
