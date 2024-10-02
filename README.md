# Trosie - Todo Management Application

## 🚀 Live Demo

- **Frontend:** https://trosie.vercel.app
- **Backend:** https://trosie-api.vercel.app
- **API Documentation:** https://documenter.getpostman.com/view/31476421/2sAXxJhv5f

## 🎯 Objective

Trosie is a powerful Todo Management Application designed to help users efficiently manage their tasks and projects. The application allows users to create, organize, and track their todos, providing an easy way to stay productive and focused.

## 🌟 Features

- **Create a New Project:** Users can easily set up a new project to categorize their todos, ensuring better organization and clarity.
- **Manage Todos:** Within each project, users can:

  - **Add Todos:** Create new tasks with relevant details.
  - **Edit Todos:** Update existing tasks to reflect changes in requirements.
  - **Mark as Complete:** Keep track of progress by marking tasks as completed.

  - **Export as Gist:** Users can generate a project summary in markdown format and export it as a secret gist on GitHub. This feature allows for easy sharing and documentation of project progress.

## ⚙️ Installation

### Prerequisites

To run Trosie locally, ensure you have the following installed:

- **Node.js** (LTS version recommended)
- **PostgreSQL** (Ensure it's running)
- **Git** (for cloning the repository)

### Steps to Run the Project

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/mskp/todo-management-app-trosie
   cd todo-management-app-trosie
   ```

2. **Set Up Environment Variables:**

   Create a `.env` file in each application's directory based on the `.env.example` file and fill in the appropriate details.

3. **Install Dependencies:**

   ```bash
   pnpm install
   ```

4. **Run the Application:**

   ```bash
   pnpx turbo dev
   ```

5. **Run Tests:**

   To ensure everything is functioning correctly, run the tests with the following command:

   ```bash
   pnpm test:app
   ```

## 📸 Screenshots

### Landing Page

![landing page](/assets/screenshots/langing-page.png)

### Login Page

![Screenshot Placeholder](/assets/screenshots/login-page.png)

### Signup Page

![Screenshot Placeholder](/assets/screenshots/signup-page.png)

### Projects Page

![Screenshot Placeholder](/assets/screenshots/projects-page.png)

### Todo Page

![Screenshot Placeholder](/assets/screenshots/todo-page.png)

### Gist Export

![Screenshot Placeholder](/assets/screenshots/gist-export.png)

## 💻 Tech Stack

- **Frontend:** Next.js, Tailwind CSS, Shadcn
- **Backend:** Nest.js
- **Database:** PostgreSQL, Prisma
- **Monorepo Management:** Turborepo

## 👨‍💻 Developer Information

- **Name:** Sushant Pandey
- **Email:** sushhantpandey@gmail.com
- **GitHub:** https://github.com/mskp

## 📜 License

This project is licensed under the MIT License.
