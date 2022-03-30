import { Link } from "react-router-dom";
import { ReactComponent as WarningIcon } from "../assets/warning.svg";

export default function NotFound() {
  return (
    <div className="container h-screen flex flex-col justify-center items-center">
      <WarningIcon fill="#ff825c" width={100} height={100} />
      <h1 className="text-4xl font-semibold ">404</h1>
      <h1 className="text-3xl">Page Not Found.</h1>
      <h2 className="text-2xl mt-1">
        죄송합니다. 찾으시는 페이지가 존재하지 않습니다.
      </h2>
      <Link to="/">
        <button className="mt-1 w-40 h-10 shadow-xs hover:bg-active hover:text-white duration-300 rounded shadow-2xl">
          홈으로 가기
        </button>
      </Link>
    </div>
  );
}
