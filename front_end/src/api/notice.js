import { apiInstance } from "./index.js";

const api = apiInstance();

// 공지사항 전체 조회
async function getItems(pageNo, pageSize) {
  return (await api.get(`/notice/?page=${pageNo}&size=${pageSize}`)).data;
}

// 공지사항 id 조회
async function getItem(id) {
  return (await api.get(`/notice/${id}`)).data;
}

export { getItems, getItem };
