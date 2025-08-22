import { useStore } from "../store/store";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search, PencilLine, List } from "lucide-react";
import { motion } from "framer-motion";

function Home() {
    const navigate = useNavigate();
    const getUserId = useStore((state) => state.getUserId);
    const userId = getUserId();

    const [username, setUsername] = useState<string>("");

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) setUsername(storedUsername);
    }, [userId, navigate]);

    const actions = [
        { label: "Join Room", icon: <Search className="w-5 h-5" />, link: "/join" },
        { label: "Create Room", icon: <PencilLine className="w-5 h-5" />, link: "/create" },
        { label: "Your Rooms", icon: <List className="w-5 h-5" />, link: "/my-rooms" },
    ];

    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <div className="bg-white py-10 px-8 sm:px-16 rounded-2xl shadow-xl w-full max-w-2xl text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">
                    Hi, {username} 🤓
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {actions.map((action, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className="cursor-pointer border-2 border-blue-600 text-blue-600 rounded-xl py-8 px-6 flex flex-col items-center justify-center shadow-sm hover:bg-blue-50 transition"
                            onClick={() => navigate(action.link)}
                        >
                            {action.icon}
                            <span className="mt-3 font-semibold">{action.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
