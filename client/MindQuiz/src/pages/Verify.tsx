import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Verify() {
    const { token } = useParams<{ token: string; }>();
    const [msg, setMsg] = useState("Verifying...");
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/verify/${token}`);
                setMsg(res.data.status.description);
                setTimeout(() => navigate("/login"), 2000);
            } catch (err: any) {
                setMsg("❌ Verification failed: " + (err.response?.data?.status?.description || err.message));
            }
        };
        if (token) verifyEmail();
    }, [token]);

    return <div className="flex justify-center items-center min-h-screen text-white text-2xl">{msg}</div>;
}
