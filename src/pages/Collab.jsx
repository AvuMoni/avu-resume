// src/pages/Collab.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

function Collab() {
  const { currentUser, userProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: userProfile?.displayName || "",
    organization: "",
    collaborationType: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!currentUser) {
      setError("Please log in before submitting a collaboration request.");
      return;
    }

    try {
      setSubmitting(true);

      await addDoc(
        collection(db, "collaborationRequests"),
        {
          userId: currentUser.uid,
          name: formData.name.trim(),
          email: currentUser.email,
          organization: formData.organization.trim(),
          collaborationType: formData.collaborationType,
          message: formData.message.trim(),
          status: "new",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );

      setSuccess(true);

      setFormData({
        name:
          userProfile?.displayName ||
          currentUser.displayName ||
          "",
        organization: "",
        collaborationType: "",
        message: "",
      });

    } catch (error) {
      console.error(
        "Error submitting collaboration request:",
        error
      );

      setError(
        "We couldn't submit your request. Please try again."
      );

    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="collab-page">

        <div className="collab-container">

          <section className="collab-header">
            <span className="collab-label">
              AVU YILE / WORK WITH US
            </span>

            <h1>
              Let's build something together.
            </h1>

            <p>
              Whether you have an idea, a skill,
              an opportunity or a project, we'd love
              to hear from you.
            </p>
          </section>

          <div className="collab-login-card">

            <h2>
              Become part of the journey.
            </h2>

            <p>
              Please create an Avu Yile account or log
              in before submitting a collaboration request.
            </p>

            <div className="collab-login-actions">

              <Link
                to="/login"
                className="btn-primary"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="btn-secondary"
              >
                Join Now
              </Link>

            </div>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="collab-page">

      <div className="collab-container">

        <section className="collab-header">

          <span className="collab-label">
            AVU YILE / WORK WITH US
          </span>

          <h1>
            Let's build something together.
          </h1>

          <p>
            Have an idea, skill, opportunity or project
            that you'd like to explore with us?
            Tell us about it.
          </p>

        </section>

        <section className="collab-form-section">

          <div className="collab-form-intro">

            <span>
              COLLABORATION REQUEST
            </span>

            <h2>
              Tell us what you're thinking.
            </h2>

            <p>
              Give us enough information to understand
              your idea and how we might work together.
            </p>

            <div className="collab-account">

              <small>
                SUBMITTING AS
              </small>

              <strong>
                {currentUser.email}
              </strong>

            </div>

          </div>

          <form
            className="collab-form"
            onSubmit={handleSubmit}
          >

            {success && (
              <div className="collab-success">
                <strong>
                  Request submitted.
                </strong>

                <p>
                  Thank you for reaching out.
                  The Avu Yile team will review
                  your request.
                </p>
              </div>
            )}

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <div className="collab-field">

              <label htmlFor="name">
                Your Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />

            </div>

            <div className="collab-field">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                value={currentUser.email || ""}
                disabled
              />

              <small>
                This is the email connected to your account.
              </small>

            </div>

            <div className="collab-field">

              <label htmlFor="organization">
                Organization / Project
              </label>

              <input
                id="organization"
                name="organization"
                type="text"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Company, organization or project name"
              />

            </div>

            <div className="collab-field">

              <label htmlFor="collaborationType">
                How would you like to collaborate?
              </label>

              <select
                id="collaborationType"
                name="collaborationType"
                value={formData.collaborationType}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select an option
                </option>

                <option value="Creative Partnership">
                  Creative Partnership
                </option>

                <option value="Project Collaboration">
                  Project Collaboration
                </option>

                <option value="Sponsorship">
                  Sponsorship
                </option>

                <option value="Community Partnership">
                  Community Partnership
                </option>

                <option value="Skills / Services">
                  Skills / Services
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

            <div className="collab-field">

              <label htmlFor="message">
                Tell us more
              </label>

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your idea, project or opportunity..."
                rows="7"
                required
              />

            </div>

            <button
              type="submit"
              className="btn-primary collab-submit"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Collaboration Request →"}
            </button>

          </form>

        </section>

      </div>

    </div>
  );
}

export default Collab;
