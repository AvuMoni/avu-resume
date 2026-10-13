import React, { useEffect, useState } from "react";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { Link } from "react-router-dom";

import { db } from "../firebase";

function AdminCollaborationRequests() {
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const requestsQuery = query(
        collection(db, "collaborationRequests"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(requestsQuery);

      const loadedRequests = snapshot.docs.map(
        (requestDoc) => ({
          id: requestDoc.id,
          ...requestDoc.data(),
        })
      );

      setRequests(loadedRequests);
    } catch (error) {
      console.error(
        "Error loading collaboration requests:",
        error
      );

      setError(
        "Unable to load collaboration requests."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return "Date unavailable";
    }

    try {
      const date = timestamp.toDate
        ? timestamp.toDate()
        : new Date(timestamp);

      return date.toLocaleString("en-ZA", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Date unavailable";
    }
  };

  const updateRequestStatus = async (
    requestId,
    status
  ) => {
    try {
      setUpdatingId(requestId);

      const requestRef = doc(
        db,
        "collaborationRequests",
        requestId
      );

      await updateDoc(requestRef, {
        status,
        updatedAt: new Date(),
      });

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status,
              }
            : request
        )
      );
    } catch (error) {
      console.error(
        "Error updating collaboration request:",
        error
      );

      alert(
        "Unable to update the request status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteRequest = async (requestId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this collaboration request?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(requestId);

      await deleteDoc(
        doc(
          db,
          "collaborationRequests",
          requestId
        )
      );

      setRequests((currentRequests) =>
        currentRequests.filter(
          (request) =>
            request.id !== requestId
        )
      );
    } catch (error) {
      console.error(
        "Error deleting collaboration request:",
        error
      );

      alert(
        "Unable to delete the collaboration request."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "new":
        return "new";

      case "reviewing":
        return "reviewing";

      case "approved":
        return "approved";

      case "declined":
        return "declined";

      default:
        return "new";
    }
  };

  const getStatusLabel = (status) => {
    if (!status) {
      return "New";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  return (
    <main className="admin-page">

      <div className="admin-container">

        {/* BACK BUTTON */}

        <div className="admin-page-back">

          <Link to="/admin">
            ← Back to Admin Dashboard
          </Link>

        </div>

        {/* PAGE HEADER */}

        <section className="admin-welcome">

          <div>

            <span className="admin-label">
              AVU YILE / OPPORTUNITIES
            </span>

            <h1>
              Collaboration Requests.
            </h1>

            <p>
              Review people and organisations
              interested in working with Avu Yile.
            </p>

          </div>

          <div className="admin-profile">

            <span>
              TOTAL REQUESTS
            </span>

            <strong>
              {requests.length}
            </strong>

            <small>
              Collaboration submissions
            </small>

          </div>

        </section>

        {/* ERROR */}

        {error && (
          <div className="admin-system">

            <p>
              {error}
            </p>

            <button
              type="button"
              className="admin-refresh-button"
              onClick={loadRequests}
            >
              Try Again
            </button>

          </div>
        )}

        {/* LOADING */}

        {loading && !error && (
          <div className="admin-system">

            <div className="auth-loading">

              <div className="loading-spinner"></div>

              <p>
                Loading collaboration requests...
              </p>

            </div>

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          requests.length === 0 && (
            <div className="admin-system">

              <span className="admin-label">
                REQUESTS EMPTY
              </span>

              <h2>
                No collaboration requests yet.
              </h2>

              <p>
                Requests submitted through the
                Work With Us page will appear here.
              </p>

              <Link
                to="/collab"
                className="btn-secondary"
              >
                View Work With Us
              </Link>

            </div>
          )}

        {/* REQUEST LIST */}

        {!loading &&
          !error &&
          requests.length > 0 && (

            <section className="admin-contact-list">

              {requests.map(
                (request, index) => (

                  <article
                    key={request.id}
                    className="admin-contact-card"
                  >

                    {/* NUMBER */}

                    <div className="admin-contact-number">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <div className="admin-contact-content">

                      {/* HEADER */}

                      <div className="admin-contact-header">

                        <div>

                          <div className="admin-contact-name-row">

                            <h2>
                              {request.name ||
                                "Unknown applicant"}
                            </h2>

                            <span
                              className={`admin-contact-status ${getStatusClass(
                                request.status
                              )}`}
                            >
                              {getStatusLabel(
                                request.status
                              )}
                            </span>

                          </div>

                          <a
                            href={`mailto:${request.email}`}
                            className="admin-contact-email"
                          >
                            {request.email ||
                              "No email provided"}
                          </a>

                        </div>

                        <div className="admin-contact-date">

                          {formatDate(
                            request.createdAt
                          )}

                        </div>

                      </div>

                      {/* DETAILS */}

                      <div className="admin-request-details">

                        <div className="admin-request-detail">

                          <span>
                            ORGANISATION
                          </span>

                          <strong>
                            {request.organization ||
                              "Not provided"}
                          </strong>

                        </div>

                        <div className="admin-request-detail">

                          <span>
                            COLLABORATION TYPE
                          </span>

                          <strong>
                            {request.collaborationType ||
                              "Not specified"}
                          </strong>

                        </div>

                        <div className="admin-request-detail">

                          <span>
                            USER ID
                          </span>

                          <strong>
                            {request.userId ||
                              "Unavailable"}
                          </strong>

                        </div>

                      </div>

                      {/* MESSAGE */}

                      <div className="admin-contact-message">

                        <span>
                          REQUEST MESSAGE
                        </span>

                        <p>
                          {request.message ||
                            "No message provided."}
                        </p>

                      </div>

                      {/* ACTIONS */}

                      <div className="admin-contact-actions">

                        <span>
                          UPDATE STATUS
                        </span>

                        <div className="admin-status-buttons">

                          <button
                            type="button"
                            className={`admin-status-button ${
                              request.status ===
                              "new"
                                ? "active"
                                : ""
                            }`}
                            disabled={
                              updatingId ===
                              request.id
                            }
                            onClick={() =>
                              updateRequestStatus(
                                request.id,
                                "new"
                              )
                            }
                          >
                            New
                          </button>

                          <button
                            type="button"
                            className={`admin-status-button ${
                              request.status ===
                              "reviewing"
                                ? "active"
                                : ""
                            }`}
                            disabled={
                              updatingId ===
                              request.id
                            }
                            onClick={() =>
                              updateRequestStatus(
                                request.id,
                                "reviewing"
                              )
                            }
                          >
                            Reviewing
                          </button>

                          <button
                            type="button"
                            className={`admin-status-button ${
                              request.status ===
                              "approved"
                                ? "active"
                                : ""
                            }`}
                            disabled={
                              updatingId ===
                              request.id
                            }
                            onClick={() =>
                              updateRequestStatus(
                                request.id,
                                "approved"
                              )
                            }
                          >
                            Approved
                          </button>

                          <button
                            type="button"
                            className={`admin-status-button ${
                              request.status ===
                              "declined"
                                ? "active"
                                : ""
                            }`}
                            disabled={
                              updatingId ===
                              request.id
                            }
                            onClick={() =>
                              updateRequestStatus(
                                request.id,
                                "declined"
                              )
                            }
                          >
                            Declined
                          </button>

                          <button
                            type="button"
                            className="admin-delete-button"
                            disabled={
                              deletingId ===
                              request.id
                            }
                            onClick={() =>
                              deleteRequest(
                                request.id
                              )
                            }
                          >
                            {deletingId ===
                            request.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </div>

                    </div>

                  </article>

                )
              )}

            </section>

          )}

      </div>

    </main>
  );
}

export default AdminCollaborationRequests;
