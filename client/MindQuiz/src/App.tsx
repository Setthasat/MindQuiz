import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import { useState } from "react";
import Background from "./components/Background";


export default function App() {

  const [isDarkmode, setIsDarkmode] = useState(false);

  const lightColors = {
    bg: "#1F05EE",
    gradLight: "#17DFFF",
    gradDark: "#1F05EE",
    gradAltLight: "#1b72f7",
    gradAltDark: "#1F05EE",
  };

  const darkColors = {
    bg: "#2A0172",
    gradLight: "#000000",
    gradDark: "#2A0172",
    gradAltLight: "#150139",
    gradAltDark: "#2A0172",
  };

  return (
    <div className="w-screen h-screen">
      <Background colors={isDarkmode ? darkColors : lightColors} />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}
