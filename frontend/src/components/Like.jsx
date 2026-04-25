import { Heart } from "lucide-react";
import { useState } from "react";
import { postRoute } from "../utils/routes";
import apiClient from "../utils/apiClient";

const Like = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post?.isLiked || false);
  const [likeCount, setLikeCount] = useState(post?.likeCount || 0);

  const handleTogglePostLike = async () => {
    try {
      const res = await apiClient.put(`${postRoute}/${post._id}/like`);

      if (res?.status === 200) {
        setIsLiked(res?.data?.data?.isLiked);
        setLikeCount(res?.data?.data?.totalLikes);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div
      className="flex items-center gap-1 cursor-pointer"
      onClick={() => handleTogglePostLike()}
    >
      {" "}
      {isLiked ? <Heart className="fill-red-500 text-red-500" /> : <Heart />}
      <span className="text-sm">{likeCount}</span>
    </div>
  );
};

export default Like;
