import { Outlet, useLocation } from "react-router-dom";
import LeftSidebar from "../../components/LeftSidebar";
import RightSidebar from "../../components/RightSidebar";
import SettingsSidebar from "../../components/SettingsSidebar";

const MainLayout = () => {
  const location = useLocation();

  const isSettingsPage = location.pathname.startsWith("/settings");
  const isFeedPage = location.pathname === "/";
  const isMessagePage = location.pathname.startsWith("/message");

  const showRightSidebar =
    location.pathname.startsWith("/profile") || isMessagePage;

  if (isSettingsPage) {
    return (
      <div className="w-full h-screen flex">
        <LeftSidebar collapsed />
        <SettingsSidebar />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex">
      <LeftSidebar collapsed />
      <div className={`flex-1 ${isMessagePage ? "overflow-hidden" : "overflow-y-auto"} ${isFeedPage ? "disableScrollbar" : ""}`}>
        <Outlet />
      </div>
      {!showRightSidebar && <RightSidebar />}
    </div>
  );
};

export default MainLayout;
