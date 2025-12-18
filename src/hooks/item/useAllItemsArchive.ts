import { queryOptions } from "@tanstack/react-query";
import { allItemsArchiveApi } from "../../api/item_api";

export const useAllItemsArchive = () => {
  return queryOptions({
    queryFn: allItemsArchiveApi,
    queryKey: ["archiveitems"],
  });
};
