import { useEffect, useState } from "react";
import PageContainer from "../components/PageContainer";
import TabBar from "../components/TabBar/TabBar";
import UserUpdate from "../components/MyPage/UserUpdate";
import InterestingStock from "../components/MyPage/InterestingStock";
import Portfolio from "../components/MyPage/Portfolio";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
  const navigate = useNavigate();

  // tab 이동 시 시용
  const [currentTab, setCurrentTab] = useState("관심종목");
  const tabInfo = ["관심종목", "포트폴리오", "백테스트 결과", "회원정보 수정"];

  const tabInfo2 = [
    {
      name: "관심종목",
      link: "linkStock",
    },
  ];

  // 현재 로그인 상태 확인
  const isLoggedIn = window.sessionStorage.getItem("access_token")
    ? true
    : false;

  // 로그인하지 않은 상태라면 /login 로 이동
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn]);

  return (
    <PageContainer>
      <div className="flex flex-col items-center">
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
