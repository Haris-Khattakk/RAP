import { useMutation } from "@tanstack/react-query";
import { APIS } from "../../config/Config";

export const useFollowMutation = ({ followers }) => {
  return useMutation({
    mutationFn: async ({ follower, follow }) => {
      if (
        followers?.some((f) =>
          typeof f === "string" ? f === follower : f._id === follower
        )
      ) {
        return await APIS.unfollowUser(follower, follow);
      } else {
        return await APIS.followUser(follower, follow);
      }
    },
  });
};
