// src/pages/ForgotPassword.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "../firebase";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);


  /* =====================================================
     HANDLE EMAIL CHANGE
  ===================================================== */

  const handleEmailChange = (e) => {

    setEmail(e.target.value);

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };


  /* =====================================================
     SEND RESET EMAIL
  ===================================================== */

  const handleResetPassword = async (e) => {

    e.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setSuccess("");


    const cleanEmail = email.trim().toLowerCase();


    /* ===================================================
       VALIDATE EMAIL
    =================================================== */

    if (!cleanEmail) {

      setError(
        "Please enter your email address."
      );

      return;
    }


    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(cleanEmail)) {

      setError(
        "Please enter a valid email address."
      );

      return;
    }


    /* ===================================================
       SEND FIREBASE RESET EMAIL
    =================================================== */

    try {

      setLoading(true);

      await sendPasswordResetEmail(
        auth,
        cleanEmail
      );


      /*
       * We intentionally use a generic success message.
       *
       * This avoids revealing whether a particular
       * email address is registered with the application.
       */

      setSuccess(
        "If an account exists for this email address, a password reset link has been sent. Please check your inbox and spam folder."
      );

      setEmail("");

    } catch (resetError) {

      console.error(
        "Password reset error:",
        resetError
      );


      switch (resetError.code) {

        case "auth/invalid-email":

          setError(
            "Please enter a valid email address."
          );

          break;


        case "auth/too-many-requests":

          setError(
            "Too many reset requests. Please wait a while and try again."
          );

          break;


        case "auth/network-request-failed":

          setError(
            "A network error occurred. Check your internet connection and try again."
          );

          break;


        case "auth/user-disabled":

          setError(
            "This account has been disabled. Please contact Avu Yile support."
          );

          break;


        default:

          /*
           * Keep the message generic rather than exposing
           * unnecessary Firebase implementation details.
           */

          setError(
            "We couldn't process the password reset request. Please try again."
          );

      }

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="auth-page">

      <div className="auth-card">

        <h1>
          Reset Your Password
        </h1>

        <p>
          Enter your email address and we'll send you
          instructions to reset your password.
        </p>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div
            className="auth-error"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>

        )}


        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (

          <div
            className="auth-success"
            role="status"
            aria-live="polite"
          >
            {success}
          </div>

        )}


        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleResetPassword}
          noValidate
        >

          <label htmlFor="forgot-password-email">
            Email address
          </label>

          <input
            id="forgot-password-email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={handleEmailChange}
            autoComplete="email"
            required
            disabled={loading}
          />


          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>

        </form>


        {/* =================================================
            BACK TO LOGIN
        ================================================= */}

        <p className="auth-switch">

          Remember your password?{" "}

          <Link to="/login">
            Back to Login
          </Link>

        </p>

      </div>

    </div>

  );
}

export default ForgotPassword;
