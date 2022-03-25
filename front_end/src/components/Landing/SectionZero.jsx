import { ReactComponent as Launch } from "../../assets/landing_page/product-launch.svg";
import { ReactComponent as Notes } from "../../assets/landing_page/notes.svg";

export default function SectionZero() {
  return (
    <div className="landing-block-container w-full text-center flex flex-col md:flex-row justify-evenly items-center gap-10 ">
      <div className="content-wrapper w-full">
        <div className="svg-container w-2/3">
          <Launch />
        </div>
        <h1>빠르고 쉬운 백테스트</h1>
        <h2 className="content">
          현재 자신의 투자 전략을 과거 데이터에 대입하여 검증하고, 안전성과
          고수익이 보장되는 전략을 수립해보세요!
        </h2>
        <div className="flex w-full">
          <div className="memo-wrapper w-1/2">
            <Notes />
            <h4>Why JRStock?</h4>
            <p>
              1. 다량 축적된 국내 주식 데이터 <br />
              2. 손쉬운 검색 &amp; 필터링
            </p>
          </div>
          <div className="memo-wrapper w-1/2">
            <Notes />
            <h4>How?</h4>
            <p>이미 검증된 추천 전략으로 손쉽게 시작!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
