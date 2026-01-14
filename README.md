<div align="center">

# ☀️ SolarCredits India

### AI-Verified Carbon Credits for India's Solar Revolution

[![Built with React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Arbitrum](https://img.shields.io/badge/Arbitrum-Sepolia-28A0F0?style=for-the-badge&logo=ethereum&logoColor=white)](https://arbitrum.io/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Democratizing carbon markets for 100 million+ small solar installations across India**

[🚀 Live Demo](#) • [📖 Documentation](#getting-started) • [🎯 Features](#-features) • [🛠️ Tech Stack](#-technology-stack)

</div>

---

## 🌟 Overview

**SolarCredits India** is a revolutionary blockchain-based platform that enables small-scale solar producers across India to monetize their clean energy generation through verified carbon credits. By combining **AI-powered bill verification** with **ultra-low-cost blockchain transactions** on Arbitrum Sepolia, we're making carbon markets accessible to everyone.

### 🎯 The Problem

India has over **100 million small solar installations**, but traditional carbon credit markets are:
- ❌ Too expensive (high verification costs)
- ❌ Too slow (manual verification takes weeks)
- ❌ Too complex (inaccessible to small producers)
- ❌ Lack transparency (centralized intermediaries)

### ✅ Our Solution

- ✨ **Instant AI Verification** - Upload your electricity bill, get verified in seconds
- 💰 **Ultra-Low Gas Fees** - Less than ₹0.10 per transaction on Arbitrum Sepolia
- 🔗 **Blockchain Transparency** - Immutable proof of carbon offset on-chain
- 🛒 **Decentralized Marketplace** - Buy/sell credits directly, no intermediaries
- 🌍 **ESG Compliance** - Retire credits for corporate sustainability goals

---

## ✨ Features

### 🤖 AI-Powered Bill Verification
- Upload electricity bills (PDF, JPG, PNG)
- Advanced ML models extract solar generation data
- Instant verification with 98%+ confidence scores
- Cryptographic hash for tamper-proof records

### ⛓️ Blockchain Minting (Arbitrum Sepolia)
- **SRC Token Contract**: `0x00DEfe6c8fE01610406Aa58538952D5b7d92c56e`
- ERC-20 compliant carbon credit tokens
- 1 SRC = 100 kWh of verified solar generation
- Mint credits directly to your MetaMask wallet
- Gas fees < ₹0.10 per transaction

### 🛒 Decentralized Marketplace
- **Decimal Purchases Supported** - Buy 0.001 SRC or 100 SRC
- **1 SRC = 1 ETH** conversion ratio
- Direct peer-to-peer transactions
- Filter by location, rating, solar capacity
- Real-time transaction history
- Verified producer badges

### 🌍 ESG Compliance Portal
- Carbon offset calculator
- Retire credits for ESG compliance
- Downloadable certificates with blockchain proof
- Impact dashboard (CO₂ offset, trees equivalent)
- Permanent on-chain retirement records

### 🎨 Premium User Experience
- Glassmorphism UI with dark mode
- Smooth animations powered by Framer Motion
- Responsive design (mobile, tablet, desktop)
- Interactive 3D tilt cards
- Real-time wallet integration
- Confetti celebrations for successful transactions

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface (React)                   │
│  Dashboard │ Marketplace │ Portfolio │ ESG Portal │ Auth    │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
    │ Wallet  │    │ Supabase│    │   AI    │
    │ Context │    │ Backend │    │ Verify  │
    │(MetaMask)│   │  (Auth, │    │ Service │
    └────┬────┘    │   DB)   │    └─────────┘
         │         └─────────┘
         │
    ┌────▼──────────────────────────────────┐
    │   Arbitrum Sepolia Testnet            │
    │   SRC Token Contract (ERC-20)         │
    │   0x00DEfe6c8fE01610406Aa58538952... │
    └───────────────────────────────────────┘
```

### Data Flow

1. **Upload** → User uploads electricity bill
2. **Verify** → AI analyzes bill, extracts solar generation data
3. **Mint** → User approves MetaMask transaction
4. **Blockchain** → SRC tokens minted on Arbitrum Sepolia
5. **Trade** → Credits available on marketplace
6. **Retire** → ESG buyers retire credits for compliance

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.3 + TypeScript 5.8
- **Build Tool**: Vite 5.4
- **Styling**: TailwindCSS 3.4 + Custom Glassmorphism
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion 12.26
- **State Management**: React Query (TanStack), Context API
- **Routing**: React Router DOM 6.30

### Blockchain
- **Network**: Arbitrum Sepolia Testnet
- **Wallet**: MetaMask Integration
- **Token Standard**: ERC-20 (SRC Token)
- **RPC**: Arbitrum Sepolia dRPC endpoint
- **Chain ID**: 421614 (0x66eee)

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime subscriptions
- **Storage**: Supabase Storage (for bill uploads)

### Development
- **Language**: TypeScript
- **Linting**: ESLint 9
- **Package Manager**: npm / bun
- **Version Control**: Git

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm (or bun)
- **MetaMask** browser extension
- **Arbitrum Sepolia ETH** (get from [faucet](https://faucet.quicknode.com/arbitrum/sepolia))
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/BhaveshGajengi1/solar-credits-india.git
cd solar-credits-india
```

2. **Install dependencies**
```bash
npm install
# or
bun install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

> **Note**: The SRC token contract address is hardcoded in `src/lib/contract.ts`

4. **Start the development server**
```bash
npm run dev
# or
bun dev
```

5. **Open your browser**
```
http://localhost:5173
```

### MetaMask Setup

1. Install [MetaMask](https://metamask.io/)
2. Add Arbitrum Sepolia network (auto-prompted in app)
3. Get testnet ETH from [Arbitrum Sepolia Faucet](https://faucet.quicknode.com/arbitrum/sepolia)
4. Connect wallet in the app

---

## 📖 Usage Guide

### For Solar Producers 🌞

1. **Connect Wallet** - Click "Connect Wallet" and approve MetaMask
2. **Upload Bill** - Go to Dashboard → Upload your electricity bill
3. **AI Verification** - Wait ~3 seconds for AI to verify your solar generation
4. **Mint Credits** - Click "Mint Credits" → Approve transaction in MetaMask
5. **Earn Money** - List your credits on the marketplace or hold them

### For ESG Buyers 🏢

1. **Browse Marketplace** - Explore verified credits from solar producers
2. **Purchase Credits** - Select amount (supports decimals like 0.5 SRC)
3. **Retire Credits** - Go to ESG Portal → Retire credits for compliance
4. **Download Certificate** - Get blockchain-verified ESG certificate

---

## 📁 Project Structure

```
solarcredits-india/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/         # Layout components (Header, Footer)
│   │   ├── marketplace/    # Marketplace-specific components
│   │   └── ui/             # shadcn/ui components + custom
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx # Supabase authentication
│   │   └── WalletContext.tsx # MetaMask wallet integration
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # External service integrations
│   │   └── supabase/       # Supabase client & queries
│   ├── lib/                # Utility functions
│   │   └── contract.ts     # Smart contract ABI & helpers
│   ├── pages/              # Page components
│   │   ├── Index.tsx       # Landing page
│   │   ├── Dashboard.tsx   # Producer dashboard
│   │   ├── Marketplace.tsx # Credit marketplace
│   │   ├── Portfolio.tsx   # User portfolio
│   │   ├── ESGPortal.tsx   # ESG buyer portal
│   │   └── Auth.tsx        # Authentication page
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── supabase/              # Supabase migrations & config
├── .env                   # Environment variables
├── package.json           # Dependencies
├── tailwind.config.ts     # TailwindCSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

---

## 🔗 Smart Contract Details

### SRC Token (ERC-20)

- **Contract Address**: `0x00DEfe6c8fE01610406Aa58538952D5b7d92c56e`
- **Network**: Arbitrum Sepolia Testnet
- **Chain ID**: 421614
- **Token Symbol**: SRC
- **Decimals**: 18
- **Total Supply**: Dynamic (minted on verification)

### Token Economics

- **1 SRC** = 100 kWh of verified solar generation
- **1 SRC** = ~100 kg CO₂ offset
- **1 SRC** = 1 ETH (marketplace conversion)
- **Minting**: Only through verified bill uploads
- **Burning**: Permanent retirement for ESG compliance

### View on Block Explorer

[View Contract on Arbiscan Sepolia →](https://sepolia.arbiscan.io/address/0x00DEfe6c8fE01610406Aa58538952D5b7d92c56e)

---

## 🎨 Screenshots

### Landing Page
Beautiful hero section with animated gradients and floating particles

### Dashboard
Upload bills, view AI verification results, mint credits with one click

### Marketplace
Browse and purchase credits from verified solar producers across India

### ESG Portal
Calculate carbon offset, retire credits, download compliance certificates

---

## 🗺️ Roadmap

### Phase 1: Testnet Launch ✅
- [x] AI bill verification
- [x] SRC token deployment (Arbitrum Sepolia)
- [x] Marketplace with decimal purchases
- [x] ESG retirement portal
- [x] MetaMask integration

### Phase 2: Mainnet Deployment 🚧
- [ ] Deploy to Arbitrum One mainnet
- [ ] Multi-language support (Hindi, Tamil, Telugu)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard

### Phase 3: Scale & Integrate 🔮
- [ ] Integration with government solar schemes
- [ ] API for corporate ESG platforms
- [ ] Automated bill fetching from utility companies
- [ ] Carbon credit derivatives marketplace

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use existing UI components from `src/components/ui`
- Write meaningful commit messages
- Test on Arbitrum Sepolia before submitting PR
- Update documentation for new features

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Arbitrum** for ultra-low gas fees enabling micro-transactions
- **Supabase** for seamless backend infrastructure
- **shadcn/ui** for beautiful, accessible components
- **India's Solar Community** for inspiring this project

---

## 📞 Contact & Links

- **GitHub**: [@BhaveshGajengi1](https://github.com/BhaveshGajengi1)
- **Repository**: [solar-credits-india](https://github.com/BhaveshGajengi1/solar-credits-india)
- **Issues**: [Report a bug](https://github.com/BhaveshGajengi1/solar-credits-india/issues)
- **Discussions**: [Join the conversation](https://github.com/BhaveshGajengi1/solar-credits-india/discussions)

---

<div align="center">

### ⭐ Star this repo if you find it useful!

**Made with ❤️ for India's Solar Revolution**

[⬆ Back to Top](#️-solarcredits-india)

</div>
