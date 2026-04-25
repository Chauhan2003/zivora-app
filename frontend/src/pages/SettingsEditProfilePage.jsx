import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Pencil, ChevronDown, Check } from "lucide-react";
import apiClient from "../utils/apiClient";
import { userRoute } from "../utils/routes";
import { updateUser } from "../context/userSlice";
import { SERVER_ERROR } from "../constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SettingsEditProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("/profileImage.jpg");

  // Form fields
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get(
          `${userRoute}/profile/${currentUser?.username}`,
        );
        if (res?.status === 200) {
          const data = res.data?.data;
          setProfileData(data);
          setFullName(data?.profile?.fullName || "");
          setWebsite(data?.profile?.website || "");
          setBio(data?.profile?.bio || "");
          setGender(data?.profile?.gender || "");
          setImagePreview(data?.profile?.avatar || "/profileImage.jpg");
        }
      } catch (err) {
        console.error(err.response?.data?.message || SERVER_ERROR);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.username) {
      fetchProfile();
    }
  }, [currentUser]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Send everything in a single request
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("website", website);
      formData.append("bio", bio);
      formData.append("gender", gender);
      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      const res = await apiClient.put(`${userRoute}/profile`, formData);

      if (res?.status === 200) {
        const profileData = res.data?.data;
        dispatch(updateUser({
          fullName: profileData?.fullName || currentUser?.fullName,
          avatar: profileData?.avatar,
        }));
        navigate(`/profile/${currentUser?.username}`);
      }
    } catch (err) {
      console.error(err.response?.data?.message || SERVER_ERROR);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-400 border-t-blue-600 dark:border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-y-auto py-10 px-4 disableScrollbar">
      <div className="max-w-[600px] mx-auto">
        <h1 className="text-2xl font-bold mb-8">Edit profile</h1>

        {/* Profile Photo Section */}
        <div className="bg-gray-100 dark:bg-[#262626] rounded-2xl p-4 flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img
              src={imagePreview}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-sm">{currentUser?.username}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profileData?.profile?.fullName || ""}
              </p>
            </div>
          </div>
          <label
            htmlFor="edit-profile-image"
            className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors"
          >
            Change photo
          </label>
          <input
            id="edit-profile-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Website */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-bold">Website</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Website"
              className="w-full bg-transparent border border-gray-300 dark:border-[#363636] rounded-xl px-4 py-3 text-sm outline-none text-foreground focus:border-gray-400 transition-colors placeholder:text-gray-500"
            />
            <p className="text-xs text-gray-500">
              Editing your links is only available on mobile. Visit the
              Instagram app and edit your profile to change the websites in your
              bio.
            </p>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-bold">Bio</label>
            <div className="relative">
              <textarea
                value={bio}
                onChange={(e) => {
                  if (e.target.value.length <= 150) {
                    setBio(e.target.value);
                  }
                }}
                placeholder="Bio"
                rows={3}
                className="w-full bg-transparent border border-gray-300 dark:border-[#363636] rounded-xl px-4 py-3 text-sm outline-none text-foreground focus:border-gray-400 transition-colors resize-none placeholder:text-gray-500"
              />
              <span className="absolute bottom-3 right-3 text-xs text-gray-500">
                {bio.length} / 150
              </span>
            </div>
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-bold">Gender</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full bg-transparent border border-gray-300 dark:border-[#363636] rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors cursor-pointer flex items-center justify-between hover:border-gray-400">
                  <span className="text-foreground">
                    {gender === "MALE"
                      ? "Male"
                      : gender === "FEMALE"
                        ? "Female"
                        : gender === "OTHER"
                          ? "Other"
                          : "Prefer not to say"}
                  </span>
                  <ChevronDown size={18} className="text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full bg-white dark:bg-[#262626] border-gray-200 dark:border-[#363636] rounded-xl p-1">
                <DropdownMenuItem
                  onClick={() => setGender("")}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors text-foreground ${gender === "" ? "bg-gray-100 dark:bg-[#363636]" : "hover:bg-gray-100 dark:hover:bg-[#363636]"}`}
                >
                  <span className="text-sm">Prefer not to say</span>
                  {gender === "" && (
                    <Check size={16} className="text-blue-500" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setGender("MALE")}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors text-foreground ${gender === "MALE" ? "bg-gray-100 dark:bg-[#363636]" : "hover:bg-gray-100 dark:hover:bg-[#363636]"}`}
                >
                  <span className="text-sm">Male</span>
                  {gender === "MALE" && (
                    <Check size={16} className="text-blue-500" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setGender("FEMALE")}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors text-foreground ${gender === "FEMALE" ? "bg-gray-100 dark:bg-[#363636]" : "hover:bg-gray-100 dark:hover:bg-[#363636]"}`}
                >
                  <span className="text-sm">Female</span>
                  {gender === "FEMALE" && (
                    <Check size={16} className="text-blue-500" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setGender("OTHER")}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors text-foreground ${gender === "OTHER" ? "bg-gray-100 dark:bg-[#363636]" : "hover:bg-gray-100 dark:hover:bg-[#363636]"}`}
                >
                  <span className="text-sm">Other</span>
                  {gender === "OTHER" && (
                    <Check size={16} className="text-blue-500" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <p className="text-xs text-gray-500">
              This won't be part of your public profile.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsEditProfilePage;
