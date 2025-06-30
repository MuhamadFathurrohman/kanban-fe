// Home.jsx
import React, { useEffect, useState } from "react";
import "../sass/Home/Home.css";
import API from "../service/api";
import { DEPARTMENT_MAP } from "../utils/constants";
import LoaderPrimary from "../components/LoaderPrimary";

export default function Home() {
    const [user, setUser] = useState({ name: "", role: "", department: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userStorage = JSON.parse(localStorage.getItem("user"));
                const response = await API.get(
                    `user/me/${userStorage.id_users}`
                );
                const userData = response.data.data;

                setUser({
                    name: userData.name || "User",
                    role: userData.role || "User",
                    department: `${
                        DEPARTMENT_MAP[userData.department.name] ||
                        userData.department.name ||
                        ""
                    } Department`,
                });
            } catch (err) {
                setError("Gagal mengambil data user. Silakan login ulang.", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="home-wrapper">
                <div className="home-container">
                    <div className="loader">
                        <LoaderPrimary />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="home-wrapper">
                <p style={{ color: "red" }}>{error}</p>
            </div>
        );
    }

    return (
        <div className="home-wrapper">
            <div className="home-container">
                <h1 className="company-name">
                    PT AUTOMOTIVE FASTENERS AOYAMA INDONESIA
                </h1>
                <h2 className="welcome-text">
                    WELCOME BACK{" "}
                    <span className="highlight-name">
                        {user.name.toUpperCase()}
                    </span>
                    ,{" "}
                    <span className="highlight-role">
                        {user.role.toUpperCase()}
                    </span>{" "}
                    OF{" "}
                    <span className="highlight-dept">
                        {user.department.toUpperCase()}
                    </span>
                </h2>
                <h3 className="request-text">TO REQUEST KANBAN</h3>
            </div>
        </div>
    );
}
