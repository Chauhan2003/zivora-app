import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center gap-1 px-4">
      <img src="/authImage.png" alt="auth_image" className="w-[420px] hidden lg:block" />
      <Outlet />
    </div>
  );
};

export default AuthLayout;
