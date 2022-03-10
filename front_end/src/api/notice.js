import { apiInstance } from "./index.js";

const api = apiInstance();

// 공지사항 조회
async function getItems(pageNo, pageSize) {
  return (await api.get(`/notice/?page=${pageNo}&size=${pageSize}`)).data;
}

export { getItems };
