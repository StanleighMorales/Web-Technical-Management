import { queryOptions } from "@tanstack/react-query";
import { getArchiveItemInfo } from "../../api/item_api";

export const useGetArchiveItemInfo = (id: string) => {
  return queryOptions({
    queryFn: () => getArchiveItemInfo(id),
    queryKey: ["archiveitems", id],
  });
};
