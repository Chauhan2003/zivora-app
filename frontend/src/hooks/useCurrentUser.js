import { useEffect, useState } from "react";
import axios from "axios";
import { userRoute } from "../utils/routes";
import { useDispatch } from "react-redux";
import { login, logout } from "../context/userSlice";
import Cookies from "js-cookie";

const useCurrentUser = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("zivora_access_token");

    const fetchCurrentUser = async () => {
      try {
        if (!token) {
          dispatch(logout());
          setLoading(false);
          return;
        }

        const res = await axios.get(`${userRoute}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(login(res?.data?.data));
      } catch (err) {
        console.error(
          "Failed to fetch user:",
          err.response?.data || err.message
        );
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return loading;
};

export default useCurrentUser;
