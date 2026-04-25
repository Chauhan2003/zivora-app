import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { postRoute, userRoute } from "../utils/routes";
import { useSelector } from "react-redux";

const useUserProfile = ({ username }) => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser && currentUser.username === username) {
      setIsOwnProfile(true);
    } else {
      setIsOwnProfile(false);
    }
  }, [currentUser, username]);

  useEffect(() => {
    if (!username) {
      setProfile(null);
      setPosts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchData = async () => {
      try {
        const [profileRes, postsRes] = await Promise.allSettled([
          apiClient.get(`${userRoute}/profile/${username}`),
          apiClient.get(`${postRoute}/profile/${username}`),
        ]);

        if (
          profileRes.status === "fulfilled" &&
          profileRes.value.status === 200
        ) {
          setProfile(profileRes.value.data.data);
        } else {
          setProfile(null);
        }

        if (postsRes.status === "fulfilled" && postsRes.value.status === 200) {
          setPosts(postsRes.value.data.data);
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setProfile(null);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  return { profile, posts, isOwnProfile, loading };
};

export default useUserProfile;
