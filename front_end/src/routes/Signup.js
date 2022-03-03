import { Link } from "react-router-dom";
import "./background.css";

export default function Login() {
  return (
    <div>
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
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">JRstock</h2>
          </div>
          <div>
            <h2 className="text-xl text-gray-900">
              Create an account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600"></p>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm">
              <div className="my-5">
                <label htmlFor="name">이름</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="on"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Name"
                />
              </div>
              <div className="my-5">
                <label htmlFor="email-address">이메일</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
                <button className="mt-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-400 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">이메일 인증</button>
              </div>
              <div className="my-5">
                <label htmlFor="password">비밀번호</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
              <div className="my-5">
                <label htmlFor="password-confirmation">비밀번호 확인</label>
                <input
                  id="password-confirmation"
                  name="password-confirmation"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-400 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                회원가입
              </button>
            </div>
          </form>
          <div className="flex justify-center">
            <p>이미 계정이 있으신가요?&nbsp;</p>
            <Link to="/login" className="text-blue-600 hover:text-blue-500">
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
