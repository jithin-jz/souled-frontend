# Souled Store - Modern eCommerce Platform

A full-stack eCommerce platform built with React, Vite, and Django REST Framework (DRF), featuring a modern UI with smooth animations and responsive design.

![Souled Store](https://img.shields.io/badge/Status-Development-yellow)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Django](https://img.shields.io/badge/Django-4.2-092E20?logo=django)
![DRF](https://img.shields.io/badge/DRF-3.14-9E1F63?logo=django)

## 🚀 Features

- **Modern UI/UX** with smooth animations using Framer Motion
- **Responsive Design** that works on all devices
- **User Authentication** with JWT (JSON Web Tokens)
- **Product Catalog** with categories and search functionality
- **Shopping Cart** with persistent storage
- **Checkout Process** with order management
- **Admin Dashboard** for product and order management
- **Google OAuth** integration
- **Real-time Updates** for cart and order status

## 🛠 Tech Stack

### Frontend
- ⚛️ React 18
- 🚀 Vite (Build tool)
- 🎨 Tailwind CSS for styling
- 🔄 React Router for navigation
- 📱 Responsive design with mobile-first approach
- 🎭 Framer Motion for animations
- 🔐 JWT Authentication
- 📊 Recharts for data visualization

### Backend
- 🐍 Python 3.10+
- 🎯 Django 4.2
- 🔄 Django REST Framework (DRF) 3.14
- 🗄️ PostgreSQL (Database)
- 🔑 JWT Authentication
- 🔄 CORS Headers
- 📦 Django REST Framework Simple JWT

## 📦 Installation

### Prerequisites

- Node.js 18+ (LTS recommended)
- Python 3.10+
- PostgreSQL 13+
- npm or yarn

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/souled-store.git
   cd souled-store
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables in `.env`:
   ```env
   DEBUG=True
   SECRET_KEY=your-secret-key
   DATABASE_URL=postgresql://user:password@localhost:5432/souled_store
   CORS_ALLOWED_ORIGINS=http://localhost:5173
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

7. Start the development server:
   ```bash
   python manage.py runserver
   ```

## 🏗 Project Structure

```
souled-store/
├── src/                    # Frontend source code
│   ├── assets/            # Static assets (images, fonts, etc.)
│   ├── components/        # Reusable UI components
│   ├── context/           # React context providers
│   ├── pages/             # Page components
│   ├── routes/            # Application routes
│   └── utils/             # Utility functions
├── backend/               # Django backend
│   ├── config/            # Django project settings
│   ├── products/          # Products app
│   ├── users/             # Users app
│   ├── orders/            # Orders app
│   └── manage.py
├── public/                # Public assets
└── package.json           # Frontend dependencies
```

## 🧪 Running Tests

### Frontend Tests
```bash
npm test
# or
yarn test
```

### Backend Tests
```bash
cd backend
python manage.py test
```

## 🚀 Deployment

### Frontend
Build the production version:
```bash
npm run build
# or
yarn build
```

### Backend
For production deployment, consider using:
- Gunicorn or uWSGI as the application server
- Nginx as a reverse proxy
- PostgreSQL as the production database
- Environment variables for sensitive configuration

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Framer Motion](https://www.framer.com/motion/)
- [Django REST Framework](https://www.django-rest-framework.org/)

---

Made with ❤️ by JITHIN
