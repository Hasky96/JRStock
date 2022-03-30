import { ReactComponent as Thinking } from "../../assets/landing_page/thinking.svg";

export default function SectionOne() {
  return (
    <div className="landing-block-container w-full flex flex-col items-center md:flex-row md:justify-evenly md:gap-10">
      <div className="svg-container w-3/4 md:w-1/2">
        <Thinking width={"100%"} />
      </div>
      <div className="content-wrapper w-full md:w-1/2">
        <h1>종목 필터링</h1>
        <h2 className="content">
          PER 등 여러 지표를 설정하여 자신이 원하는 종목을 필터링하고, 저평가된
          종목을 찾아보세요!
        </h2>
      </div>
    </div>
  );
}
