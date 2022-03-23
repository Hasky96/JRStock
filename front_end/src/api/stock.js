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

// 종목별 일봉 데이터 받아오기
async function getDayStock(codeNumber) {
  const api = apiInstance();
  return await api.get(`stock/day/${codeNumber}`);
}

// 종목별 주봉 데이터 받아오기
async function getWeekStock(codeNumber) {
  const api = apiInstance();
  return await api.get(`stock/week/${codeNumber}`);
}

// 종목별 월봉 데이터 받아오기
async function getMonthStock(codeNumber) {
  const api = apiInstance();
  return await api.get(`stock/month/${codeNumber}`);
}

// 종목 상세 정보 받아오기
async function getDetail(codeNumber) {
  const api = apiInstance();
  return await api.get(`stock/detail/${codeNumber}`);
}

// 종목 실시간 정보 받아오기
async function getLive(codeNumber) {
  const api = apiInstance();
  return await api.get(`stock/live/${codeNumber}`);
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

// 토론 댓글 리스트 받아오기
async function getCommentList(boardId, page, size) {
  const api = apiInstance();
  return await api.get(
    `stock/comment/${boardId}?` +
      (page ? `page=${page}&` : "") +
      (size ? `size=${size}&` : "")
  );
}

// 토론 댓글 작성
async function createComment(board_id, content) {
  const authApi = loginApiInstance();
  await authApi.post("stock/comment/create/", { board_id, content });
}

// 토론 댓글 삭제
async function deleteComment(id) {
  const authApi = loginApiInstance();
  await authApi.delete(`stock/comment/delete/${id}`);
}

export {
  getStockItemList,
  getStockItemList2,
  getBoardList,
  createBoard,
  getBoardDetail,
  deleteBoard,
  updateBoard,
  getDayStock,
  getWeekStock,
  getMonthStock,
  getDetail,
  getLive,
  getCommentList,
  createComment,
  deleteComment,
};
