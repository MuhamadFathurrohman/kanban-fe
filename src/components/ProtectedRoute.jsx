// components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SessionExpiredModal from "./SessionExpiredModal";

export default function ProtectedRoute({ children }) {
    const [isExpired, setIsExpired] = useState(false);
    const token = localStorage.getItem("token");
    const [alertConfirm, setAlertConfirm] = useState(true);
    const [fadeOutConfirm, setFadeOutConfirm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setIsExpired(true);
            setAlertConfirm(true);
            return;
        }

        const tokenTimer = setTimeout(() => {
            localStorage.clear();
            setIsExpired(true);
            setAlertConfirm(true);
        }, 30 * 60 * 1000);

        return () => {
            clearTimeout(tokenTimer);
        };
    }, [token]);

    const handleConfirm = () => {
        localStorage.clear();

        setFadeOutConfirm(true);
        setTimeout(() => {
            setAlertConfirm(false);
            setFadeOutConfirm(false);
            navigate("/login", { replace: true });
        }, 300);
    };

    if (isExpired) {
        return (
            <SessionExpiredModal
                onConfirm={handleConfirm}
                alertConfirm={alertConfirm}
                fadeOutConfirm={fadeOutConfirm}
            />
        );
    }

    return children;
}
