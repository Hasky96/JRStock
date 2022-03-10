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
  return (await api.get(`/user/email-check/${userEmail}`)).data.email_check;
}

// 비밀번호 재발급
async function passwordReset(user) {
  return await api.post("user/password-reset/", user);
}

export { registerUser, checkDuplication, login, oauth, passwordReset };
