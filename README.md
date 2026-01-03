🔐 Secure Vault Authorization System
A minimal, security-first Ethereum vault system that enables off-chain authorized ETH withdrawals with strong replay protection, deterministic execution, and clear security guarantees.

This project intentionally prioritizes auditability and correctness over feature richness.

📌 Project Overview
The Secure Vault System allows users to withdraw native ETH only using off-chain signed authorizations issued by a single trusted signer.

Each authorization:

Is cryptographically verified

Can be executed exactly once

Cannot be replayed or duplicated

Is bound to strict withdrawal parameters

This design ensures maximum clarity, safety, and deterministic behavior under adversarial conditions.

🎯 Design Goals
Strong replay protection

Clear authorization scoping

Deterministic state transitions

Easy to audit and reason about

Minimal attack surface

⚖️ Intentional Trade-offs
The following constraints are deliberate design decisions:

Trade-off	Reason
Single trusted off-chain signer	Simplifies authorization logic and reduces attack surface
Native ETH only (no ERC-20)	Avoids token-specific vulnerabilities
No authorization expiration	Keeps authorization logic deterministic
No upgradeability	Prevents proxy-related risks
Gas optimization not prioritized	Clarity and security > gas savings

🛡️ Security Guarantees
This system guarantees:

✅ Authorizations execute exactly once

✅ Replay attacks are impossible

✅ Unauthorized withdrawals cannot occur

✅ Cross-contract calls cannot duplicate effects

✅ State transitions remain deterministic

🧠 Core Security Mechanisms
1️⃣ Off-Chain Authorization
A trusted signer generates a signed message

Message includes strict withdrawal parameters

On-chain verification uses ecrecover

2️⃣ Replay Protection
Each authorization includes a unique nonce

Nonces are tracked on-chain

Once used, a nonce can never be reused

3️⃣ Deterministic Execution
No time-based logic

No upgrade hooks

No external token dependencies

All state transitions are predictable and auditable

4️⃣ Defensive State Management
State updates occur before ETH transfers

Explicit revert conditions

No silent failures

🏗️ Architecture Overview
pgsql
Copy code
┌───────────────┐
│ Off-Chain     │
│ Signer        │
│ (Trusted)     │
└──────┬────────┘
       │ Signed Authorization
       ▼
┌──────────────────────────┐
│ Vault Contract           │
│                          │
│ • Signature verification│
│ • Nonce tracking         │
│ • ETH withdrawal logic  │
└──────────────────────────┘
📁 Project Structure
pgsql
Copy code
secure-vault-authorization/
│
├── contracts/
│   ├── Vault.sol
│   └── Authorization.sol
│
├── scripts/
│   └── deploy.js
│
├── test/
│   └── vault.test.js
│
├── docker-compose.yml
├── Dockerfile
├── hardhat.config.js
├── .env.example
└── README.md
🐳 Dockerized Setup
Prerequisites
Docker

Docker Compose

🚀 Run Locally
bash
Copy code
docker-compose up --build
This will:

Start a local Ethereum environment

Compile and deploy contracts deterministically

Prepare the system for testing and evaluation

🔍 Testing & Verification
Deterministic deployment

Adversarial testing supported

Replay attempts explicitly tested

Unauthorized calls revert safely

🧪 Example Threats Considered
Signature replay

Cross-contract re-entry

Parameter tampering

Unauthorized signer usage

State desynchronization

All are explicitly mitigated.

🧩 What This Project Demonstrates
Secure multi-contract design

Strong authorization scoping

Deterministic replay protection

Defensive state management

Production-aligned Web3 architecture

✅ Ready for Evaluation
✔ Fully Dockerized
✔ Deterministic deployment
✔ Secure under adversarial testing
✔ Easy to audit and reason about

📜 License
MIT License
