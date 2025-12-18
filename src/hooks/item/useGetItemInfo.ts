import { queryOptions } from "@tanstack/react-query";
import { getItemApi } from "../../api/item_api";

export const useGetItemInfo = (id: string) => {
  return queryOptions({
    queryFn: () => getItemApi(id),
    queryKey: ["items"],
  });
};
