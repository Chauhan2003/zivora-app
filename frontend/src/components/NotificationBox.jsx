import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import apiClient from "../utils/apiClient";
import { userRoute } from "../utils/routes";
import { useEffect, useState } from "react";

const getDateDisplay = (date) => {
  const postDate = moment(date);
  const currentDate = moment();
  const diffInMinutes = currentDate.diff(postDate, "minutes");
  const diffInHours = currentDate.diff(postDate, "hours");
  const diffInDays = currentDate.diff(postDate, "days");
  if (diffInMinutes < 1) return "Now";
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInDays < 5) return `${diffInDays}d`;
  return postDate.format("MMM D");
};

const NotificationBox = ({ notification, onUpdate }) => {
  const [notificationStatus, setNotificationStatus] = useState(
    notification?.type
  );

  const navigate = useNavigate();

  useEffect(() => {
    setNotificationStatus(notification?.type);
  }, [notification]);

  const actionText = {
    LIKE: "liked your post.",
    LIKE_POST: "liked your post.",
    FOLLOW: "started following you.",
    COMMENT: `commented: `,
    FOLLOW_REQUEST: "requested to follow you.",
  };

  const handleAcceptFollowRequest = async () => {
    try {
      const res = await apiClient.put(
        `${userRoute}/update/follow-request/${notification._id}/accepted`
      );
      if (res?.status === 200) {
        setNotificationStatus("FOLLOW");
        onUpdate && onUpdate();
        // Reload the page to refresh profile data
        window.location.reload();
      }
    } catch (error) {
      console.error("Error accepting follow request:", error);
    }
  };

  const handleDeclineFollowRequest = async () => {
    try {
      const res = await apiClient.put(
        `${userRoute}/update/follow-request/${notification._id}/declined`
      );
      if (res?.status === 200) {
        onUpdate && onUpdate();
      }
    } catch (error) {
      console.error("Error declining follow request:", error);
    }
  };

  const handleNavigateToProfile = () => {
    navigate(`/profile/${notification?.from?.username}`);
  };

  return (
    <div className="w-full flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <img
          src={notification?.from?.avatar || "/profileImage.jpg"}
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
          alt="profile image"
          onClick={() => handleNavigateToProfile()}
        />
        <div className="flex flex-col leading-tight">
          <div className="text-sm text-foreground">
            <span
              className="font-semibold cursor-pointer"
              onClick={() => handleNavigateToProfile()}
            >
              {notification?.from?.username}
            </span>{" "}
            <span>{actionText[notificationStatus]}</span>{" "}
            {notification?.type === "COMMENT" && (
              <span className="italic">{notification?.comment.text}</span>
            )}{" "}
            <span className="text-xs text-muted-foreground">
              {getDateDisplay(notification?.updatedAt)}
            </span>{" "}
            {notificationStatus === "FOLLOW_REQUEST" && (
              <>
                <button
                  type="button"
                  className="text-blue-500 cursor-pointer mx-2"
                  onClick={handleDeclineFollowRequest}
                >
                  Decline
                </button>
                <button
                  type="button"
                  className="text-blue-500 cursor-pointer"
                  onClick={handleAcceptFollowRequest}
                >
                  Accept
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {notification?.post && (
        <img
          src={notification?.post?.mediaUrls?.[0]}
          className="w-10 h-10 rounded-sm object-cover"
          alt="post image"
        />
      )}
    </div>
  );
};

export default NotificationBox;
