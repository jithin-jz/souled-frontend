<div align="center">

# 🎨 Souled Store - Frontend

### Modern E-Commerce Experience Built with React & Vite

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**Lightning-fast** shopping experience with smooth animations, responsive design, and modern UI/UX patterns.

[Features](#-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Deployment](#-deployment)

</div>

---

## ✨ Features

### 🎨 Modern UI/UX

- **Smooth Animations** - Powered by Framer Motion for delightful interactions
- **Responsive Design** - Mobile-first approach, works on all devices
- **Dark Theme** - Elegant dark slate color scheme
- **Micro-interactions** - Hover effects, transitions, and visual feedback
- **Empty States** - Beautiful placeholders for cart, wishlist, and orders

### 🛍️ Shopping Experience

- **Product Catalog** - Browse with filters (category, price range, search)
- **Shopping Cart** - Persistent cart with real-time updates
- **Wishlist** - Save favorites for later
- **Quick Actions** - Add to cart/wishlist with one click
- **Stock Indicators** - Real-time availability display

### 🔐 Authentication

- **Email/Password Login** - Traditional authentication
- **Google OAuth** - One-tap sign-in with Google
- **Protected Routes** - Automatic redirect for authenticated pages
- **Session Management** - Automatic token refresh

### 💳 Checkout & Orders

- **Multi-Step Checkout** - Address selection, payment method
- **Payment Options** - Cash on Delivery & Stripe integration
- **Order Tracking** - View order history with detailed status
- **Payment Status** - Real-time payment verification
- **Success Animations** - Confetti celebration on order completion

### 👨‍💼 Admin Dashboard

- **User Management** - View, block/unblock users
- **Product Management** - Full CRUD operations
- **Order Management** - Update order and payment status
- **Analytics Dashboard** - Sales metrics and charts
- **Responsive Admin UI** - Works on all devices

---

## � Quick Start

### Prerequisites

```bash
Node.js 18+ (LTS recommended)
npm or yarn
Backend API running on localhost:8000
```

### Installation

1. **Clone and Setup**

   ```bash
   git clone <your-repo-url>
   cd Souled
   npm install
   ```

2. **Environment Configuration**

   Create `.env` file:

   ```env
   VITE_API_URL=http://localhost:8000/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```

3. **Start Development Server**

   ```bash
   npm run dev
   ```

   🎉 App running at `http://localhost:5173`

---

## 📁 Project Structure

```
Souled/
├── src/
│   ├── admin/              # Admin dashboard pages
│   │   ├── Dashboard.jsx   # Analytics & stats
│   │   ├── Users.jsx       # User management
│   │   ├── Products.jsx    # Product management
│   │   └── AdminOrderManagement.jsx
│   │
│   ├── components/         # Reusable components
│   │   ├── auth/          # Login, Register
│   │   ├── Navbar.jsx     # Navigation bar
│   │   ├── Footer.jsx     # Site footer
│   │   └── Loader.jsx     # Loading states
│   │
│   ├── pages/             # Customer pages
│   │   ├── Home.jsx       # Landing page
│   │   ├── Products/      # Product listing
│   │   ├── Cart.jsx       # Shopping cart
│   │   ├── Wishlist.jsx   # Saved items
│   │   ├── Orders.jsx     # Order history
│   │   ├── Payment.jsx    # Checkout
│   │   └── ProfileDetails.jsx
│   │
│   ├── Routes/            # Route guards
│   │   ├── ProtectedRoute.jsx
│   │   ├── PublicRoute.jsx
│   │   └── AdminRoute.jsx
│   │
│   ├── store/             # Zustand state management
│   │   ├── useAuthStore.js
│   │   └── useCartStore.js
│   │
│   ├── utils/             # Utilities
│   │   └── api.js         # Axios instance with interceptors
│   │
│   └── App.jsx            # Root component
│
├── public/                # Static assets
├── index.html            # HTML template
└── package.json          # Dependencies
```

---

## 🎯 Key Pages

### Customer Pages

- **Home** (`/`) - Landing page with featured products
- **Products** (`/products`) - Catalog with filters and search
- **Product Details** (`/products/:id`) - Individual product page
- **Cart** (`/cart`) - Shopping cart management
- **Wishlist** (`/wishlist`) - Saved items
- **Checkout** (`/payment`) - Address and payment selection
- **Orders** (`/orders`) - Order history
- **Profile** (`/profile`) - User profile and settings
- **Addresses** (`/addresses`) - Manage shipping addresses

### Admin Pages

- **Dashboard** (`/admin/dashboard`) - Analytics and metrics
- **Users** (`/admin/users`) - User management
- **Products** (`/admin/products`) - Product CRUD
- **Orders** (`/admin/orders`) - Order management
- **Reports** (`/admin/reports`) - Sales reports

---

## 🛠️ Tech Stack

### Core

- **React 18.2.0** - UI library
- **Vite 7.0.4** - Build tool & dev server
- **React Router 7.7.0** - Client-side routing
- **Zustand 5.0.9** - State management

### Styling

- **Tailwind CSS 4.1.11** - Utility-first CSS
- **Framer Motion 12.23.12** - Animation library
- **Lucide React** - Icon library
- **React Icons** - Additional icons

### Features

- **Axios 1.10.0** - HTTP client with interceptors
- **React Toastify** - Toast notifications
- **React Confetti** - Success celebrations
- **Recharts 3.1.0** - Charts for admin dashboard
- **@react-oauth/google** - Google OAuth integration

### Development

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--slate-900: #0f172a   /* Background */
--slate-800: #1e293b   /* Cards */
--slate-700: #334155   /* Borders */

/* Accent Colors */
--blue-500: #3b82f6    /* Primary actions */
--green-500: #10b981   /* Success states */
--red-500: #ef4444     /* Errors */
--yellow-500: #eab308  /* Warnings */
```

### Typography

- **Font Family**: System fonts (optimized for performance)
- **Headings**: Bold, large sizes
- **Body**: Regular weight, readable sizes

---

## 🧪 Testing

```bash
# Run tests (when configured)
npm test

# Run linter
npm run lint

# Type checking (if using TypeScript)
npm run type-check
```

---

## � Build & Deployment

### Production Build

```bash
npm run build
```

Output in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deployment Options

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Netlify

```bash
# Build command
npm run build

# Publish directory
dist
```

#### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

---

## ⚙️ Configuration

### Environment Variables

| Variable                | Description            | Required |
| ----------------------- | ---------------------- | -------- |
| `VITE_API_URL`          | Backend API base URL   | ✅       |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅       |

### Vite Config

```javascript
// vite.config.js
export default {
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
};
```

---

## 🔒 Security Features

✅ **XSS Protection** - React's built-in escaping  
✅ **CSRF Tokens** - Automatic CSRF handling  
✅ **Secure Cookies** - HttpOnly JWT cookies  
✅ **Route Guards** - Protected routes for auth  
✅ **Input Validation** - Client-side validation  
✅ **Auto Logout** - On token expiration

---

## 🚀 Performance

- **Code Splitting** - Lazy loading for routes
- **Tree Shaking** - Unused code elimination
- **Asset Optimization** - Image and CSS optimization
- **Fast Refresh** - Instant HMR during development
- **Lighthouse Score** - 90+ on all metrics

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Zustand](https://github.com/pmndrs/zustand)

---

<div align="center">

**Built with ❤️ by JITHIN**

⭐ Star this repo if you find it helpful!

[Report Bug](https://github.com/yourusername/souled/issues) • [Request Feature](https://github.com/yourusername/souled/issues)

</div>
