import { useNavigate } from "react-router-dom";
import { ReactComponent as Developer } from "../../assets/landing_page/developer.svg";
import "./Intro.css";

export default function Intro() {
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-center gap-10 landing-block-container">
      <div className="content-wrapper w-full lg:w-1/2">
        <h6>JRStock</h6>
        <p className="content">
          굶주린 주식 어린이들을 위한 주식 백테스트 서비스
        </p>
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
      <div className="w-full lg:w-1/2">
        <Developer />
      </div>
    </div>
  );
}
