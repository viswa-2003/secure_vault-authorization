🔐 Secure Vault System
On-Chain Authorization with Deterministic Replay Protection

A production-grade Web3 vault architecture that enforces single-use, cryptographically authorized withdrawals with strict on-chain replay protection.

📌 Overview

Secure Vault System is a defensive multi-contract blockchain architecture designed to safely manage and withdraw native blockchain funds (ETH).

Inspired by real-world DeFi protocol designs, it strictly separates:

🏦 Asset custody

🔐 Permission validation

This separation reduces risk, limits trust boundaries, and significantly improves auditability.

💡 Core Principle
Funds move only when explicitly authorized — exactly once — under all execution conditions.

🎯 Design Objectives

This system guarantees:

🔒 Explicit authorization for every withdrawal

🔁 Replay protection (single-use authorizations only)

🧮 Correct accounting across all execution paths

🧱 Strict separation of responsibilities

🛡️ Defense against malicious callers

🔍 High observability via events

♻️ Fully reproducible local deployment

🧠 High-Level Architecture

The system consists of two independent on-chain contracts, each with a clearly defined responsibility.

🏦 SecureVault Contract

(Custody Layer)

Primary Role:
Safely holds and transfers ETH.

Responsibilities

Accept ETH deposits from any address

Hold pooled funds securely

Request authorization validation

Execute withdrawals only after confirmation

Emit clear observability events

Explicitly Does NOT

❌ Verify signatures

❌ Track authorization usage

❌ Generate authorization logic

🔍 This keeps the vault minimal, auditable, and low-risk.

🔐 AuthorizationManager Contract

(Permission Layer)

Primary Role:
Validates permissions and enforces replay protection.

Responsibilities

Verify off-chain generated authorizations

Validate cryptographic signatures

Track authorization usage

Ensure each authorization is consumed exactly once

Explicitly Does NOT

❌ Hold funds

❌ Transfer ETH

❌ Depend on vault logic

🔐 Authorization correctness is enforced independently of custody.

🔗 Why This Separation Matters

This architectural split ensures:

A compromised vault cannot fabricate permissions

A compromised authorization system cannot steal funds

Each contract remains small, focused, and auditable

Security reviews can be isolated and scoped

✅ Mirrors battle-tested DeFi protocol patterns

🔁 End-to-End Withdrawal Flow

User deposits ETH into SecureVault

Trusted off-chain authority constructs a withdrawal authorization

Authorization is cryptographically signed

Withdrawal request is sent to SecureVault

SecureVault forwards data to AuthorizationManager

AuthorizationManager:

Reconstructs the message

Verifies signature authenticity

Confirms authorization is unused

Marks it as consumed

SecureVault:

Updates internal state

Transfers ETH

Emits a withdrawal event

🚫 At no point can funds move without explicit authorization

🧾 Authorization Scope

Each authorization is strictly bound to:

Vault contract address

Blockchain network (chainId)

Recipient address

Withdrawal amount

Unique nonce

This guarantees authorizations are:

Vault-specific

Network-specific

Amount-specific

Recipient-specific

Single-use only

🆔 Deterministic Authorization ID

Each authorization generates a unique ID:

keccak256(
  vault_address,
  recipient,
  amount,
  chainId,
  nonce
)

Why this matters:

Prevents ambiguity

Enables simple replay tracking

Guarantees uniqueness across vaults & networks

🔁 Replay Protection (On-Chain)

Replay attacks are prevented by:

Storing authorization IDs on-chain

Rejecting already-used IDs

Marking IDs as consumed before success

Once used, an authorization:

❌ Cannot be reused

❌ Cannot be replayed

❌ Cannot be modified

❌ Cannot be transferred across chains or vaults

All replay attempts revert deterministically.

🧮 State Safety & Correctness

Strict safety rules ensure:

Vault balance is checked before withdrawal

Authorization is validated before state change

State updates occur before ETH transfer

All failures revert atomically

This guarantees:

No double withdrawals

No partial execution

No inconsistent state

No negative balances

📡 Events & Observability

The system emits events for every critical action:

Event	Description
Deposit	ETH received by the vault
AuthorizationUsed	Authorization consumed
Withdrawal	ETH transferred to recipient

❗ Failed operations revert cleanly and emit no misleading events.

🧪 Testing Strategy

Automated tests validate:

ETH deposits

Authorized withdrawals

Replay attack prevention

Tampered parameter rejection

Tests simulate:

Off-chain authorization generation

Adversarial replay attempts

Parameter manipulation attacks

✅ System invariants hold under malicious conditions

🐳 Local Deployment (Docker)

The entire system is fully reproducible using Docker.

Prerequisites

Docker

Docker Compose

Run the System
docker-compose up


This automatically:

Starts a local blockchain

Compiles contracts

Deploys AuthorizationManager

Deploys SecureVault

Outputs deployed addresses

🧠 No manual steps required

📂 Repository Structure
/
├─ contracts/
│  ├─ AuthorizationManager.sol
│  └─ SecureVault.sol
├─ scripts/
│  └─ deploy.js
├─ tests/
│  └─ system.spec.js
├─ docker/
│  ├─ Dockerfile
│  └─ entrypoint.sh
├─ docker-compose.yml
├─ hardhat.config.js
└─ README.md

⚠️ Assumptions & Limitations

Single trusted off-chain signer

Native ETH only (no ERC-20)

No authorization expiration

No upgradeability

Gas optimization not prioritized

These are intentional trade-offs to maximize security clarity.

🛡️ Security Guarantees

This system guarantees:

Authorizations execute exactly once

Replay attacks are impossible

Unauthorized withdrawals cannot occur

Cross-contract calls cannot duplicate effects

State transitions remain deterministic

🏁 Final Notes

This project demonstrates:

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
