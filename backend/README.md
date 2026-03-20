# ⚡ NextGen Triage Management System

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?logo=react)
![Status](https://img.shields.io/badge/Status-Live-success)
![Developer](https://img.shields.io/badge/Developer-Ayush-orange)

**Live Demo:** [Click here to view the live application](https://nextgen-dashboard-0ovr.onrender.com) *(Note: The free Render backend may take 30-50 seconds to spin up on the first load).*

## 📖 Project Overview
NextGen Triage is a full-stack hospital admission dashboard designed to streamline emergency room intake. It allows medical staff to rapidly admit patients, automatically generate professional patient IDs, and categorize individuals based on medical urgency (Critical, Urgent, Stable) to ensure priority care.

## ✨ Key Features
* **Automated ID Generation:** Intercepts frontend admission data on the backend to dynamically generate and assign unique medical IDs (e.g., `NGT-4829`) before database insertion.
* **Triage Sorting Algorithm:** Automatically filters and highlights "Critical" status patients in a dedicated Emergency Ward section for immediate medical attention.
* **RESTful API Integration:** Full CRUD (Create, Read, Update, Delete) functionality connecting the React frontend to a cloud-hosted MongoDB database.
* **Real-time Search:** Dynamic search directory to filter admitted patients by name or disease instantly.
* **Secure Environment:** Protected database architecture using environment variables (`.env`) to secure connection strings and credentials.

## 🛠️ Tech Stack
* **Frontend:** React.js, HTML5, CSS3
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas, Mongoose
* **Deployment:** Render (Web Services)

## 🚀 Running the Project Locally

To run this project on your local machine, follow these steps:

**1. Clone the repository**
```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git)