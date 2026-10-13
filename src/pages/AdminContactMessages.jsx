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

function AdminContactMessages() {
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const messagesQuery = query(
        collection(db, "contactMessages"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(messagesQuery);

      const loadedMessages = snapshot.docs.map((messageDoc) => ({
        id: messageDoc.id,
        ...messageDoc.data(),
      }));

      setMessages(loadedMessages);
    } catch (error) {
      console.error(
        "Error loading contact messages:",
        error
      );

      setError(
        "Unable to load contact messages."
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

  const updateMessageStatus = async (
    messageId,
    status
  ) => {
    try {
      setUpdatingId(messageId);

      const messageRef = doc(
        db,
        "contactMessages",
        messageId
      );

      await updateDoc(messageRef, {
        status,
        updatedAt: new Date(),
      });

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === messageId
            ? {
                ...message,
                status,
              }
            : message
        )
      );
    } catch (error) {
      console.error(
        "Error updating message status:",
        error
      );

      alert(
        "Unable to update the message status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteMessage = async (messageId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(messageId);

      await deleteDoc(
        doc(
          db,
          "contactMessages",
          messageId
        )
      );

      setMessages((currentMessages) =>
        currentMessages.filter(
          (message) =>
            message.id !== messageId
        )
      );
    } catch (error) {
      console.error(
        "Error deleting contact message:",
        error
      );

      alert(
        "Unable to delete the message."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "new":
        return "new";

      case "read":
        return "read";

      case "replied":
        return "replied";

      case "archived":
        return "archived";

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

        {/* =========================================
            BACK
        ========================================= */}

        <div className="admin-page-back">

          <Link to="/admin">
            ← Back to Admin Dashboard
          </Link>

        </div>


        {/* =========================================
            HEADER
        ========================================= */}

        <section className="admin-welcome">

          <div>

            <span className="admin-label">
              AVU YILE / COMMUNICATION
            </span>

            <h1>
              Contact Messages.
            </h1>

            <p>
              Review messages submitted through
              the Avu Yile contact form and keep
              track of their status.
            </p>

          </div>

          <div className="admin-profile">

            <span>
              TOTAL MESSAGES
            </span>

            <strong>
              {messages.length}
            </strong>

            <small>
              Contact submissions
            </small>

          </div>

        </section>


        {/* =========================================
            ERROR
        ========================================= */}

        {error && (
          <div className="admin-system">

            <p>
              {error}
            </p>

            <button
              type="button"
              className="admin-refresh-button"
              onClick={loadMessages}
            >
              Try Again
            </button>

          </div>
        )}


        {/* =========================================
            LOADING
        ========================================= */}

        {loading && !error && (
          <div className="admin-system">

            <div className="auth-loading">

              <div className="loading-spinner"></div>

              <p>
                Loading contact messages...
              </p>

            </div>

          </div>
        )}


        {/* =========================================
            EMPTY
        ========================================= */}

        {!loading &&
          !error &&
          messages.length === 0 && (
            <div className="admin-system">

              <span className="admin-label">
                INBOX EMPTY
              </span>

              <h2>
                No contact messages yet.
              </h2>

              <p>
                Messages submitted through the
                Contact page will appear here.
              </p>

              <Link
                to="/contact"
                className="btn-secondary"
              >
                View Contact Page
              </Link>

            </div>
          )}


        {/* =========================================
            MESSAGE LIST
        ========================================= */}

        {!loading &&
          !error &&
          messages.length > 0 && (

            <section className="admin-contact-list">

              {messages.map(
                (message, index) => (

                  <article
                    key={message.id}
                    className="admin-contact-card"
                  >

                    {/* NUMBER */}

                    <div className="admin-contact-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>


                    <div className="admin-contact-content">

                      {/* HEADER */}

                      <div className="admin-contact-header">

                        <div>

                          <div className="admin-contact-name-row">

                            <h2>
                              {message.name ||
                                "Unknown sender"}
                            </h2>

                            <span
                              className={`admin-contact-status ${getStatusClass(
                                message.status
                              )}`}
                            >
                              {getStatusLabel(
                                message.status
                              )}
                            </span>

                          </div>

                          <a
                            href={`mailto:${message.email}`}
                            className="admin-contact-email"
                          >
                            {message.email ||
                              "No email provided"}
                          </a>

                        </div>


                        <div className="admin-contact-date">

                          {formatDate(
                            message.createdAt
                          )}

                        </div>

                      </div>


                      {/* MESSAGE */}

                      <div className="admin-contact-message">

                        <span>
                          MESSAGE
                        </span>

                        <p>
                          {message.message ||
                            "No message content."}
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
                              message.status ===
                              "new"
                                ? "active"
                                : ""
                            }`}
                            disabled={
                              updatingId ===
                              message.id
                            }
                            onClick={() =>
                              updateMessageStatus(
                                message.id,
                                "new"
                              )
                            }
                          >
                            New
                          </button>


                          <button
                            type="button"
                            className={`admin-status-button ${
                              message.status ===
                              "read"
                                ? "active"
                                : ""
                            }`}
                            disabled={
                              updatingId ===
                              message.id
                            }
                            onClick={() =>
                              updateMessageStatus(
                                message.id,
                                "read"
                              )
                            }
                          >
                            Read
                          </button>


                          <button
                            type="button"
                            className={`admin-status-button ${
                              message.status ===
                              "replied"
                                ? "active"
                                : ""
                            }`}
                            disabled={
                              updatingId ===
                              message.id
                            }
                            onClick={() =>
                              updateMessageStatus(
                                message.id,
                                "replied"
                              )
                            }
                          >
                            Replied
                          </button>


                          <button
                            type="button"
                            className={`admin-status-button ${
                              message.status ===
                              "archived"
                                ? "active"
                                : ""
                            }`}
                            disabled={
                              updatingId ===
                              message.id
                            }
                            onClick={() =>
                              updateMessageStatus(
                                message.id,
                                "archived"
                              )
                            }
                          >
                            Archive
                          </button>


                          <button
                            type="button"
                            className="admin-delete-button"
                            disabled={
                              deletingId ===
                              message.id
                            }
                            onClick={() =>
                              deleteMessage(
                                message.id
                              )
                            }
                          >
                            {deletingId ===
                            message.id
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

export default AdminContactMessages;
