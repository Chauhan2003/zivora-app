import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook for infinite scroll pagination
 * @param {Function} fetchFunction - Function to fetch data
 * @param {Object} options - Configuration options
 * @returns {Object} Infinite scroll state and functions
 */
export const useInfiniteScroll = (fetchFunction, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  const observer = useRef();
  const limit = options.limit || 10;

  /**
   * Load more data
   */
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction(page, limit);

      if (result && result.length > 0) {
        setData((prev) => [...prev, ...result]);
        setPage((prev) => prev + 1);

        // Check if there's more data
        if (result.length < limit) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more data:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, page, limit, loading, hasMore]);

  /**
   * Reset the infinite scroll state
   */
  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    setLoading(false);
  }, []);

  /**
   * Intersection observer callback
   */
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore],
  );

  /**
   * Initial load
   */
  useEffect(() => {
    loadMore();
  }, []);

  return {
    data,
    loading,
    hasMore,
    error,
    lastElementRef,
    reset,
    loadMore,
  };
};
