import { loginApiInstance } from "./index.js";

// 관심 종목 추가
async function startBacktest(values) {
  const authApi = loginApiInstance();
  return await authApi.post(`backtest/start/`, values);
}

export { startBacktest };
