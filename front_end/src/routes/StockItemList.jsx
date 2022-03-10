import PageContainer from "../components/PageContainer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StockItemList() {
  const navigate = useNavigate();
  const [checkedList, setcheckedList] = useState([]);
  const stocks = [
    {
      id: 1351,
      name: "삼성전자",
      currentPrice: "72400",
      volatility: 200,
      volatilityRate: "+0.28%",
      volume: "17640567",
      marketPrice: "72400",
      highPrice: "72400",
      lowPrice: "72400",
      marketCapitalization: "430421300000000",
    },
    {
      id: 1346134,
      name: "삼성전자",
      currentPrice: "72400",
      volatility: -500,
      volatilityRate: "-1.90%",
      volume: "17640567",
      marketPrice: "72400",
      highPrice: "72400",
      lowPrice: "72400",
      marketCapitalization: "430421300000000",
    },
    {
      id: 13,
      name: "삼성전자",
      currentPrice: "72400",
      volatility: 2000,
      volatilityRate: "+0.41%",
      volume: "17640567",
      marketPrice: "72400",
      highPrice: "72400",
      lowPrice: "72400",
      marketCapitalization: "430421300000000",
    },
    {
      id: 4136136,
      name: "삼성전자",
      currentPrice: "72400",
      volatility: -1500,
      volatilityRate: "-1.90%",
      volume: "17640567",
      marketPrice: "72400",
      highPrice: "72400",
      lowPrice: "72400",
      marketCapitalization: "430421300000000",
    },
  ];

  // 주식 데이터로 html 리스트를 만듬
  const stockList = () => {
    const result = [];
    for (let i = 0; i < stocks.length; i++) {
      result.push(<hr key={i}></hr>);
      result.push(
        <li
          key={"stock" + i}
          className="grid grid-cols-12 h-12 hover:bg-yellow-50 hover:cursor-pointer"
        >
          <div className="col-span-1 my-auto grid grid-cols-2">
            <p className="col-span-1">
              <input
                id="total-stock"
                name="total-stock"
                type="checkbox"
                className="h-4 w-4 text-amber-300 focus:ring-amber-500 border-gray-300 rounded"
                onChange={onChecked.bind(this, stocks[i].id)}
                checked={checkedList.includes(stocks[i].id) ? true : false}
              />
            </p>
            <p
              className="col-span-1"
              onClick={goDetailPage.bind(this, stocks[i].id)}
            >
              {i + 1}
            </p>
          </div>
          <p
            className="col-span-2 my-auto"
            onClick={goDetailPage.bind(this, stocks[i].id)}
          >
            {stocks[i].name}
          </p>
          <p
            className="col-span-1 my-auto"
            onClick={goDetailPage.bind(this, stocks[i].id)}
          >
            {stocks[i].currentPrice}
          </p>
          <p
            className={
              stocks[i].volatility > 0
                ? "col-span-2 my-auto text-red-500"
                : "col-span-2 my-auto text-blue-600"
            }
            onClick={goDetailPage.bind(this, stocks[i].id)}
          >
            {stocks[i].volatility > 0
              ? "▲ " + stocks[i].volatility
              : "▼ " + -stocks[i].volatility}{" "}
            ({stocks[i].volatilityRate})
          </p>
          <p
            className="col-span-1 my-auto"
            onClick={goDetailPage.bind(this, stocks[i].id)}
          >
            {stocks[i].volume}
          </p>
          <p
            className="col-span-1 my-auto"
            onClick={goDetailPage.bind(this, stocks[i].id)}
          >
            {stocks[i].marketPrice}
          </p>
          <p
            className="col-span-1 my-auto"
            onClick={goDetailPage.bind(this, stocks[i].id)}
          >
            {stocks[i].highPrice}
          </p>
          <p
            className="col-span-1 my-auto"
            onClick={goDetailPage.bind(this, stocks[i].id)}
          >
            {stocks[i].lowPrice}
          </p>
          <p
            className="col-span-2 my-auto"
            onClick={goDetailPage.bind(this, stocks[i].id)}
          >
            {stocks[i].marketCapitalization}
          </p>
        </li>
      );
    }
    return result;
  };

  // 전체 체크 클릭 시
  const onCheckedAll = (e) => {
    if (e.target.checked) {
      const checkedListArray = [];

      stocks.forEach((stock) => checkedListArray.push(stock.id));

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
    navigate({ pathname: `/stock/${id}` });
  };

  return (
    <PageContainer>
      <div className="border-collapse w-full text-center">
        <ul>
          <li className="grid grid-cols-12 h-12 bg-slate-100">
            <div className="col-span-1 my-auto grid grid-cols-2">
              <p className="col-span-1">
                <input
                  id="total-stock"
                  name="total-stock"
                  type="checkbox"
                  className="h-4 w-4 text-amber-300 focus:ring-amber-500 border-gray-300 rounded"
                  onChange={onCheckedAll}
                  checked={
                    checkedList.length === 0
                      ? false
                      : checkedList.length === stocks.length
                      ? true
                      : false
                  }
                />
              </p>
              <p className="col-span-1">No</p>
            </div>
            <p className="col-span-2 my-auto">종목명</p>
            <p className="col-span-1 my-auto">현재가</p>
            <p className="col-span-2 my-auto">변동률(전일대비)</p>
            <p className="col-span-1 my-auto">거래량</p>
            <p className="col-span-1 my-auto">시가</p>
            <p className="col-span-1 my-auto">고가</p>
            <p className="col-span-1 my-auto">저가</p>
            <p className="col-span-2 my-auto">시가총액</p>
          </li>
          {stockList()}
        </ul>
      </div>
    </PageContainer>
  );
}
