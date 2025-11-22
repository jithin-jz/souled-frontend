import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const PublicRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <Loader />;

    if (user) return <Navigate to="/" replace />;

    return <Outlet />;
};

export default PublicRoute;
