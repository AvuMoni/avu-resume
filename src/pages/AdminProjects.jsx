import React, { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { Link } from "react-router-dom";

import { db } from "../firebase";

function AdminProjects() {
  const emptyForm = {
    title: "",
    category: "",
    description: "",
    image: "",
    technologies: "",
    status: "active",
    featured: false,
  };

  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const projectsQuery = query(
        collection(db, "projects"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(projectsQuery);

      const loadedProjects = snapshot.docs.map(
        (projectDoc) => ({
          id: projectDoc.id,
          ...projectDoc.data(),
        })
      );

      setProjects(loadedProjects);
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

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Please enter a project title.");
      return;
    }

    if (!form.description.trim()) {
      setError(
        "Please enter a project description."
      );
      return;
    }

    try {
      setSaving(true);

      const technologies =
        form.technologies
          .split(",")
          .map((technology) =>
            technology.trim()
          )
          .filter(Boolean);

      const projectData = {
        title: form.title.trim(),
        category: form.category.trim(),
        description:
          form.description.trim(),
        image: form.image.trim(),
        technologies,
        status: form.status,
        featured: form.featured,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(
          doc(
            db,
            "projects",
            editingId
          ),
          projectData
        );

        setSuccess(
          "Project updated successfully."
        );
      } else {
        await addDoc(
          collection(db, "projects"),
          {
            ...projectData,
            createdAt: serverTimestamp(),
          }
        );

        setSuccess(
          "Project created successfully."
        );
      }

      resetForm();
      await loadProjects();
    } catch (error) {
      console.error(
        "Error saving project:",
        error
      );

      setError(
        "Unable to save the project."
      );
    } finally {
      setSaving(false);
    }
  };

  const editProject = (project) => {
    setEditingId(project.id);

    setForm({
      title: project.title || "",
      category: project.category || "",
      description:
        project.description || "",
      image: project.image || "",
      technologies: Array.isArray(
        project.technologies
      )
        ? project.technologies.join(", ")
        : project.technologies || "",
      status:
        project.status || "active",
      featured:
        project.featured === true,
    });

    setSuccess("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteProject = async (
    projectId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(projectId);

      await deleteDoc(
        doc(
          db,
          "projects",
          projectId
        )
      );

      setProjects((currentProjects) =>
        currentProjects.filter(
          (project) =>
            project.id !== projectId
        )
      );

      if (editingId === projectId) {
        resetForm();
      }

      setSuccess(
        "Project deleted successfully."
      );
    } catch (error) {
      console.error(
        "Error deleting project:",
        error
      );

      setError(
        "Unable to delete the project."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const toggleFeatured = async (
    project
  ) => {
    try {
      await updateDoc(
        doc(
          db,
          "projects",
          project.id
        ),
        {
          featured: !project.featured,
          updatedAt: serverTimestamp(),
        }
      );

      setProjects((currentProjects) =>
        currentProjects.map(
          (currentProject) =>
            currentProject.id ===
            project.id
              ? {
                  ...currentProject,
                  featured:
                    !project.featured,
                }
              : currentProject
        )
      );
    } catch (error) {
      console.error(
        "Error updating featured status:",
        error
      );

      setError(
        "Unable to update featured status."
      );
    }
  };

  return (
    <main className="admin-page">

      <div className="admin-container">

        <div className="admin-page-back">

          <Link to="/admin">
            ← Back to Admin Dashboard
          </Link>

        </div>

        {/* HEADER */}

        <section className="admin-welcome">

          <div>

            <span className="admin-label">
              AVU YILE / CONTENT
            </span>

            <h1>
              Projects.
            </h1>

            <p>
              Create and manage the projects
              displayed across the Avu Yile
              platform.
            </p>

          </div>

          <div className="admin-profile">

            <span>
              TOTAL PROJECTS
            </span>

            <strong>
              {projects.length}
            </strong>

            <small>
              Projects in the system
            </small>

          </div>

        </section>

        {/* MESSAGES */}

        {error && (
          <div className="admin-system admin-message-error">

            <p>
              {error}
            </p>

          </div>
        )}

        {success && (
          <div className="admin-system admin-message-success">

            <p>
              {success}
            </p>

          </div>
        )}

        {/* PROJECT FORM */}

        <section className="admin-project-form-section">

          <div className="admin-section-heading">

            <span>
              {editingId
                ? "EDIT PROJECT"
                : "NEW PROJECT"}
            </span>

            <h2>
              {editingId
                ? "Update project."
                : "Create something new."}
            </h2>

          </div>

          <form
            className="admin-project-form"
            onSubmit={handleSubmit}
          >

            <div className="admin-form-grid">

              {/* TITLE */}

              <div className="admin-form-field">

                <label htmlFor="title">
                  PROJECT TITLE
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g. ModuSonke"
                  value={form.title}
                  onChange={handleChange}
                />

              </div>

              {/* CATEGORY */}

              <div className="admin-form-field">

                <label htmlFor="category">
                  CATEGORY
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  placeholder="e.g. Technology"
                  value={form.category}
                  onChange={handleChange}
                />

              </div>

              {/* IMAGE */}

              <div className="admin-form-field admin-form-full">

                <label htmlFor="image">
                  IMAGE URL
                </label>

                <input
                  id="image"
                  name="image"
                  type="text"
                  placeholder="e.g. /images/project.jpg"
                  value={form.image}
                  onChange={handleChange}
                />

                <small>
                  You can use a public image path
                  or an image URL.
                </small>

              </div>

              {/* TECHNOLOGIES */}

              <div className="admin-form-field admin-form-full">

                <label htmlFor="technologies">
                  TECHNOLOGIES
                </label>

                <input
                  id="technologies"
                  name="technologies"
                  type="text"
                  placeholder="React, Firebase, AI"
                  value={form.technologies}
                  onChange={handleChange}
                />

                <small>
                  Separate technologies with commas.
                </small>

              </div>

              {/* DESCRIPTION */}

              <div className="admin-form-field admin-form-full">

                <label htmlFor="description">
                  DESCRIPTION
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="7"
                  placeholder="Describe the project..."
                  value={form.description}
                  onChange={handleChange}
                />

              </div>

              {/* STATUS */}

              <div className="admin-form-field">

                <label htmlFor="status">
                  STATUS
                </label>

                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="development">
                    In Development
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="paused">
                    Paused
                  </option>

                </select>

              </div>

              {/* FEATURED */}

              <div className="admin-form-field admin-featured-field">

                <label>
                  FEATURED PROJECT
                </label>

                <label className="admin-checkbox">

                  <input
                    type="checkbox"
                    name="featured"
                    checked={
                      form.featured
                    }
                    onChange={handleChange}
                  />

                  <span>
                    Display as a featured
                    project
                  </span>

                </label>

              </div>

            </div>

            {/* FORM ACTIONS */}

            <div className="admin-form-actions">

              <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Project"
                  : "Create Project"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel Edit
                </button>
              )}

            </div>

          </form>

        </section>

        {/* PROJECT LIST */}

        <section className="admin-project-list-section">

          <div className="admin-section-heading">

            <span>
              PROJECT DIRECTORY
            </span>

            <h2>
              Existing projects.
            </h2>

          </div>

          {loading && (
            <div className="admin-system">

              <div className="auth-loading">

                <div className="loading-spinner"></div>

                <p>
                  Loading projects...
                </p>

              </div>

            </div>
          )}

          {!loading &&
            projects.length === 0 && (
              <div className="admin-system">

                <span className="admin-label">
                  PROJECTS EMPTY
                </span>

                <h2>
                  No projects yet.
                </h2>

                <p>
                  Use the form above to
                  create your first project.
                </p>

              </div>
            )}

          {!loading &&
            projects.length > 0 && (

              <div className="admin-project-list">

                {projects.map(
                  (project, index) => (

                    <article
                      key={project.id}
                      className="admin-project-card"
                    >

                      <div className="admin-project-number">
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </div>

                      <div className="admin-project-main">

                        <div className="admin-project-header">

                          <div>

                            <div className="admin-project-title-row">

                              <h3>
                                {project.title}
                              </h3>

                              {project.featured && (
                                <span className="admin-project-featured">
                                  Featured
                                </span>
                              )}

                            </div>

                            <span className="admin-project-category">
                              {project.category ||
                                "Uncategorised"}
                            </span>

                          </div>

                          <span className="admin-project-status">
                            {project.status ||
                              "active"}
                          </span>

                        </div>

                        <p className="admin-project-description">
                          {project.description}
                        </p>

                        {Array.isArray(
                          project.technologies
                        ) &&
                          project.technologies
                            .length > 0 && (

                            <div className="admin-project-technologies">

                              {project.technologies.map(
                                (
                                  technology
                                ) => (
                                  <span
                                    key={
                                      technology
                                    }
                                  >
                                    {technology}
                                  </span>
                                )
                              )}

                            </div>
                          )}

                        <div className="admin-project-actions">

                          <button
                            type="button"
                            className="admin-status-button"
                            onClick={() =>
                              editProject(
                                project
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="admin-status-button"
                            onClick={() =>
                              toggleFeatured(
                                project
                              )
                            }
                          >
                            {project.featured
                              ? "Remove Featured"
                              : "Feature"}
                          </button>

                          <button
                            type="button"
                            className="admin-delete-button"
                            disabled={
                              deletingId ===
                              project.id
                            }
                            onClick={() =>
                              deleteProject(
                                project.id
                              )
                            }
                          >
                            {deletingId ===
                            project.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </div>

                    </article>

                  )
                )}

              </div>
            )}

        </section>

      </div>

    </main>
  );
}

export default AdminProjects;
