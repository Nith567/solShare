# SolShare – A Solana-Powered 402 Paywall File Marketplace 🚀🔐

SolShare is a modern decentralized file marketplace built with **Solana**, **Next.js 15+**, and **Pinata** IPFS storage.  
This dApp allows users to upload, pay, and access token-gated content using the **HTTP 402 Payment Required protocol**.

---

## 🔥 Features

- 🪙 **Solana Wallet Auth** – Connect with your Solana wallet (Phantom, Backpack, etc.)
- 💳 **Pay-per-file access** using **HTTP 402 protocol**
- 📦 **Any user can upload** datasets, images, videos, documents – anything.
- 📁 Files are stored on **IPFS (via Pinata)** with **private time-limited links**
- ⌛ Links **auto-expire in 60 seconds** after purchase to preserve exclusivity
- 📊 Uses **Prisma + PostgreSQL** for secure file metadata storage
- 💅 Built with **Next.js App Router**, **React 19**, **Tailwind CSS**

---

## 💼 Use Case

1. User logs in with a **Solana wallet**
2. Uploads a file (e.g. dataset, image, video, ZIP)
3. The file gets uploaded privately to **Pinata**
4. Content is listed in the **marketplace**
5. User pays using Solana (via wallet interaction)
6. A secure **IPFS download link** is generated
7. The link auto-expires in **60 seconds** ⏳

---

## 🛠️ Tech Stack

- **Next.js 15+**
- **Prisma + PostgreSQL**
- **Pinata IPFS (Private Gateway)**
- **HTTP 402 Custom Headers + Middleware**
