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

// 공지사항 작성
async function createNotice(title, content) {
  const authApi = loginApiInstance();
  return await authApi.post("/notice/create/", {
    title,
    content,
  });
}

// 공지사항 삭제
async function deleteNotice(noticeId) {
  const authApi = loginApiInstance();
  await authApi.delete(`notice/delete/${noticeId}`);
}

export { getItems, getItem, createNotice, deleteNotice };
