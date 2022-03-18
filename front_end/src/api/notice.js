import { apiInstance, loginApiInstance } from "./index.js";

// 공지사항 전체 조회
async function getItems(pageNo, pageSize) {
  const api = apiInstance();
  return (await api.get(`/notice/?page=${pageNo}&size=${pageSize}`)).data;
}

// 공지사항 id 조회
async function getItem(id) {
  const api = apiInstance();
  return (await api.get(`/notice/${id}`)).data;
}

export { getItems, getItem };
