import { useState, useMemo } from "react";
import type { THistoryBorrwedItems } from "../types/types";
import { FormattedDateTime } from "./FormattedDateTime";
import { SlugStatus } from "./SlugStatus";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";

type PendingItemsTableProps = {
    items: THistoryBorrwedItems[];
    onApprove: (item: THistoryBorrwedItems) => void;
    onDeny: (item: THistoryBorrwedItems) => void;
    onRowClick: (itemId: string) => void;
    searchValue: string;
    onSearchChange: (value: string) => void;
};

const ITEMS_PER_PAGE = 10;

export default function PendingItemsTable({ items, onApprove, onDeny, onRowClick, onSearchChange }: PendingItemsTableProps) {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedItems = useMemo(() => items.slice(startIndex, endIndex), [items, startIndex, endIndex]);

    // Reset to page 1 when items change (e.g., after search)
    useMemo(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [items.length, currentPage, totalPages]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Search Bar and Pagination Container */}
            <div className="flex justify-end mb-6">
                <div className="flex items-center gap-4">
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        handlePageChange={handlePageChange}
                    />
                    <SearchBar
                        onChangeValue={onSearchChange}
                        name="Search Pending"
                        placeholder="Search by borrower or item"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl shadow-lg h-[50vh] md:h-[60vh] bg-white/95">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            {[
                                "Serial Number",
                                "Image",
                                "Item",
                                "Borrower",
                                "Teacher",
                                "Room",
                                "Remarks",
                                "Request Date",
                                "Status",
                                "Action",
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
                        {paginatedItems.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="py-8 text-center text-gray-500">
                                    No items found.
                                </td>
                            </tr>
                        ) : (
                            paginatedItems.filter((s) => s.status === "Pending").map((item) => (
                                <tr
                                    key={item.id}
                                    onClick={() => onRowClick(item.id)}
                                    className="hover:bg-[#f1f5f9] transition-colors odd:bg-white even:bg-[#f8fafc] cursor-pointer"
                                >
                                    <td className="py-3 px-4">{item.item.serialNumber}</td>
                                    <td className="py-4 px-6">
                                        <img
                                            src={typeof item.item.image === "string" ? item.item.image : "-"}
                                            alt={item.borrowerFullName}
                                            className="object-cover w-10 h-10 rounded-xl"
                                            onError={(e) => (e.currentTarget.style.display = "none")}
                                        />
                                    </td>
                                    <td className="py-4 px-6">{item.item.itemName}</td>
                                    <td className="py-4 px-6">{item.borrowerFullName}</td>
                                    <td className="py-4 px-6">{item.teacherFullName || "-"}</td>
                                    <td className="py-4 px-6">{item.room || "-"}</td>
                                    <td className="py-4 px-6">{item.remarks || "-"}</td>
                                    <td className="py-4 px-6">{FormattedDateTime(item.item.createdAt)}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-sm ${SlugStatus((item.status))}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onApprove(item);
                                                }}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeny(item);
                                                }}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                                            >
                                                Deny
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <p className="mt-6 text-sm text-center text-[#64748b]">
                <span className="font-semibold">Note:</span> Click on any row to view full details including borrower information. Click 'Approve' to confirm and process pending borrow requests.
            </p>
        </div>
    );
}
