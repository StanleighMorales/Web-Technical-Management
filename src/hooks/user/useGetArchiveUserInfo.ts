import { queryOptions } from "@tanstack/react-query";
import { getArchiveUserInfo } from "../../api/user_api";

export const useGetArchiveUserInfo = (id: string) => {
  return queryOptions({
    queryFn: () => getArchiveUserInfo(id),
    queryKey: ["ArchiveUsers", id],
  });
};
