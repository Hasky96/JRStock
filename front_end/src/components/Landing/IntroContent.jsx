import { useNavigate } from "react-router-dom";
import { ReactComponent as Rocket } from "../../assets/rocket.svg";

export default function IntroContent() {
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <div className="content-wrapper w-full lg:w-2/3">
      <div className="flex relative">
        <h1>JRStock</h1>
        <div className="absolute left-52 top-2">
          <Rocket fill="#ff825c" width={50} height={50} />
        </div>
      </div>
      <h2 className="content">
        <p>
          굶
          <span className="underline decoration-active decoration-4 underline-offset-2">
            주린
          </span>{" "}
          <span className="underline decoration-active decoration-4 underline-offset-2">
            주
          </span>
          식 어
          <span className="underline decoration-active decoration-4 underline-offset-2">
            린이
          </span>
          들을 위한 주식 백테스트 서비스
        </p>
      </h2>

      <div className="button-wrapper">
        <button
          className="button bg-primary text-white"
          onClick={() => handleButtonClick("market")}
        >
          Explore
        </button>

        <button
          className="button text-primary"
          onClick={() => handleButtonClick("signup")}
        >
          Signup
        </button>
      </div>
    </div>
  );
}
