import { getInterest, getLive } from "../../api/stock";
import { useEffect, useState } from "react";

export default function Interested() {
  const [stocks, setStocks] = useState([]);
  const [lives, setLives] = useState([]);

  const init = async () => {
    const res = await getInterest({ page: 1, size: 5 });
    setStocks(res.data.results);

    let temp = [];
    for (let stock of res.data.results) {
      let liveRes;
      try {
        const res = await getLive(stock.financial_info.basic_info.code_number);
        liveRes = res.data;
        liveRes["isError"] = false;
      } catch {
        liveRes = {};
        liveRes["isError"] = true;
      }
      liveRes["company_name"] = stock.financial_info.basic_info.company_name;
      temp.push(liveRes);
    }
    setLives(temp);
  };

  const updateLive = async () => {
    console.log(stocks);
  };

  useEffect(() => {
    init();
    // updateLive();
  }, []);

  return (
    <div>
      <div>관심종목</div>
    </div>
  );
}
