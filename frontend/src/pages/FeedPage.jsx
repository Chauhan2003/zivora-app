import Post from "../components/Post";
import PostSkeleton from "../components/PostSkeleton";
import { useInfiniteScroll } from "../hooks";
import { postService } from "../services";

const FeedPage = () => {
  const { data: posts, loading, hasMore, lastElementRef } = useInfiniteScroll(
    postService.getFeedPosts,
    { limit: 10 }
  );

  return (
    <div className="flex flex-col gap-10 items-center py-8 overflow-y-auto disableScrollbar">
      {posts.map((post, index) => {
        if (index === posts.length - 1 && hasMore) {
          return (
            <div key={post._id} ref={lastElementRef}>
              <Post post={post} />
            </div>
          );
        }
        return <Post key={post._id} post={post} />;
      })}
      {loading && hasMore && (
        <>
          <PostSkeleton />
          <PostSkeleton />
        </>
      )}
    </div>
  );
};

export default FeedPage;
