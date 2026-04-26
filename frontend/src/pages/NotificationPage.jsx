import { useState, useMemo } from "react";
import moment from "moment";
import NotificationBox from "../components/NotificationBox";
import useNotifications from "../hooks/useNotifications";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const groupNotificationsByTime = (notifications) => {
  const groups = { today: [], last7Days: [], lastMonth: [] };

  notifications.forEach((n) => {
    const diffDays = moment().diff(moment(n.createdAt), "days");
    if (diffDays < 1) groups.today.push(n);
    else if (diffDays < 7) groups.last7Days.push(n);
    else groups.lastMonth.push(n);
  });

  return groups;
};

const NotificationPage = () => {
  const {
    followRequestNotifications = [],
    normalNotifications = [],
    loading,
    refetchNotifications,
  } = useNotifications();

  const [showFollowRequests, setShowFollowRequests] = useState(false);

  // 🧠 Memoize grouped notifications to prevent unnecessary re-renders
  const grouped = useMemo(
    () => groupNotificationsByTime(normalNotifications),
    [normalNotifications]
  );

  const hasManyFollowRequests = followRequestNotifications.length > 2;
  const latestFollowRequests = followRequestNotifications
    .slice(0, 2)
    .map((n) => n.from);

  const renderSection = (title, items) => {
    if (!items.length) return null;
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-foreground">{title}</h2>
        <div className="flex flex-col gap-4">
          {items.map((notification, index) => (
            <NotificationBox
              key={notification._id || index}
              notification={notification}
              onUpdate={refetchNotifications}
            />
          ))}
        </div>
      </div>
    );
  };

  const FollowRequestsPreview = () => {
    if (!followRequestNotifications.length) return null;

    if (showFollowRequests || !hasManyFollowRequests) {
      return (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            Follow Requests
          </h2>
          <div className="flex flex-col gap-4">
            {followRequestNotifications.map((notification, index) => (
              <NotificationBox
                key={notification._id || index}
                notification={notification}
                onUpdate={refetchNotifications}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          Follow Requests
        </h2>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowFollowRequests(true)}
        >
          <div className="flex items-center -space-x-6">
            {latestFollowRequests.map((from, idx) => (
              <Avatar key={idx} className="border-2 border-background">
                <AvatarImage
                  src={from?.avatar || "/profileImage.jpg"}
                  alt={from?.username || "user"}
                />
              </Avatar>
            ))}
          </div>
          <div className="text-sm text-muted-foreground ml-3">
            <span className="font-semibold text-foreground">
              {latestFollowRequests[0]?.username}
            </span>
            {latestFollowRequests[1] && (
              <span className="font-semibold text-foreground">
                , {latestFollowRequests[1]?.username}
              </span>
            )}
            {" and "}
            {followRequestNotifications.length - 2} others requested to follow
            you.
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-muted-foreground">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col py-6 gap-4 items-center overflow-auto disableScrollbar px-4 md:px-0">
      <div className="w-full max-w-md">
        <FollowRequestsPreview />

        {/* Notification Sections */}
        {followRequestNotifications.length > 0 && grouped.today.length > 0 && (
          <Separator className="my-4" />
        )}

        {renderSection("Today", grouped.today)}
        {grouped.last7Days.length > 0 && grouped.today.length > 0 && (
          <Separator className="my-4" />
        )}
        {renderSection("Last 7 Days", grouped.last7Days)}
        {grouped.lastMonth.length > 0 && grouped.last7Days.length > 0 && (
          <Separator className="my-4" />
        )}
        {renderSection("Last Month", grouped.lastMonth)}
      </div>
    </div>
  );
};

export default NotificationPage;
