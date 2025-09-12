import React, { useState } from "react";
import "../css/Login.css"; // reuse same styles for consistency

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
      // Hook up API call here
      await new Promise((r) => setTimeout(r, 900));
      console.log({ username, email, password, role });
      // navigate("/dashboard");
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

            {/* Role */}
            {/* Role */}
            <div className="field role-field">
              <span className="role-label">Choose Role:</span>
              <div className="role-options">
                <label
                  className={`role-option ${role === "user" ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={role === "user"}
                    onChange={() => setRole("user")}
                  />
                  User
                </label>
                <label
                  className={`role-option ${role === "admin" ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === "admin"}
                    onChange={() => setRole("admin")}
                  />
                  Admin
                </label>
              </div>
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
