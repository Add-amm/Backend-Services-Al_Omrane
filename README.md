# Backend-Services-Al_Omrane

## Overview

Backend-Services-Al_Omrane is a microservices-based backend system designed for Al Omrane, supporting user management, authentication, supplier management, product ordering, file storage, and notifications. Each service is containerized using Docker and communicates via REST APIs. The stack uses Node.js, Express, Sequelize (MySQL), Redis, and other supporting libraries.

---

## Architecture

**Services:**
- **auth-service**: Handles authentication, JWT issuance, and token management.
- **users-management**: Manages users, roles, and agencies.
- **supplier-service**: Manages suppliers and their contracts/files.
- **product-order-service**: Handles products and orders.
- **file-service**: Handles file uploads and downloads.
- **notification-service**: Sends email notifications.
- **mysql**: MySQL database for persistent storage.
- **redis**: Redis for token allow-list and caching.

Each service is isolated and communicates with others via HTTP APIs.

---

## Directory Structure

```
.
├── docker-compose.yml
├── .env
├── services/
│   ├── auth-service/
│   ├── users-management/
│   ├── supplier-service/
│   ├── product-order-service/
│   ├── file-service/
│   └── notification-service/
└── ...
```

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Environment Variables

Copy `.env` to the project root and fill in the required values. Example:

```
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=gcc_db
MYSQL_USER=user
MYSQL_PASSWORD=password
DB_HOST=mysql
DB_PORT=3306
PORT=3000
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://redis:6379
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_password
MAIL_FROM=your_email@example.com
```

Each service may use its own `.env` file for service-specific configuration.

---

### Build and Run All Services

```bash
docker-compose up --build
```

This will build and start all services, including MySQL and Redis.

---

## Services Overview

### 1. **auth-service**
- **Port:** 3000
- **Endpoints:**
  - `POST /auth/login` — Authenticate user and get JWT
  - `POST /auth/logout` — Invalidate JWT
  - `GET /auth/profile` — Get authenticated user profile

### 2. **users-management**
- **Port:** 3001
- **Endpoints:**
  - `GET /api/user` — List all users (admin only)
  - `GET /api/user/:id` — Get user by ID
  - `POST /api/user` — Create user
  - `PUT /api/user/:id` — Update user
  - `DELETE /api/user/:id` — Block user
  - `POST /api/user/changepassword` — Change own password

### 3. **supplier-service**
- **Port:** 3002
- **Endpoints:**
  - `GET /api/supplier` — List all suppliers
  - `GET /api/supplier/:id` — Get supplier by ID
  - `POST /api/supplier` — Create supplier (supports file upload)
  - `PUT /api/supplier/:id` — Update supplier
  - `DELETE /api/supplier/:id` — Delete supplier

### 4. **product-order-service**
- **Port:** 3003
- **Endpoints:**
  - **Products:**
    - `GET /api/product` — List all products
    - `GET /api/product/:id` — Get product by ID
    - `POST /api/product` — Create product
    - `PUT /api/product/:id` — Update product
    - `DELETE /api/product/:id` — Delete product
  - **Orders:**
    - `GET /api/order` — List all orders
    - `GET /api/order/:id` — Get order by ID
    - `POST /api/order` — Create order
    - `PUT /api/order/:id` — Update order
    - `DELETE /api/order/:id` — Delete order
    - `GET /api/order-directeur` — List orders for director
    - `GET /api/order-responsable` — List orders for responsible
    - `GET /api/order-custom` — List orders by status
    - `PATCH /api/order/:id/accept-by-responsable` — Accept order by responsible
    - `PATCH /api/order/:id/accept-by-director` — Accept order by director
    - `POST /api/order/:id/reject` — Reject order

### 5. **file-service**
- **Port:** 4005
- **Endpoints:**
  - `POST /file/upload` — Upload a file
  - `GET /file/download/:id` — Download a file by ID
  - `DELETE /file/delete/:id` — Delete a file by ID

### 6. **notification-service**
- **Port:** 4000
- **Endpoints:**
  - `POST /send` — Send an email

---

## Database

- **MySQL** is used for persistent storage.
- **Sequelize** ORM is used for model definitions and migrations.
- **Redis** is used for token allow-list and caching.

---

## Development

### Running a Single Service

You can run a single service for development:

```bash
cd services/users-management
npm install
npm run dev
```

Make sure MySQL and Redis are running (can use Docker Compose).

### Seeding Data

The `users-management` service seeds roles, agencies, and users on startup if the tables are empty.

---

## File Uploads

- File uploads are handled by the `file-service`.
- Other services (e.g., supplier-service) upload files by sending them to `file-service` and storing the returned file ID.

---

## Authentication

- JWT-based authentication.
- Tokens are stored in Redis allow-list for validation and can be invalidated on logout.

---

## Email Notifications

- The `notification-service` uses SMTP credentials from environment variables to send emails.

---

## Useful Commands

- **Build and start all services:**  
  `docker-compose up --build`
- **Stop all services:**  
  `docker-compose down`
- **Remove all volumes (reset DB):**  
  `docker-compose down -v`
- **View logs:**  
  `docker-compose logs -f`

---

## Troubleshooting

- **Database schema issues:**  
  If you see unexpected columns (e.g., `departement` in `agences`), remove the `mysql-data` Docker volume and restart to reset the schema:
  ```bash
  docker-compose down -v
  docker-compose up --build
  ```

- **Environment variables:**  
  Ensure all required variables are set in `.env` files.

---

## License

MIT License. See [LICENSE.txt](LICENSE.txt).

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

