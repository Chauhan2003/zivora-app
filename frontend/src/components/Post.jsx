import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Like from "./Like";
import Comment from "./Comment";
import Save from "./Save";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const getDateDisplay = (date) => {
  const postDate = moment(date);
  const diffInMinutes = moment().diff(postDate, "minutes");
  const diffInHours = moment().diff(postDate, "hours");
  const diffInDays = moment().diff(postDate, "days");

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  if (diffInHours < 24) return `${diffInHours} hr ago`;
  if (diffInDays < 5) return `${diffInDays} day ago`;
  return postDate.format("MMM D, YYYY");
};

const Post = ({ post }) => {
  const [showFullCaption, setShowFullCaption] = useState(false);
  const caption = post?.caption || null;
  const profileImage = post?.user?.avatar || "/profileImage.jpg";
  const username = post?.user?.username || "Unknown User";

  return (
    <div key={post._id} className="w-full max-w-md px-4 md:px-0 flex flex-col gap-2 pb-4">
      <div className="flex items-center gap-2">
        <img
          src={profileImage}
          alt="profile image"
          className="w-9 h-9 rounded-full"
        />
        <div className="flex flex-col justify-center">
          <Link to="/" className="text-sm font-medium">
            {username}
          </Link>
          <span className="text-xs text-gray-600">
            {getDateDisplay(post?.createdAt)}
          </span>
        </div>
        <EllipsisVertical size={20} className="ml-auto cursor-pointer" />
      </div>

      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="rounded-md overflow-hidden flex justify-center border">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {post.mediaUrls.map((src, index) => (
                <CarouselItem key={index}>
                  <div className="w-full h-[450px] flex items-center justify-center">
                    <img
                      src={src}
                      alt={`Post image ${index}`}
                      className="object-contain w-full h-full rounded-md"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}

      {caption != null && (
        <p className="text-sm">
          {showFullCaption ? caption : `${caption.slice(0, 110)}`}
          {caption.length > 110 && (
            <button
              className="text-[#4150F7] ml-1"
              onClick={() => setShowFullCaption(!showFullCaption)}
            >
              {showFullCaption ? "show less" : "more"}
            </button>
          )}
        </p>
      )}

      <ul className="flex items-center gap-4 mt-2">
        <li>
          <Like post={post} />
        </li>
        <li>
          <Comment post={post} />
        </li>
        <li className="ml-auto">
          <Save post={post} />
        </li>
      </ul>
    </div>
  );
};

export default Post;
