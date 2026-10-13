import React, { useCallback, useEffect, useState } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { Link } from "react-router-dom";

import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const {
    currentUser,
    userProfile,
  } = useAuth();

  const [stats, setStats] = useState({
    members: 0,
    projects: 0,
    collaborationRequests: 0,
    contactMessages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const [
        membersSnapshot,
        projectsSnapshot,
        requestsSnapshot,
        messagesSnapshot,
      ] = await Promise.all([
        getDocs(
          collection(db, "users")
        ),

        getDocs(
          collection(db, "projects")
        ),

        getDocs(
          collection(
            db,
            "collaborationRequests"
          )
        ),

        getDocs(
          collection(
            db,
            "contactMessages"
          )
        ),
      ]);

      setStats({
        members: membersSnapshot.size,
        projects: projectsSnapshot.size,
        collaborationRequests:
          requestsSnapshot.size,
        contactMessages:
          messagesSnapshot.size,
      });
    } catch (error) {
      console.error(
        "Error loading admin stats:",
        error
      );

      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <main className="admin-page">

      <div className="admin-container">

        {/* =========================================
            ADMIN HEADER
        ========================================= */}

        <section className="admin-welcome">

          <div>

            <span className="admin-label">
              AVU YILE / ADMIN
            </span>

            <h1>
              Welcome back.
            </h1>

            <p>
              Manage the Avu Yile platform,
              projects, members, requests,
              and messages from here.
            </p>

          </div>


          {/* =========================================
              ADMIN PROFILE
          ========================================= */}

          <div className="admin-profile">

            <span>
              ADMIN ACCOUNT
            </span>

            <strong>
              {userProfile?.displayName ||
                currentUser?.email ||
                "Administrator"}
            </strong>

            <small>
              {currentUser?.email ||
                "Administrator account"}
            </small>

          </div>

        </section>


        {/* =========================================
            ERROR STATE
        ========================================= */}

        {error && (

          <section className="admin-system">

            <span>
              SYSTEM ERROR
            </span>

            <h2>
              Dashboard statistics unavailable.
            </h2>

            <p>
              We could not load the latest
              administration statistics.
              Please try again.
            </p>

            <button
              type="button"
              className="admin-refresh-button"
              onClick={loadStats}
              disabled={loading}
            >
              {loading
                ? "Refreshing..."
                : "Try Again"}
            </button>

          </section>

        )}


        {/* =========================================
            STATISTICS
        ========================================= */}

        <section
          className="admin-stats"
          aria-label="Administration statistics"
        >

          {/* MEMBERS */}

          <article className="admin-stat-card">

            <span>
              01 / MEMBERS
            </span>

            <strong>
              {loading ? "—" : stats.members}
            </strong>

            <p>
              Registered community members
            </p>

          </article>


          {/* PROJECTS */}

          <article className="admin-stat-card">

            <span>
              02 / PROJECTS
            </span>

            <strong>
              {loading ? "—" : stats.projects}
            </strong>

            <p>
              Projects currently in the system
            </p>

          </article>


          {/* COLLABORATION */}

          <article className="admin-stat-card">

            <span>
              03 / COLLABORATION
            </span>

            <strong>
              {loading
                ? "—"
                : stats.collaborationRequests}
            </strong>

            <p>
              Collaboration requests received
            </p>

          </article>


          {/* CONTACT */}

          <article className="admin-stat-card">

            <span>
              04 / CONTACT
            </span>

            <strong>
              {loading
                ? "—"
                : stats.contactMessages}
            </strong>

            <p>
              Messages received through Contact
            </p>

          </article>

        </section>


        {/* =========================================
            MANAGEMENT
        ========================================= */}

        <section className="admin-management">

          <div className="admin-section-heading">

            <span>
              ADMINISTRATION
            </span>

            <h2>
              Manage the platform.
            </h2>

          </div>


          <div className="admin-management-grid">

            {/* MEMBERS */}

            <Link
              to="/admin/members"
              className="admin-management-card"
            >

              <div className="admin-management-number">
                01
              </div>

              <div>

                <span>
                  COMMUNITY
                </span>

                <h3>
                  Members
                </h3>

                <p>
                  View registered members,
                  account information, and
                  roles.
                </p>

              </div>

              <strong aria-hidden="true">
                →
              </strong>

            </Link>


            {/* PROJECTS */}

            <Link
              to="/admin/projects"
              className="admin-management-card"
            >

              <div className="admin-management-number">
                02
              </div>

              <div>

                <span>
                  CONTENT
                </span>

                <h3>
                  Projects
                </h3>

                <p>
                  Create, edit, feature,
                  and manage Avu Yile
                  projects.
                </p>

              </div>

              <strong aria-hidden="true">
                →
              </strong>

            </Link>


            {/* COLLABORATION */}

            <Link
              to="/admin/collaboration-requests"
              className="admin-management-card"
            >

              <div className="admin-management-number">
                03
              </div>

              <div>

                <span>
                  OPPORTUNITIES
                </span>

                <h3>
                  Collaboration Requests
                </h3>

                <p>
                  Review collaboration
                  requests and update
                  their status.
                </p>

              </div>

              <strong aria-hidden="true">
                →
              </strong>

            </Link>


            {/* CONTACT */}

            <Link
              to="/admin/contact-messages"
              className="admin-management-card"
            >

              <div className="admin-management-number">
                04
              </div>

              <div>

                <span>
                  COMMUNICATION
                </span>

                <h3>
                  Contact Messages
                </h3>

                <p>
                  Review messages sent
                  through the Avu Yile
                  contact form.
                </p>

              </div>

              <strong aria-hidden="true">
                →
              </strong>

            </Link>

          </div>

        </section>


        {/* =========================================
            QUICK ACTIONS
        ========================================= */}

        <section className="admin-quick-actions">

          <div className="admin-section-heading">

            <span>
              QUICK ACTIONS
            </span>

            <h2>
              Go somewhere useful.
            </h2>

          </div>


          <div className="admin-quick-links">

            <Link to="/">
              View Website ↗
            </Link>

            <Link to="/projects">
              View Projects ↗
            </Link>

            <Link to="/contact">
              View Contact Page ↗
            </Link>

            <Link to="/dashboard">
              Member Dashboard ↗
            </Link>

          </div>

        </section>

      </div>

    </main>
  );
}

export default AdminDashboard;
