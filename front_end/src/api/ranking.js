import { apiInstance } from "./index.js";

async function getBacktestRank(pageNo, size, option, toggle, name) {
  const api = apiInstance();
  return (
    await api.get(
      `backtest/rank/?page=${pageNo}&size=${size}&option=${option}${
        toggle ? `&name=${name}` : ""
      }`
    )
  ).data;
}

export { getBacktestRank };
