# 💹 M.Bond - Increasing Liquidity in Corporate Bond Markets  
*SEBI GFF 2025 Hackathon Project*  

![Next.js](https://img.shields.io/badge/Frontend-Next.js-blue)  
![Bun](https://img.shields.io/badge/Runtime-Bun-purple)  
![Spring Boot](https://img.shields.io/badge/Backend-SpringBoot-green)  
![Redis](https://img.shields.io/badge/Cache-Redis-red)  
![Flask](https://img.shields.io/badge/API-Flask-black)  
![Python](https://img.shields.io/badge/Language-Python-yellow)  
![Kafka](https://img.shields.io/badge/Streaming-Kafka-orange)  
![Status](https://img.shields.io/badge/Stage-Functional_MVP-brightgreen)   

This repository contains our prototype platform designed to **improve liquidity in the bond market**.  
We combine **fractional bond trading**, **education**, **order matching**, **pricing services**, and **AI-powered recommendations** into a unified ecosystem.  

📺 **Video Demo**: [Watch Here](https://your-demo-link.com)  

---

## 🧩 Modules Overview  

### 1. [Frontend: Bond Trading & Education](./frontend-bond-platform-education-module)  
- Login & Dashboard for investors.  
- **Bond Trading**: Buy/sell units, holdings view, yield projections.  
- **Explore Bonds**: Discover new bonds in market.  
- **Education Hub**: Learn about govt bonds, high-yield bonds, etc.  
- **Gamification**: Quizzes, badges, certificates.  
- **AI Assistant**: Portfolio risk analysis & bond recommendations.  

---

### 2. [Order Matching & Ledger Service](./order-matching-ledger-service)  
- **Matching Engine** (Price-Time Priority).  
- **Ledger Service**: Maintains trade & settlement records.  
- **Compliance Layer**: KYC/AML, regulatory checks.  
- RESTful APIs with **Swagger UI**.  

---

### 3. [Fractionalization & Pricing Service](./fractionalization-pricing-service)  
- Pricing engine for **fractional bond units**.  
- Supports **high-rated vs low-rated bonds**.  
- Present Value (PV) & implied yield models.  
- Buyer interest simulations & yield projections.  

---

### 4. [Recommendations Service](./recommendations-service)  
- Portfolio risk scoring (0–100).  
- Evaluates **stocks, MFs, and FDs** alongside bonds.  
- Suggests **safer/yield-enhancing bond replacements**.  
- Provides new portfolio with **improved risk score**.  

---

## 🏗️ Simplified System Architecture  

```mermaid
flowchart LR
    A["🌐 Frontend (Trading + Education)"]
    B["⚙️ Order Matching & Ledger Service"]
    C["💰 Fractionalization & Pricing Service"]
    D["🧠 Recommendations Service"]

    A <--> B
    A <--> C
    B <--> C
    A <--> D

