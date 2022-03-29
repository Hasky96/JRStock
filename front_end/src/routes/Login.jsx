import { LockClosedIcon } from "@heroicons/react/solid";
import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import GoogleLogin from "react-google-login";
import { login, oauth } from "../api/user";
import { ReactComponent as ABtest } from "../assets/landing_page/abtest.svg";
import { ReactComponent as Rocket } from "../assets/rocket.svg";
import "./background.css";

export default function Login() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isError, setIsError] = useState(false);
  const clientId =
    "138234037090-qflbfgu5st5hfj7v7v2pc6qp2i5ugt5r.apps.googleusercontent.com";
  let navigate = useNavigate();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/" } };

  // 로그인 요청 시 실행
  const tryLogin = async () => {
    try {
      const result = await login({ email, password });
      sessionStorage.setItem("access_token", result.data.access_token);
      console.log(from);
      navigate(from);
    } catch (e) {
      console.log(e);
      setIsError(true);
    }
  };

  // 이메일 입력 시 변수에 할당
  const inputEmail = (e) => {
    setEmail(e.target.value);
  };

  // 비밀번호 입력 시 변수에 할당
  const inputPassword = (e) => {
    setPassword(e.target.value);
  };

  const rememberMe = (e) => {
    console.log(e.target.checked);
  };

  // 소셜 로그인 성공 시 실행
  const onSuccess = async (response) => {
    try {
      const result = await oauth(response);
      sessionStorage.setItem("access_token", result.data.access_token);
      navigate(from);
    } catch (e) {
      console.log(e);
    }
  };

  // 소셜 로그인 실패 시 실행
  const onFailure = (error) => {
    console.log(error);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute left-0 top-0 w-full h-full bg-primary z-[-1] polygon-top"></div>
        <div className="absolute left-0 bottom-0 w-full h-full bg-secondary z-[-1] polygon-bottom"></div>
        <div className="flex border-2 p-12 shadow-lg rounded-md bg-white">
          <div className="hidden lg:inline-block min-w-[400px] w-1/2 my-auto mr-32">
            <ABtest />
          </div>
          <div className="min-w-[350px] max-w-lg space-y-8">
            <div className="flex justify-center relative">
              <Link to="/">
                <h2 className="text-3xl font-extrabold text-primary text-center">
                  JRstock
                </h2>
                <div className="absolute right-[90px] top-1">
                  <Rocket fill="#ff825c" />
                </div>
              </Link>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-primary text-center">
                Login in to your account
              </h2>
            </div>
            {isError && (
              <div>
                <p className="text-red-600">사용자 정보가 올바르지 않습니다.</p>
              </div>
            )}
            <form
              className="mt-5 space-y-6"
              onSubmit={function (e) {
                e.preventDefault();
                tryLogin();
              }}
            >
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="my-5">
                  <label htmlFor="email-address">이메일</label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-primary placeholder-gray-900 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    onChange={inputEmail}
                  />
                </div>
                <div className="my-5">
                  <label htmlFor="password">비밀번호</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-primary placeholder-gray-900 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Password"
                    onChange={inputPassword}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    onChange={rememberMe}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/login/help"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    비밀번호를 잊으셨나요?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-active duration-300"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <LockClosedIcon
                      className="h-5 w-5 text-primary group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </span>
                  로그인
                </button>
                <GoogleLogin
                  className="w-full mt-5 rounded-md"
                  clientId={clientId}
                  responseType={"id_token"}
                  onSuccess={onSuccess}
                  onFailure={onFailure}
                />
              </div>
            </form>
            <div className="flex justify-center">
              <p>아직 계정이 없으신가요?&nbsp;</p>
              <Link to="/signup" className="text-blue-600 hover:text-blue-900">
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
