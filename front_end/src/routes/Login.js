import { LockClosedIcon } from "@heroicons/react/solid";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./background.css";
import React, { useState } from "react";
import GoogleLogin from "react-google-login";
import { login } from "../api/user";

export default function Login() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isError, setIsError] = useState(false);
  let navigate = useNavigate();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/" } };

  const tryLogin = async () => {
    try {
      const result = await login({ email, password })
      console.log(result)
      sessionStorage.setItem("access_token", result.data.access_token);
      navigate(from);
    } catch (e) {
      setIsError(true);
      console.log(e);
    }
  };

  const inputEmail = (e) => {
    setEmail(e.target.value);
  };

  const inputPassword = (e) => {
    setPassword(e.target.value);
  };

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-img">
        <div className="max-w-lg w-full space-y-8 border-2 p-12 rounded-md bg-white">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">
              JRstock
            </h2>
          </div>
          <div>
            <p>Welcome back</p>
            <h2 className="text-xl text-gray-900">Login in to your account</h2>
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
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-300 focus:border-amber-300 focus:z-10 sm:text-sm"
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
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-300 focus:border-amber-300 focus:z-10 sm:text-sm"
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
                  className="h-4 w-4 text-amber-300 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  비밀번호를 잊으셨나요?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-300 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-amber-500 group-hover:text-amber-300"
                    aria-hidden="true"
                  />
                </span>
                로그인
              </button>
              <GoogleLogin className="w-full mt-5 rounded-md" />
            </div>
          </form>
          <div className="flex justify-center">
            <p>아직 계정이 없으신가요?&nbsp;</p>
            <Link to="/signup" className="text-blue-600 hover:text-blue-500">
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
