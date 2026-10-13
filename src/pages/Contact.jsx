import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccess("");
    setError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setError("Please complete all fields.");
      return;
    }

    try {
      setSending(true);

      await addDoc(
        collection(db, "contactMessages"),
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          status: "new",
          createdAt: serverTimestamp(),
        }
      );

      setFormData({
        name: "",
        email: "",
        message: "",
      });

      setSuccess(
        "Your message has been sent successfully."
      );
    } catch (error) {
      console.error(
        "Contact form error:",
        error
      );

      setError(
        "Unable to send your message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="contact-page avu-contact-page">

      <div className="contact-container avu-contact-container">

        {/* =========================================
            CONTACT HERO
        ========================================= */}

        <section className="contact-hero avu-contact-hero">

          <div className="contact-hero-content avu-contact-hero-text">

            <span className="contact-label avu-contact-eyebrow">
              AVU YILE / CONTACT
            </span>

            <h1>
              Let's talk
              <br />
              about what's next.
            </h1>

            <p>
              Have an idea, project, opportunity,
              or simply want to connect with Avu Yile?
              We'd love to hear from you.
            </p>

          </div>

          <div className="contact-orbit avu-contact-mark">

            <span>
              AVU
            </span>

            <strong>
              YILE
            </strong>

            <small>
              IDEAS / PEOPLE / OPPORTUNITY
            </small>

          </div>

        </section>


        {/* =========================================
            CONTACT OPTIONS
        ========================================= */}

        <section className="contact-options avu-contact-options">

          <article className="contact-option avu-contact-card">

            <span className="avu-contact-number">
              01
            </span>

            <span className="avu-contact-card-label">
              EMAIL
            </span>

            <h2>
              Start a conversation.
            </h2>

            <p>
              Have a question, opportunity,
              partnership idea, or something
              you'd like to discuss?
            </p>

            <a
              href="mailto:hello@avuyile.com"
              className="avu-contact-primary"
            >
              Email Avu Yile
              <span>
                →
              </span>
            </a>

          </article>


          <article className="contact-option avu-contact-card">

            <span className="avu-contact-number">
              02
            </span>

            <span className="avu-contact-card-label">
              SOCIAL
            </span>

            <h2>
              Find us online.
            </h2>

            <p>
              Follow Avu Yile and stay connected
              with our latest projects, ideas,
              opportunities, and updates.
            </p>

            <div className="contact-socials">

              <a
  href="https://www.instagram.com/"
  target="_blank"
  rel="noreferrer"
  className="avu-contact-secondary"
>
  Instagram
  <span>
    ↗
  </span>
</a>

<a
  href="https://www.linkedin.com/"
  target="_blank"
  rel="noreferrer"
  className="avu-contact-secondary"
>
  LinkedIn
  <span>
    ↗
  </span>
</a>

<a
  href="https://www.facebook.com/"
  target="_blank"
  rel="noreferrer"
  className="avu-contact-secondary"
>
  Facebook
  <span>
    ↗
  </span>
</a>

            </div>

          </article>


          <article className="contact-option avu-contact-card">

            <span className="avu-contact-number">
              03
            </span>

            <span className="avu-contact-card-label">
              WORK WITH US
            </span>

            <h2>
              Build something meaningful.
            </h2>

            <p>
              Looking to collaborate,
              partner, contribute, or bring
              an idea to life?
            </p>

            <Link
              to="/collab"
              className="avu-contact-primary"
            >
              Start a Collaboration
              <span>
                →
              </span>
            </Link>

          </article>


          <article className="contact-option avu-contact-card">

            <span className="avu-contact-number">
              04
            </span>

            <span className="avu-contact-card-label">
              MESSAGE
            </span>

            <h2>
              Send us a message.
            </h2>

            <p>
              Tell us what you're working on
              and how we can connect.
            </p>

            <a
              href="#contact-form"
              className="avu-contact-secondary"
            >
              Open Contact Form
              <span>
                ↓
              </span>
            </a>

          </article>

        </section>


        {/* =========================================
            CONTACT FORM
        ========================================= */}

        <section
          id="contact-form"
          className="contact-form-section"
        >

          <div className="contact-form-heading">

            <span className="contact-label">
              SEND US A MESSAGE
            </span>

            <h2>
              Tell us what's
              <br />
              on your mind.
            </h2>

          </div>


          <div className="contact-message">

            <form onSubmit={handleSubmit}>

              <div className="contact-field">

                <label htmlFor="contactName">
                  NAME
                </label>

                <input
                  id="contactName"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />

              </div>


              <div className="contact-field">

                <label htmlFor="contactEmail">
                  EMAIL
                </label>

                <input
                  id="contactEmail"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />

              </div>


              <div className="contact-field">

                <label htmlFor="contactMessage">
                  MESSAGE
                </label>

                <textarea
                  id="contactMessage"
                  name="message"
                  rows="7"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind..."
                  required
                ></textarea>

              </div>


              {error && (
                <div className="contact-form-error">
                  {error}
                </div>
              )}


              {success && (
                <div className="contact-form-success">
                  {success}
                </div>
              )}


              <button
                type="submit"
                className="btn-primary contact-submit"
                disabled={sending}
              >
                {sending
                  ? "Sending..."
                  : "Send Message →"}
              </button>

            </form>

          </div>

        </section>


        {/* =========================================
            FINAL CTA
        ========================================= */}

        <section className="contact-bottom avu-contact-final">

          <div>

            <span className="contact-label">
              AVU YILE
            </span>

            <h2>
              Ideas become
              <br />
              opportunities.
            </h2>

          </div>

          <Link
            to="/projects"
            className="contact-project-link avu-contact-explore"
          >
            Explore Our Projects
            <span>
              →
            </span>
          </Link>

        </section>

      </div>

    </main>
  );
}

export default Contact;
