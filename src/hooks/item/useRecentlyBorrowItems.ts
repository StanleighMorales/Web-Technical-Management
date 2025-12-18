import { queryOptions } from "@tanstack/react-query";
import { recentlyBorrowItems } from "../../api/item_api";

export const useRecentlyBorrowItems = (id?: string) => {
  return queryOptions({
    queryFn: () => recentlyBorrowItems(id),
    queryKey: ["lentItems", id],
  });
};
