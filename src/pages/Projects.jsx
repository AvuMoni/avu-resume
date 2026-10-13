import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase";

function Projects() {

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const loadProjects = async () => {

      try {

        setLoading(true);
        setError("");

        const projectsQuery = query(
          collection(db, "projects"),
          orderBy("createdAt", "desc")
        );

        const snapshot =
          await getDocs(projectsQuery);

        const projectData =
          snapshot.docs.map((projectDoc) => ({
            id: projectDoc.id,
            ...projectDoc.data(),
          }));

        setProjects(projectData);

      } catch (error) {

        console.error(
          "Error loading projects:",
          error
        );

        setError(
          "Unable to load projects."
        );

      } finally {

        setLoading(false);

      }

    };

    loadProjects();

  }, []);


  const featuredProjects =
    projects.filter(
      (project) =>
        project.featured === true
    );

  const regularProjects =
    projects.filter(
      (project) =>
        project.featured !== true
    );


  return (
    <div className="projects-page">

      <div className="projects-container">

        {/* =========================
            HEADER
        ========================= */}

        <section className="projects-header">

          <span className="projects-label">
            AVU YILE / PROJECTS
          </span>

          <h1>
            What we're building.
          </h1>

          <p>
            Explore the projects, ideas and
            initiatives we're creating with
            our community.
          </p>

        </section>


        {/* =========================
            LOADING
        ========================= */}

        {loading && (

          <div className="projects-status">

            <div className="loading-spinner"></div>

            <p>
              Loading projects...
            </p>

          </div>

        )}


        {/* =========================
            ERROR
        ========================= */}

        {!loading && error && (

          <div className="projects-error">
            {error}
          </div>

        )}


        {/* =========================
            EMPTY
        ========================= */}

        {!loading &&
          !error &&
          projects.length === 0 && (

            <div className="projects-empty">

              <span className="projects-empty-number">
                00
              </span>

              <h2>
                Nothing here yet.
              </h2>

              <p>
                We're working on something new.
                Check back soon.
              </p>

            </div>

          )}


        {/* =========================
            FEATURED PROJECTS
        ========================= */}

        {!loading &&
          !error &&
          featuredProjects.length > 0 && (

            <section className="featured-projects">

              <div className="projects-section-heading">

                <span>
                  FEATURED
                </span>

                <h2>
                  Work worth watching.
                </h2>

              </div>


              <div className="featured-project-grid">

                {featuredProjects.map(
                  (project) => (

                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="featured-project-card"
                    >

                      {project.image && (

                        <div className="featured-project-image-wrapper">

                          <img
                            src={project.image}
                            alt={project.title}
                            className="featured-project-image"
                          />

                        </div>

                      )}


                      <div className="featured-project-content">

                        <div className="project-meta">

                          {project.category && (
                            <span>
                              {project.category}
                            </span>
                          )}

                          {project.status && (
                            <span>
                              {project.status}
                            </span>
                          )}

                        </div>


                        <h2>
                          {project.title}
                        </h2>


                        {project.shortDescription && (

                          <p>
                            {project.shortDescription}
                          </p>

                        )}


                        <div className="project-view">
                          View Project →
                        </div>

                      </div>

                    </Link>

                  )
                )}

              </div>

            </section>

          )}


        {/* =========================
            ALL PROJECTS
        ========================= */}

        {!loading &&
          !error &&
          regularProjects.length > 0 && (

            <section className="all-projects">

              <div className="projects-section-heading">

                <span>
                  ALL PROJECTS
                </span>

                <h2>
                  Everything we're building.
                </h2>

              </div>


              <div className="projects-grid">

                {regularProjects.map(
                  (project) => (

                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="project-card"
                    >

                      {project.image && (

                        <div className="project-image-wrapper">

                          <img
                            src={project.image}
                            alt={project.title}
                            className="project-image"
                          />

                        </div>

                      )}


                      <div className="project-content">

                        <div className="project-meta">

                          {project.category && (
                            <span>
                              {project.category}
                            </span>
                          )}

                          {project.status && (
                            <span>
                              {project.status}
                            </span>
                          )}

                        </div>


                        <h2>
                          {project.title}
                        </h2>


                        {project.shortDescription && (

                          <p className="project-short-description">
                            {project.shortDescription}
                          </p>

                        )}


                        <div className="project-view">
                          View Project →
                        </div>

                      </div>

                    </Link>

                  )
                )}

              </div>

            </section>

          )}


        {/* =========================
            ALL PROJECTS ARE FEATURED
        ========================= */}

        {!loading &&
          !error &&
          featuredProjects.length > 0 &&
          regularProjects.length === 0 && (

            <section className="all-projects">

              <div className="projects-section-heading">

                <span>
                  MORE TO COME
                </span>

                <h2>
                  We're just getting started.
                </h2>

                <p>
                  More Avu Yile projects are
                  on the way.
                </p>

              </div>

            </section>

          )}

      </div>

    </div>
  );
}

export default Projects;
