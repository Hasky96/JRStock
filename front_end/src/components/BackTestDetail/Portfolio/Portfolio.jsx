import { useState } from "react";
import ListItem from "../../BackTestList/ListItem";
import ListTitle from "../../BackTestList/ListTitle";
import { PortfolioChart } from "./PortfolioChart";
import "./Portfolio.css";

export default function Portfolio() {
  const dummyPortfolio = ["삼성전자", "SK하이닉스", "네이버"];
  const dummyStocks = [];
  for (let i = 0; i < 55; i++) {
    dummyStocks.push({
      id: i,
      stock: "삼성전자",
      stock_code: "000536",
    });
  }

  const [checkedList, setcheckedList] = useState([]);
  const [stockList, setStockList] = useState(dummyStocks);

  const onCheckedAll = (e) => {
    if (e.target.checked) {
      const checkedListArray = [];

      stockList.forEach((item) => checkedListArray.push(item.id));

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

  const paintStockList = stockList.map((item, index) => {
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
    <div className="w-full flex flex-col justify-center items-center">
      Portfolio
      <div className="flex gap-3">
        <div className="rounded shadow-lg p-3 mt-5">
          <div>매매 종목 리스트</div>
          <div className="stock-list-container overflow-y-scroll scroll-wrapper-box">
            <table className="table-auto  w-full text-left">
              {/* <colgroup>
              <col span="1" style={{ width: 5 + "%" }} />
              <col span="1" style={{ width: 5 + "%" }} />
              <col span="1" style={{ width: 70 + "%" }} />
              <col span="1" style={{ width: 15 + "%" }} />
            </colgroup> */}
              <ListTitle
                onCheckedAll={onCheckedAll}
                checked={
                  checkedList.length && checkedList.length === stockList.length
                    ? true
                    : false
                }
                titles={["No", "종목명", "종목 코드"]}
              />
              <tbody>{stockList.length && paintStockList}</tbody>
            </table>
          </div>
        </div>
        <div className="rounded shadow-lg p-3 mt-5">
          <div className=" text-lg">
            <div>포트폴리오 구성 (처음에 자산 분배 한 경우)</div>
            <PortfolioChart labels={dummyPortfolio} />
          </div>
        </div>
      </div>
    </div>
  );
}
