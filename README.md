# UrbanBin Backend

Production-ready backend for the UrbanBin waste management platform.

This README is designed to help you quickly understand the system in the future: architecture, modules, database design, APIs, setup, testing, and common troubleshooting.

## 1. Tech Stack

- Runtime: Node.js (CommonJS)
- Framework: Express.js
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT + bcrypt
- Validation: Joi
- File Upload: Multer
- Realtime: Socket.IO
- Logging: Morgan + custom logger

## 2. High-Level Architecture

Request flow:

Client -> Route -> Validation Middleware -> Auth Middleware (if protected) -> Controller -> Service -> Repository -> Prisma -> PostgreSQL

Error flow:

Thrown errors -> Global error middleware -> Standard JSON error response

Realtime flow:

Sensor data insert -> service logic -> update bin/alerts -> emit Socket.IO events

Offline monitor flow:

Background interval checks stale bins -> emits sensorOffline event

## 3. Project Structure

Key folders in src:

- config: environment parsing and Prisma client setup
- controllers: HTTP handlers (thin layer)
- services: business logic and rules
- repositories: data access using Prisma
- routes: endpoint mapping
- middlewares: auth, validation, error handling, uploads
- validations: Joi schemas per module
- sockets: socket initialization and offline monitor
- utils: logger, custom error, async handler

Other important folders:

- prisma: schema.prisma (database schema)
- scripts: utility scripts like dummy data seeding
- postman: ready-to-import Postman files
- docs: testing guides and project docs

## 4. Layer Responsibilities

### Controller Layer

- Reads params/body/query
- Calls service function
- Returns consistent JSON response

### Service Layer

- Applies domain rules
- Validates business constraints
- Coordinates multi-step operations/transactions

### Repository Layer

- Handles database operations only
- Keeps Prisma queries separate from business logic

### Middleware Layer

- Authentication (JWT verification)
- Joi request validation
- Not found handling
- Global error normalization (including Prisma errors)

## 5. Database Schema Overview

Prisma models:

1. Location
2. Bin
3. SensorData
4. Alert
5. Vehicle
6. Driver
7. Route
8. Collection
9. Complaint
10. User

Enums:

- bin_status: FULL, NORMAL
- complaint_status: OPEN, CLOSED
- alert_status: PENDING, RESOLVED

Important relations:

- Location 1 -> many Bins
- Bin 1 -> many SensorData / Alerts / Complaints / Collections
- Vehicle 1 -> many Routes and linked Driver(s) (driver has unique vehicle_id)
- Driver + Vehicle -> Route
- Route -> many Collections

Schema source:

- prisma/schema.prisma

## 6. Environment Variables

Reference file:

- .env.example

Main values used by backend:

- NODE_ENV
- APP_PORT
- APP_HOST
- DATABASE_URL
- LOG_LEVEL
- JWT_SECRET
- JWT_EXPIRES_IN
- BIN_FULL_THRESHOLD
- SENSOR_OFFLINE_MINUTES
- SENSOR_OFFLINE_CHECK_INTERVAL_SECONDS

## 7. Installation and Setup

1. Install dependencies

	npm install

2. Configure environment

	Copy .env.example to .env and update values.

3. Generate Prisma client

	npx prisma generate

4. Sync database schema (choose one)

	Development migration flow:
	npx prisma migrate dev --name init_schema

	Or direct sync:
	npx prisma db push

5. Start server

	npm run dev

Default server URL format:

- http://APP_HOST:APP_PORT

## 8. Authentication

Login endpoint returns JWT token. Use it in protected APIs:

Authorization: Bearer <token>

Current local dev user (if seeded/created):

- email: admin@urbanbin.com
- password: Admin@123

## 9. API Catalog

Base path: /api/v1

### Public Endpoints

1. GET /health
2. POST /auth/login

### Protected Endpoints

Auth:

1. POST /auth/logout

Bins:

1. GET /bins
2. GET /bins/:id
3. POST /bins
4. PUT /bins/:id
5. DELETE /bins/:id

Sensor Data:

1. POST /sensor-data

Alerts:

1. GET /alerts
2. GET /alerts/:bin_id
3. PATCH /alerts/:id

Vehicles:

1. GET /vehicles
2. GET /vehicles/:id
3. POST /vehicles
4. PUT /vehicles/:id

Routes:

1. GET /routes
2. GET /routes/:id
3. POST /routes
4. DELETE /routes/:id

Analytics:

1. GET /analytics/kpi
2. GET /analytics/trends

Complaints:

1. POST /complaints (multipart/form-data with image)

## 10. Realtime Events (Socket.IO)

Server-side emits:

1. binUpdate
	- Trigger: sensor data ingestion updates bin state

2. sensorOffline
	- Trigger: offline monitor detects stale bins

Socket files:

- src/sockets/socket.js
- src/sockets/offline_sensor.monitor.js

## 11. Validation and Error Handling

Validation:

- Joi schemas in src/validations
- request_validation.middleware validates body/params/query before controller execution

Error handling:

- AppError for domain errors
- Global error middleware maps known Prisma errors and returns uniform JSON shape

Typical error status codes:

- 400 validation/domain rule
- 401 unauthorized/invalid login
- 404 not found
- 409 conflict
- 500 internal server error

## 12. Seed and Test Data

Dummy seeding script:

- scripts/seed_dummy_data.cjs

Run command:

- npm run seed:dummy

It inserts linked data across all tables for API testing.

## 13. Postman and Testing Docs

Postman files:

- postman/UrbanBin_API.postman_collection.json
- postman/UrbanBin_Local.postman_environment.json

Testing guide:

- docs/API_TESTING_GUIDE.md

## 14. Useful Commands

- npm run dev
- npm start
- npm run prisma:generate
- npm run prisma:migrate
- npm run prisma:deploy
- npm run seed:dummy

Direct Prisma commands:

- npx prisma studio
- npx prisma db push
- npx prisma migrate dev --name <name>

## 15. Common Troubleshooting

### App says port already in use

- Stop old node process using that port or change APP_PORT.

### DB auth failed

- Recheck DATABASE_URL username/password/port/database name.

### Table does not exist

- Run npx prisma db push or run migrations.

### Login fails with invalid email/password

- Ensure user exists in users table and password hash is valid.

### Protected API returns 401

- Check Authorization header format and token expiry.

## 16. What To Read First Later

If you revisit this project after a long time, read in this order:

1. prisma/schema.prisma
2. src/routes/index.routes.js
3. One complete module flow (example: bin.routes -> bin.controller -> bin.service -> bin.repository)
4. src/middlewares/error_handler.middleware.js
5. src/server.js

This gives you the fastest full-picture refresh.
