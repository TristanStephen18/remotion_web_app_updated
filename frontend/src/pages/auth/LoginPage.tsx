import React, { useState } from "react";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      console.log({ email, password, remember });
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth__bg">
      <main className="auth__container">
        <section className="auth__card" role="dialog" aria-label="Login">
          <header className="auth__header">
            <div className="logo">
              <span className="logo__dot" />
              <span className="logo__text">ViralMotion</span>
            </div>
            <h1 className="auth__title">
              Welcome Back <span className="wave">👋</span>
            </h1>
            <p className="auth__subtitle">
              Sign in to continue creating snappy, TikTok-style animations.
            </p>
          </header>

          {error && (
            <div className="auth__error" role="alert">
              {error}
            </div>
          )}

          <form className="auth__form" onSubmit={onSubmit} noValidate>
            {/* Email */}
            <div className="field">
              <span className="field__icon" aria-hidden>
                {/* Mail Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 6h16v12H4z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="m4 7 8 6 8-6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </span>
              <input
                type="email"
                inputMode="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                autoComplete="email"
                aria-label="Email address"
                required
              />
            </div>

            {/* Password */}
            <div className="field">
              <span className="field__icon" aria-hidden>
                {/* Lock Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M8 10V7a4 4 0 1 1 8 0v3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                autoComplete="current-password"
                aria-label="Password"
                required
              />
              <button
                type="button"
                className="field__suffix"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye-off
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 3l18 18"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 3-3c0-.5-.1-1-.3-1.4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M20.8 12.6c-1.7 2.9-4.9 4.9-8.8 4.9-2.1 0-4.1-.6-5.8-1.7M4 8.7C5.8 6.3 8.8 4.9 12 4.9c2.1 0 4.1.6 5.8 1.7"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>
                ) : (
                  // Eye
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className="auth__row">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a className="link" href="/forgot">
                Forgot password?
              </a>
            </div>

            <button
              className="btn btn--primary"
              type="submit"
              disabled={loading}
            >
              {loading ? <span className="spinner" aria-hidden /> : "Log In"}
            </button>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <div className="socials">
              <button
                type="button"
                className="btn btn--ghost"
                aria-label="Continue with Google"
              >
                <img
                  src="/images/logos/google_logo.png"
                  alt="Google logo"
                  width={18}
                  height={18}
                />
                <span>Google</span>
              </button>

              <button
                type="button"
                className="btn btn--ghost"
                aria-label="Continue with GitHub"
              >
                <img
                  src="/images/logos/github_logo.png"
                  alt="GitHub logo"
                  width={18}
                  height={18}
                />
                <span>GitHub</span>
              </button>

              <button
                type="button"
                className="btn btn--ghost"
                aria-label="Continue with X"
              >
                <img
                  src="/images/logos/x_logo.jpg"
                  alt="X (Twitter) logo"
                  width={18}
                  height={18}
                />
                <span>Twitter</span>
              </button>
            </div>
          </form>

          <footer className="auth__footer">
            <span>Don’t have an account?</span>
            <a className="link" href="/signup">
              Sign Up
            </a>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
