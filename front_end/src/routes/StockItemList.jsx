import PageContainer from "../components/PageContainer";

export default function StockItemList() {
  const stocks = [
    {
      no: 1,
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
      no: 2,
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
      no: 3,
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
      no: 4,
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
    for (let stock of stocks) {
      result.push(<hr></hr>);
      result.push(
        <li key={stock.no} className="grid grid-cols-12 h-12">
          <p className="col-span-1 my-auto">{stock.no}</p>
          <p className="col-span-2 my-auto">{stock.name}</p>
          <p className="col-span-1 my-auto">{stock.currentPrice}</p>
          <p
            className={
              stock.volatility > 0
                ? "col-span-2 my-auto text-red-500"
                : "col-span-2 my-auto text-blue-600"
            }
          >
            {stock.volatility > 0
              ? "▲ " + stock.volatility
              : "▼ " + -stock.volatility}{" "}
            ({stock.volatilityRate})
          </p>
          <p className="col-span-1 my-auto">{stock.volume}</p>
          <p className="col-span-1 my-auto">{stock.marketPrice}</p>
          <p className="col-span-1 my-auto">{stock.highPrice}</p>
          <p className="col-span-1 my-auto">{stock.lowPrice}</p>
          <p className="col-span-2 my-auto">{stock.marketCapitalization}</p>
        </li>
      );
    }
    return result;
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
