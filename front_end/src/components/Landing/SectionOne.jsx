import { useNavigate } from "react-router-dom";
import { ReactComponent as Graphs } from "../../assets/landing_page/graphs.svg";
import { ReactComponent as Notes } from "../../assets/landing_page/notes.svg";
import "./Intro.css";

export default function SectionOne() {
  return (
    <div className="w-full flex flex-col md:flex-row justify-evenly items-center gap-10 landing-block-container">
      <div className="w-full lg:w-1/3">
        <Graphs />
      </div>
      <div className="content-wrapper w-full lg:w-2/3">
        <h1>Light, fast {`&`} responsive</h1>
        <h2 className="content">
          This template is ready to use, so you don't need to change anything at
          a component level, unless you want to customize the default styling.
        </h2>
        <div className="memo-wrapper flex w-full">
          <div className="w-1/2">
            <Notes />
            <h4>Why?</h4>
            <p>
              과거 데이터를 이용한 백테스트로 안전하고 고수익률을 보장하는 전략
              수립 가능
            </p>
          </div>
          <div className="w-1/2">
            <Notes />
            <h4>How?</h4>
            <p>JRStock 에 축적된 데이터와 추천 전략으로 손쉽게 시작</p>
          </div>
        </div>
      </div>
    </div>
  );
}
