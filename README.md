# HAAD Technical Services Co. L.L.C. - ERP Portal

This repository contains the full source code for the HAAD Technical Services website and ERP Administration Portal.

## Project Structure
*   📁 `/backend`: Express API server (TypeScript) interacting with MongoDB Atlas.
*   📁 `/frontend`: Next.js (App Router, TypeScript, Tailwind CSS) web application.

---

## 🛠️ Prerequisites
Make sure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18.x or later recommended)
*   [npm](https://www.npmjs.com/) (usually bundled with Node.js)
*   A running [MongoDB connection string](https://www.mongodb.com/products/platform/atlas-database) (provided in environment variables)

---

## 🚀 Steps to Run Locally

### 1. Start the Backend API Server
Open a terminal in the `/backend` folder:
```bash
cd backend
```

Ensure a `.env` file exists inside `/backend` with the following configuration (replace with your MongoDB password):
```env
PORT=5000
MONGODB_URI=mongodb+srv://samyukthterawe:LD4zJeePugVyJPRY@cluster0.pgwvs7e.mongodb.net/haad_tech
```

Install dependencies and start the hot-reloading development server:
```bash
npm install
npm run dev
```
The server will boot on [http://localhost:5000](http://localhost:5000). You can verify it is active by visiting the health check URL at [http://localhost:5000/api/health](http://localhost:5000/api/health).

---

### 2. Start the Frontend Application
Open a new, separate terminal in the `/frontend` folder:
```bash
cd frontend
```

Create a `.env.local` file inside `/frontend` containing the target backend API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Install dependencies and launch the Next.js development server:
```bash
npm install
npm run dev
```
The frontend application will start on [http://localhost:3000](http://localhost:3000).

---

## 🔐 Accessing the ERP Admin Panel
1. Open your browser and navigate to [http://localhost:3000/admin](http://localhost:3000/admin).
2. Enter the secure authorization key to authenticate:
   *   **Key**: `haad` or `haadhts`
3. Once authenticated, you can view, edit, and delete real-time database settings, inquiry logs, and quotation calculations.