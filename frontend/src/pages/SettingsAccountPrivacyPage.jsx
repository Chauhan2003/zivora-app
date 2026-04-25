import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import apiClient from "../utils/apiClient";
import { userRoute } from "../utils/routes";
import { SERVER_ERROR } from "../constants";

const SettingsAccountPrivacyPage = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get(
          `${userRoute}/profile/${currentUser?.username}`
        );
        if (res?.status === 200) {
          const visibility = res.data?.data?.profile?.visibility;
          setIsPrivate(visibility === "PRIVATE");
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

  const handleTogglePrivacy = async () => {
    const newVisibility = isPrivate ? "PUBLIC" : "PRIVATE";
    setSaving(true);

    try {
      const res = await apiClient.put(`${userRoute}/privacy`, {
        visibility: newVisibility,
      });

      if (res?.status === 200) {
        setIsPrivate(newVisibility === "PRIVATE");
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
        <h1 className="text-2xl font-bold mb-8">Account privacy</h1>

        <div className="border border-gray-200 dark:border-[#363636] rounded-2xl p-6 flex flex-col gap-8">
          {/* Private Account */}
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-base font-bold">Private account</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                When your account is public, your profile and posts can be seen
                by anyone, on or off Zivora, even if they don't have a Zivora
                account.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                When your account is private, only the followers you approve can
                see what you share, including your photos or videos on hashtag
                and location pages, and your followers and following lists.
              </p>
            </div>
            <button
              onClick={handleTogglePrivacy}
              disabled={saving}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${
                isPrivate ? "bg-blue-700" : "bg-gray-300 dark:bg-[#363636]"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                  isPrivate ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsAccountPrivacyPage;
