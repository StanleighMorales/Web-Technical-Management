import { useQuery } from '@tanstack/react-query';
import { useBorrowedItemsQuery } from '../query/get/useBorrwedItemsQuery';
import type { THistoryBorrwedItems } from '../types/types';

/**
 * Custom hook to get the count of pending and reserved items
 * Returns the total count that needs admin attention
 */
export const usePendingCount = () => {
    const { data } = useQuery(useBorrowedItemsQuery());

    const counts = {
        pending: 0,
        reserved: 0,
        total: 0,
    };

    if (data) {
        const items = data as THistoryBorrwedItems[];
        counts.pending = items.filter((item) => item.status === 'Pending').length;
        counts.reserved = items.filter((item) => item.status === 'Reserved').length;
        counts.total = counts.pending + counts.reserved;
    }

    return counts;
};
