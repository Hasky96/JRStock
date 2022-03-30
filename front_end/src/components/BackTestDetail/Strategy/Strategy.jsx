import { useEffect, useState } from "react";
import { getBacktestCondition } from "../../../api/backtest";
import { trimStrategy } from "../../../util/trimResult";
import TradeStrategy from "./TradeStrategy";

export default function Strategy({ conditions, isLoading, id }) {
  const [buyCondition, setBuyCondition] = useState("");
  const [sellCondition, setSellCondition] = useState("");
  const [buyStrategy, setBuyStrategy] = useState("");
  const [sellStrategy, setSellStrategy] = useState("");
  const [isStrategy, setIsStrategy] = useState(false);

  const fetchStrategy = async (backtestId) => {
    const res = await getBacktestCondition(backtestId);
    return res.data;
  };

  useEffect(() => {
    async function fetchAndSetStrategy() {
      const data = await fetchStrategy(id);
      const { buyStrategy, sellStrategy } = await trimStrategy(data);
      setBuyStrategy(buyStrategy);
      setSellStrategy(sellStrategy);
      console.log(buyStrategy, sellStrategy);
      setIsStrategy(true);
    }

    if (!isLoading) {
      fetchAndSetStrategy();
      setBuyCondition({
        standard: conditions.buy_standard,
        ratio: conditions.buy_ratio,
      });
      setSellCondition({
        standard: conditions.sell_standard,
        ratio: conditions.sell_ratio,
      });
    }
  }, [isLoading, conditions]);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full flex flex-col justify-center mt-3 gap-2">
        {isStrategy && (
          <>
            <TradeStrategy
              condition={buyCondition}
              name="매수"
              color="red"
              strategies={buyStrategy}
            />
            <TradeStrategy
              condition={sellCondition}
              name="매도"
              color="blue"
              strategies={sellStrategy}
            />
          </>
        )}
      </div>
    </div>
  );
}
