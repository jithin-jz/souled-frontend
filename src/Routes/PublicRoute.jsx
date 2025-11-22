import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const PublicRoute = () => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return <Loader />;
    }

    if (user) {
        return <Navigate to={isAdmin ? "/admin/dashboard" : "/"} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
