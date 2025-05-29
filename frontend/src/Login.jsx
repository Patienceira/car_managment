import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "PSSMS";

    window.history.pushState(null, document.title, window.location.href);
    const onPopState = () => {
      window.history.pushState(null, document.title, window.location.href);
    };
    const onKeyDown = (e) => {
      if (
        (e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) ||
        (e.metaKey && (e.key === "ArrowLeft" || e.key === "ArrowRight"))
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("popstate", onPopState);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const url = `http://localhost:3000/${isRegister ? "register" : "login"}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
      } else {
        if (isRegister) {
          setMessage("Account created successfully. Please login.");
          setIsRegister(false);
        } else {
          localStorage.setItem("username", name);
          localStorage.setItem("token", data.token || "");
          navigate("/");
        }
      }
    } catch {
      setError("Network error. Try again.");
    }
  };

  return (
    <div className="login-container position-relative">
      <div className="overlay" />
      <div className="form-wrapper d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="system-title text-white mb-4 text-center">
         PSSMS
        </h1>

        <form
          className={`login-form p-4 bg-white rounded shadow animated-form ${
            isRegister ? "slide-left" : "slide-right"
          }`}
          onSubmit={handleSubmit}
        >
          <h3 className="text-center mb-3">{isRegister ? "Register" : "Login"}</h3>

          <div className="form-group mb-3 floating-label-group">
            <input
              type="text"
              className="form-control floating-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
            <label className="floating-label">Username</label>
          </div>

          <div className="form-group mb-3 floating-label-group position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control floating-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="floating-label">Password</label>
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer", userSelect: "none" }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit" className="btn btn-primary w-100 animated-btn">
            {isRegister ? "Register" : "Login"}
          </button>

          {message && <div className="alert alert-success mt-3">{message}</div>}
          {error && <div className="alert alert-danger mt-3">{error}</div>}

          <div className="text-center mt-3">
            {isRegister ? (
              <>
                <small>Already have an account?</small>
                <br />
                <button
                  className="btn btn-sm btn-outline-secondary mt-1"
                  onClick={() => setIsRegister(false)}
                  type="button"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                <small>Don't have an account?</small>
                <br />
                <button
                  className="btn btn-sm btn-outline-secondary mt-1"
                  onClick={() => setIsRegister(true)}
                  type="button"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
