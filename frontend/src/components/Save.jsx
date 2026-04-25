import { Bookmark } from "lucide-react";
import { useState } from "react";

const Save = ({ post }) => {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        setIsSaved(!isSaved);
      }}
    >
      {isSaved ? <Bookmark className="fill-black text-black" /> : <Bookmark />}
    </div>
  );
};

export default Save;
