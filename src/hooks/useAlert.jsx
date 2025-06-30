import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useAlert = (redirectPath) => {
    const [alerts, setAlerts] = useState({});
    const navigate = useNavigate();

    const showAlert = (alertType, data = {}) => {
        setAlerts((prev) => ({
            ...prev,
            [alertType]: { visible: true, fadeOut: false, ...data },
        }));
    };

    const closeAlert = (alertType, delay = 300) => {
        setAlerts((prev) => ({
            ...prev,
            [alertType]: { ...prev[alertType], fadeOut: true },
        }));

        setTimeout(() => {
            setAlerts((prev) => {
                const newAlerts = { ...prev };
                delete newAlerts[alertType];
                return newAlerts;
            });
            if (redirectPath) navigate(redirectPath);
        }, delay);
    };

    return { alerts, showAlert, closeAlert };
};
