import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Login";
import SideBar from "./components/SideBar";
import Header from "./components/Header";

function App() {
  return (
    <>
      <div>
        <SideBar></SideBar>
      </div>
      <div>
        <div>
          <Header></Header>
        </div>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
