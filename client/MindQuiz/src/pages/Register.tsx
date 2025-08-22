import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";

export default function Register() {
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">("");
    const [isLoading, setIsLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

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

        const firstName = firstNameRef.current?.value || "";
        const lastName = lastNameRef.current?.value || "";
        const username = `${firstName} ${lastName}`.trim();

        const user = {
            username,
            email: emailRef.current?.value || "",
            password: passwordRef.current?.value || "",
        };

        try {
            const res = await axios.post(`${API_URL}/register`, user);
            const { verificationToken } = res.data.data;
            const verifyLink = `${window.location.origin}/verify/${verificationToken}`;

            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    user_email: user.email,
                    verify_link: verifyLink
                },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );

            showMessage("✅ Registered! Check your email.", "success");
            setTimeout(() => navigate("/login"), 2000);

        } catch (err: any) {
            const errorMessage = err.response?.data?.status?.description || "Registration failed.";
            showMessage(errorMessage, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4 ">
            <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl w-full max-w-lg">
                
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-8">
                    Register
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-black">
                    
                    {/* First & Last Name Side by Side on larger screens */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input 
                            ref={firstNameRef} 
                            type="text" 
                            placeholder="First Name" 
                            className="input-field flex-1 border p-2 rounded-lg" 
                            required 
                        />
                        <input 
                            ref={lastNameRef} 
                            type="text" 
                            placeholder="Last Name" 
                            className="input-field flex-1 border p-2 rounded-lg" 
                            required 
                        />
                    </div>

                    <input ref={emailRef} type="email" placeholder="Email" className="input-field border p-2 rounded-lg" required />
                    <input ref={passwordRef} type="password" placeholder="Password" className="input-field border p-2 rounded-lg" required />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-lg font-semibold transition duration-300 
                            ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"} 
                            ${messageType === "success" ? "bg-green-600" : messageType === "error" ? "bg-red-600" : ""}`}
                    >
                        {isLoading ? "Registering..." : message || "Register"}
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-600 font-medium hover:underline">
                            Login
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}
