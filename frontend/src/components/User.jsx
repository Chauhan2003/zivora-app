import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const User = ({ user }) => {
  return (
    <Link
      to={`/profile/${user?.username}`}
      className="w-full flex items-center justify-between hover:bg-muted dark:hover:bg-muted-foreground/20 p-2 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-2">
        <img
          src={user?.profile?.avatar || "/profileImage.jpg"}
          className="w-10 h-10 rounded-full object-cover"
          alt="profile image"
        />
        <div>
          <h1 className="font-semibold text-sm">{user?.username}</h1>
          <h3 className="text-gray-600 dark:text-gray-400 text-sm uppercase">{user?.profile?.fullName || user?.fullName}</h3>
        </div>
      </div>
      <div>
        <ChevronRight />
      </div>
    </Link>
  );
};

export default User;
