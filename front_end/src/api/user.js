import { apiInstance } from "./index";

const api = apiInstance();

async function login(user) {
  console.log(user);
  return await api.post("/user/login/normal/", user);
}

export { login };
