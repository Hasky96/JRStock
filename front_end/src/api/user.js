import { apiInstance } from "./index";

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

export { login, oauth };
