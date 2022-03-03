import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import SideBar from "./components/SideBar";
import Header from "./components/Header";

function App() {
  return (
    <>
      {/* <div>
        <SideBar></SideBar>
      </div>
      <div>
        <div>
          <Header></Header>
        </div> */}
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Router>
      {/* </div> */}
    </>
  );
}

export default App;
