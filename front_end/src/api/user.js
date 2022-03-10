import { apiInstance, loginApiInstance } from "./index.js";

const api = apiInstance();
const loginApi = loginApiInstance();

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

// 이메일 중복 조회
async function checkDuplication(userEmail) {
  return (await api.get(`/user/email-check/${userEmail}`)).data.email_check;
}

// 패스워드 확인
async function userPasswordCheck(password) {
  return await loginApi.post(`/user/password-check/`, password);
}

// 회원 정보 조회
async function userDetail() {
  return (await loginApi.get("/user/detail/")).data;
}

// 회원 정보 수정
async function userUpdate(id, userInfo) {
  return (
    await loginApi.put(`/user/update/${id}`, userInfo, {
      headers: {
        "Content-Type": `multipart/form-data`,
      },
    })
  ).data;
}

export {
  registerUser,
  checkDuplication,
  login,
  oauth,
  userPasswordCheck,
  userDetail,
  userUpdate,
};
