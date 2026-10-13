import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const {
    currentUser,
    userProfile,
    loading,
  } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  };

  const isAdmin =
    currentUser &&
    userProfile?.role === "admin";

  return (
    <nav className="navbar">

      {/* =========================
          LOGO
      ========================= */}

      <Link
        to="/"
        className="nav-logo"
      >
        Avu Yile
      </Link>


      {/* =========================
          NAVIGATION
      ========================= */}

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        <a href="/#about">
          About
        </a>

        <Link to="/projects">
          Projects
        </Link>
        <Link to="/contact">
          Contact
        </Link>
        <Link to="/collab">
          Work With Us
        </Link>



        {/* =========================
            AUTHENTICATED USER
        ========================= */}

        {!loading && currentUser ? (
          <>

            <Link to="/dashboard">
              Dashboard
            </Link>


            {/* =========================
                ADMIN LINK
            ========================= */}

            {isAdmin && (
              <Link
                to="/admin"
                className="nav-admin"
              >
                Admin
              </Link>
            )}


            {/* =========================
                LOGOUT
            ========================= */}

            <button
              onClick={handleLogout}
              className="nav-logout"
              type="button"
            >
              Logout
            </button>

          </>
        ) : !loading ? (

          /* =========================
             LOGGED OUT
          ========================= */

          <>

            <Link
              to="/login"
              className="nav-login"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="nav-signup"
            >
              Join Now
            </Link>

          </>

        ) : null}

      </div>

    </nav>
  );
}

export default Navbar;
