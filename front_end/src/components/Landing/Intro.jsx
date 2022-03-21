import { useNavigate } from "react-router-dom";
import { ReactComponent as Developer } from "../../assets/landing_page/developer.svg";
import { ReactComponent as Rocket } from "../../assets/rocket.svg";
import "./Intro.css";

export default function Intro() {
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <div className="w-full flex flex-col md:flex-row justify-evenly items-center gap-10 landing-block-container">
      <div className="content-wrapper w-full lg:w-2/3">
        <div className="flex">
          <h1>JRStock</h1>
          <Rocket width={50} height={50} />
        </div>
        <h2 className="content">
          굶주린 주식 어린이들을 위한 주식 백테스트 서비스
        </h2>
        <div className="button-wrapper">
          <button
            className="button bg-indigo-900 text-white"
            onClick={() => handleButtonClick("market")}
          >
            Explore
          </button>

          <button
            className="button text-indigo-900"
            onClick={() => handleButtonClick("signup")}
          >
            Signup
          </button>
        </div>
      </div>
      <div className="w-full lg:w-1/3">
        <Developer />
      </div>
    </div>
  );
}
