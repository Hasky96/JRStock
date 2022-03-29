import { apiInstance, loginApiInstance } from "./index.js";

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

async function getBacktestDetail(backtestId) {
  const api = apiInstance();
  return await api.get(`backtest/${backtestId}`);
}

async function getBacktestCondition(backtestId) {
  const api = apiInstance();
  return await api.get(`backtest/condition/${backtestId}`);
}
async function getBacktestTradeRecord(backtestId) {
  const api = apiInstance();
  return await api.get(`backtest/buysell/${backtestId}`);
}
async function getBacktestDaily(backtestId) {
  const api = apiInstance();
  return await api.get(`backtest/day/${backtestId}`);
}
async function getBacktestAnnually(backtestId) {
  const api = apiInstance();
  return await api.get(`backtest/year/${backtestId}`);
}

export {
  startBacktest,
  getBacktestList,
  getBacktestDetail,
  getBacktestCondition,
  getBacktestTradeRecord,
  getBacktestDaily,
  getBacktestAnnually,
};
