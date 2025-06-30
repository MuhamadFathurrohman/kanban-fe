import React, { useState, useEffect } from "react";
import "../../sass/Login/Login.css";
import Logo from "../../assets/images/logo.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import API from "../../service/api";
import { LoaderButton } from "../../components/LoaderButton";
import { DEPARTMENT_MAP, ID_DEPARTMENT_MAP } from "../../utils/constants";

export default function SignUp() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        no_hp: "",
        password: "",
        confirmPassword: "",
        department: "",
    });
    const [alert, setAlert] = useState(null);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setAlert({ type: "error", message: "Name is required" });
            return false;
        }
        if (!formData.email.trim()) {
            setAlert({ type: "error", message: "Email is required" });
            return false;
        }
        if (!formData.password.trim()) {
            setAlert({ type: "error", message: "Password is required" });
            return false;
        }
        if (formData.password.length < 6) {
            setAlert({
                type: "error",
                message: "Password must be at least 6 characters",
            });
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setAlert({ type: "error", message: "Passwords do not match" });
            return false;
        }
        if (!formData.department) {
            setAlert({ type: "error", message: "Please select a department" });
            return false;
        }
        return true;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const signUpData = {
                name: formData.name,
                email: formData.email,
                no_hp: formData.no_hp,
                password: formData.password,
                id_department: ID_DEPARTMENT_MAP[formData.department],
            };

            await API.post("/auth/signup", signUpData);

            setAlert({
                type: "success",
                message: "Account created successfully! Please login.",
            });

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            setAlert({
                type: "error",
                message: error.response?.data?.message || "Registration failed",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 3000);

            const fadeOutTimeout = setTimeout(() => {
                setIsFadingOut(true);
            }, 2000);

            return () => {
                clearTimeout(timer);
                clearTimeout(fadeOutTimeout);
                setIsFadingOut(false);
            };
        }
    }, [alert]);

    return (
        <div className="login-container">
            <form className="login-card" onSubmit={handleSignUp}>
                <img src={Logo} alt="Logo" className="logo" />
                <h2>
                    PRODUCTION CONTROL
                    <span className="highlight"> DEPARTMENT</span>
                </h2>
                <h3>CREATE ACCOUNT</h3>
                <p className="sub-text">Please fill in your information</p>

                <div className="section-input">
                    <div>
                        <label className="label-input" htmlFor="name">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Your Full Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="label-input" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Your Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="label-input" htmlFor="no_hp">
                            Phone Number
                        </label>
                        <input
                            type="no_hp"
                            name="no_hp"
                            placeholder="Enter Your Phone Number"
                            value={formData.no_hp}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="label-input" htmlFor="department">
                            Department
                        </label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            required
                            className="input"
                            style={{ marginBottom: "15px" }}
                        >
                            <option value="">Select Department</option>
                            {Object.entries(DEPARTMENT_MAP)
                                .filter((_, index) => index !== 0)
                                .map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="section-input-password">
                        <label className="label-input" htmlFor="password">
                            Password
                        </label>
                        <div className="input-password">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter Your Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="section-input-password">
                        <label
                            className="label-input"
                            htmlFor="confirmPassword"
                        >
                            Confirm Password
                        </label>
                        <div className="input-password">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Your Password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                            <span
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? <LoaderButton /> : "Create Account"}
                </button>

                <p className="auth-text">
                    Already have an account?{" "}
                    <NavLink to="/login">
                        <span>Sign In</span>
                    </NavLink>
                </p>

                {alert && (
                    <div className="alert-overlay">
                        <div
                            className={`alert ${alert.type} ${
                                isFadingOut ? "fade-out" : "fade-in"
                            }`}
                        >
                            <span>{alert.message}</span>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
