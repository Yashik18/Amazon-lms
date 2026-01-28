# Amazon Seller Mastery LMS

A comprehensive Learning Management System (LMS) designed to teach users how to sell on Amazon, featuring interactive workflows, gamified scenarios, and AI-driven assistance.

## 🚀 Features

- **Interactive Workflows**: Step-by-step guides for tasks like Product Launch, PPC Optimization, and Inventory Planning.
- **Real-world Scenarios**: Case studies (e.g., "Ranking Drop Crisis") where users must solve problems to earn points.
- **Gamification**: Experience points (XP), Levels, Streaks, and Achievements to keep users engaged.
- **AI Assistant**: "Amazon Guru" chatbot provides real-time hints and explanations for difficult steps.
- **Admin Portal**: Tools to create new scenarios, manage users, and upload simulation data.

## 🛠 Tech Stack

### Frontend
- **React**: UI Library
- **Vite**: Build Tool
- **Material UI (MUI)**: Component System
- **Recharts**: Data Visualization
- **React Markdown**: Content Rendering

### Backend
- **Node.js & Express**: API Server
- **MongoDB**: Database (User progress, Workflows, Scenarios)
- **Mongoose**: 0DM

## 📦 Data & Simulation
- **Seeds**: Pre-loaded simulated data from Helium 10, Pi Datametrics, and Amazon Ads.
- **AI Integration**: Stub/Service ready for LLM connection (currently simulated/mocked for demo).

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repo-url>
    cd amazon-lms
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    # Create .env file with:
    # MONGODB_URI=mongodb://localhost:27017/amazon-lms
    # JWT_SECRET=your_secret
    # PORT=5000
    npm run seed # (Optional) To populate initial data
    npm start
    ```

3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## 🛡️ Security

- **Authentication**: JWT-based auth.
- **Password Hashing**: Bcrypt.
- **Environment**: Sensitive keys protected via `.env` (excluded from git).

## 🤝 Contribution

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
