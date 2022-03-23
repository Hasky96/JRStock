import { ReactComponent as Graphs } from "../../assets/landing_page/graphs.svg";

export default function SectionTwo() {
  return (
    <div className="landing-block-container w-full flex flex-col md:flex-row justify-evenly items-center gap-10 ">
      <div className="content-wrapper w-full lg:w-2/3">
        <h1>백테스트 결과 시각화</h1>
        <h2 className="content">
          수익률, 거래 종목, 매매 정보를 포함한 상세한 백테스트 결과를 한 눈에
          보기 쉽도록 차트와 함께 제공합니다.
        </h2>
      </div>
      <div className="svg-container w-full lg:w-1/3">
        <Graphs />
      </div>
    </div>
  );
}
