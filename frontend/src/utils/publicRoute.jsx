import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const { isCurrentUser } = useSelector((state) => state.user);

  // If user is authenticated, redirect to home
  if (isCurrentUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
