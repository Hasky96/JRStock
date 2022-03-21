import { apiInstance, loginApiInstance } from "./index.js";

// 주식 종목 리스트 받아오기
async function getStockItemList(page, size, sort, company_name, face_value) {
  const api = apiInstance();
  return await api.get(`stock/?page=${page}&size=${size}`);
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
  getBoardList,
  createBoard,
  getBoardDetail,
  deleteBoard,
  updateBoard,
};
