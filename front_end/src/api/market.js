import { apiInstance } from "./index.js";

const api = apiInstance();

// 일별 주가지수 받아오기
async function getDayStock(codeNumber) {
  return (await api.get(`stock/day/${codeNumber}`)).data;
}

// 주별 주가지수 받아오기
async function getWeekStock(codeNumber) {
  return (await api.get(`stock/week/${codeNumber}`)).data;
}

// 월별 주가지수 받아오기
async function getMonthStock(codeNumber) {
  return (await api.get(`stock/month/${codeNumber}`)).data;
}

// 종가 지수 받아오기
async function getPredict(codeNumber) {
  return (await api.get(`stock/predict/${codeNumber}`)).data;
}

export { getDayStock, getWeekStock, getMonthStock, getPredict };
