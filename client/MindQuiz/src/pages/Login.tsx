import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/store";
import { motion } from "framer-motion";

function Login() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    const setUser = useStore((state) => state.setUser);
    const getUserId = useStore((state) => state.getUserId);
    const logout = useStore((state) => state.logout);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">("");
    const [isLoading, setIsLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (getUserId()) logout();
    }, []);

    const showMessage = (text: string, type: "success" | "error") => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, 3000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const user = {
            email: emailRef.current?.value || "",
            password: passwordRef.current?.value || "",
        };

        try {
            const response = await axios.post(`${API_URL}/login`, user);
            const userData = response.data.data;

            setUser({
                userId: userData.userId,
                email: user.email,
            });
            localStorage.setItem("userId", userData.userId);
            localStorage.setItem("username", userData.username);

            showMessage("Login successful! Redirecting...", "success");
            setTimeout(() => {
                navigate("/Home");
            }, 1500);
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.status?.description ||
                "Login failed. Please check your credentials.";
            showMessage(errorMessage, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl w-full max-w-lg">
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-8">
                    Login
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 md:gap-8 text-base md:text-lg"
                >
                    <input
                        ref={emailRef}
                        type="email"
                        placeholder="Email"
                        className="w-full h-12 md:h-14 px-4 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        ref={passwordRef}
                        type="password"
                        placeholder="Password"
                        className="w-full h-12 md:h-14 px-4 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full h-12 md:h-14 rounded-lg font-semibold transition duration-300 
                            ${isLoading
                                ? "bg-gray-400 cursor-not-allowed text-white"
                                : messageType === "success"
                                    ? "bg-green-600 text-white"
                                    : messageType === "error"
                                        ? "bg-red-600 text-white"
                                        : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                        whileHover={!isLoading ? {
                            scale: 1.05,
                            y: -3,
                            boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)"
                        } : {}}
                        whileTap={!isLoading ? { scale: 0.95 } : {}}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 15
                        }}
                    >
                        {isLoading
                            ? "Signing in..."
                            : messageType === "success"
                                ? "Login successful!"
                                : messageType === "error"
                                    ? message || "Sign in"
                                    : "Sign in"}
                    </motion.button>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Don’t have an account?{" "}
                        <a
                            href="/register"
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Sign up
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
