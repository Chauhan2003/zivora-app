import { useDispatch, useSelector } from "react-redux";
import SuggestedUser from "./SuggestedUser";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { logout } from "../context/userSlice";
import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import { userRoute } from "../utils/routes";

const RightSidebar = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileImage = currentUser?.avatar || "/profileImage.jpg";

  const fetchSuggestedUsers = async () => {
    try {
      const res = await apiClient.post(`${userRoute}/suggested-users`);

      if (res?.status === 200) {
        setSuggestedUsers(res?.data?.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSuggestedUsers();
  }, []);

  const handleLogout = () => {
    Cookies.set("zivora_access_token");
    dispatch(logout());
    navigate("/accounts/login");
  };

  return (
    <div className="p-4 flex-col items-center h-screen w-[320px] shrink-0 hidden lg:flex">
      <div className="flex items-center w-full gap-2 mb-6 bg-muted dark:bg-muted-foreground/20 p-3 rounded-lg">
        <img
          src={profileImage}
          className="w-10 h-10 rounded-full object-cover"
          alt="profile image"
        />
        <Link to={`/profile/${currentUser?.username}`}>
          <h1 className="font-semibold text-sm">{currentUser?.username}</h1>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm uppercase">
            {currentUser?.fullName}
          </h3>
        </Link>
        <button
          className="text-blue-600 dark:text-blue-400 text-sm ml-auto font-semibold cursor-pointer hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          onClick={() => handleLogout()}
        >
          Logout
        </button>
      </div>

      {suggestedUsers.length > 0 && (
        <SuggestedUser suggestedUsers={suggestedUsers} />
      )}
    </div>
  );
};

export default RightSidebar;
