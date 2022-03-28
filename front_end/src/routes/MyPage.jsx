import { useState } from "react";
import PageContainer from "../components/PageContainer";
import TabBar from "../components/TabBar/TabBar";
import UserUpdate from "../components/MyPage/UserUpdate";
import MyStock from "../components/MyPage/MyStock";

export default function MyPage() {
  // tab 이동 시 시용
  const [currentTab, setCurrentTab] = useState("관심종목");
  const tabInfo = ["관심종목", "회원정보 수정"];

  return (
    <PageContainer>
      <div className="flex flex-col items-center">
        <TabBar setCurrentTab={setCurrentTab} tabInfo={tabInfo} />
        <div className="mt-5 w-full">
          {currentTab === "관심종목" && <MyStock />}
          {currentTab === "회원정보 수정" && <UserUpdate />}
        </div>
      </div>
    </PageContainer>
  );
}
