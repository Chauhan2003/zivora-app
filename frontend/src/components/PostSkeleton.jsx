const PostSkeleton = () => {
  return (
    <div className="w-md flex flex-col gap-2 pb-4">
      {/* Header skeleton */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
        <div className="flex flex-col justify-center flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse mb-1" />
          <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
        </div>
        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Image skeleton */}
      <div className="rounded-md overflow-hidden flex justify-center border">
        <div className="w-full h-[450px] bg-gray-200 animate-pulse" />
      </div>

      {/* Description skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>

      {/* Actions skeleton */}
      <ul className="flex items-center gap-4 mt-2">
        <li>
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
        </li>
        <li>
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
        </li>
        <li className="ml-auto">
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
        </li>
      </ul>
    </div>
  );
};

export default PostSkeleton;
