import { useQuery } from "@tanstack/react-query";
import { useRecentlyBorrowItems } from "./itemHooks";
import type { THistoryBorrwedItems } from "../@types/types";

export const useActiveBorrowCount = () => {
    const { data } = useQuery(useRecentlyBorrowItems());

    if (!data) return 0;

    const items = data as THistoryBorrwedItems[];
    return items.filter((item) => item.status === "Borrowed").length;
};
