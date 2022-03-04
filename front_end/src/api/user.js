import { apiInstance, loginApiInstance } from "./index.js";

const api = apiInstance();

// 회원 가입
async function registerUser(user) {
  return await api.post(`/user/create/`, JSON.stringify(user));
}

//이메일 중복 조회
async function checkDuplication(userEmail) {
  return (await api.get(`/user/duplication?email=${userEmail}`)).data.data;
}

export { registerUser, checkDuplication };
