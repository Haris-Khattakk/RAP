import React, { useEffect } from "react";
import { PostCard } from "../components/index";
import { APIS } from "../../config/Config";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

const LIMIT = 10;
const fetchPosts = async ({ pageParam, currentUser}) => {
  // console.log(currentUser)
  const res = await APIS.getHomePosts({ page: pageParam, limit: LIMIT, currentUser });
  return {
    data: res.data.data,
    nextPage: pageParam + 1,
    hasMore: res.data.hasMore,
  };
};

function Home() {
  // get current active user
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"]);
  
  // paginated posts call
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["HomePosts", currentUser?.data?.id],
    queryFn: ({pageParam = 1})=> fetchPosts({pageParam, currentUser: currentUser?.data?.id}),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    enabled: !!currentUser,
  });

  // Infinite scroll
  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (
        scrollTop + clientHeight >= scrollHeight - 100 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="p-2  bg-gray-600 ">
      {posts?.pages?.map((page, pageIndex) =>
        page?.data?.map((post, idx) => (
          <PostCard
            key={post._id + "-" + pageIndex + "-" + idx}
            post={post}
            currentUser={currentUser.data}
            // onPostUpdated={handlePostUpdated}
          />
        ))
      )}
    </div>
  );
}

export default Home;
