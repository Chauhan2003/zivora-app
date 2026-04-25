import { NavLink, useNavigate } from "react-router-dom";
import ADD_ICON from "../assets/addIcon.svg";
import HOME_ICON from "../assets/homeIcon.svg";
import NOTIFICATION_ICON from "../assets/notificationIcon.svg";
import SEARCH_ICON from "../assets/searchIcon.svg";
import MESSAGE_ICON from "../assets/messageIcon.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Info,
  LogOut,
  Menu,
  MessageCircleMore,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";
import CreatePostBox from "./CreatePostBox";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../context/userSlice";
import Cookies from "js-cookie";
import { useTheme } from "../context/themeContext.jsx";

const menuItems = [
  { label: "Home", icon: HOME_ICON, to: "/" },
  { label: "Search", icon: SEARCH_ICON, to: "/search" },
  { label: "Messages", icon: MESSAGE_ICON, to: "/" },
  { label: "Notifications", icon: NOTIFICATION_ICON, to: "/notifications" },
];

const LeftSidebar = ({ collapsed = false }) => {
  const [toggleCreatePost, setToggleCreatePost] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const { theme, toggleTheme } = useTheme();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileImage = currentUser?.avatar || "/profileImage.jpg";

  const isCollapsed = collapsed && !hovered && !dropdownOpen;
  const isExpanded = !isCollapsed;
  const itemClass =
    "w-full flex items-center px-3 py-2.5 rounded-md transition-colors hover:bg-muted dark:hover:bg-muted-foreground/20";

  const handleLogout = () => {
    Cookies.set("zivora_access_token");

    dispatch(logout());
    navigate("/accounts/login");
  };

  return (
    <>
      <div
        className="relative w-[72px] h-screen shrink-0"
        onMouseEnter={() => collapsed && setHovered(true)}
        onMouseLeave={() => collapsed && setHovered(false)}
      >
        <div
          className={`absolute left-0 top-0 z-30 border-r bg-background py-8 px-2 flex flex-col items-center h-screen transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? "w-[220px]" : "w-[72px]"
          }`}
        >
          <div className="w-full flex items-center gap-2 pl-1 mb-8">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Zivora Logo" className="w-10 h-10" />
            </div>
            <h2
              className={`text-3xl font-bold shadows-into-light-regular whitespace-nowrap transition-all duration-300 ${
                isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
              }`}
            >
              Zivora
            </h2>
          </div>

          <div className="w-full flex flex-col items-center gap-2">
            {menuItems.map(({ label, icon, to }) => (
              <NavLink
                key={label}
                to={to}
                title={isCollapsed ? label : ""}
                className={itemClass}
              >
                <span className="w-10 h-6 flex items-center justify-center shrink-0">
                  <img
                    src={icon}
                    alt={`${label} icon`}
                    className="w-6 h-6 dark:invert"
                  />
                </span>
                <span
                  className={`text-lg whitespace-nowrap transition-all duration-300 ${
                    isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
                  }`}
                >
                  {label}
                </span>
              </NavLink>
            ))}

            <button
              className={`${itemClass} text-lg cursor-pointer`}
              onClick={() => setToggleCreatePost(true)}
              title={isCollapsed ? "Create" : ""}
            >
              <span className="w-10 h-6 flex items-center justify-center shrink-0">
                <img
                  src={ADD_ICON}
                  alt="Add icon"
                  className="w-6 h-6 dark:invert"
                />
              </span>
              <span
                className={`whitespace-nowrap transition-all duration-300 ${
                  isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
                }`}
              >
                Create
              </span>
            </button>

            <NavLink
              to={`/profile/${currentUser?.username}`}
              title={isCollapsed ? "Profile" : ""}
              className={`${itemClass} text-lg`}
            >
              <span className="w-10 h-7 flex items-center justify-center shrink-0">
                <img
                  src={profileImage}
                  alt="profile image"
                  className="w-7 h-7 rounded-full"
                />
              </span>
              <span
                className={`whitespace-nowrap transition-all duration-300 ${
                  isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
                }`}
              >
                Profile
              </span>
            </NavLink>
          </div>

          <DropdownMenu onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className={`${itemClass} text-lg mt-auto cursor-pointer hover:bg-muted dark:hover:bg-muted-foreground/30 focus:outline-none focus:ring-0`}
                title={isCollapsed ? "More" : ""}
              >
                <span className="w-10 h-6 flex items-center justify-center shrink-0">
                  <Menu className="w-6 h-6" />
                </span>
                <span
                  className={`whitespace-nowrap transition-all duration-300 ${
                    isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
                  }`}
                >
                  More
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 text-md">
              <DropdownMenuItem onClick={toggleTheme}>
                {theme === "light" ? <Moon /> : <Sun />}
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings/edit")}>
                <Settings />
                Setting
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Info />
                Info
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageCircleMore />
                Contact Us
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleLogout()}>
                <LogOut />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {toggleCreatePost && (
        <CreatePostBox onClose={() => setToggleCreatePost(false)} />
      )}
    </>
  );
};

export default LeftSidebar;
