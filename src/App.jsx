/* eslint-disable no-unused-vars */
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { useLayoutEffect } from "react";
import SignUpForm from "./components/SignUp/SignUpForm";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Mcq from "./pages/Mcq";
import Calibration from "./components/SignUp/Calibration";
import InterviewPage from "./pages/InterviewPage";
import { InterviewMainPage } from "./components/Interview/InterviewMainPage";
import Videos from "./components/Home/Videos";

const Wrapper = ({ children }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 1);
  }, [location.pathname]);
  return children;
};
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <SignUpStepForm /> */}

      <BrowserRouter>
        <Wrapper>
          <Navbar />
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/details" element={<Calibration />} />
            <Route path="/" element={<Login />} />
            <Route path="/mcq" element={<Mcq />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/interviewmain" element={<InterviewMainPage />} />
            <Route path="/videos" element={<Videos />} />
          </Routes>
          <Footer />
        </Wrapper>
      </BrowserRouter>
    </>
  );
}

export default App;
