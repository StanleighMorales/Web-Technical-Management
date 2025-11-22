import { useCallback, useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { DashboardSkeletonLoader } from "../loader/DashboardSkeletonLoader";
import DashboardBadges from "../components/DashboardBadges";
import ErrorTable from "../components/ErrorTables";
import type { TRecentBorrowItemProps } from "../types/types";
import Pagination from "../components/Pagination";
import { RecentBorrowedItemsTable } from "../components/RecentBorrowedItemsTable";
import { useSummaryDataQuery } from "../query/get/useSummaryDataQuery";
import { useBorrowedItemsQuery } from "../query/get/useBorrwedItemsQuery";
import { ViewRecentBorrowItems } from "../components/ViewRecentBorrowItems";

type Summary = {
    totalItems: number | null;
    totalActiveUsers: number | null;
    totalLentItems: number | null;
    totalItemsCategories: number | null;
};

export default function Dashboard() {
    const [dataSummary, setDataSummary] = useState<Summary>({
        totalItems: 0,
        totalActiveUsers: 0,
        totalLentItems: 0,
        totalItemsCategories: 0,
    });

    const [onViewBorrowItemOpen, setOnViewBorrowItemOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [borrowedItemData, setBorrowedItemData] = useState<TRecentBorrowItemProps[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { data: recentBorrowData, isLoading: isBorrowedItemLoading, isError: isBorrowedItemError } = useQuery(useBorrowedItemsQuery());
    const { data: summaryData } = useQuery(useSummaryDataQuery());

    const badges = [
        { name: "Total Items", data: dataSummary.totalItems, link: "/home/inventory-list" },
        { name: "Categories", data: dataSummary.totalItemsCategories, link: "/home/inventory-list" },
        { name: "Active Users", data: dataSummary.totalActiveUsers, link: "/home/user-management" },
        { name: "Total Borrowed", data: dataSummary.totalLentItems, link: "/home/history-list" },
    ];

    // Filter logic
    const filteredData = useMemo(
        () =>
            borrowedItemData.filter(
                (item) =>
                    item.item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.item.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [borrowedItemData, searchTerm]
    );

    // Pagination logic
    const paginatedData = useMemo(
        () =>
            filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
        [filteredData, currentPage]
    );

    const totalPages = useMemo(
        () => Math.ceil(filteredData.length / itemsPerPage),
        [filteredData]
    );

    const handlePageChange = useCallback((page: number) => setCurrentPage(page), []);

    const handleViewBorrowItemOpen = (id: string) => {
        setSelectedId(id);
        setOnViewBorrowItemOpen(true);
    };

    const handleViewBorrowItemClose = () => {
        setSelectedId(null);
        setOnViewBorrowItemOpen(false);
    };

    // Update summary data
    useEffect(() => {
        if (!summaryData) return;
        setDataSummary((prev) => ({
            ...prev,
            totalItems: summaryData.totalItems,
            totalActiveUsers: summaryData.totalActiveUsers,
            totalItemsCategories: summaryData.totalItemsCategories,
            totalLentItems: summaryData.totalLentItems,
        }));
    }, [summaryData]);

    // Update borrowed items
    useEffect(() => {
        if (!recentBorrowData) return;
        setBorrowedItemData(recentBorrowData);
    }, [recentBorrowData]);

    if (isBorrowedItemLoading) return <DashboardSkeletonLoader />;

    return (
        <div className="flex z-40 flex-col items-center py-10 px-2 w-full min-h-screen animate-fadeIn bg-linear-to-br from-[#f8fafc] via-[#e0e7ef] to-[#c7d2fe]">
            <div className="grid grid-cols-1 justify-items-center gap-8 mb-8 w-full max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
                {badges.map((item, index) => (
                    <DashboardBadges key={index} name={item.name} link={item.link} data={item.data} />
                ))}
            </div>

            <div className="p-8 w-full rounded-2xl border shadow-md bg-white/90 border-[#e0e7ef]">
                <div className="flex flex-col gap-4 mb-4 md:flex-row md:justify-between md:items-center">
                    <h1 className="-mt-10 text-2xl font-bold max-sm:-mt-1 text-[#1e293b]">
                        Recently Borrowed Items
                    </h1>
                    <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center">
                        {totalPages > 1 && (
                            <Pagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                handlePageChange={handlePageChange}
                            />
                        )}
                        <SearchBar
                            onChangeValue={(value) => setSearchTerm(value)}
                            name="search"
                            placeholder="Search items..."
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl shadow-inner h-[55vh] bg-white/95">
                    {isBorrowedItemError ? <ErrorTable /> : (
                        <table className="relative w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    {[
                                        "Serial Number",
                                        "Image",
                                        "Item",
                                        "Occupied By",
                                        "Teacher",
                                        "Room",
                                        "Remarks",
                                        "DateTime",
                                        "Status",
                                    ].map((header) => (
                                        <th
                                            key={header}
                                            className="sticky bg-white top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.filter((s) => s.status === "Borrowed").map((item) => (
                                    <tr
                                        key={item.item.serialNumber}
                                        className="transition-colors odd:bg-white even:bg-[#f8fafc] hover:bg-[#f1f5f9] cursor-pointer"
                                        onClick={() => handleViewBorrowItemOpen(item.id)}
                                    >
                                        <RecentBorrowedItemsTable
                                            id={item.id}
                                            image={item.item.image}
                                            itemName={item.item.itemName}
                                            serialNumber={item.item.serialNumber}
                                            borrowerFullName={item.borrowerFullName}
                                            room={item.room}
                                            teacherFullName={item.teacherFullName}
                                            remarks={item.remarks}
                                            createdAt={item.item.createdAt}
                                            status={item.status}
                                        />
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {onViewBorrowItemOpen && selectedId && (
                <ViewRecentBorrowItems
                    itemId={selectedId}
                    isOpen={onViewBorrowItemOpen}
                    onClose={handleViewBorrowItemClose}
                />
            )}
        </div>
    );
}
