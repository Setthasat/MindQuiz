import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import Background from "./components/Background";
import JoinroomCode from "./pages/JoinroomCode";
import CreateRoom from "./pages/CreateRoom";

export default function App() {

  return (
    <div className="w-screen h-screen">
      <Background />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/home" element={<Home />} />
        <Route path="/join" element={<JoinroomCode />} />
        <Route path="/create" element={<CreateRoom />} />
      </Routes>
    </div>
  );
}
