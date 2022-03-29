import ListTitle from "../BackTestList/ListTitle";
import ListItem from "../BackTestList/ListItem";
import { useEffect, useState } from "react";
import { getInterest } from "../../api/stock";

export default function MyStock() {
  const [stockItems, setStockItems] = useState([]);
  const [checkedList, setcheckedList] = useState([]);

  useEffect(() => {
    getInterest().then((res) => console.log(res));
  });

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
      <div className="flex">
        {/* <ListHeader
          optionKind={["aaa", "bbb", "ccc"]}
          onClickFilter={onClickFilter}
          onSearch={onSearch}
        /> */}
      </div>
      <div className="mt-5 overflow-x-scroll">
        <table className="table-auto text-center min-w-[1200px]">
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
          <tbody>{stockItems.length && paintStockItems}</tbody>
        </table>
      </div>
      {/* <div className="relative w-full flex justify-center">
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
      </div> */}
    </>
  );
}
