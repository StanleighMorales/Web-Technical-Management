import { queryOptions } from "@tanstack/react-query";
import { allUsersApi } from "../../api/user_api";

export const useAllUsers = () => {
  return queryOptions({
    queryFn: allUsersApi,
    queryKey: ["users"],
  });
};
