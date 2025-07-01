import React, { useState, useEffect } from "react";
import "../../sass/Auth/Login/Login.css";
import Logo from "../../assets/images/logo.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import API from "../../service/api";
import { LoaderButton } from "../../components/LoaderButton";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [alert, setAlert] = useState(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Handle OTP input changes
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits

    if (value.length <= 1) {
      const newOtp = otp.split("");
      newOtp[index] = value;
      setOtp(newOtp.join(""));

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = e.target.parentNode.children[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  // Handle OTP input key events
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Focus previous input on backspace if current is empty
        const prevInput = e.target.parentNode.children[index - 1];
        if (prevInput) {
          prevInput.focus();
        }
      } else {
        // Clear current input
        const newOtp = otp.split("");
        newOtp[index] = "";
        setOtp(newOtp.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      const prevInput = e.target.parentNode.children[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    } else if (e.key === "ArrowRight" && index < 5) {
      const nextInput = e.target.parentNode.children[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    setOtp(pasteData);

    // Focus the next empty input or last input
    const focusIndex = Math.min(pasteData.length, 5);
    const inputs = e.target.parentNode.children;
    if (inputs[focusIndex]) {
      inputs[focusIndex].focus();
    }
  };

  // Step 1: Send OTP to email
  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setAlert({ type: "error", message: "Email is required" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await API.post("/auth/forgot-password", { email });

      setAlert({
        type: "success",
        message: "OTP has been sent to your email",
      });
      setStep(2);
      setCountdown(60); // 60 second countdown for resend
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Failed to send OTP",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setAlert({ type: "error", message: "OTP is required" });
      return;
    }

    if (otp.length !== 6) {
      setAlert({ type: "error", message: "OTP must be 6 digits" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await API.post("/auth/verify-otp", {
        email,
        otp,
      });

      setResetToken(response.data.resetToken);
      setAlert({
        type: "success",
        message: "OTP verified successfully",
      });
      setStep(3);
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Invalid OTP",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      setAlert({ type: "error", message: "New password is required" });
      return;
    }

    if (newPassword.length < 6) {
      setAlert({
        type: "error",
        message: "Password must be at least 6 characters",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlert({ type: "error", message: "Passwords do not match" });
      return;
    }

    setIsLoading(true);

    try {
      await API.post("/auth/reset-password", {
        resetToken,
        newPassword,
        confirmPassword,
      });

      setAlert({
        type: "success",
        message: "Password reset successfully! Redirecting to login...",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Failed to reset password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    try {
      await API.post("/auth/forgot-password", { email });
      setAlert({
        type: "success",
        message: "New OTP has been sent to your email",
      });
      setCountdown(60);
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Failed to resend OTP",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to step 1
  const handleBackToEmail = () => {
    setStep(1);
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setResetToken("");
    setCountdown(0);
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

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3>FORGOT PASSWORD</h3>
            <p className="sub-text">Enter your email to receive OTP</p>

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
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? <LoaderButton /> : "Send OTP"}
            </button>
          </>
        );

      case 2:
        return (
          <>
            <h3>VERIFY OTP</h3>
            <p className="sub-text">
              Enter the 6-digit OTP sent to
              <br />
              <strong>{email}</strong>
            </p>

            <div className="section-input">
              <div>
                <label className="label-input" htmlFor="otp">
                  OTP Code
                </label>
                <div
                  className="otp-inputs"
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={otp[index] || ""}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      onPaste={(e) => handleOtpPaste(e)}
                      style={{
                        width: "45px",
                        height: "45px",
                        textAlign: "center",
                        fontSize: "18px",
                        fontWeight: "bold",
                        border: "2px solid #2ea1d8",
                        borderRadius: "8px",
                        backgroundColor: "white",
                        color: "#333",
                      }}
                      className="otp-input"
                    />
                  ))}
                </div>
              </div>
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? <LoaderButton /> : "Verify OTP"}
            </button>

            <div style={{ textAlign: "center", marginTop: "15px" }}>
              <span style={{ fontSize: "13px", color: "#666" }}>
                Didn't receive OTP?{" "}
                {countdown > 0 ? (
                  <span style={{ color: "#999" }}>Resend in {countdown}s</span>
                ) : (
                  <span
                    onClick={handleResendOTP}
                    style={{
                      color: "#0165b9",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Resend OTP
                  </span>
                )}
              </span>
            </div>

            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <span
                onClick={handleBackToEmail}
                style={{
                  fontSize: "13px",
                  color: "#0165b9",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Change Email
              </span>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h3>RESET PASSWORD</h3>
            <p className="sub-text">Enter your new password</p>

            <div className="section-input">
              <div className="section-input-password">
                <label className="label-input" htmlFor="newPassword">
                  New Password
                </label>
                <div className="input-password">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <span onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
              </div>

              <div className="section-input-password">
                <label className="label-input" htmlFor="confirmPassword">
                  Confirm New Password
                </label>
                <div className="input-password">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              {isLoading ? <LoaderButton /> : "Reset Password"}
            </button>
          </>
        );

      default:
        return null;
    }
  };

  const handleSubmit = (e) => {
    switch (step) {
      case 1:
        handleSendOTP(e);
        break;
      case 2:
        handleVerifyOTP(e);
        break;
      case 3:
        handleResetPassword(e);
        break;
      default:
        e.preventDefault();
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <img src={Logo} alt="Logo" className="logo" />
        <h2>
          PRODUCTION CONTROL
          <span className="highlight"> DEPARTMENT</span>
        </h2>

        {renderStepContent()}

        <p className="auth-text">
          Remember your password?{" "}
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
