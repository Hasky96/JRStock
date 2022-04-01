import { apiInstance, loginApiInstance } from "./index.js";

const getParamURL = async (params) => {
  let paramURL = "";
  if (params) {
    paramURL += "?";
    for (const [key, value] of Object.entries(params)) {
      paramURL += `${key}=${value}&`;
    }
  }
  return paramURL;
};

async function startBacktest(data) {
  const authApi = loginApiInstance();
  return await authApi.post(`backtest/start/`, data);
}

async function getBacktestList(params) {
  const authApi = loginApiInstance();
  const paramURL = await getParamURL(params);

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

async function getBacktestTradeRecord(backtestId, params) {
  const api = apiInstance();
  const paramURL = await getParamURL(params);
  return await api.get(`backtest/buysell/${backtestId}` + paramURL);
}
async function getBacktestDaily(backtestId) {
  const api = apiInstance();
  return await api.get(`backtest/day/${backtestId}`);
}

async function getStockDaily(code, start, end) {
  const api = apiInstance();
  const paramURL = `?start=${start}&end=${end}`;
  return await api.get(`stock/data/start-end/${code}` + paramURL);
}

async function getBacktestAnnually(backtestId) {
  const api = apiInstance();
  return await api.get(`backtest/year/${backtestId}`);
}

async function deleteBacktest(backtestId) {
  const authApi = loginApiInstance();
  return await authApi.delete(`backtest/delete/${backtestId}`);
}

export {
  startBacktest,
  deleteBacktest,
  getBacktestList,
  getBacktestDetail,
  getBacktestCondition,
  getBacktestTradeRecord,
  getBacktestDaily,
  getBacktestAnnually,
  getStockDaily,
};
