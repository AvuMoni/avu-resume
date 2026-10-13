import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Collab from "./pages/Collab";
import Contact from "./pages/Contact";

import Dashboard from "./pages/Dashboard";

import AdminDashboard from "./pages/AdminDashboard";
import AdminCollaborationRequests from "./pages/AdminCollaborationRequests";
import AdminProjects from "./pages/AdminProjects";
import AdminMembers from "./pages/AdminMembers";
import AdminContactMessages from "./pages/AdminContactMessages";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>

        <div className="app-container">

          <Navbar />

          <main className="main-content">

            <Routes>

              {/* ================================
                  PUBLIC PAGES
              ================================= */}

              <Route
                path="/"
                element={<Home />}
              />

              <Route
                path="/projects"
                element={<Projects />}
              />

              <Route
                path="/projects/:projectId"
                element={<ProjectDetails />}
              />

              <Route
                path="/collab"
                element={<Collab />}
              />

              <Route
                path="/contact"
                element={<Contact />}
              />

              <Route
                path="/login"
                element={<Login />}
              />

              <Route
                path="/signup"
                element={<Signup />}
              />
              <Route
                path="/forgot-password"
                element={<ForgotPassword />}
              />

              {/* ================================
                  MEMBER PAGES
              ================================= */}

              <Route element={<ProtectedRoute />}>

                <Route
                  path="/dashboard"
                  element={<Dashboard />}
                />

              </Route>


              {/* ================================
                  ADMIN PAGES
              ================================= */}

              <Route element={<AdminRoute />}>

                <Route
                  path="/admin"
                  element={<AdminDashboard />}
                />

                <Route
                  path="/admin/collaboration-requests"
                  element={
                    <AdminCollaborationRequests />
                  }
                />

                <Route
                  path="/admin/projects"
                  element={
                    <AdminProjects />
                  }
                />

                <Route
                  path="/admin/members"
                  element={
                    <AdminMembers />
                  }
                />

                <Route
                  path="/admin/contact-messages"
                  element={
                    <AdminContactMessages />
                  }
                />

              </Route>

            </Routes>

          </main>

          <Footer />

        </div>

      </AuthProvider>
    </Router>
  );
}

export default App;
