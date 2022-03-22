import { ReactComponent as Trophy } from "../../assets/landing_page/trophy.svg";
import { ReactComponent as TrophyLarge } from "../../assets/landing_page/trophy_large.svg";

export default function SectionThree() {
  return (
    <div className="mt-10 mb-60 landing-block-container w-full flex flex-col md:flex-row justify-evenly items-center gap-10 ">
      <div className="w-full lg:w-1/3">
        <TrophyLarge />
      </div>
      <div className="content-wrapper w-full lg:w-2/3">
        <h1>랭킹 시스템</h1>
        <h2 className="content">
          백테스트 결과를 공유하여 자신의 전략을 뽐내보세요!
        </h2>
      </div>
    </div>
  );
}
