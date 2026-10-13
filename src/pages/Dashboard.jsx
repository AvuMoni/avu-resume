// src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "../firebase";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState("");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const loadRequests = async () => {
      if (!currentUser) {
        setRequests([]);
        setRequestsLoading(false);
        return;
      }

      try {
        setRequestsLoading(true);
        setRequestsError("");

        const requestsQuery = query(
          collection(db, "collaborationRequests"),
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(requestsQuery);

        const requestData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRequests(requestData);
      } catch (error) {
        console.error(
          "Error loading collaboration requests:",
          error
        );

        setRequestsError(
          "Unable to load your collaboration requests."
        );
      } finally {
        setRequestsLoading(false);
      }
    };

    loadRequests();
  }, [currentUser]);

  const displayName =
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "Member";

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return "Recently";
    }

    if (typeof timestamp.toDate === "function") {
      return timestamp.toDate().toLocaleDateString(
        undefined,
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );
    }

    return "Recently";
  };

  const formatStatus = (status) => {
    if (!status) {
      return "New";
    }

    return status
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  return (
    <div className="dashboard-page">

      <div className="dashboard-container">

        {/* =========================
            WELCOME
        ========================== */}

        <section className="dashboard-welcome">

          <div>

            <span className="dashboard-label">
              AVU YILE / MEMBER AREA
            </span>

            <h1>
              Welcome, {displayName}.
            </h1>

            <p>
              Your space to discover projects, connect,
              collaborate and grow with Avu Yile.
            </p>

          </div>

          <div className="dashboard-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>

        </section>

        {/* =========================
            EXPLORE
        ========================== */}

        <section className="dashboard-section">

          <div className="dashboard-section-heading">

            <div>

              <span>
                EXPLORE
              </span>

              <h2>
                What would you like to do?
              </h2>

            </div>

          </div>

          <div className="dashboard-grid">

            <button
              className="dashboard-feature"
              onClick={() => navigate("/projects")}
            >

              <div className="feature-number">
                01
              </div>

              <h3>
                Explore Projects
              </h3>

              <p>
                Discover creative projects, initiatives
                and opportunities happening through
                Avu Yile.
              </p>

              <span className="feature-link">
                View Projects →
              </span>

            </button>

            <button
              className="dashboard-feature"
              onClick={() => navigate("/collab")}
            >

              <div className="feature-number">
                02
              </div>

              <h3>
                Work With Us
              </h3>

              <p>
                Have an idea, skill or opportunity?
                Find out how you can collaborate with
                Avu Yile.
              </p>

              <span className="feature-link">
                Start Collaborating →
              </span>

            </button>

            <button
              className="dashboard-feature"
              onClick={() => navigate("/")}
            >

              <div className="feature-number">
                03
              </div>

              <h3>
                Discover Avu Yile
              </h3>

              <p>
                Learn more about our vision, community
                and the work we're building.
              </p>

              <span className="feature-link">
                Explore →
              </span>

            </button>

          </div>

        </section>

        {/* =========================
            COLLABORATION REQUESTS
        ========================== */}

        <section className="dashboard-section">

          <div className="dashboard-section-heading">

            <div>

              <span>
                YOUR ACTIVITY
              </span>

              <h2>
                Collaboration requests
              </h2>

            </div>

            {requests.length > 0 && (
              <button
                className="dashboard-text-button"
                onClick={() => navigate("/collab")}
              >
                New Request →
              </button>
            )}

          </div>

          {requestsLoading && (
            <div className="dashboard-requests-loading">

              <div className="loading-spinner"></div>

              <p>
                Loading your requests...
              </p>

            </div>
          )}

          {!requestsLoading && requestsError && (
            <div className="projects-error">
              {requestsError}
            </div>
          )}

          {!requestsLoading &&
            !requestsError &&
            requests.length === 0 && (

              <div className="dashboard-no-requests">

                <div className="dashboard-empty-number">
                  00
                </div>

                <div>

                  <h3>
                    No collaboration requests yet.
                  </h3>

                  <p>
                    Have an idea you'd like to explore
                    with Avu Yile? Start your first
                    collaboration request.
                  </p>

                  <button
                    className="btn-primary"
                    onClick={() => navigate("/collab")}
                  >
                    Start a Request →
                  </button>

                </div>

              </div>
            )}

          {!requestsLoading &&
            !requestsError &&
            requests.length > 0 && (

              <div className="dashboard-requests">

                {requests.map((request) => (

                  <div
                    key={request.id}
                    className="dashboard-request-card"
                  >

                    <div className="request-number">
                      {String(
                        requests.indexOf(request) + 1
                      ).padStart(2, "0")}
                    </div>

                    <div className="request-main">

                      <div className="request-top">

                        <span className="request-type">
                          {request.collaborationType ||
                            "Collaboration"}
                        </span>

                        <span
                          className={`request-status request-status-${request.status || "new"}`}
                        >
                          {formatStatus(
                            request.status
                          )}
                        </span>

                      </div>

                      <h3>
                        {request.organization ||
                          "Independent Collaboration"}
                      </h3>

                      <p>
                        {request.message}
                      </p>

                      <span className="request-date">
                        Submitted{" "}
                        {formatDate(
                          request.createdAt
                        )}
                      </span>

                    </div>

                  </div>

                ))}

              </div>
            )}

        </section>

        {/* =========================
            ACCOUNT OVERVIEW
        ========================== */}

        <section className="dashboard-section">

          <div className="dashboard-section-heading">

            <div>

              <span>
                YOUR ACCOUNT
              </span>

              <h2>
                Member overview
              </h2>

            </div>

          </div>

          <div className="dashboard-overview">

            <div className="overview-card">

              <span className="overview-label">
                ACCOUNT
              </span>

              <h3>
                Active
              </h3>

              <p>
                Your Avu Yile account is active and
                ready to use.
              </p>

            </div>

            <div className="overview-card">

              <span className="overview-label">
                EMAIL
              </span>

              <h3 className="overview-email">
                {currentUser?.email}
              </h3>

              <p>
                Your registered account email.
              </p>

            </div>

            <div className="overview-card">

              <span className="overview-label">
                MEMBER SINCE
              </span>

              <h3>
                {currentUser?.metadata?.creationTime
                  ? new Date(
                      currentUser.metadata.creationTime
                    ).toLocaleDateString()
                  : "Recently"}
              </h3>

              <p>
                Your Avu Yile membership began here.
              </p>

            </div>

          </div>

        </section>

        {/* =========================
            WHAT'S NEXT
        ========================== */}

        <section className="dashboard-coming-soon">

          <span>
            WHAT'S NEXT
          </span>

          <h2>
            More is coming.
          </h2>

          <p>
            Soon you'll be able to manage your projects,
            track opportunities, communicate with the
            Avu Yile team and more — all from here.
          </p>

        </section>

        {/* =========================
            LOGOUT
        ========================== */}

        <div className="dashboard-footer">

          <button
            onClick={handleLogout}
            className="dashboard-logout"
          >
            Log Out
          </button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
