"""
Banking Calculation Service (Python / FastAPI)
- Interest calculation
- Transaction validation
- Account statement generation
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timedelta
from decimal import Decimal, ROUND_HALF_UP

app = FastAPI(
    title="Banking Calculation Service",
    description="Interest, validation & statement generation",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def quantize(value: float) -> float:
    return float(Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


# ---------- Models ----------

class InterestRequest(BaseModel):
    principal: float = Field(..., gt=0)
    annual_rate: float = Field(..., ge=0)  # percent
    days: int = Field(..., gt=0)
    compound: bool = False


class TransactionLine(BaseModel):
    date: str
    type: str
    amount: float
    description: Optional[str] = ""
    balance_after: Optional[float] = None


class StatementRequest(BaseModel):
    account_number: str
    account_type: str
    customer_name: str
    opening_balance: float
    transactions: List[TransactionLine]
    from_date: Optional[str] = None
    to_date: Optional[str] = None


class ValidateTxnRequest(BaseModel):
    amount: float
    balance: float
    account_status: str
    txn_type: str  # Deposit, Withdrawal, Transfer


# ---------- Endpoints ----------

@app.get("/")
def root():
    return {
        "service": "Banking Calculation Service",
        "version": "1.0.0",
        "endpoints": [
            "GET  /health",
            "POST /calculate/interest",
            "POST /generate/statement",
            "POST /validate/transaction"
        ]
    }


@app.get("/health")
def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


@app.post("/calculate/interest")
def calculate_interest(req: InterestRequest):
    """
    Simple interest or compound interest calculation.
    Returns interest amount and new principal.
    """
    principal = req.principal
    rate = req.annual_rate / 100.0
    years = req.days / 365.0

    if req.compound:
        # Compound interest (annual compounding for simplicity)
        amount = principal * ((1 + rate) ** years)
        interest = amount - principal
    else:
        # Simple interest
        interest = principal * rate * years
        amount = principal + interest

    return {
        "principal": quantize(principal),
        "annual_rate_percent": req.annual_rate,
        "days": req.days,
        "compound": req.compound,
        "interest": quantize(interest),
        "new_balance": quantize(amount)
    }


@app.post("/validate/transaction")
def validate_transaction(req: ValidateTxnRequest):
    """Basic business rules validation."""
    errors = []

    if req.account_status != "Active":
        errors.append(f"Account is {req.account_status}")

    if req.amount <= 0:
        errors.append("Amount must be positive")

    if req.txn_type in ("Withdrawal", "Transfer") and req.amount > req.balance:
        errors.append("Insufficient balance")

    if req.txn_type == "Withdrawal" and req.amount > 500000:
        errors.append("Withdrawal limit exceeded (max 500,000 per transaction)")

    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "message": "OK" if not errors else "; ".join(errors)
    }


@app.post("/generate/statement")
def generate_statement(req: StatementRequest):
    """
    Generate a simple account statement summary.
    """
    running = req.opening_balance
    lines = []
    total_credit = 0.0
    total_debit = 0.0

    for t in req.transactions:
        if t.type in ("Deposit", "Interest", "Transfer-In"):
            running += t.amount
            total_credit += t.amount
            side = "Credit"
        else:
            running -= t.amount
            total_debit += t.amount
            side = "Debit"

        lines.append({
            "date": t.date,
            "description": t.description or t.type,
            "type": t.type,
            "debit": quantize(t.amount) if side == "Debit" else 0,
            "credit": quantize(t.amount) if side == "Credit" else 0,
            "balance": quantize(running)
        })

    return {
        "account_number": req.account_number,
        "account_type": req.account_type,
        "customer_name": req.customer_name,
        "from_date": req.from_date,
        "to_date": req.to_date or datetime.utcnow().strftime("%Y-%m-%d"),
        "opening_balance": quantize(req.opening_balance),
        "closing_balance": quantize(running),
        "total_debit": quantize(total_debit),
        "total_credit": quantize(total_credit),
        "transactions": lines,
        "generated_at": datetime.utcnow().isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
