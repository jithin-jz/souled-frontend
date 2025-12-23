// src/App.jsx
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAuthStore from "./store/useAuthStore";
import { setLogoutCallback } from "./utils/api";

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
import ManageAddresses from "./pages/ManageAddresses";
import NotFound from "./pages/NotFound";

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
import AdminOrderDetails from "./admin/AdminOrderDetails";

const AppContent = () => {
    const { user, loading, loadUser, logout } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    // Reload cart/wishlist when user is authenticated
    useEffect(() => {
        if (user) {
            import("./store/useCartStore").then(({ default: useCartStore }) => {
                useCartStore.getState().loadCart();
                useCartStore.getState().loadWishlist();
            });
        }
    }, [user]);

    useEffect(() => {
        setLogoutCallback(() => {
            logout();
            navigate("/");
        });
    }, [logout, navigate]);

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
                        <Route path="/addresses" element={<ManageAddresses />} />
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
                        <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
                        <Route path="/admin/reports" element={<Reports />} />
                    </Route>

                    {/* 404 Catch-all */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>

            {showCustomerUI && <Footer />}
        </>
    );
};

const App = () => (
    <Router>
        <AppContent />
        <ToastContainer position="bottom-right" autoClose={1000} theme="colored" />
    </Router>
);

export default App;
