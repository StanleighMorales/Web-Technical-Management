import { useQuery } from "@tanstack/react-query";
import { useRecentlyBorrowItems } from "./itemHooks";
import type { THistoryBorrwedItems } from "../@types/types";

/**
 * Returns counts for the sidebar badge and tab indicators.
 *
 * - pending:  items with status "Pending"  → need admin Approve/Deny
 * - approved: items with status "Approved" → awaiting pickup (shown in Reservations tab)
 * - total:    pending + approved           → drives the sidebar badge
 */
export const usePendingCount = () => {
    const { data } = useQuery(useRecentlyBorrowItems());

    const counts = {
        pending: 0,
        approved: 0,
        total: 0,
    };

    if (data) {
        const items = data as THistoryBorrwedItems[];
        counts.pending  = items.filter((item) => item.status === "Pending").length;
        counts.approved = items.filter((item) => item.status === "Approved").length;
        counts.total    = counts.pending + counts.approved;
    }

    return counts;
};
