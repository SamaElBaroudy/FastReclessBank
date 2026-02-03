# FastRecklessBank

Revel8 tech challenge: a tiny in-memory bank API with a simple React UI.

## Overview
- Create accounts (UUIDs) and keep balances in memory.
- Deposit, withdraw, and transfer funds between accounts.
- View account details, including the last 50 outgoing transfers.
- Thread-safe operations using per-account locks.

## Tech stack
- Backend: Java 17, Spring Boot (webmvc)
- Frontend: React + TypeScript + Vite

## Quick start

### 1) Run the backend (Spring Boot)
```bash
./mvnw spring-boot:run
```
Backend runs on `http://localhost:8080`.

### 2) Run the frontend (Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173` and proxies `/accounts` to the backend.

## API
Base URL: `http://localhost:8080`

### Create account
`POST /accounts`

Response:
```json
{ "id": "uuid", "balance": 0 }
```

### List accounts
`GET /accounts`

Response:
```json
[ { "id": "uuid", "balance": 0 } ]
```

### Deposit
`POST /accounts/{id}/deposit?amount=100`

### Withdraw
`POST /accounts/{id}/withdraw?amount=25`

### Transfer
`POST /accounts/transfer`
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
- `400 Bad Request`: invalid amount or invalid transfer (same account)
- `404 Not Found`: account not found
- `409 Conflict`: insufficient funds

## Notes
- Data is in-memory only. Restarting the backend clears all accounts.
- Each account tracks the last 50 outgoing transfers in a ring buffer.


