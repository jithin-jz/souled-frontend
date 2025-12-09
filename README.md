<div align="center">

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=32&duration=2800&pause=2000&color=3B82F6&center=true&vCenter=true&width=940&lines=🎨+Souled+Store+-+Modern+E-Commerce" alt="Typing SVG" />

### ✨ Lightning-fast shopping experience built with React & Vite

<p align="center">
  <a href="#-features"><kbd>Features</kbd></a>
  <a href="#-screenshots"><kbd>Screenshots</kbd></a>
  <a href="#-quick-start"><kbd>Quick Start</kbd></a>
  <a href="#-tech-stack"><kbd>Tech Stack</kbd></a>
  <a href="#-documentation"><kbd>Docs</kbd></a>
</p>

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

</div>

<br/>

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎨 Modern UI/UX

- ✅ Smooth animations with Framer Motion
- ✅ Fully responsive design
- ✅ Elegant dark theme
- ✅ Delightful micro-interactions
- ✅ Beautiful empty states

### 🛍️ Shopping Experience

- ✅ Advanced product filters
- ✅ Persistent shopping cart
- ✅ Wishlist functionality
- ✅ One-click actions
- ✅ Real-time stock updates

</td>
<td width="50%">

### 🔐 Authentication

- ✅ Email/Password login
- ✅ Google OAuth integration
- ✅ Protected routes
- ✅ Auto token refresh

### 💳 Checkout & Orders

- ✅ Multi-step checkout
- ✅ COD & Stripe payments
- ✅ Order tracking
- ✅ Payment verification
- ✅ Success animations

</td>
</tr>
</table>

### 👨‍💼 Admin Dashboard

> Full-featured admin panel with user management, product CRUD, order management, and analytics

<br/>

## 📸 Screenshots

<div align="center">

<table>
<tr>
<td colspan="2" align="center">
<h3>🖼️ Application Preview</h3>
</td>
</tr>
<tr>
<td width="50%">
<img src="./screenshots/home.png" alt="Home Page" width="100%"/>
<p align="center"><b>🏠 Home Page</b></p>
</td>
<td width="50%">
<img src="./screenshots/products.png" alt="Products" width="100%"/>
<p align="center"><b>🛍️ Products Listing</b></p>
</td>
</tr>
<tr>
<td width="50%">
<img src="./screenshots/cart.png" alt="Cart" width="100%"/>
<p align="center"><b>🛒 Shopping Cart</b></p>
</td>
<td width="50%">
<img src="./screenshots/admin-dashboard.png" alt="Admin Dashboard" width="100%"/>
<p align="center"><b>📊 Admin Dashboard</b></p>
</td>
</tr>
</table>

</div>

<br/>

## 🚀 Quick Start

### 📋 Prerequisites

```bash
Node.js 18+ (LTS recommended)
npm or yarn
Backend API running
```

### ⚡ Installation

```bash
# 1️⃣ Clone the repository
git clone <your-repo-url>
cd Souled

# 2️⃣ Install dependencies
npm install

# 3️⃣ Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# 4️⃣ Start development server
npm run dev
```

> 🎉 **App running at** `http://localhost:5173`

### 🔧 Environment Variables

```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

📖 See [.env.example](./.env.example) for detailed setup instructions

<br/>

## 🛠️ Tech Stack

<div align="center">

### Core Technologies

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-433E38?style=for-the-badge&logo=react&logoColor=white)

### Styling & UI

![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

### Features & Tools

![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)

</div>

<details>
<summary><b>📦 View All Dependencies</b></summary>

#### Core

- React 18.2.0 - UI library
- Vite 7.0.4 - Build tool & dev server
- React Router 7.7.0 - Client-side routing
- Zustand 5.0.9 - State management

#### Styling

- Tailwind CSS 4.1.11 - Utility-first CSS
- Framer Motion 12.23.12 - Animation library
- Lucide React - Icon library
- React Icons - Additional icons

#### Features

- Axios 1.10.0 - HTTP client
- React Toastify - Toast notifications
- React Confetti - Success celebrations
- Recharts 3.1.0 - Charts
- @react-oauth/google - Google OAuth

</details>

<br/>

## 📚 Documentation

<table>
<tr>
<td align="center" width="25%">
<a href="./API_DOCS.md">
<img src="https://img.icons8.com/fluency/96/api.png" width="64"/>
<br/><b>API Docs</b>
</a>
<br/>Complete endpoint reference
</td>
<td align="center" width="25%">
<a href="./TESTING.md">
<img src="https://img.icons8.com/fluency/96/test-tube.png" width="64"/>
<br/><b>Testing Guide</b>
</a>
<br/>Setup & guidelines
</td>
<td align="center" width="25%">
<a href="./.env.example">
<img src="https://img.icons8.com/fluency/96/settings.png" width="64"/>
<br/><b>Environment</b>
</a>
<br/>Configuration guide
</td>
<td align="center" width="25%">
<a href="./DEPLOYMENT.md">
<img src="https://img.icons8.com/fluency/96/rocket.png" width="64"/>
<br/><b>Deployment</b>
</a>
<br/>Deploy instructions
</td>
</tr>
</table>

<br/>

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run linter
npm run lint
```

📖 **Full testing guide:** [TESTING.md](./TESTING.md)

<br/>

## 📦 Build & Deployment

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

🚀 **Deployment guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

<br/>

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and pull requests.

<br/>

## 📄 License

This project is licensed under the MIT License.

<br/>

---

<div align="center">

### 💙 Built with passion by **JITHIN**

<p>
<a href="https://github.com/jithin-jz/souled-frontend">
<img src="https://img.shields.io/github/stars/jithin-jz/souled-frontend?style=social" alt="Stars"/>
</a>
<a href="https://github.com/jithin-jz/souled-frontend/fork">
<img src="https://img.shields.io/github/forks/jithin-jz/souled-frontend?style=social" alt="Forks"/>
</a>
</p>

**⭐ Star this repo if you find it helpful!**

<p>
<a href="https://github.com/jithin-jz/souled-frontend/issues">Report Bug</a>
·
<a href="https://github.com/jithin-jz/souled-frontend/issues">Request Feature</a>
</p>

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer"/>

</div>
