# ========== 1) Create 2 accounts ==========
echo "---- POST /accounts"
A_ID=$(curl -s -X POST http://localhost:8080/accounts | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')
echo "---- POST /accounts"
B_ID=$(curl -s -X POST http://localhost:8080/accounts | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')

echo "A_ID=$A_ID"
echo "B_ID=$B_ID"
echo -e "\n"
# ========== 2) List all accounts ==========
echo "---- GET /accounts"
curl -s http://localhost:8080/accounts
echo -e "\n"

# ========== 3) Deposit into A ==========
echo "---- POST /accounts/$A_ID/deposit?amount=100"
curl -i -X POST "http://localhost:8080/accounts/$A_ID/deposit?amount=100"
echo -e "\n"

# ========== 4) Withdraw from A ==========
echo "---- POST /accounts/$A_ID/withdraw?amount=30"
curl -i -X POST "http://localhost:8080/accounts/$A_ID/withdraw?amount=30"
echo -e "\n"

# ========== 5) Withdraw too much (should fail: 409 or 400) ==========
echo "---- POST /accounts/$A_ID/withdraw?amount=999999 (expect failure)"
curl -i -X POST "http://localhost:8080/accounts/$A_ID/withdraw?amount=999999"
echo -e "\n"

# ========== 6) Transfer A -> B ==========
echo "---- POST /accounts/transfer (A -> B, amount=25)"
curl -i -X POST "http://localhost:8080/accounts/transfer" \
  -H "Content-Type: application/json" \
  -d "{\"fromAccountId\":\"$A_ID\",\"toAccountId\":\"$B_ID\",\"amount\":25}"
echo -e "\n"

# ========== 7) List all accounts again (balances should reflect operations) ==========
echo "---- GET /accounts (after deposit/withdraw/transfer)"
curl -s http://localhost:8080/accounts
echo -e "\n"


# ========== 8) Check A account details (should include the transfer to B) ==========
echo "---- GET /accounts/$A_ID"
curl -s "http://localhost:8080/accounts/$A_ID"
echo -e "\n"

# ========== 9) Check B account details (should likely have no outgoing transfers empty) ==========
echo "---- GET /accounts/$B_ID"
curl -s "http://localhost:8080/accounts/$B_ID"
echo -e "\n"

# ========== 10) Validation checks ==========
echo "---- Deposit negative (expect 400)"
curl -i -X POST "http://localhost:8080/accounts/$A_ID/deposit?amount=-5"
echo -e "\n"

echo "---- Transfer to same account (expect 400)"
curl -i -X POST "http://localhost:8080/accounts/transfer" \
  -H "Content-Type: application/json" \
  -d "{\"fromAccountId\":\"$A_ID\",\"toAccountId\":\"$A_ID\",\"amount\":1}"
echo -e "\n"

echo "---- Transfer with insufficient funds (expect failure)"
curl -i -X POST "http://localhost:8080/accounts/transfer" \
  -H "Content-Type: application/json" \
  -d "{\"fromAccountId\":\"$A_ID\",\"toAccountId\":\"$B_ID\",\"amount\":999999}"
echo -e "\n"
