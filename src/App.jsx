// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";

import ProtectedRoute from "./Routes/ProtectedRoute";
import PublicRoute from "./Routes/PublicRoute";
import AdminRoute from "./Routes/AdminRoute";

import Home from "./pages/Home";
import Products from "./pages/Products/Products";
import SingleProduct from "./pages/SingleProduct";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import OrderSuccess from "./pages/OrderSuccess";
import ProfileDetails from "./pages/ProfileDetails";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import Dashboard from "./admin/Dashboard";
import Users from "./admin/Users";
import AdminProducts from "./admin/Products";
import Reports from "./admin/Reports";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";
import AdminUserDetails from "./admin/AdminUserDetails";
import AdminOrderManagement from "./admin/AdminOrderManagement";

const AppContent = () => {
    const { user, loading } = useAuth();

    if (loading) return <Loader />;

    const showCustomerUI = !user?.is_staff;

    return (
        <>
            {showCustomerUI && <Navbar />}

            <main className="min-h-screen bg-gray-900 text-white">
                <Routes>
                    {/* Public always visible */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<SingleProduct />} />

                    {/* Not allowed if user logged in */}
                    <Route element={<PublicRoute />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    {/* Requires login */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/payment" element={<Payment />} />
                        <Route path="/payment-success" element={<PaymentSuccess />} />
                        <Route path="/order-success" element={<OrderSuccess />} />
                        <Route path="/profile" element={<ProfileDetails />} />
                    </Route>

                    {/* Admin only */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<Dashboard />} />
                        <Route path="/admin/dashboard" element={<Dashboard />} />
                        <Route path="/admin/users" element={<Users />} />
                        <Route path="/admin/users/:id" element={<AdminUserDetails />} />
                        <Route path="/admin/products" element={<AdminProducts />} />
                        <Route path="/admin/products/add" element={<AddProduct />} />
                        <Route path="/admin/products/edit/:id" element={<EditProduct />} />
                        <Route path="/admin/orders" element={<AdminOrderManagement />} />
                        <Route path="/admin/reports" element={<Reports />} />
                    </Route>
                </Routes>
            </main>

            {showCustomerUI && <Footer />}
        </>
    );
};

const App = () => (
    <Router>
        <AuthProvider>
            <CartProvider>
                <AppContent />
                <ToastContainer position="bottom-right" autoClose={1000} theme="colored" />
            </CartProvider>
        </AuthProvider>
    </Router>
);

export default App;
