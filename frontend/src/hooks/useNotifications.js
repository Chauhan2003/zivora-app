import { useState, useEffect, useCallback } from "react";
import apiClient from "../utils/apiClient";
import { notificationRoute } from "../utils/routes";

const useNotifications = () => {
  const [followRequestNotifications, setFollowRequestNotifications] = useState(
    []
  );
  const [normalNotifications, setNormalNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(notificationRoute);

      if (res?.status === 200 && Array.isArray(res.data?.data)) {
        const followReq = [];
        const normal = [];

        res.data.data.forEach((notification) => {
          if (notification.type === "FOLLOW_REQUEST")
            followReq.push(notification);
          else normal.push(notification);
        });

        setFollowRequestNotifications(followReq);
        setNormalNotifications(normal);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    followRequestNotifications,
    normalNotifications,
    loading,
    refetchNotifications: fetchNotifications,
  };
};

export default useNotifications;
