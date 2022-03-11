import { apiInstance } from "./index.js";

const api = apiInstance();

// 주식 종목 리스트 받아오기
async function getStockItemList(page, size) {
  return await api.get(`stock/kospi/?page=${page}&size=${size}`);
}

export { getStockItemList };
