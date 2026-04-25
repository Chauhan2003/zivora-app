import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { userRoute } from "../utils/routes";

const useSearchUsers = ({ query }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setUsers([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const res = await apiClient.get(`${userRoute}/search?q=${query}`);
        if (res?.status === 200) setUsers(res?.data?.data || []);
      } catch (err) {
        console.error(err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return { users, loading };
};

export default useSearchUsers;
