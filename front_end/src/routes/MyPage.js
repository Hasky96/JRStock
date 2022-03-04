import { useState } from "react";
import PageContainer from "../components/PageContainer";
import TabBar from "../components/TabBar/TabBar.js";

export default function MyPage() {
  const [currentTab, setCurrentTab] = useState("관심종목");
  const tabInfo = ["관심종목", "포트폴리오", "회원정보 수정"];
  return (
    <PageContainer>
      <TabBar setCurrentTab={setCurrentTab} tabInfo={tabInfo} />
    </PageContainer>
  );
}
