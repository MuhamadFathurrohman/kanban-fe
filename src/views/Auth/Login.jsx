import React, { useState, useEffect } from "react";
import "../../sass/Auth/Login/Login.css";
import Logo from "../../assets/images/logo.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import API from "../../service/api";
import { LoaderButton } from "../../components/LoaderButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });
      const user = res.data.user;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      const role = user.role.toLowerCase();
      const department = user.id_department;

      // Routing berdasarkan role dan departemen
      if (department !== 1) {
        if (role === "user") {
          navigate("/user/home-user");
        } else if (
          role === "manager" ||
          role === "leader" ||
          role === "supervisor"
        ) {
          navigate("/user-lead/home-user-lead");
        } else {
          setAlert({
            type: "error",
            message: "Role tidak dikenali untuk departemen ini.",
          });
        }
      } else {
        // Jika department = Production Control
        if (role === "admin") {
          navigate("/admin/home-admin");
        } else if (
          role === "manager" ||
          role === "supervisor" ||
          role === "staff"
        ) {
          navigate("/pc-lead/home-pc-lead");
        } else {
          setAlert({
            type: "error",
            message: "Role tidak dikenali untuk Production Control.",
          });
        }
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Internal Server Error",
      });
    } finally {
      setIsLoading(false); // Matikan loader setelah selesai
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
      <form className="login-card" onSubmit={handleLogin}>
        <img src={Logo} alt="Logo" className="logo" />
        <h2>
          PRODUCTION CONTROL
          <span className="highlight"> DEPARTMENT</span>
        </h2>
        <h3>REQUEST KANBAN</h3>
        <p className="sub-text">Please sign in to your account</p>
        <div className="section-input">
          <div>
            <label className="label-input" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="section-input-password">
            <label className="label-input" htmlFor="password">
              Password
            </label>
            <div className="input-password">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            <NavLink to="/forgot-password">
              <p>Forgot Password?</p>
            </NavLink>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="login-button">
          {isLoading ? <LoaderButton /> : "Sign In"}
        </button>

        <p className="auth-text">
          Don't have account?{" "}
          <NavLink to="/signup">
            <span>Sign Up</span>
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
