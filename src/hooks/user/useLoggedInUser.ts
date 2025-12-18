import { queryOptions } from "@tanstack/react-query";
import { userLoggedIn } from "../../api/user_api";

export const useLoggedInUser = () => {
  return queryOptions({
    queryFn: userLoggedIn,
    queryKey: ["me"],
  });
};
