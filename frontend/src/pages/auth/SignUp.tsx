import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ for navigation
import "../css/Login.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== verifyPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: username,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      // const data = await response.json();
      setSuccess("Signup successful! Redirecting to login...");
      
      // redirect after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth__bg">
      <main className="auth__container">
        <section className="auth__card" role="dialog" aria-label="Sign Up">
          <header className="auth__header">
            <div className="logo">
              <span className="logo__dot" />
              <span className="logo__text">ViralMotion</span>
            </div>
            <h1 className="auth__title">
              Create Account <span className="wave">🚀</span>
            </h1>
            <p className="auth__subtitle">
              Join to start creating snappy, TikTok-style animations.
            </p>
          </header>

          {error && (
            <div className="auth__error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="auth__success" role="alert">
              {success}
            </div>
          )}

          <form className="auth__form" onSubmit={onSubmit} noValidate>
            {/* Username */}
            <div className="field">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                autoComplete="username"
                aria-label="Username"
                required
              />
            </div>

            {/* Email */}
            <div className="field">
              <input
                type="email"
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
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                autoComplete="new-password"
                aria-label="Password"
                required
              />
            </div>

            {/* Verify Password */}
            <div className="field">
              <input
                type="password"
                placeholder="Verify Password"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                className="input"
                autoComplete="new-password"
                aria-label="Verify Password"
                required
              />
            </div>

            <button
              className="btn btn--primary"
              type="submit"
              disabled={loading}
            >
              {loading ? <span className="spinner" aria-hidden /> : "Sign Up"}
            </button>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <div className="socials">
              <button type="button" className="btn btn--ghost">
                <img
                  src="/images/logos/google_logo.png"
                  alt="Google logo"
                  width={18}
                  height={18}
                />
                <span>Google</span>
              </button>

              <button type="button" className="btn btn--ghost">
                <img
                  src="/images/logos/github_logo.png"
                  alt="GitHub logo"
                  width={18}
                  height={18}
                />
                <span>GitHub</span>
              </button>

              <button type="button" className="btn btn--ghost">
                <img
                  src="/images/logos/x_logo.jpg"
                  alt="X logo"
                  width={18}
                  height={18}
                />
                <span>Twitter</span>
              </button>
            </div>
          </form>

          <footer className="auth__footer">
            <span>Already have an account?</span>
            <a className="link" href="/login">
              Log In
            </a>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default SignupPage;
