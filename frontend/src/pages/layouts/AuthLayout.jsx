import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center gap-1">
      <img src="/authImage.png" alt="auth_image" className="w-[420px]" />
      <Outlet />
    </div>
  );
};

export default AuthLayout;
