// src/pages/Login.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      );

      const user = credential.user;

      /*
       * The AuthContext loads the user's Firestore profile.
       * Redirect based on the existing profile role.
       *
       * IMPORTANT:
       * This redirect is for navigation only.
       * AdminRoute and Firestore security rules must
       * independently enforce administrator permissions.
       */
      let destination = "/dashboard";

      try {
        const { db } = await import("../firebase");
        const { doc, getDoc } = await import("firebase/firestore");

        const profileSnapshot = await getDoc(
          doc(db, "users", user.uid)
        );

        if (
          profileSnapshot.exists() &&
          profileSnapshot.data().role === "admin"
        ) {
          destination = "/admin";
        }
      } catch (profileError) {
        console.error("Unable to load user profile:", profileError);

        // A profile lookup failure must not grant admin access.
        destination = "/dashboard";
      }

      navigate(destination, { replace: true });
    } catch (loginError) {
      console.error("Login failed:", loginError);

      switch (loginError.code) {
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError(
            "The email or password is incorrect. Please check your details and try again."
          );
          break;

        case "auth/user-disabled":
          setError(
            "This account has been disabled. Please contact Avu Yile support."
          );
          break;

        case "auth/too-many-requests":
          setError(
            "Too many login attempts. Please wait a while and try again."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "A network error occurred. Check your internet connection and try again."
          );
          break;

        case "auth/operation-not-allowed":
          setError(
            "Email and password login is currently unavailable. Please contact support."
          );
          break;

        default:
          setError(
            "We couldn't log you in right now. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (setter) => (e) => {
    setter(e.target.value);

    if (error) {
      setError("");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back</h1>

        <p>Log in to your Avu Yile account.</p>

        {error && (
          <div className="auth-error" role="alert" aria-live="polite">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} noValidate>
          <label htmlFor="login-email">
            Email address
          </label>

          <input
            id="login-email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={handleFieldChange(setEmail)}
            autoComplete="email"
            required
            disabled={loading}
            aria-invalid={Boolean(error)}
          />

          <label htmlFor="login-password">
            Password
          </label>

          <div className="password-input-wrapper">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={handleFieldChange(setPassword)}
              autoComplete="current-password"
              required
              disabled={loading}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((previous) => !previous)}
              disabled={loading}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <p className="forgot-password-link">
            <Link to="/forgot-password">
              Forgot your password?
            </Link>
          </p>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
