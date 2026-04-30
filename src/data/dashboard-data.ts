import { useRecentlyBorrowItems } from './../hooks/itemHooks';
import { useQuery } from "@tanstack/react-query";
import { useSummaryData } from "../hooks/itemHooks";
import { useEffect, useState } from "react";
import type { TRecentBorrowItemProps, TSummary } from '../@types/types';

export const useSummarriesData = () => {

    const [dataSummary, setDataSummary] = useState<TSummary>({
        totalItems: 0,
        totalActiveUsers: 0,
        totalLentItems: 0,
        totalItemsCategories: 0,
    });

    const { data: summaryData } = useQuery(useSummaryData());

    // Update summary data
    useEffect(() => {
        if (!summaryData) return;
        setDataSummary((prev) => ({
            ...prev,
            totalItems: summaryData.data?.totalItems,
            totalActiveUsers: summaryData.data?.totalActiveUsers,
            totalItemsCategories: summaryData.data?.totalItemsCategories,
            totalLentItems: summaryData.data?.totalLentItems,
        }));
    }, [summaryData]);

    return { dataSummary }
}

export const useRecentlyAllBorrowItems = () => {

    const [borrowedItemData, setBorrowedItemData] = useState<
        TRecentBorrowItemProps[]
    >([]);

    const {
        data: recentBorrowData,
        isLoading: isBorrowedItemLoading,
        isError: isBorrowedItemError,
    } = useQuery(useRecentlyBorrowItems());

    // Update borrowed items
    useEffect(() => {
        if (!recentBorrowData) return;
        setBorrowedItemData(recentBorrowData);
    }, [recentBorrowData]);

    return { borrowedItemData, isBorrowedItemLoading, isBorrowedItemError }
}