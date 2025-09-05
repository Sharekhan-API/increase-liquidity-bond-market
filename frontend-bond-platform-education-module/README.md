# Frontend for Fractional BondXchange Platform and Education Module

This is the **frontend application** for our bond trading and education platform, built with [Next.js](https://nextjs.org/) and powered by [Bun](https://bun.sh/).  

It provides two key modules:  

1. **Bond Trading (Buy/Sell)**
   - Login screen for stockbrokers and investors.  
   - User dashboard showing **bond holdings** with detailed metadata.  
   - **Buy flow**: choose number of units, view projected returns based on Yield to Maturity (YTM).  
   - **Sell flow**: see proceeds from immediate sale vs. holding till maturity.  
   - **Explore Bonds** section to discover new bonds or additional units available in the market.  

2. **Bond Education (SEBI-inspired module)**
   - Learn about different types of bonds (Government, High-yield, etc.).  
   - **Education content**: structured lessons to improve investor knowledge.  
   - **Quizzes & Gamification**: test knowledge, earn badges/certificates.  
   - **AI-powered Portfolio Assistant**: enter your portfolio, get a **risk score**, and receive **bond recommendations** to improve diversification and reduce risk.  

Together, these modules aim to **improve participation and liquidity** in the corporate bond market by making bond trading simpler and bond knowledge more accessible.  

---

## 📦 Features

* 🎨 Intuitive UI for buying/selling fractional bond units.  
* 📊 Real-time return projections based on YTM.  
* 🔍 Explore and discover new bonds easily.  
* 📚 SEBI-style education hub with lessons and bond categories.  
* 🏆 Quizzes with badges and certificates.  
* 🤖 AI-driven portfolio risk analysis and bond recommendations.  
* ⚡️ Powered by **Next.js + Bun** for fast and modern developer experience.  

---

## 📁 Project Setup

### 1. **Install Bun**

Make sure you have Bun installed globally:

```bash
curl -fsSL https://bun.sh/install | bash
```

After installation, restart your terminal and verify:

```bash
bun --version
```

### 2. **Clone the Repository**

```bash
git clone https://github.com/dubeyanant/bonds.git
cd your-repo-name
```

### 3. **Install Dependencies**

Use Bun to install dependencies:

```bash
bun install
```

This will install all packages listed in `package.json`.

---

## 🚀 Running the Project

### Development Mode

Start the dev server:

```bash
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

### Production Build

To create a production build:

```bash
bun run build
```

Then start the production server:

```bash
bun run start
```

---

## 🛠 Scripts

Here's a quick reference of useful scripts:

| Script          | Description                 |
| --------------- | --------------------------- |
| `bun run dev`   | Run Next.js in development  |
| `bun run build` | Build for production        |
| `bun run start` | Start the production server |
