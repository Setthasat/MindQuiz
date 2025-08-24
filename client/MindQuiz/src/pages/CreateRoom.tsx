import { useState, useEffect } from "react";
import { useStore } from "../store/store";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

function CreateRoom() {
  const navigate = useNavigate();
  const getUserId = useStore((state) => state.getUserId);
  const userId = getUserId();
  const [roomName, setRoomName] = useState<string>("");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
  }, [userId, navigate]);
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Navbar />
      <div className="bg-white p-24 rounded-lg shadow-md text-center">
        <h2 className="text-4xl font-bold mb-4">CREATE ROOM</h2>
        <input
          type="text"
          placeholder="Enter room name"
          className="border border-gray-300 p-2 rounded-lg w-full mb-4"
        />
        <button className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full">
          CREATE
        </button>
      </div>
    </div>
  );
}

export default CreateRoom;