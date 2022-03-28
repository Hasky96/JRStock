import { ReactComponent as Trophy } from "../../assets/landing_page/trophy.svg";
import { ReactComponent as TrophyLarge } from "../../assets/landing_page/trophy_large.svg";

export default function SectionThree() {
  return (
    <div className="landing-block-container w-full flex flex-col items-center md:flex-row md:justify-evenly md:gap-10 ">
      <div className="svg-container w-72 md:w-1/3">
        <TrophyLarge width={"100%"} />
      </div>
      <div className="content-wrapper w-full md:w-2/3">
        <h1>랭킹 시스템</h1>
        <h2 className="content">
          백테스트 결과를 공유하여 자신의 전략을 뽐내보세요!
        </h2>
      </div>
    </div>
  );
}
