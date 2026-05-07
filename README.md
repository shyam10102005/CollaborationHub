# 🚀 CollaborationHub

**CollaborationHub** is a premium, unified AI-powered platform designed to bridge the gap between content creators, brands, and talent managers. It provides a comprehensive "Operating System" for the creator economy, handling everything from content planning and AI assistance to campaign management and financial tracking.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)

---

## ✨ Key Features

### 🤳 For Creators
- **AI Assistant**: Generate content ideas, scripts, and captions with an integrated AI helper.
- **Content Planner**: Schedule and manage your content across multiple social platforms.
- **Media Kit**: Create and share professional, real-time updated media kits for brand pitches.
- **Link-in-Bio**: A customizable, high-conversion landing page for all your social links.
- **Earnings Dashboard**: Track sponsorships, affiliate income, and platform bonuses.

### 🏢 For Brands
- **Creator Discovery**: Find the perfect creators for your campaigns using advanced niche and location filtering.
- **Campaign Management**: Initiate and track brand deals from request to completion.
- **Spending Analytics**: Monitor your ROI and campaign performance in one place.

### 🛡️ For Platform Admins (Managers)
- **Restricted Portal**: A secure, isolated administrative dashboard at `/manager/login`.
- **Platform Oversight**: Monitor total platform revenue, user growth, and creator verification.
- **System Health**: Track active collaborations and platform-wide performance metrics.

---

## 🛠️ Technology Stack

- **Frontend**: React.js with Vanilla CSS (Premium Dark Theme)
- **Backend**: Node.js & Express.js
- **Database**: MongoDB Atlas (with write-through caching for performance)
- **Real-time**: Socket.io for instant messaging
- **Icons**: Lucide React
- **Analytics**: Recharts

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- npm or yarn

### 2. Environment Setup
Create a `.env` file in the root directory and add the following:

```env
# MongoDB Atlas
MONGODB_URI=your_mongodb_atlas_uri
MONGODB_DB_NAME=collabhub

# Authentication
JWT_SECRET_KEY=your_secret_key

# App Config
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 3. Installation
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### 4. Running the Project
From the root directory, you can run both the server and client simultaneously:
```bash
npm run dev
```

---

## 🛡️ Administrative Access
The Manager role is restricted and cannot be created via the public signup page. 
- **Admin Portal**: `http://localhost:5173/manager/login`
- **Default Admin (Dev)**: `manager@agency.com` / `password123`

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Developed with ❤️ for the Creator Economy.
