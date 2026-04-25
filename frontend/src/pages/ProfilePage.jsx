import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { userRoute, postRoute } from "../utils/routes";
import apiClient from "../utils/apiClient";
import { Settings } from "lucide-react";
import { Loader2, Lock } from "lucide-react";
import { Heart } from "lucide-react";
import { useSelector } from "react-redux";
import { SERVER_ERROR } from "../constants";
import ProfileDataSkeleton from "../components/ProfileDataSkeleton";
import EditProfileImageBox from "../components/EditProfileImageBox";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);

  const [profileData, setProfileData] = useState(null);
  const [profilePosts, setProfilePosts] = useState([]);
  const [profileDataLoading, setProfileDataLoading] = useState(true);
  const [followStatus, setFollowStatus] = useState(null);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);
  const [selectedTab, setSelectedTab] = useState("posts");
  const [toggleEditProfileImage, setToggleEditProfileImage] = useState(false);
  const [updatedProfileImage, setUpdatedProfileImage] = useState("/profileImage.jpg");

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    if (profileData?.profile?.avatar) {
      setUpdatedProfileImage(profileData.profile.avatar);
    }
  }, [profileData]);

  const handleFollowUnfollow = async () => {
    if (!profileData || followStatus === null || isFollowLoading) return;
    setIsFollowLoading(true);

    try {
      let res;
      if (followStatus === 0) {
        res = await apiClient.post(`${userRoute}/follow-request`, {
          receiverId: profileData._id,
          type: "SEND",
        });
        if (res?.status === 200) setFollowStatus(1);
      } else if (followStatus === 2) {
        res = await apiClient.delete(`${userRoute}/unfollow/${profileData._id}`);
        if (res?.status === 200) setFollowStatus(0);
      }
    } catch (err) {
      console.error(err.response?.data?.message || SERVER_ERROR);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleCreateChatMessage = async () => {
    try {
      const res = await apiClient.post(`/api/v1/chats/create`, {
        receiverId: profileData?._id,
      });

      if (res?.status === 201 || res?.status === 200) {
        navigate("/message");
      }
    } catch (err) {
      console.error(err.response?.data?.message || SERVER_ERROR);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchProfileByUsername = async () => {
      setProfileDataLoading(true);
      try {
        const res = await apiClient.get(`${userRoute}/profile/${username}`);
        if (res?.status === 200 && isMounted) {
          setProfileData(res.data?.data);
          setFollowStatus(res.data?.data?.followStatus ?? 0);
        }
      } catch (err) {
        console.error(err.response?.data?.message || SERVER_ERROR);
      } finally {
        if (isMounted) setProfileDataLoading(false);
      }
    };
    fetchProfileByUsername();
    return () => {
      isMounted = false;
    };
  }, [username, location.key]);

  useEffect(() => {
    const fetchProfilePosts = async () => {
      if (!profileData || !currentUser) return;

      try {
        if (isOwnProfile || followStatus === 2) {
          const res = await apiClient.get(`${postRoute}/profile/${username}`);
          if (res?.status === 200) {
            setProfilePosts(res.data?.data);
          }
        }
      } catch (err) {
        console.error(err.response?.data?.message || SERVER_ERROR);
      }
    };

    fetchProfilePosts();
  }, [followStatus, username]);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (!profileData || !currentUser || selectedTab !== "saved") return;

      try {
        const res = await apiClient.get(
          `${userRoute}/${profileData?._id}/saved/post/list/all`
        );
        if (res?.status === 200) {
          setSavedPosts(res.data?.data);
        }
      } catch (err) {
        console.error(err.response?.data?.message || SERVER_ERROR);
      }
    };

    fetchSavedPosts();
  }, [selectedTab, username]);

  return (
    <div className="w-full h-full px-4 pt-10 pb-4 overflow-auto">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        {profileDataLoading ? (
          <ProfileDataSkeleton />
        ) : (
          <>
            <div className="flex justify-center w-full gap-16">
              <img
                src={updatedProfileImage || "/profileImage.jpg"}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover cursor-pointer"
                onClick={() => isOwnProfile && setToggleEditProfileImage(true)}
              />

              <div className="flex flex-col gap-4">
                <div className="flex items-center flex-wrap gap-4">
                  <span className="text-2xl font-semibold">
                    {profileData?.username || "Unknown"}
                  </span>
                  {isOwnProfile ? (
                    <>
                      <button
                        onClick={() => navigate("/settings/edit")}
                        className="w-28 h-[35px] text-base rounded-lg bg-[#292929] hover:bg-[#212121] font-bold text-white"
                      >
                        Edit Profile
                      </button>
                      <button className="cursor-pointer">
                        <Settings className="text-2xl" />
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        className="w-24 h-[35px] text-sm rounded-lg font-bold bg-blue-700 text-white flex items-center justify-center cursor-pointer"
                        onClick={handleFollowUnfollow}
                        disabled={isFollowLoading}
                      >
                        {isFollowLoading ? (
                          <Loader2 className="animate-spin" />
                        ) : followStatus === 1 ? (
                          "Requested"
                        ) : followStatus === 2 ? (
                          "Unfollow"
                        ) : (
                          "Follow"
                        )}
                      </button>

                      {/* Message button - requires backend chat route */}
                      {/* {followStatus === 2 && (
                        <button
                          className="w-24 h-[35px] text-base rounded-lg font-bold bg-[#212121] text-white flex items-center justify-center"
                          onClick={handleCreateChatMessage}
                        >
                          Message
                        </button>
                      )} */}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-lg">
                    <span className="font-semibold">
                      {profileData?.profile?.postCount || "0"}
                    </span>{" "}
                    posts
                  </div>
                  <div className="text-lg">
                    <span className="font-semibold">
                      {profileData?.profile?.followerCount || "0"}
                    </span>{" "}
                    followers
                  </div>
                  <div className="text-lg">
                    <span className="font-semibold">
                      {profileData?.profile?.followingCount || "0"}
                    </span>{" "}
                    following
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-bold uppercase text-base">
                    {profileData?.profile?.fullName || ""}
                  </span>
                  <p className="max-w-xs text-base break-words">
                    {profileData?.profile?.bio || ""}
                  </p>
                  {profileData?.profile?.website && (
                    <a
                      href={profileData.profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-sm"
                    >
                      {profileData.profile.website}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="w-full border border-[#1f1f1f] mb-3"></div>
              {(isOwnProfile || followStatus === 2) && (
                <div className="flex justify-center gap-10">
                  <div
                    className={`font-semibold text-base uppercase cursor-pointer ${
                      selectedTab === "posts" ? "text-blue-500" : ""
                    }`}
                    onClick={() => setSelectedTab("posts")}
                  >
                    Posts
                  </div>
                  <div
                    className={`font-semibold text-base uppercase cursor-pointer ${
                      selectedTab === "saved" ? "text-blue-500" : ""
                    }`}
                    onClick={() => setSelectedTab("saved")}
                  >
                    Saved
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {isOwnProfile || followStatus === 2 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(selectedTab === "posts" ? profilePosts : savedPosts).map(
              (post) => (
                <div
                  key={post._id}
                  className="relative w-full aspect-square group"
                >
                  <img
                    src={post?.mediaUrls?.[0] || "/placeholder.jpg"}
                    className="w-full h-full object-cover rounded-lg"
                    alt="post"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                    <Heart className="text-[20px] text-red-500 mr-2" />
                    {post?.likeCount || 0}
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          !profileDataLoading && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex justify-center items-center gap-4">
                <div className="p-3 rounded-full border border-white">
                  <Lock className="text-2xl" />
                </div>
                <div className="text-base font-semibold text-center">
                  <h2>This account is private</h2>
                  <h3>Follow to see their photos and videos.</h3>
                </div>
              </div>
              <button
                className="w-24 h-[35px] text-sm rounded-lg font-bold bg-blue-700 text-white flex items-center justify-center cursor-pointer"
                onClick={handleFollowUnfollow}
                disabled={isFollowLoading}
              >
                {isFollowLoading ? (
                  <Loader2 className="animate-spin text-xl" />
                ) : followStatus === 1 ? (
                  "Requested"
                ) : followStatus === 2 ? (
                  "Unfollow"
                ) : (
                  "Follow"
                )}
              </button>
            </div>
          )
        )}
      </div>

      {toggleEditProfileImage && (
        <EditProfileImageBox
          onClose={() => setToggleEditProfileImage(false)}
          currentImage={profileData?.profile?.avatar}
          onSave={(newImage) => {
            setUpdatedProfileImage(newImage);
            setToggleEditProfileImage(false);
          }}
        />
      )}
    </div>
  );
};

export default ProfilePage;
