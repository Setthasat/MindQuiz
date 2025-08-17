import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/store";
import { motion } from 'framer-motion';


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
        console.log(getUserId());
        if (getUserId()) {
            logout();
        }
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
            const errorMessage = error.response?.data?.status?.description || "Login failed. Please check your credentials.";
            showMessage(errorMessage, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-start items-center min-h-screen max-h-screen max-w-screen bg-[#12161C] px-4 pt-16 md:pt-24 overflow-hidden">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 md:gap-8 text-lg md:text-[1.5rem] mt-8 md:mt-12 w-[70%] max-w-md text-white justify-center items-center"
            >
                <input
                    ref={emailRef}
                    className="w-full h-12 md:h-[4rem] bg-transparent my-2 focus:outline-none border-b border-white text-white text-base md:text-lg peer"
                    type="email"
                    placeholder="Email"
                    required
                />
                <input
                    ref={passwordRef}
                    className="w-full h-12 md:h-[4rem] bg-transparent my-2 focus:outline-none border-b border-white text-white text-base md:text-lg peer"
                    type="password"
                    placeholder="Password"
                    required
                />
                <motion.button
                    type="submit"
                    disabled={isLoading}
                    className={`relative flex justify-center items-center w-full h-12 md:h-16 rounded-lg border-2 overflow-hidden ${isLoading
                        ? "bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed"
                        : messageType === "success"
                            ? "bg-green-600 border-green-500 text-white"
                            : messageType === "error"
                                ? "bg-red-600 border-red-500 text-white"
                                : "border-white/30 hover:bg-white hover:text-[#12161C] hover:border-white"
                        }`}
                    whileHover={!isLoading ? {
                        scale: 1.05,
                        backgroundColor: messageType === "success" ? "rgb(22 163 74)" : messageType === "error" ? "rgb(220 38 38)" : "rgba(255, 255, 255, 1)",
                        color: messageType === "success" || messageType === "error" ? "#fff" : "#000",
                        borderColor: messageType === "success" ? "rgb(22 163 74)" : messageType === "error" ? "rgb(220 38 38)" : "rgba(255, 255, 255, 1)",
                        y: -5,
                        boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)"
                    } : {}}
                    whileTap={!isLoading ? { scale: 0.95 } : {}}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 15
                    }}
                >
                    <span>
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span>Signing in</span>
                                <span className="animate-pulse">...</span>
                            </span>
                        ) : messageType === "success" ? (
                            "Login successful!"
                        ) : messageType === "error" ? (
                            message || "Sign in"
                        ) : (
                            "Sign in"
                        )}
                    </span>
                </motion.button>
                <a className="text-right w-full px-2 md:px-6 underline underline-offset-8 cursor-pointer" href="/register">Sign up</a>
            </form>
        </div>
    );
}

export default Login;