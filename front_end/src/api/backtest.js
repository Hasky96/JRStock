import { loginApiInstance } from "./index.js";

async function startBacktest(data) {
  const authApi = loginApiInstance();
  return await authApi.post(`backtest/start/`, data);
}

async function getBacktestList(params) {
  const authApi = loginApiInstance();
  let paramURL = "";
  if (params) {
    paramURL += "?";
    for (const [key, value] of Object.entries(params)) {
      paramURL += `${key}=${value}&`;
    }
  }

  return await authApi.get(`backtest/` + paramURL);
}

export { startBacktest, getBacktestList };
