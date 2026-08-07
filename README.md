# 🤖 AI Customer Support Chatbot

A full-stack AI-powered customer support platform built with **React + Vite** (frontend) and **Spring Boot 3 + Java 21** (backend), featuring JWT authentication, OpenAI GPT-4o integration, FAQ management, feedback collection, and an admin dashboard.

---

## 🚀 Quick Start

### One-Click Launch
```
Double-click: start.bat
```
This will:
- Verify MySQL is running
- Start the Spring Boot backend on port **8080**
- Start the Vite frontend on port **5173**
- Open the app in your browser automatically

---

## 🔑 Default Credentials

| Role  | Email                  | Password    |
|-------|------------------------|-------------|
| Admin | admin@aisupport.com    | *(reset via DB — see below)* |
| User  | test@example.com       | Test@1234   |

> **Note:** The test@example.com account has been promoted to ROLE_ADMIN.

### Reset Admin Password (via MySQL)
```sql
-- Generate a new bcrypt hash for your desired password, then:
UPDATE users SET password = '<bcrypt_hash>' WHERE email = 'admin@aisupport.com';
```

---

## 🌐 URLs

| Service       | URL                                         |
|---------------|---------------------------------------------|
| Frontend App  | http://localhost:5173                       |
| Backend API   | http://localhost:8080                       |
| Swagger Docs  | http://localhost:8080/swagger-ui.html       |

---

## 🏗️ Project Structure

```
ai-customer-support/
├── start.bat                  ← One-click launcher
├── test-api.bat               ← API test script
├── backend/                   ← Spring Boot (Java 21)
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/aisupport/
│       │   ├── controller/    ← REST API endpoints
│       │   ├── service/       ← Business logic
│       │   ├── model/         ← JPA entities
│       │   ├── repository/    ← Database access
│       │   ├── security/      ← JWT + Spring Security
│       │   ├── dto/           ← Request/Response DTOs
│       │   ├── config/        ← CORS, Security, JWT config
│       │   └── exception/     ← Global error handling
│       └── resources/
│           ├── application.yml
│           └── db/migration/  ← Flyway SQL migrations
└── frontend/                  ← React + Vite + Tailwind CSS
    └── src/
        ├── pages/             ← Login, Register, Chat, Admin
        ├── components/        ← Chat, Navbar, Sidebar, etc.
        ├── services/          ← API service layer (Axios)
        ├── context/           ← AuthContext, ChatContext
        ├── hooks/             ← useAuth, useChat, useFaq, etc.
        └── routes/            ← Protected & Admin routes
```

---

## ⚙️ Configuration

### OpenAI API Key (for AI chat responses)
Set the environment variable before starting the backend:
```bash
# Windows CMD
set OPENAI_API_KEY=sk-your-key-here

# Windows PowerShell
$env:OPENAI_API_KEY="sk-your-key-here"
```
Or edit `backend/src/main/resources/application.yml`:
```yaml
spring:
  ai:
    openai:
      api-key: sk-your-key-here
```

### Database
Default config (`application.yml`):
```
Host:     localhost:3306
Database: ai_support_db
Username: root
Password: root
```

---

## 🧪 API Overview

### Auth Endpoints
| Method | URL                     | Auth     | Description           |
|--------|-------------------------|----------|-----------------------|
| POST   | /api/auth/register      | Public   | Register new user     |
| POST   | /api/auth/login         | Public   | Login & get JWT       |
| GET    | /api/auth/me            | Bearer   | Get current user      |

### Chat Endpoints
| Method | URL                              | Auth   | Description              |
|--------|----------------------------------|--------|--------------------------|
| POST   | /api/chat/message                | Bearer | Send message to AI       |
| GET    | /api/chat/sessions               | Bearer | List user sessions       |
| GET    | /api/chat/sessions/{id}/messages | Bearer | Get session messages     |

### FAQ Endpoints
| Method | URL              | Auth   | Description       |
|--------|------------------|--------|-------------------|
| GET    | /api/faq         | Public | List all FAQs     |
| POST   | /api/faq         | Admin  | Create FAQ        |
| PUT    | /api/faq/{id}    | Admin  | Update FAQ        |
| DELETE | /api/faq/{id}    | Admin  | Delete FAQ        |

### Admin Endpoints
| Method | URL                          | Auth  | Description        |
|--------|------------------------------|-------|--------------------|
| GET    | /api/admin/users             | Admin | List all users     |
| PUT    | /api/admin/users/{id}/role   | Admin | Change user role   |
| PUT    | /api/admin/users/{id}/toggle | Admin | Enable/disable user|
| DELETE | /api/admin/users/{id}        | Admin | Delete user        |

### Analytics Endpoints
| Method | URL                       | Auth  | Description           |
|--------|---------------------------|-------|-----------------------|
| GET    | /api/analytics/overview   | Admin | Stats overview        |
| GET    | /api/analytics/chart      | Admin | Daily message chart   |

---

## 🛠️ Tech Stack

| Layer     | Technology                         |
|-----------|------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS       |
| Backend   | Spring Boot 3.3, Java 21           |
| Security  | Spring Security + JWT (JJWT 0.12)  |
| AI        | Spring AI + OpenAI GPT-4o          |
| Database  | MySQL 8.0 + Flyway migrations      |
| ORM       | Spring Data JPA + Hibernate 6      |
| API Docs  | Springdoc OpenAPI (Swagger UI)     |

---

## 📦 Manual Startup

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm run dev
```

---

## 🔒 Security Features
- Passwords hashed with BCrypt
- JWT tokens with 24h expiry
- Role-based access: `ROLE_USER` and `ROLE_ADMIN`
- CORS configured for `http://localhost:5173`
- Password field excluded from all API responses

---

*Built with Spring Boot 3 + React 18 + OpenAI GPT-4o*
