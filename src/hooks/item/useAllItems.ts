import { queryOptions } from "@tanstack/react-query";
import { allItemsApi } from "../../api/item_api";

export const useAllItems = () => {
  return queryOptions({
    queryFn: allItemsApi,
    queryKey: ["items"],
  });
};
