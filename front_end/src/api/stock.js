import { apiInstance, loginApiInstance } from "./index.js";

// 주식 종목 리스트 받아오기
async function getStockItemList(page, size, sort, company_name, face_value) {
  const api = apiInstance();
  return await api.get(
    `stock/?` +
      (page ? `page=${page}&` : "") +
      (size ? `size=${size}&` : "") +
      (company_name ? `company_name=${company_name}&` : "")
  );
}

// 주식 종목 리스트 받아오기
async function getStockItemList2({
  page,
  size,
  sort,
  company_name,
  face_value,
}) {
  const api = apiInstance();
  return await api.get(
    `stock/?` +
      (page ? `page=${page}&` : "") +
      (size ? `size=${size}&` : "") +
      (company_name ? `company_name=${company_name}&` : "")
  );
}

// 종목 토론 리스트 받아오기
async function getBoardList(code, page, size) {
  const api = apiInstance();
  return await api.get(
    `stock/post/${code}?` +
      (page ? `page=${page}&` : "") +
      (size ? `size=${size}&` : "")
  );
}

// 주식 종목 검색 리스트 받아오기
async function getStockItemListSearched(
  page,
  size,
  sort,
  company_name,
  face_value
) {
  const api = apiInstance();
  return await api.get(
    `stock/?page=${page}&size=${size}&company_name=${company_name}`
  );
}

// 토론 게시글 작성
async function createBoard(title, content, code_number) {
  const authApi = loginApiInstance();
  return await authApi.post("stock/post/create", {
    title,
    content,
    code_number,
  });
}

// 토론 게시글 상세페이지 받아오기
async function getBoardDetail(boardId) {
  const api = apiInstance();
  return await api.get(`stock/post/detail/${boardId}`);
}

// 토론 게시글 삭제
async function deleteBoard(boardId) {
  const authApi = loginApiInstance();
  await authApi.delete(`stock/post/delete/${boardId}`);
}

// 토론 게시글 수정
async function updateBoard(title, content, boardId) {
  const authApi = loginApiInstance();
  await authApi.put(`stock/post/update/${boardId}`, { title, content });
}

export {
  getStockItemList,
  getStockItemList2,
  getBoardList,
  createBoard,
  getBoardDetail,
  deleteBoard,
  updateBoard,
};
