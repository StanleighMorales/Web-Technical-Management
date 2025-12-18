import { queryOptions } from "@tanstack/react-query";
import { allUsersArchiveApi } from "../../api/user_api";

export const useAllUsersArchive = () => {
  return queryOptions({
    queryFn: allUsersArchiveApi,
    queryKey: ["archiveusers"],
  });
};
