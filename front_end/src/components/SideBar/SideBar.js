import { ReactComponent as DashboardIconActive } from "../../assets/dashboardIconActive.svg";
import { ReactComponent as StockList } from "../../assets/stockList.svg";
import { ReactComponent as BackTest } from "../../assets/backTest.svg";
import { ReactComponent as MyPage } from "../../assets/myPage.svg";
import { ReactComponent as Rocket } from "../../assets/sidebarRocket.svg";
import "./SideBar.css";

export default function SideBar() {
  return (
    <div className="navbar h-screen bg-white flex flex-col items-center pt-10 pl-5 drop-shadow">
      <ul className="w-full mt-10 flex flex-col gap-8">
        <li className="logo">
          <a className="nav-link">
            <span className="link-text">JRstock</span>
            <Rocket />
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link">
            <DashboardIconActive />
            <span className="link-text">주요 시세 정보</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link">
            <StockList />
            <span className="link-text">종목 리스트</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link">
            <BackTest />
            <span className="link-text">백테스트</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link">
            <MyPage />
            <span className="link-text">마이페이지</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
