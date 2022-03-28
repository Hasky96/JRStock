import { ReactComponent as Graphs } from "../../assets/landing_page/graphs.svg";

export default function SectionTwo() {
  return (
    <div className="landing-block-container w-full flex flex-col items-center md:flex-row md:justify-evenly md:gap-10">
      <div className="content-wrapper w-full md:w-1/2">
        <h1>백테스트 결과 시각화</h1>
        <h2 className="content">
          수익률, 매매 내역 등을 포함한 상세한 백테스트 결과를 한 눈에 보기
          쉽도록 차트와 함께 제공합니다.
        </h2>
      </div>
      <div className="svg-container w-3/4 md:w-1/2">
        <Graphs />
      </div>
    </div>
  );
}
