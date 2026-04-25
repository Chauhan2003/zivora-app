const ProfileDataSkeleton = () => {
  return (
    <div className="flex justify-center w-full gap-16 flex-wrap">
      {/* Profile Image Skeleton */}
      <div className="w-36 h-36 rounded-full bg-gray-200 animate-pulse" />

      {/* Profile Info Skeleton */}
      <div className="flex flex-col gap-4">
        {/* Username and Buttons Skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="w-28 h-[35px] bg-gray-200 rounded-lg animate-pulse" />
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        </div>

        {/* Stats Skeleton */}
        <div className="flex items-center gap-6">
          <div className="h-5 bg-gray-200 rounded w-20 animate-pulse" />
          <div className="h-5 bg-gray-200 rounded w-24 animate-pulse" />
          <div className="h-5 bg-gray-200 rounded w-24 animate-pulse" />
        </div>

        {/* Name and Bio Skeleton */}
        <div className="flex flex-col gap-1">
          <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ProfileDataSkeleton;
