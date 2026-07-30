<div align="center">

# 🚗 DriveHub
### Car Dealership Inventory System

A modern full-stack **Car Dealership Inventory Management System** built with the **MERN Stack**.

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Framework-Express-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge)](https://jwt.io/)
[![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## 🌐 Live Demo

### Frontend
**Vercel:** https://drivehub-inventory-system.vercel.app/

### Backend
**Railway:** https://drivehub-inventory-system-production.up.railway.app/

---

## 🔑 Demo Accounts

### 👨‍💼 Admin Account

| Field | Value |
|-------|-------|
| Email | `abhayyadav96312@gmail.com` |
| Password | `Abhay@9631` |

---

### 👤 User Account 1

| Field | Value |
|-------|-------|
| Email | `abhaykumaryadav748864@gmail.com` |
| Password | `Abhay@7488` |

---

### 👤 User Account 2

| Field | Value |
|-------|-------|
| Email | `cec234043.it.cec@cgc.edu.in` |
| Password | `Abhay@7488` |

---

## 📝 Registration & Email Verification

> **Note**
>
> This project is hosted on **Railway Free Tier**. The application uses **Nodemailer + Gmail SMTP** for OTP email verification.
>
> Railway **Free**, **Trial**, and **Hobby** plans block outbound SMTP connections. Therefore, OTP emails cannot be sent from the deployed application.
>
> To fully enable email verification in production, the backend must be deployed on a **Railway Pro** plan or another hosting provider that allows outbound SMTP connections.
>
> **For evaluation purposes, please use one of the demo accounts provided above.**

</div>

---

# 📖 Project Overview

DriveHub is a full-stack **Car Dealership Inventory System** that enables dealerships to efficiently manage vehicle inventory while providing customers with a seamless experience for browsing and purchasing vehicles.

The application includes secure **JWT-based authentication**, **Role-Based Access Control (RBAC)**, **vehicle inventory management**, **purchase history tracking**, **OTP-based email verification**, **vehicle image uploads**, and an **AI-powered assistant** to enhance the user experience.

Administrators can securely add, update, delete, and restock vehicles, while customers can search inventory, purchase vehicles, and view their purchase history through a responsive React-based user interface.

This project was developed as part of the **TDD Kata: Car Dealership Inventory System** assignment and demonstrates full-stack development, RESTful API design, database integration, automated testing, clean software architecture, and responsible AI-assisted software development.

---

# 🎯 Assignment Requirements Covered

This project implements all major requirements specified in the assignment.

| Requirement | Status |
|-------------|:------:|
| 🔐 User Registration & Login | ✅ |
| 🔑 JWT Authentication | ✅ |
| 🚘 Vehicle CRUD Operations | ✅ |
| 🔍 Vehicle Search & Filtering | ✅ |
| 🛒 Vehicle Purchase | ✅ |
| 📦 Vehicle Restock (Admin) | ✅ |
| 👨‍💼 Role-Based Access Control | ✅ |
| 📜 Purchase History | ✅ |
| 🖼️ Vehicle Image Upload | ✅ |
| 📱 Responsive React SPA | ✅ |
| 🧪 Backend Automated Testing | ✅ |
| 🤖 AI Usage Documentation | ✅ |
| 📄 PROMPTS.md Included | ✅ |
| 📚 Comprehensive README | ✅ |
| ☁️ Live Deployment | ✅ 


# ✨ Features

## 🔐 Authentication & Authorization

- User Registration with Email OTP Verification
- Secure Login using JWT Authentication
- Persistent User Sessions
- Role-Based Access Control (Admin & User)
- Protected API Routes
- Secure Password Hashing using bcrypt

---

## 🚘 Vehicle Inventory Management

### 👨‍💼 Admin

- Add New Vehicles
- Update Vehicle Details
- Delete Vehicles
- Restock Vehicle Inventory
- Upload Vehicle Images using Cloudinary
- Manage Complete Inventory

### 👤 User

- Browse Available Vehicles
- View Vehicle Details
- Search Vehicles by Brand
- Purchase Vehicles
- View Personal Purchase History

---

## 📦 Inventory Management

- Real-time Inventory Updates
- Automatic Stock Reduction After Purchase
- Prevent Purchases for Out-of-Stock Vehicles
- Quantity-based Purchase Support
- Admin Inventory Restocking

---

## 🔍 Search & Filtering

- Search Vehicles by Brand
- Responsive Search Experience
- Instant Vehicle Listing Updates

---

## 📜 Purchase Management

- Purchase History Tracking
- Admin Access to All Purchase Records
- User Access to Personal Purchase History
- Transaction Date & Quantity Tracking

---

## 🤖 AI Features

- AI-powered Vehicle Assistant
- Groq API Integration
- Interactive Chat Interface

---

## 📧 Email Features

- OTP Email Verification
- Professional HTML Email Templates
- Secure Registration Verification

---

## 🎨 User Experience

- Modern Responsive UI
- Mobile-Friendly Design
- Protected Routes
- Toast Notifications
- Loading Indicators
- Clean Dashboard Interface

|# 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React.js, Tailwind CSS, React Router DOM, Axios, React Hot Toast, Lucide React |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT (JSON Web Tokens), bcrypt |
| **Email Service** | Nodemailer, Gmail SMTP |
| **Image Storage** | Cloudinary, Multer |
| **AI Integration** | Groq API |
| **Testing** | Jest, Supertest, MongoDB Memory Server |
| **Deployment** | Vercel (Frontend), MongoDB Atlas |
| **Version Control** | Git, GitHub |

---

## 🏗️ System Architecture

```text
┌──────────────────────────────┐
│         React Frontend       │
│     (Tailwind CSS SPA)       │
└──────────────┬───────────────┘
               │ REST API
               ▼
┌──────────────────────────────┐
│      Express.js Backend      │
│ JWT • RBAC • Controllers     │
└──────────────┬───────────────┘
       │              │
       ▼              ▼
 MongoDB Atlas    External Services
                  • Cloudinary
                  • Nodemailer
                  • Groq AI
```


# 🗄️ Entity Relationship (ER) Diagram

The following ER diagram illustrates the database design of the DriveHub Car Dealership Inventory System, including the relationships between users, vehicles, purchases, categories, inventory logs, and OTP verification.

<div align="center">

<img src="./screenshots/er.png" alt="DriveHub ER Diagram" width="100%"/>

</div>

### Database Entities

| Entity | Description |
|---------|-------------|
| **Users** | Stores user information, authentication details, and roles (Admin/User). |
| **Vehicles** | Contains vehicle details such as brand, model, price, stock, images, and creator information. |
| **Purchases** | Records vehicle purchases, payment information, quantity, and transaction history. |
| **Categories** | Maintains vehicle categories for better organization and filtering. |
| **Inventory_Logs** | Tracks inventory updates including purchases, restocking, and stock modifications. |
| **OTPs** | Stores email verification OTPs with expiration details for secure account verification. |

### Entity Relationships

- A **User** can create multiple **Vehicles**.
- A **User** can generate multiple **Inventory Logs**.
- A **User** can request multiple **OTPs** for email verification.
- A **Vehicle** belongs to one **Category**.
- A **Vehicle** can have multiple **Inventory Logs**.
- A **Vehicle** can appear in multiple **Purchase** records.
- Each **Purchase** is associated with one **User** and one **Vehicle**.





# 🔄 System Flow Diagram

The following flow diagram illustrates the complete workflow of the DriveHub Car Dealership Inventory System, covering authentication, vehicle management, purchasing, payment processing, inventory updates, AI assistance, and supporting services.

<div align="center">

<img src="./screenshots/systemflow.png" alt="DriveHub System Flow Diagram" width="100%"/>

</div>

# 📂 Project Structure

```text
drivehub-inventory-system
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── tests
│   ├── utils
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── services
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── screenshots
├── README.md
├── PROMPTS.md
└── .gitignore
```
# 🚀 Getting Started

Follow the steps below to run the project locally.

## 📋 Prerequisites

Make sure the following software is installed on your system:

- Node.js (v18 or later)
- npm
- Git
- MongoDB Atlas account (or a local MongoDB instance)
- Cloudinary account
- Gmail account with an App Password (for OTP emails)
- Groq API Key

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/abhay963/drivehub-inventory-system.git

cd drivehub-inventory-system
```

---

## 2️⃣ Backend Setup

Navigate to the backend folder.

```bash
cd backend
```

Install dependencies.

```bash
npm install
```

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GROQ_API_KEY=your_groq_api_key
```

Start the backend server.

```bash
npm run dev
```

The backend will start on:

```
http://localhost:5000
```

---

## 3️⃣ Frontend Setup

Open a new terminal.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Create a `.env` file inside the `frontend` directory.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend.

```bash
npm run dev
```

The frontend will start on:

```
http://localhost:5173
```

---

## 4️⃣ Running the Application

After starting both servers:

- Open your browser.
- Visit:

```
http://localhost:5173
```

You can now:

- Register a new account
- Verify your email using the OTP
- Log in securely
- Browse available vehicles
- Search vehicles
- Purchase vehicles
- View purchase history
- Access the Admin Dashboard (Admin users)

# 📡 REST API Documentation

The backend exposes a RESTful API for authentication, vehicle management, inventory operations, and purchase history.

## 🔐 Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/verify-otp` | Verify email using OTP | Public |
| POST | `/api/auth/login` | Login and receive JWT token | Public |

---

## 🚗 Vehicle Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/vehicles` | Get all available vehicles | Public |
| GET | `/api/vehicles/search` | Search vehicles by brand | Public |
| POST | `/api/vehicles` | Add a new vehicle | Admin |
| PUT | `/api/vehicles/:id` | Update vehicle details | Admin |
| DELETE | `/api/vehicles/:id` | Delete a vehicle | Admin |

---

## 📦 Inventory Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/vehicles/:id/purchase` | Purchase a vehicle | Authenticated User |
| POST | `/api/vehicles/:id/restock` | Restock vehicle inventory | Admin |

---

## 🛒 Purchase History

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/purchase/history` | View purchase history | Authenticated User / Admin |

---

## 🤖 AI Chat

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/chat` | AI-powered vehicle assistant | Authenticated User |


# 📸 Application Screenshots

The following screenshots showcase the major features and functionality of the **DriveHub – Car Dealership Inventory System**.

---

## 🏠 Landing Page

Modern and responsive landing page introducing the DriveHub platform.

![Landing Page](./screenshots/app/01-Landing.png)

---

## ✨ Landing Page Features

Highlights the key features and services offered by the application.

![Landing Page Features](./screenshots/app/02-Landing.png)

---

## 📝 User Registration

Secure user registration page.

![User Registration](./screenshots/app/03-Register.png)

---

## ✅ Registration Form Validation

Client-side validation and error handling during registration.

![Registration Validation](./screenshots/app/04-Register.png)

---

## 📧 Email OTP Verification

OTP verification screen for activating newly created accounts.

![OTP Verification](./screenshots/app/05-VerifyEmail.png)

---

## 🔐 User Login

JWT-based secure login page.

![Login](./screenshots/app/06-Signin.png)

---

# 👨‍💼 Admin Panel

## 📊 Admin Dashboard

Overview of dealership statistics and management features.

![Admin Dashboard](./screenshots/app/07-Admin-Dashboard.png)

---

## 📈 Dashboard Analytics

Charts displaying sales, inventory, and dealership insights.

![Dashboard Charts](./screenshots/app/08-Admin-Dashboard-Charts.png)

---

## 📉 Additional Dashboard Analytics

Additional statistical visualizations and reports.

![Dashboard Charts 2](./screenshots/app/09-Admin-Dashboard-Chart2.png)

---

## 🚗 Vehicle Inventory Management

Manage all vehicles available in inventory.

![Inventory](./screenshots/app/10-Admin-Inventory.png)

---

## ➕ Add New Vehicle

Admin interface for adding new vehicles.

![Add Vehicle](./screenshots/app/11-Admin-Add-Vehicle.png)

---

## 📦 Update Vehicle Stock

Increase stock quantity of existing vehicles.

![Update Stock](./screenshots/app/12-Admin-Update-Stock.png)

---

## 💰 Sales Dashboard

Monitor completed vehicle purchases.

![Sales Dashboard](./screenshots/app/13-Admin-Sales.png)

---

## 📋 Sales Details

Detailed sales history and purchase information.

![Sales Details](./screenshots/app/14-Admin-Sales-2.png)

---

# 👤 User Panel

## 🏡 User Dashboard

Customer dashboard after login.

![User Dashboard](./screenshots/app/15-User-Dashboard.png)

---

## 🚘 Vehicle Recommendations

Browse featured and available vehicles.

![User Dashboard 2](./screenshots/app/16-User-Dashboard2.png)

---

## 👤 User Profile

Manage personal account information.

![User Profile](./screenshots/app/17-User-Profile.png)

---

## 💬 Chat Assistant

Built-in chatbot interface.

![ChatBot](./screenshots/app/18-User-ChatBot.png)

---

## 🤖 AI Vehicle Assistant

Groq-powered AI assistant for vehicle-related queries.

![AI ChatBot](./screenshots/app/19-User-AiChatBot.png)

---

## 🚙 Vehicle Inventory

Browse the complete dealership inventory.

![Vehicle Inventory](./screenshots/app/20-User-Inventory.png)

---

## 🛒 Purchase Vehicle

Vehicle purchase page with stock validation.

![Purchase Vehicle](./screenshots/app/21-User-Purchase.png)

---

## 💳 Checkout

Checkout process before confirming the purchase.

![Checkout](./screenshots/app/22-User-Checkout.png)

---

## 💵 Payment

Payment processing screen.

![Payment](./screenshots/app/23-User-Payment.png)

---

## ✅ Payment Status

Successful payment confirmation screen.

![Payment Status](./screenshots/app/24-User-Payment-Status.png)

---

## 📜 Purchase History

View all previously purchased vehicles.

![Purchase History](./screenshots/app/25-User-Purchase-History.png)

---

## 📄 Purchase Details

Detailed information for a selected purchase.

![Purchase Details](./screenshots/app/26-User-Purchase-Details.png)

---

## ❌ Out of Stock

Vehicle automatically becomes unavailable when inventory reaches zero.

![Out of Stock](./screenshots/app/27-User-Vehicle-Out-Of-Stock.png)

---

# 🧪 Test Report

DriveHub was developed using a **Test-Driven Development (TDD)** approach to ensure the correctness, reliability, and maintainability of the backend APIs. Automated tests were written and executed throughout development to validate business logic and API behavior.

---

## 🛠️ Testing Stack

- **Jest** – JavaScript testing framework
- **Supertest** – API endpoint testing
- **MongoDB Memory Server** – Isolated in-memory database for testing

---

## ✅ Test Coverage

The automated test suite validates the following modules:

### 🔐 Authentication

- User Registration
- Email OTP Verification
- User Login
- JWT Authentication
- Protected Routes

### 🚗 Vehicle Management

- Create Vehicle
- Retrieve Vehicles
- Search Vehicles
- Update Vehicle
- Delete Vehicle

### 📦 Inventory Management

- Purchase Vehicle
- Restock Vehicle
- Inventory Updates
- Out-of-Stock Validation

---

# 🔄 TDD Workflow

The project followed the **Red → Green → Refactor** development cycle.

## 🔴 Red Phase

Tests were written before implementation to define the expected behavior. Initially, the tests failed because the required functionality had not yet been implemented.

| Authentication Test | Vehicle Test |
|---------------------|--------------|
| ![](./screenshots/tests/tdd-progress/01-auth-test-initial-failure.png) | ![](./screenshots/tests/tdd-progress/03-vehicle-test-initial-failure.png) |

---

## 🟢 Green Phase

After implementing the required functionality, all test cases passed successfully.

![](./screenshots/tests/tdd-progress/04-auth-and-vehicle-tests-passing.png)

---

# 📬 API Testing

The REST APIs were manually verified using **Postman** in addition to the automated Jest test suite.

| Register API | Login API |
|--------------|-----------|
| ![](./screenshots/tests/postman/01-register-user-api.png) | ![](./screenshots/tests/postman/02-login-user-api.png) |

| Vehicle Creation | Vehicle Search |
|------------------|----------------|
| ![](./screenshots/tests/postman/05-create-vehicle-api.png) | ![](./screenshots/tests/postman/06-search-vehicles-api.png) |

These API tests verify authentication, vehicle management, and core inventory operations.

---

# 📊 Final Test Results

All backend test suites executed successfully.

```text
Test Suites: 3 passed, 3 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        9.119 s
```

### Jest Test Summary

![](./screenshots/tests/unit-tests/01-jest-test-suite-passed.png)

---

## ✅ Testing Summary

| Category | Status |
|----------|--------|
| Authentication | ✅ Passed |
| Vehicle Management | ✅ Passed |
| Inventory Management | ✅ Passed |
| Purchase Workflow | ✅ Passed |
| Protected Routes | ✅ Passed |
| API Testing (Postman) | ✅ Passed |
| Automated Tests (Jest) | ✅ Passed |

This testing process helped ensure that the application's core functionality behaves correctly and remains reliable as new features are added.


# 🤖 My AI Usage

AI tools were used throughout the development of **DriveHub** as learning and productivity assistants. They helped me explore implementation approaches, debug issues, improve the user interface, and review my code. All suggestions were carefully reviewed before being incorporated into the project, and the final implementation, testing, and deployment were completed by me.

---

## 🛠️ AI Tools Used

- **ChatGPT** – Backend development guidance, debugging, testing ideas, documentation, and code reviews.
- **Gemini** – UI/UX suggestions, responsive layouts, and frontend improvements.
- **Grok** – Tailwind CSS styling ideas and interface refinements.
- **Groq API** – Integrated into the application as the AI-powered vehicle assistant for end users.

---

## 💡 How I Used AI

### Backend Development

During backend development, I used AI mainly to discuss implementation approaches and review my design decisions.

Examples include:

- Reviewing REST API design.
- Understanding JWT authentication and authorization.
- Discussing MongoDB schema design.
- Reviewing controller and route organization.
- Finding and fixing bugs during development.
- Improving validation and error handling.

The final APIs, business logic, database integration, and application structure were implemented and tested by me.

---

### Frontend Development

For the frontend, AI was mainly used as a UI brainstorming partner.

It helped with:

- Responsive layout suggestions.
- Tailwind CSS improvements.
- Dashboard layout ideas.
- Component organization.
- User experience improvements.
- Minor styling refinements.

I customized the final interface and integrated all frontend components manually.

---

### Testing

AI helped me think about different testing scenarios and possible edge cases.

Examples include:

- Suggesting Jest test cases.
- Discussing API testing strategies.
- Reviewing authentication edge cases.
- Identifying validation scenarios worth testing.

The final test suite was written, executed, debugged, and verified manually.

---

### Documentation

AI also assisted with improving the project documentation by suggesting a better structure and clearer explanations.

This included:

- Organizing the README.
- Improving setup instructions.
- Writing API documentation.
- Preparing the AI usage documentation.
- Creating the `PROMPTS.md` file.

All documentation was reviewed and edited before submission.

---

### Debugging & Code Review

Whenever I encountered errors during development, I used AI as a debugging assistant rather than expecting complete solutions.

Typical uses included:

- Understanding error messages.
- Finding possible causes of bugs.
- Reviewing API responses.
- Checking React state management issues.
- Reviewing deployment-related problems.
- Suggesting cleaner and more maintainable code.

I verified every suggested solution before applying it to the project.

---

# 📝 Reflection

Using AI made the development process more efficient, especially when learning new concepts, debugging issues, reviewing code, and improving documentation.

Instead of relying on AI to build the project, I primarily used it as a second opinion whenever I was unsure about an implementation or wanted to compare different approaches.

Every feature in this project—including authentication, inventory management, purchasing, testing, deployment, and frontend integration—was implemented, integrated, tested, and verified by me. AI served as a learning resource and development assistant throughout the project rather than replacing the software development process.

---

## 📌 AI Usage Transparency

To maintain transparency, this repository also includes a **PROMPTS.md** file documenting the major prompts used during development. AI assistance was limited to guidance, code reviews, debugging support, UI suggestions, testing ideas, and documentation improvements, while the final implementation and project decisions remain my own.

## Planned Features

- 💳 Online Payment Gateway Integration (Stripe/Razorpay)
- ⭐ Vehicle Reviews & Ratings
- ❤️ Wishlist / Favorites
- 🔔 Email Notifications for Purchases
- 📊 Advanced Sales Analytics Dashboard
- 📈 Inventory Reports & Export (PDF/Excel)
- 🚘 Vehicle Comparison Feature
- 🔍 Advanced Filtering (Price, Category, Brand)
- 📱 Progressive Web App (PWA) Support
- 🐳 Docker Containerization
- ☁️ CI/CD Pipeline using GitHub Actions
- 🌍 Multi-language Support

---

# 🙏 Acknowledgements

I would like to thank the creators and maintainers of the open-source technologies and services used in this project.

- React
- Node.js
- Express.js
- MongoDB Atlas
- Tailwind CSS
- Cloudinary
- Nodemailer
- Jest
- Supertest
- Groq API
- ChatGPT

---

# 👨‍💻 Author

**Abhay Kumar Yadav**

- 🎓 B.Tech Information Technology
- 🌐 GitHub: https://github.com/abhay963

---

# 📄 License

This project was developed for educational purposes as part of the **TDD Kata: Car Dealership Inventory System** assignment.
