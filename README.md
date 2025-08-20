# AngularForumApp

## Overview

This project is a modern, full-featured forum web application built with Angular, leveraging a robust stack of libraries and best practices. It provides user account management, thread- and post-creation/editing/deletion, profile customization, and rich interactions—all designed for scalability, maintainability, and excellent user experience.

---

## Technology Stack & Frameworks

- **Angular (Standalone Components, Reactive Forms)**  
  Utilizes Angular's latest standalone component architecture and reactive forms for modular, scalable UI development.

- **RxJS**  
  For reactive programming and asynchronous data streams handling.

- **NgRx (Store)**  
  State management to handle application state consistently and efficiently.

- **Angular Router**  
  Declarative, powerful routing with route guards for authentication and authorization.

- **Firebase (Firestore)**  
  Cloud Firestore is used as the backend database for real-time data synchronization.

- **Angular CDK (Dialog)**  
  For modal dialog implementations and enhancing accessibility.

- **Angular Common Utilities** (`AsyncPipe`, `DatePipe`, `Location`)  
  For common utility features like async pipe handling, formatting dates, and location navigation.

- **TypeScript**  
  Strongly typed language ensuring code quality and maintainability.

- **Testing**  
  Angular Testing utilities with Jasmine and Karma, applying best practices for unit testing components, services, and validators.

- **Linting & Formatting** (assumed standard)  
  To maintain code quality and consistency across the project.

---

## Project Structure & Architecture

- **Features Modularization**  
  The application is organized into modular feature folders such as `account`, `posts`, `threads`, each representing core functionality. This modular approach promotes separation of concerns and scalability.

- **Shared Module**  
  Contains reusable models, validators, helpers, and pipes used across the app for consistency and code reuse.

- **Core Services**  
  Business logic abstraction such as `AuthService`, `PostService`, `ThreadService` to handle communication with backend (Firestore) and perform actions.

- **State Management with NgRx**  
  Application state such as loading indicators is managed with NgRx store, supporting reactive UI updates and centralized state.

- **Reactive Forms & Custom Validators**  
  Form management leverages Angular Reactive Forms with custom validators (e.g., `passwordMatchValidator`, `trimmedMinLength`) ensuring form input integrity and rich UX.

- **Route Guards**  
  Security enforced through guards for authentication/authorization (e.g., `AuthGuard`, `GuestGuard`).

- **Standalone Components**  
  Maximizes reusability and simplifies dependency handling by using Angular’s standalone components throughout.

- **Testing Coverage**  
  Comprehensive unit tests for all major components and validators, designed to test protected/private members using Angular testing utilities and TypeScript tricks for encapsulation.

---

## Functionality Highlights

- User registration, login, and profile management with validation and error handling.
- Thread- and post-creation, editing, deletion with robust validation, and async operations.
- User profile pages showing threads and posts with pagination and filtering.
- Real-time loading states and error feedback using NgRx store.
- Modal confirmations for sensitive actions (e.g., delete confirmations).
- Location and photo upload support in profile editing.
- Async validators to enforce back-end uniqueness constraints on usernames and emails.
- Rich UI interactions with Angular CDK dialogs, pipes for pluralization, and date formatting.

---

## Getting Started

### Prerequisites

- **Node.js** (v14 or later recommended)
- **Angular CLI** (latest version)
- Firebase project setup with Firestore database.
- Environment configuration with Firebase credentials.

### Installation

1. Clone the repository:
    ```
    git clone https://github.com/yourusername/your-repo.git
    cd your-repo
    ```

2. Install dependencies:
    ```
    npm install
    ```

3. Add your Firebase credentials in an environment file (`src/environments`) (for the exam, I have already included mine).

### Running the Application

Start the development server:

ng serve

Navigate to `http://localhost:4200/` in your browser. The application will auto-reload as you make changes.

### Running Tests

Execute unit tests with:

ng test

Tests use Jasmine and Karma, covering all components, services, and validators extensively.

---

## Code Quality & Best Practices

- Use of **Reactive Forms** with validators ensures robust form validations.
- Encapsulation of logic within services for clean separation.
- Use of NgRx for state management keeps UI reactive and predictable.
- Standalone components enable tree-shakeable and modular architecture.
- Unit tests cover protected members safely via `(component as any)` for comprehensive coverage.
- Follows Angular recommended style guides and patterns.
- Consistent use of async/await for clean asynchronous code.

---

## License

[MIT License](LICENSE)

---

# Bonus Features & Requirement Coverage

Below is an overview of the assignment bonus requirements and how this forum project fulfills each.

---

## ✅ What’s Included in This Project

- **Deploy in a cloud environment**  
  *The application is ready for deployment on major cloud platforms (e.g., Firebase Hosting, Vercel, Netlify, AWS, Azure). It is currently deployed to Firebase Hosting. `https://angularforumapp.web.app`*

- **File storage cloud API**  
  *Although Google Drive or Dropbox integration is possible, the current implementation uses Firebase Storage for profile photo uploads and management. This leverages a modern file cloud API for user content storage.*

- **HTML5 features (Geolocation, SVG, Canvas, etc.)**  
  *The project uses HTML5 Geolocation in the profile edit functionality for enhanced user experience. If you wish, SVG/Canvas elements for visualizations can easily be added.*

- **Angular Animations**  
  *Angular Animations have been integrated for page transitions on logout, resulting in a more fluid and visually engaging UI.*

- **Unit tests for components**  
  *Comprehensive unit tests are written for all major components, services, and validators, following Angular and Jasmine best practices. Tests cover lifecycle logic, form validation, input/output, and service interactions.*

- **RxJS-powered state management (NgRx store)**  
  *NgRx Store is utilized for global state management: handling loading indicators, as inspired by Redux architecture.*

- **Additional Bonus Features**  
  *The project comes with modern best practices, modular feature-folder architecture, strict typing, async validators for uniqueness, protected/private member test coverage, code linting, standalone components, and easy environment configuration for cloud deployment.*

---

## ✅ Feature Checklist

| Requirement                           | Used in Project? | Note                                                                   |
|---------------------------------------|------------------|------------------------------------------------------------------------|
| 🚀 Cloud deployment                   | Yes              | Hosted with firebase hosting. `https://angularforumapp.web.app`        |
| 🗄️ File storage cloud API            | Yes              | Uses Firebase Storage for user-uploaded files (e.g., profile pictures) |
| 🌍 HTML5 features (Geolocation, etc.) | Yes              | Uses Geolocation in profile editing; extensible for more               |
| 💃 Angular Animations                 | Yes              | Integrated route transitions                                           |
| 🧪 Unit tests for components          | Yes              | Extensive unit tests for all components/services                       |
| 🔗 RxJS state management (NgRx Store) | Yes              | Handles loading state                                                  |
| ➕ Useful extra features               | Yes              | Modular architecture, async validators, linting, etc.                  |

---

## How This Benefits Users & Developers

- Users enjoy real-time feedback, secure authentication, rich profile features, and mobile-friendly UI.
- Developers benefit from modular scalable structure, strict typing, built-in state management, and strong test coverage for evolving the project further.

Thank you for exploring this project!  
Enjoy building with Angular and Firebase!  