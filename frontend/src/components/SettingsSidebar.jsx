import { NavLink } from "react-router-dom";
import { UserPen, Search, Lock } from "lucide-react";
import { useState } from "react";

const settingsMenuItems = [
  { label: "Edit profile", to: "/settings/edit", icon: UserPen },
  { label: "Account privacy", to: "/settings/privacy", icon: Lock },
];

const SettingsSidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="border-r h-screen flex-col py-8 px-4 w-[280px] shrink-0 hidden md:flex">
      <h2 className="text-2xl font-bold mb-6 px-2">Settings</h2>

      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-100 dark:bg-[#262626] rounded-lg pl-9 pr-3 py-2 text-sm outline-none text-foreground placeholder:text-gray-500 focus:ring-1 focus:ring-gray-500 transition-all"
        />
      </div>

      {/* Menu Items */}
      <div className="flex flex-col gap-1">
        {settingsMenuItems
          .filter((item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(({ label, to, icon: Icon }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-gray-100 dark:bg-[#262626]"
                    : "hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
                }`
              }
            >
              <Icon size={20} />
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
      </div>
    </div>
  );
};

export default SettingsSidebar;
