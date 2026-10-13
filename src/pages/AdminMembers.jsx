import React, { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { Link } from "react-router-dom";

import { db } from "../firebase";

function AdminMembers() {
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const membersQuery = query(
        collection(db, "users"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(membersQuery);

      const loadedMembers = snapshot.docs.map(
        (memberDoc) => ({
          id: memberDoc.id,
          ...memberDoc.data(),
        })
      );

      setMembers(loadedMembers);
    } catch (error) {
      console.error(
        "Error loading members:",
        error
      );

      setError(
        "Unable to load registered members."
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

      return date.toLocaleDateString("en-ZA", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Date unavailable";
    }
  };

  const filteredMembers = members.filter(
    (member) => {
      const search = searchTerm
        .toLowerCase()
        .trim();

      if (!search) {
        return true;
      }

      const name =
        member.displayName || "";

      const email =
        member.email || "";

      const role =
        member.role || "";

      return (
        name.toLowerCase().includes(search) ||
        email.toLowerCase().includes(search) ||
        role.toLowerCase().includes(search)
      );
    }
  );

  const adminCount = members.filter(
    (member) =>
      member.role === "admin"
  ).length;

  const memberCount = members.filter(
    (member) =>
      member.role !== "admin"
  ).length;

  return (
    <main className="admin-page">

      <div className="admin-container">

        {/* BACK */}

        <div className="admin-page-back">

          <Link to="/admin">
            ← Back to Admin Dashboard
          </Link>

        </div>

        {/* HEADER */}

        <section className="admin-welcome">

          <div>

            <span className="admin-label">
              AVU YILE / COMMUNITY
            </span>

            <h1>
              Members.
            </h1>

            <p>
              View registered members and
              their account information.
            </p>

          </div>

          <div className="admin-profile">

            <span>
              TOTAL MEMBERS
            </span>

            <strong>
              {members.length}
            </strong>

            <small>
              Registered accounts
            </small>

          </div>

        </section>

        {/* MEMBER SUMMARY */}

        {!loading &&
          !error && (
            <section className="admin-stats">

              <article className="admin-stat-card">

                <span>
                  01 / ALL ACCOUNTS
                </span>

                <strong>
                  {members.length}
                </strong>

                <p>
                  Total registered accounts
                </p>

              </article>

              <article className="admin-stat-card">

                <span>
                  02 / MEMBERS
                </span>

                <strong>
                  {memberCount}
                </strong>

                <p>
                  Standard community accounts
                </p>

              </article>

              <article className="admin-stat-card">

                <span>
                  03 / ADMINS
                </span>

                <strong>
                  {adminCount}
                </strong>

                <p>
                  Administrative accounts
                </p>

              </article>

            </section>
          )}

        {/* ERROR */}

        {error && (
          <div className="admin-system">

            <p>
              {error}
            </p>

            <button
              type="button"
              className="admin-refresh-button"
              onClick={loadMembers}
            >
              Try Again
            </button>

          </div>
        )}

        {/* SEARCH */}

        {!loading &&
          !error &&
          members.length > 0 && (

            <section className="admin-members-toolbar">

              <div>

                <span className="admin-label">
                  MEMBER DIRECTORY
                </span>

                <h2>
                  Registered accounts.
                </h2>

              </div>

              <div className="admin-member-search">

                <input
                  type="text"
                  placeholder="Search name, email or role..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                />

              </div>

            </section>

          )}

        {/* LOADING */}

        {loading && !error && (
          <div className="admin-system">

            <div className="auth-loading">

              <div className="loading-spinner"></div>

              <p>
                Loading members...
              </p>

            </div>

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          members.length === 0 && (

            <div className="admin-system">

              <span className="admin-label">
                COMMUNITY EMPTY
              </span>

              <h2>
                No registered members yet.
              </h2>

              <p>
                New accounts will appear here
                after users register.
              </p>

              <Link
                to="/signup"
                className="btn-secondary"
              >
                View Signup Page
              </Link>

            </div>

          )}

        {/* NO SEARCH RESULTS */}

        {!loading &&
          !error &&
          members.length > 0 &&
          filteredMembers.length === 0 && (

            <div className="admin-system">

              <span className="admin-label">
                NO RESULTS
              </span>

              <h2>
                No members found.
              </h2>

              <p>
                Try searching for a different
                name, email address, or role.
              </p>

              <button
                type="button"
                className="admin-refresh-button"
                onClick={() =>
                  setSearchTerm("")
                }
              >
                Clear Search
              </button>

            </div>

          )}

        {/* MEMBERS */}

        {!loading &&
          !error &&
          filteredMembers.length > 0 && (

            <section className="admin-members-list">

              {filteredMembers.map(
                (member, index) => {

                  const isAdmin =
                    member.role === "admin";

                  return (
                    <article
                      key={member.id}
                      className="admin-member-card"
                    >

                      {/* NUMBER */}

                      <div className="admin-member-number">

                        {String(
                          index + 1
                        ).padStart(2, "0")}

                      </div>

                      {/* MAIN INFORMATION */}

                      <div className="admin-member-main">

                        <div className="admin-member-heading">

                          <div>

                            <div className="admin-member-name-row">

                              <h2>
                                {member.displayName ||
                                  "Unnamed Member"}
                              </h2>

                              <span
                                className={`admin-member-role ${
                                  isAdmin
                                    ? "admin"
                                    : "member"
                                }`}
                              >
                                {isAdmin
                                  ? "Admin"
                                  : "Member"}
                              </span>

                            </div>

                            <a
                              href={`mailto:${member.email}`}
                              className="admin-contact-email"
                            >
                              {member.email ||
                                "No email provided"}
                            </a>

                          </div>

                          <div className="admin-member-date">

                            <span>
                              JOINED
                            </span>

                            <strong>
                              {formatDate(
                                member.createdAt
                              )}
                            </strong>

                          </div>

                        </div>

                        {/* DETAILS */}

                        <div className="admin-member-details">

                          <div>

                            <span>
                              ACCOUNT ID
                            </span>

                            <strong>
                              {member.id}
                            </strong>

                          </div>

                          <div>

                            <span>
                              ROLE
                            </span>

                            <strong>
                              {member.role ||
                                "member"}
                            </strong>

                          </div>

                          <div>

                            <span>
                              EMAIL
                            </span>

                            <strong>
                              {member.email ||
                                "Unavailable"}
                            </strong>

                          </div>

                        </div>

                      </div>

                    </article>
                  );
                }
              )}

            </section>

          )}

      </div>

    </main>
  );
}

export default AdminMembers;
