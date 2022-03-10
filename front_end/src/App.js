import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import Market from "./routes/Market";
import StockItemList from "./routes/StockItemList";
import StockItemDetail from "./routes/StockItemDetail";
import BackTest from "./routes/BackTest";
import MyPage from "./routes/MyPage";
import SideBar from "./components/SideBar/SideBar";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Announcement from "./routes/Announcement";

function App() {
  // pathname 을 확인하여, Sidebar 렌더링 여부를 결정
  const [showSideBar, setShowSideBar] = useState(true);
  const noSideBarURL = ["/", "/login", "/signup"];

  useEffect(() => {
    if (noSideBarURL.includes(window.location.pathname)) {
      setShowSideBar(false);
    }
  }, [window.location.pathname]);

  return (
    <Router>
      <ToastContainer hideProgressBar={true} />
      {showSideBar && (
        <div>
          <SideBar />
        </div>
      )}
      <div className={showSideBar ? "ml-20 bg-yellow-50 min-h-screen" : ""}>
        {showSideBar && (
          <div>
            <Header></Header>
          </div>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/market" element={<Market />} />
          <Route path="/stock" element={<StockItemList />} />
          <Route path="/stock/:id" element={<StockItemDetail />} />
          <Route path="/backtest" element={<BackTest />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/announcement" element={<Announcement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
