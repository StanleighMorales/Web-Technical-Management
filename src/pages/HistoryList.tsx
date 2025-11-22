import { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import { SelectHistoryStatus } from "../components/SelectHistoryStatus";
import HistoryListSkeletonLoader from "../loader/HistoryListSkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import { useBorrowedItemsQuery } from "../query/get/useBorrwedItemsQuery";
import type { THistoryBorrwedItems } from "../types/types";
import HistoryTable from "../components/HistoryTable";
import ErrorTable from "../components/ErrorTables";
import { SlugStatus } from "../components/SlugStatus";

export default function HistoryList({
    title = "Borrowing History",
    description = "This table lists item borrowing events, including the condition reported and the current status.",
}) {
    const [searchItem, setSearchItem] = useState("");
    const [borrowedItem, setBorrowedItem] = useState<THistoryBorrwedItems[]>([]);
    const [selectedStatus, setSelectedStatus] = useState("all");

    const { data, isPending, isError } = useQuery(useBorrowedItemsQuery());

    useEffect(() => {
        if (data) setBorrowedItem(data);
    }, [data]);

    const filteredItems = useMemo(() => {
        return borrowedItem.filter((item) => {
            const matchesSearch = item.borrowerFullName?.toLowerCase().includes(searchItem.toLowerCase());
            const matchesStatus = selectedStatus === "all" || SlugStatus(item.status) === selectedStatus;
            return matchesSearch && matchesStatus;
        });
    }, [borrowedItem, searchItem, selectedStatus]);

    if (isPending) return <HistoryListSkeletonLoader />;

    return (
        <div className="relative flex flex-col items-center py-10 px-2 w-full min-h-screen lg:h-full bg-gradient-to-br animate-fadeIn from-[#f8fafc] via-[#e0e7ef] to-[#c7d2fe]">
            <div className="w-full bg-white/90 rounded-2xl p-8 relative">
                {/* Title */}
                <div className="flex flex-col gap-4 mb-8 md:flex-row md:justify-between md:items-center">
                    <div>
                        <h1 className="text-[#1e293b] text-3xl md:text-5xl mb-2 font-extrabold tracking-tight drop-shadow-lg">{title}</h1>
                        <span className="text-lg font-medium text-[#64748b]">{description}</span>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-row gap-2 justify-end mb-6 flex-wrap">
                    <SelectHistoryStatus onChangeStatus={setSelectedStatus} />
                    <SearchBar onChangeValue={setSearchItem} name="Search History" placeholder="Search by Borrowed Item" />
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-2xl shadow-lg h-[50vh] md:h-[60vh] bg-white/95">
                    {isError ? (
                        <ErrorTable />
                    ) : (
                        <table className="w-full text-left border-collapse">
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
                                            className="sticky bg-white  top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <HistoryTable items={filteredItems} />
                            </tbody>
                        </table>
                    )}
                </div>

                <p className="mt-6 text-sm text-center text-[#64748b]">
                    <span className="font-semibold">Description:</span> Each row represents one history event. <em>Event Date</em> shows when it occurred. <em>Condition</em> is the item state reported at that time. <em>Status</em> reflects the latest known state for that borrow record.
                </p>
            </div>
        </div>
    );
}
