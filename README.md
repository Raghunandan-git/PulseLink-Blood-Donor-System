# 🚑 PulseLink – Real-Time Blood Donor Matching System

> A full-stack MERN application that connects blood seekers with nearby eligible donors using geo-based search, real-time notifications, and emergency SOS alerts.

---



## 📌 Overview

PulseLink is a real-time emergency blood coordination platform designed to reduce response time during critical situations.

The system enables:

* 🔍 Geo-radius based donor search
* 🚨 Emergency SOS request (extended search radius)
* 🔔 Real-time donor response notifications (Socket.io)
* 📧 Automated email alerts
* 📍 Distance calculation between donor and seeker
* 🔒 Secure JWT-based authentication

---

## 🛠 Tech Stack

### Frontend

* React.js
* Axios
* React Router
* Context API
* Socket.io Client

### Backend

* Node.js
* Express.js
* MongoDB (GeoSpatial Queries)
* Mongoose
* Socket.io
* Nodemailer
* JWT Authentication

---

## ⚡ Key Features

### 1️⃣ Geo-Based Donor Matching

* Uses MongoDB `$near` query
* Filters by blood group
* Checks donor availability & eligibility
* Radius changes based on urgency

---

### 2️⃣ Real-Time Donor Response

When a donor accepts a request:

* Request is atomically updated (prevents double acceptance)
* Email sent to seeker
* In-app notification created
* Real-time socket event emitted to seeker

No page refresh required.

---

### 3️⃣ SOS Mode (High Urgency)

* Extends search radius up to 75km
* Sends emergency email alerts
* Notifies only nearby eligible donors

---

### 4️⃣ Safety Mechanisms

* Prevents multiple active requests per seeker
* Prevents multiple donors accepting same request
* Availability-based filtering
* Secure route protection

---

## 📸 Screenshots

### Home

<img width="1588" height="4170" alt="localhost_5173_ (1)" src="https://github.com/user-attachments/assets/1fbdd282-9d83-490d-8aea-de6094e796c3" />

### Signup
<img width="1588" height="1700" alt="localhost_5173_ (2)" src="https://github.com/user-attachments/assets/b2df8242-e491-448d-89a3-ba30fbba18f3" />

### Login

<img width="1588" height="1550" alt="localhost_5173_ (4)" src="https://github.com/user-attachments/assets/cc35392d-5b5d-476b-9173-da59fda67f3a" />

### 🩸Donor Dashboard

<img width="1588" height="2214" alt="localhost_5173_donor_dashboard" src="https://github.com/user-attachments/assets/6db0180d-4299-40e1-8abd-fa3f88fef1be" />
<img width="1764" height="2354" alt="localhost_5173_donor_dashboard (1)" src="https://github.com/user-attachments/assets/8ab282b2-0512-4d9b-83d7-11d8fe41baa6" />


### 🏠 Seeker Dashboard
<img width="1764" height="1650" alt="localhost_5173_donor_dashboard (2)" src="https://github.com/user-attachments/assets/7b6554d7-a70d-40cb-924d-fe278311493c" />


---

## 🧪 How To Run Locally

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Raghunandan-git/PulseLink-Blood-Donor-System.git
cd PulseLink-Blood-Donor-System
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

Start backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🧠 System Architecture

* REST API for data operations
* MongoDB GeoSpatial indexing for location search
* Socket.io for real-time communication
* Email service for off-platform notification
* JWT middleware for authentication

---

## 🚀 Future Improvements

* Live donor tracking with map integration
* Token expiry + refresh mechanism
* Background job queue for email processing
* Premium notification UI
* Deployment with CI/CD pipeline

---

## 📈 Why This Project Stands Out

* Real-world emergency use case
* Real-time system implementation
* Geo-location database queries
* Clean separation of frontend & backend
* Scalable architecture foundation

---

## 👨‍💻 Author

**Raghunandan P**
