import { apiInstance } from "./index.js";

const api = apiInstance();

// 일반 로그인 기능
async function login(user) {
  return await api.post("/user/login/normal/", user);
}

// 소셜 로그인 기능
async function oauth(response) {
  return await api.post("/user/login/google/", {
    accessToken: response.accessToken,
  });
}

// 회원 가입
async function registerUser(user) {
  return await api.post(`/user/create/`, JSON.stringify(user));
}

//이메일 중복 조회
async function checkDuplication(userEmail) {
  return (await api.get(`/user/duplication?email=${userEmail}`)).data.data;
}

export { registerUser, checkDuplication, login, oauth };
