import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { postRoute } from "../utils/routes";

const useFeedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedPosts = async () => {
      try {
        const res = await apiClient.get(postRoute);

        if (res?.status === 200) {
          setPosts(res?.data?.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedPosts();
  }, []);

  return { posts, loading };
};

export default useFeedPosts;
