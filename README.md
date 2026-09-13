# Banking Application

Complete full-stack banking system with:

- Customer & Admin authentication
- Bank Accounts (Savings / Current)
- Deposit, Withdraw, Transfer
- Transaction History
- Account Statement
- Balance Inquiry
- Interest calculation (Python service)

## Tech Stack

| Layer          | Technology                  |
|----------------|-----------------------------|
| Frontend       | React + Vite + Tailwind CSS |
| Backend        | Node.js + Express.js        |
| Database       | MongoDB + Mongoose          |
| Python Service | FastAPI (interest, validation, statements) |

## Features

### Customer
- Register / Login
- View own accounts & balances
- Deposit money
- Withdraw money
- Transfer to another account
- View transaction history
- Download statement (via Python service)

### Admin
- View all customers & accounts
- Create accounts for customers
- Freeze / Unfreeze accounts
- View all transactions
- System overview dashboard

## Project Structure

```
banking-app/
├── backend/                 # Node.js + Express + MongoDB
├── frontend/                # React + Vite
├── python-service/          # FastAPI microservice
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB (local or Atlas)
- npm

## Quick Start

### 1. Start MongoDB
```bash
docker-compose up -d
```

### 2. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed          # creates admin + sample customers & accounts
npm run dev           # http://localhost:5000
```

### 3. Python Service
```bash
cd python-service
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev           # http://localhost:5173
```

## Default Login Credentials (after seed)

**Admin**
- Email: `admin@bank.com`
- Password: `admin123`

**Customer**
- Email: `ali@example.com`
- Password: `customer123`

## API Endpoints

### Auth
- `POST /api/auth/register` – Customer registration
- `POST /api/auth/login` – Login (customer/admin)
- `GET  /api/auth/me` – Current user

### Accounts
- `GET  /api/accounts` – My accounts (customer) / All (admin)
- `POST /api/accounts` – Create account (admin)
- `GET  /api/accounts/:id` – Account details
- `PATCH /api/accounts/:id/status` – Freeze/Unfreeze (admin)

### Transactions
- `POST /api/transactions/deposit`
- `POST /api/transactions/withdraw`
- `POST /api/transactions/transfer`
- `GET  /api/transactions` – My transactions
- `GET  /api/transactions/account/:accountId`

### Python Service
- `POST /calculate/interest`
- `POST /generate/statement`
- `POST /validate/transaction`

## License
MIT
# banking_app
