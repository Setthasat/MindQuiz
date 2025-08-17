import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Verify from "./pages/Verify";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify/:token" element={<Verify />} />
      </Routes>
    </>
  );
}
