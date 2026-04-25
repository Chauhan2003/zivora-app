import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

const Protect = () => {
  const { isCurrentUser } = useSelector((state) => state.user);
  
  // If checking authentication, show loading instead of redirecting
  if (isCurrentUser === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return isCurrentUser ? <Outlet /> : <Navigate to="/accounts/login" replace />;
};

export default Protect;
