// src/pages/Home.jsx
import React from "react";

function Home() {
  return (
    <main>

      {/* =========================
          HERO
      ========================= */}

      <section className="home hero">

        <div className="hero-content">

          <h1>
            Avu Yile
          </h1>

          <p>
            Building ideas, creating opportunities,
            and shaping the future.
          </p>

          <div className="hero-buttons">

            <a
              href="#about"
              className="btn-primary"
            >
              Learn More
            </a>

            <a
              href="/signup"
              className="btn-secondary"
            >
              Join Now
            </a>

          </div>

        </div>

      </section>


      {/* =========================
          ABOUT
      ========================= */}

      <section
        id="about"
        className="about parallax"
      >

        <div className="section-content">

          <h2>
            About Avu Yile
          </h2>

          <p>
            Avu Yile is focused on creating meaningful
            projects, connecting people, and turning
            ideas into opportunities.
          </p>

        </div>

      </section>


      {/* =========================
          VISION
      ========================= */}

      <section
        id="vision"
        className="vision parallax"
      >

        <div className="section-content">

          <h2>
            Our Vision
          </h2>

          <p>
            We envision a future where innovation,
            collaboration, and opportunity create
            lasting impact.
          </p>

        </div>

      </section>

    </main>
  );
}

export default Home;
