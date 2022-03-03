import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Stock from "./routes/Stock";
import SideBar from "./components/SideBar/SideBar";
import Header from "./components/Header";
import { useEffect, useState } from "react";

function App() {
  const [showSideBar, setShowSideBar] = useState(true);
  const noSideBarURL = ["/", "/login", "/signup"];

  useEffect(() => {
    if (noSideBarURL.includes(window.location.pathname)) {
      setShowSideBar(false);
    }
  }, []);

  return (
    <>
      {showSideBar && (
        <div>
          <SideBar />
        </div>
      )}

      <div>
        <div>
          <Header></Header>
        </div>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/stock" element={<Stock />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
