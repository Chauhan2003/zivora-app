import { MessageCircle } from "lucide-react";
import { useState } from "react";

const Comment = ({ post }) => {
  return (
    <div className="cursor-pointer">
      <MessageCircle size={22} />
    </div>
  );
};

export default Comment;
