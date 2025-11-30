# 🔒 Zcash-Miden Private Bridge

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

A privacy-preserving cross-chain bridge enabling **shielded transfers** between Zcash testnet and Miden testnet using zero-knowledge proofs.

## ✨ Features

### 🔐 Privacy-First Architecture
- **Zcash Shielded Pool**: zk-SNARKs for complete transaction privacy
- **Miden Private Rollup**: Client-side STARK proof generation
- **End-to-End Privacy**: No public linking between transactions
- **Encrypted Memos**: Private messages with recipient encryption

### 🌉 Cross-Chain Capabilities
- **Bidirectional Transfers**: Seamless Zcash ⟷ Miden asset transfers
- **Zero-Knowledge Proofs**: Cryptographic verification without revealing details
- **Atomic Swaps**: Guaranteed execution or full rollback
- **Decentralized Relayers**: No single point of failure

### 🛡️ Security Features
- **Non-Custodial**: Users maintain full control of assets
- **Commitment-Based**: Cryptographic commitments ensure integrity
- **Fraud Proof Protection**: Invalid transfers automatically rejected
- **Multi-Layer Verification**: Proofs verified on both chains

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/zcash-miden-bridge.git
cd zcash-miden-bridge

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start frontend
npm run dev

# In another terminal, start relayer
npm run relayer
