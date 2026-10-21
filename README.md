# Avu Resume — Personal Portfolio & Resume Web Application

Avu Resume is a React-based web application developed as a personal portfolio and professional showcase. It provides a central place to present projects, highlight software development skills, share professional information, and enable visitors to make contact or submit collaboration requests.

The application integrates Firebase Authentication and Cloud Firestore to support user authentication, data management, and role-based access rules for administrative functionality. It is deployed using Firebase Hosting.

## Live Application

- **Live demo:** https://avu-resume.web.app
- **GitHub repository:** https://github.com/AvuMoni/avu-resume

## Features

- **Professional Portfolio:** Showcase projects, technical skills, and professional information.
- **Resume Presentation:** Provide visitors with an accessible overview of professional experience and development capabilities.
- **Firebase Authentication:** Support account registration, login, and protected application routes.
- **Admin Dashboard:** Provide administrative interfaces for managing relevant application content and records.
- **Project Management:** Display portfolio projects and associated information.
- **Collaboration Requests:** Allow authenticated users to submit and manage their own collaboration requests.
- **Contact Form:** Allow visitors to submit messages through the application's contact functionality.
- **Protected Routes:** Restrict access to authenticated and administrative pages.
- **Database Security:** Apply Firestore Security Rules to control access to application data and prevent ordinary members from changing their own role to administrator.
- **Responsive Interface:** Build a modern user experience using React and CSS.
- **Production Hosting:** Deploy the application to Firebase Hosting with single-page application routing.

## Technology Stack

**Frontend**
- React 19
- JavaScript
- React Router
- CSS
- Framer Motion

**Backend Services and Data**
- Firebase Authentication
- Cloud Firestore
- Firebase Hosting
- Firestore Security Rules

**Development Tools**
- Node.js and npm
- Git and GitHub
- Firebase CLI

## Application Architecture

Avu Resume uses a client-side React architecture integrated with Firebase services.

1. React renders the portfolio, authentication pages, dashboards, and administrative interfaces.
2. Firebase Authentication manages user identity and sign-in state.
3. Cloud Firestore stores application data and applies security rules to database operations.
4. Protected routes control access to authenticated areas of the interface.
5. Firestore rules restrict data access according to the authenticated user and their permitted role.
6. Firebase Hosting serves the production application.

The project currently uses Firebase client-side services rather than a separate Express backend.

## Security

Security measures implemented in the project include:

- Authentication-aware application routes.
- Firestore Security Rules for controlling data access.
- User ownership checks for collaboration requests.
- Restrictions preventing ordinary members from promoting themselves to administrator through their own user document.
- Administrative access checks for protected data and operations.

**Security note:** The current implementation uses Firestore user-role data for administrator authorization. A future enhancement is to move privileged role assignment to a trusted server-side process and use Firebase Authentication custom claims for stronger administrative authorization.

## Getting Started

### Prerequisites

- Node.js and npm
- A Firebase project
- Firebase Authentication and Cloud Firestore configured

### 1. Clone the repository

```bash
git clone https://github.com/AvuMoni/avu-resume.git
cd avu-resume
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Create a local `.env` file using the environment-variable names expected by `src/firebase.js`.

The project uses Create React App-style environment variables with the `REACT_APP_FIREBASE_` prefix. Configure the Firebase project values required by your existing initialization code.

Do not commit private environment files or credentials.

### 4. Start the development server

```bash
npm start
```

### 5. Create a production build

```bash
npm run build
```

### 6. Deploy to Firebase Hosting

After configuring the Firebase CLI and selecting the correct Firebase project:

```bash
firebase deploy --only hosting
```

Review your Firebase configuration and deployment target before deploying.

## Project Objectives

Avu Resume was developed to demonstrate practical frontend development, application architecture, authentication, database integration, access-control design, and cloud deployment skills.

The project also serves as a continuously evolving professional portfolio, showcasing the developer's ability to design, build, secure, and deploy a real-world web application.

## Author

**Avuyile Moni**

Full-Stack Developer | React | JavaScript | Firebase

- GitHub: https://github.com/AvuMoni
- Portfolio: https://avu-resume.web.app
