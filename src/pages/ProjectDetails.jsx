import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase";

function ProjectDetails() {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        setError("");

        const projectRef = doc(
          db,
          "projects",
          projectId
        );

        const projectSnapshot = await getDoc(
          projectRef
        );

        if (!projectSnapshot.exists()) {
          setError("Project not found.");
          return;
        }

        setProject({
          id: projectSnapshot.id,
          ...projectSnapshot.data(),
        });
      } catch (error) {
        console.error(
          "Error loading project:",
          error
        );

        setError(
          "Unable to load this project."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  const formatDate = (timestamp) => {
    if (
      timestamp &&
      typeof timestamp.toDate === "function"
    ) {
      return timestamp
        .toDate()
        .toLocaleDateString(undefined, {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
    }

    return null;
  };

  if (loading) {
    return (
      <div className="project-details-loading">
        <div className="loading-spinner"></div>

        <p>
          Loading project...
        </p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-details-error">
        <span className="projects-label">
          AVU YILE / PROJECTS
        </span>

        <h1>
          Project not found.
        </h1>

        <p>
          {error ||
            "This project does not exist."}
        </p>

        <Link
          to="/projects"
          className="btn-primary"
        >
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const createdDate = formatDate(
    project.createdAt
  );

  return (
    <div className="project-details-page">
      <div className="project-details-container">

        {/* BACK TO PROJECTS */}

        <Link
          to="/projects"
          className="project-details-back"
        >
          ← Back to Projects
        </Link>


        {/* PROJECT HEADER */}

        <section className="project-details-header">

          <div className="project-details-kicker">

            <span>
              AVU YILE / PROJECT
            </span>

            {project.featured && (
              <span className="project-details-featured">
                FEATURED
              </span>
            )}

          </div>


          <div className="project-details-meta">

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


          <h1>
            {project.title}
          </h1>


          {project.shortDescription && (
            <p className="project-details-intro">
              {project.shortDescription}
            </p>
          )}

        </section>


        {/* PROJECT IMAGE */}

        {project.image && (
          <section className="project-details-image-section">

            <img
              src={project.image}
              alt={project.title}
              className="project-details-image"
            />

          </section>
        )}


        {/* PROJECT CONTENT */}

        <section className="project-details-content">

          {/* DESCRIPTION */}

          <div className="project-details-description">

            <span className="projects-label">
              ABOUT THE PROJECT
            </span>


            <h2>
              The story behind the work.
            </h2>


            {project.description ? (
              project.description
                .split("\n")
                .map((paragraph, index) => {

                  if (!paragraph.trim()) {
                    return null;
                  }

                  return (
                    <p key={index}>
                      {paragraph}
                    </p>
                  );
                })
            ) : (
              <p>
                {project.shortDescription ||
                  "More information about this project will be available soon."}
              </p>
            )}

          </div>


          {/* PROJECT INFORMATION */}

          <div className="project-details-info">

            <div className="project-details-info-item">

              <span>
                STATUS
              </span>

              <strong>
                {project.status ||
                  "Active"}
              </strong>

            </div>


            <div className="project-details-info-item">

              <span>
                CATEGORY
              </span>

              <strong>
                {project.category ||
                  "Creative"}
              </strong>

            </div>


            {createdDate && (
              <div className="project-details-info-item">

                <span>
                  PROJECT ADDED
                </span>

                <strong>
                  {createdDate}
                </strong>

              </div>
            )}

          </div>

        </section>


        {/* CTA */}

        <section className="project-details-next">

          <div>

            <span>
              WANT TO BE PART OF IT?
            </span>

            <h2>
              Let's build something meaningful.
            </h2>

          </div>


          <Link
            to="/collab"
            className="btn-secondary"
          >
            Work With Us →
          </Link>

        </section>

      </div>
    </div>
  );
}

export default ProjectDetails;
