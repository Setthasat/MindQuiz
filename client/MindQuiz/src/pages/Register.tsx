import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";

export default function Register() {
    const usernameRef = useRef<HTMLInputElement>(null);
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

        const user = {
            username: usernameRef.current?.value || "",
            email: emailRef.current?.value || "",
            password: passwordRef.current?.value || "",
        };

        console.log(user);

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
        <div className="flex flex-col justify-start items-center min-h-screen max-h-screen max-w-screen bg-[#12161C] px-4 pt-16 md:pt-24 overflow-hidden">
            <h2 className="text-white text-4xl md:text-6xl pb-8">Register</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8 w-[70%] max-w-md text-white">
                <input ref={usernameRef} type="text" placeholder="Username" className="input-field" required />
                <input ref={emailRef} type="email" placeholder="Email" className="input-field" required />
                <input ref={passwordRef} type="password" placeholder="Password" className="input-field" required />

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`btn ${isLoading ? "loading" : ""} ${messageType === "success" ? "success" : messageType === "error" ? "error" : ""}`}
                >
                    {isLoading ? "Registering..." : message || "Register"}
                </button>
                <a className="text-right underline mt-2" href="/login">Already have an account? Login</a>
            </form>
        </div>
    );
}
