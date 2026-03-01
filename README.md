# 🚑 PulseLink – Real-Time Blood Donor Matching System

> A full-stack MERN application that connects blood seekers with nearby eligible donors using geo-based search, real-time notifications, and emergency SOS alerts.

---

## 🌍 Live Demo

🚀 **Frontend:** *Coming Soon*
🔗 **Backend API:** *Coming Soon*

> ⚠️ Demo credentials will be provided after deployment.

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

> Add your screenshots inside a `/screenshots` folder.

### 🏠 Seeker Dashboard

```
![Seeker Dashboard](./screenshots/seeker-dashboard.png)
```

### 🩸 Nearby Requests (Donor View)

```
![Donor View](./screenshots/donor-view.png)
```

### 🚑 Donor On The Way Notification

```
![Notification](./screenshots/notification.png)
```

After adding images, remove the triple backticks.

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
