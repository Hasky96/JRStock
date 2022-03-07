import PageContainer from "../components/PageContainer";
import { useNavigate } from "react-router-dom";

export default function StockItemList() {
  const navigate = useNavigate()
  const stocks = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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

  const stockList = () => {
    const result = [];
    for (let i = 0; i < stocks.length; i++) {
      result.push(<hr key={i}></hr>);
      result.push(
        <li
          key={"stock" + i}
          className="grid grid-cols-12 h-12 hover:bg-yellow-50 hover:cursor-pointer"
          onClick={goDetailPage.bind(this, stocks[i].id)}
        >
          <p className="col-span-1 my-auto">{i + 1}</p>
          <p className="col-span-2 my-auto">{stocks[i].name}</p>
          <p className="col-span-1 my-auto">{stocks[i].currentPrice}</p>
          <p
            className={
              stocks[i].volatility > 0
                ? "col-span-2 my-auto text-red-500"
                : "col-span-2 my-auto text-blue-600"
            }
          >
            {stocks[i].volatility > 0
              ? "▲ " + stocks[i].volatility
              : "▼ " + -stocks[i].volatility}{" "}
            ({stocks[i].volatilityRate})
          </p>
          <p className="col-span-1 my-auto">{stocks[i].volume}</p>
          <p className="col-span-1 my-auto">{stocks[i].marketPrice}</p>
          <p className="col-span-1 my-auto">{stocks[i].highPrice}</p>
          <p className="col-span-1 my-auto">{stocks[i].lowPrice}</p>
          <p className="col-span-2 my-auto">{stocks[i].marketCapitalization}</p>
        </li>
      );
    }
    return result;
  };

  const goDetailPage = (id) => {
    navigate({pathname: `/stock/${id}`})
  };
  return (
    <PageContainer>
      <div className="border-collapse w-full text-center">
        <ul>
          <li className="grid grid-cols-12 h-12 bg-slate-100">
            <p className="col-span-1 my-auto">No</p>
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
