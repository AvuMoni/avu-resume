// src/pages/Signup.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../firebase";

function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  /* =====================================================
     CLEAR ERROR WHEN USER STARTS TYPING
  ===================================================== */

  const handleFieldChange = (setter) => (e) => {
    setter(e.target.value);

    if (error) {
      setError("");
    }
  };


  /* =====================================================
     SIGNUP
  ===================================================== */

  const handleSignup = async (e) => {

    e.preventDefault();

    if (loading) {
      return;
    }

    setError("");


    /* ===================================================
       CLEAN USER INPUT
    =================================================== */

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();


    /* ===================================================
       FULL NAME VALIDATION
    =================================================== */

    if (!cleanName) {

      setError("Please enter your full name.");

      return;
    }

    if (cleanName.length < 2) {

      setError(
        "Your name must contain at least 2 characters."
      );

      return;
    }

    if (cleanName.length > 100) {

      setError(
        "Your name is too long."
      );

      return;
    }


    /* ===================================================
       EMAIL VALIDATION
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
       PASSWORD VALIDATION
    =================================================== */

    if (!password) {

      setError(
        "Please create a password."
      );

      return;
    }

    if (password.length < 6) {

      setError(
        "Password must be at least 6 characters."
      );

      return;
    }

    if (password.length > 128) {

      setError(
        "Password is too long."
      );

      return;
    }


    /* ===================================================
       PASSWORD CONFIRMATION
    =================================================== */

    if (!confirmPassword) {

      setError(
        "Please confirm your password."
      );

      return;
    }

    if (password !== confirmPassword) {

      setError(
        "Passwords do not match."
      );

      return;
    }


    /* ===================================================
       CREATE ACCOUNT
    =================================================== */

    try {

      setLoading(true);


      /* =================================================
         FIREBASE AUTHENTICATION
      ================================================= */

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

      const user = userCredential.user;


      /* =================================================
         SAVE DISPLAY NAME TO FIREBASE AUTH
      ================================================= */

      await updateProfile(user, {

        displayName: cleanName,

      });


      /* =================================================
         CREATE FIRESTORE USER PROFILE

         IMPORTANT:
         New users are ALWAYS created as "member".

         The frontend never accepts a role from the
         registration form.
      ================================================= */

      await setDoc(
        doc(db, "users", user.uid),
        {

          displayName: cleanName,

          email: cleanEmail,

          role: "member",

          createdAt: serverTimestamp(),

          updatedAt: serverTimestamp(),

        }
      );


      /* =================================================
         REDIRECT
      ================================================= */

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

    } catch (signupError) {

      console.error(
        "Signup failed:",
        signupError
      );


      /* =================================================
         FIREBASE AUTH ERRORS
      ================================================= */

      switch (signupError.code) {

        case "auth/email-already-in-use":

          setError(
            "An account with this email already exists. Please log in instead."
          );

          break;


        case "auth/invalid-email":

          setError(
            "Please enter a valid email address."
          );

          break;


        case "auth/weak-password":

          setError(
            "Your password is too weak. Please choose a stronger password."
          );

          break;


        case "auth/password-does-not-meet-requirements":

          setError(
            "Your password does not meet the required security requirements."
          );

          break;


        case "auth/operation-not-allowed":

          setError(
            "Account registration is currently unavailable. Please contact support."
          );

          break;


        case "auth/network-request-failed":

          setError(
            "A network error occurred. Check your internet connection and try again."
          );

          break;


        case "auth/too-many-requests":

          setError(
            "Too many requests. Please wait a while and try again."
          );

          break;


        default:

          setError(
            "Unable to create your account. Please try again."
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
          Join Avu Yile
        </h1>

        <p>
          Create your account and become part of the journey.
        </p>


        {/* =================================================
            ERROR MESSAGE
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


        <form
          onSubmit={handleSignup}
          noValidate
        >

          {/* =================================================
              FULL NAME
          ================================================= */}

          <label htmlFor="signup-name">
            Full name
          </label>

          <input
            id="signup-name"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={handleFieldChange(setFullName)}
            autoComplete="name"
            required
            disabled={loading}
          />


          {/* =================================================
              EMAIL
          ================================================= */}

          <label htmlFor="signup-email">
            Email address
          </label>

          <input
            id="signup-email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={handleFieldChange(setEmail)}
            autoComplete="email"
            required
            disabled={loading}
          />


          {/* =================================================
              PASSWORD
          ================================================= */}

          <label htmlFor="signup-password">
            Password
          </label>

          <div className="password-input-wrapper">

            <input
              id="signup-password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Create a password"
              value={password}
              onChange={handleFieldChange(setPassword)}
              autoComplete="new-password"
              required
              disabled={loading}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(
                  (previous) => !previous
                )
              }
              disabled={loading}
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword
                ? "Hide"
                : "Show"}
            </button>

          </div>


          {/* =================================================
              CONFIRM PASSWORD
          ================================================= */}

          <label htmlFor="signup-confirm-password">
            Confirm password
          </label>

          <div className="password-input-wrapper">

            <input
              id="signup-confirm-password"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={handleFieldChange(
                setConfirmPassword
              )}
              autoComplete="new-password"
              required
              disabled={loading}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowConfirmPassword(
                  (previous) => !previous
                )
              }
              disabled={loading}
              aria-label={
                showConfirmPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showConfirmPassword
                ? "Hide"
                : "Show"}
            </button>

          </div>


          {/* =================================================
              PASSWORD REQUIREMENT
          ================================================= */}

          <p className="auth-help-text">
            Password must contain at least 6 characters.
          </p>


          {/* =================================================
              SUBMIT
          ================================================= */}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>


        {/* =================================================
            LOGIN LINK
        ================================================= */}

        <p className="auth-switch">

          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>

  );
}

export default Signup;
