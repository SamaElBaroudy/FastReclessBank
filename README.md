# Fast & Reckless Bank 🏦

Revel8 tech challenge: a tiny in-memory bank API implemented with Java Spring Boot and a simple React UI.

## Overview
### Backend 
- Create accounts (UUIDs) and keep balances in memory.
- Deposit, withdraw, and transfer money between accounts.
- Store last 50 outgoing transfers per account (in-memory, fixed-size ring buffer).
- Thread-safe operations using per-account locks.
- No database, no third-party in-memory storage libraries
### Frontend 
- Accounts overview
- Deposit / withdraw money
- Transfer money between accounts
- Account details page with outgoing transfer history

## Tech stack
- Backend: Java 17, Spring Boot (webmvc)
- Frontend: React + TypeScript + Vite

## 🧠 Design Decisions
- Accounts are stored in a `ConcurrentHashMap`
- All balance updates are atomic
- Transfers lock both accounts in a consistent order (by account ID) to prevent deadlocks
- Each account stores the last 50 outgoing transfers, Implemented as a fixed-size ring buffer for:
    - O(1) writes
    - Constant memory usage
    - Minimal GC pressure

## 📁 Project Structure (Backend)
```
controller/   REST endpoints
service/      Business logic & concurrency
model/        Domain models
dto/          Request/response objects
exception/    Custom exceptions & global handler
```

## 🚀 Quick start 

### 1) Run the backend (Spring Boot)
```bash
./mvn spring-boot:run
```
Backend runs on `http://localhost:8080`.

### 2) Run the frontend (Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173` and proxies `/accounts` to the backend.

## API Endpoints
Base URL: `http://localhost:8080`

### Create account
`POST /accounts`

### List accounts
`GET /accounts`

Response:
```json
[ { "balance": "uuid", "id": 0 } ]
```

### Deposit
`POST /accounts/{id}/deposit?amount=100`

### Withdraw
`POST /accounts/{id}/withdraw?amount=25`

### Transfer
`POST /accounts/transfer` 
Request Body
```json
{
  "fromAccountId": "uuid",
  "toAccountId": "uuid",
  "amount": 10
}
```

### Account details
`GET /accounts/{id}`

Response:
```json
{
  "id": "uuid",
  "balance": 90,
  "lastOutgoingTransfers": [
    { "toAccountId": "uuid", "amount": 10, "timestamp": "2026-01-29T22:34:00Z" }
  ]
}
```

## Errors
- `400 Bad Request`: negative amount or invalid transfer (same account)
- `404 Not Found`: account not found
- `409 Conflict`: insufficient funds
## API Manual Testing

## Notes
- Data is in-memory only. Restarting the backend clears all accounts.
- No authentication or authorization (by design)
- Currency handling is simplified (single currency)
## TODO 

