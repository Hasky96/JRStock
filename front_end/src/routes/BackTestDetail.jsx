import { useState } from "react";
import PageContainer from "../components/PageContainer";
import TabBar from "../components/TabBar/TabBar";

export default function BackTestDetail() {
  const [currentTab, setCurrentTab] = useState("결과 요약");
  const tabInfo = [
    "결과 요약",
    "수익률 상세",
    "거래 내역",
    "전략 상세",
    "포트폴리오",
  ];
  return (
    <PageContainer>
      <TabBar setCurrentTab={setCurrentTab} tabInfo={tabInfo} />
    </PageContainer>
  );
}
