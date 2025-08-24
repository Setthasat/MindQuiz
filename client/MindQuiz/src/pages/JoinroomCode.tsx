import Navbar from "../components/Navbar";

function JoinroomCode() {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Navbar />
      <div className="bg-white p-24 rounded-lg shadow-md text-center">
        <h2 className="text-4xl font-bold mb-4">JOIN ROOM</h2>
        <input
          type="text"
          placeholder="Enter room code"
          className="border border-gray-300 p-2 rounded-lg w-full mb-4"
        />
        <button className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full">
          Join
        </button>
      </div>
    </div>
  );
}

export default JoinroomCode;
