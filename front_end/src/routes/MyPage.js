import { useState } from "react";
import PageContainer from "../components/PageContainer";
import TabBar from "../components/TabBar/TabBar.js";

export default function MyPage() {
  const [currentTab, setCurrentTab] = useState("관심종목");
  const tabInfo = ["관심종목", "포트폴리오", "회원정보 수정"];
  return (
    <PageContainer>
      <div className="flex flex-col justify-center items-center">
        <TabBar setCurrentTab={setCurrentTab} tabInfo={tabInfo} />
        <div className="mt-5 w-full">
          {currentTab === "관심종목" && <InterestingStock />}
          {currentTab === "포트폴리오" && <Portfolio />}
          {currentTab === "회원정보 수정" && <UserUpdate />}
        </div>
      </div>
    </PageContainer>
  );
}
