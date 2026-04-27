import { useState, useMemo } from "react";
import type { THistoryBorrwedItems } from "../@types/types";
import { FormattedDateTime } from "./FormattedDateTime";
import { SlugStatus } from "./SlugStatus";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import { FiEdit } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import { MdOutlineClose } from "react-icons/md";

type PendingItemsTableProps = {
    items: THistoryBorrwedItems[];
    onApprove: (item: THistoryBorrwedItems) => void;
    onDeny: (item: THistoryBorrwedItems) => void;
    onMarkBorrowed: (item: THistoryBorrwedItems) => void;
    onRowClick: (itemId: string) => void;
    searchValue: string;
    onSearchChange: (value: string) => void;
};

const ITEMS_PER_PAGE = 10;

export default function PendingItemsTable({
    items,
    onApprove,
    onDeny,
    onMarkBorrowed,
    onRowClick,
    onSearchChange,
}: PendingItemsTableProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedItems = useMemo(() => items.slice(startIndex, endIndex), [items, startIndex, endIndex]);

    useMemo(() => {
        if (currentPage > totalPages && totalPages > 0) setCurrentPage(1);
    }, [items.length, currentPage, totalPages]);

    return (
        <div>
            {/* Search Bar and Pagination */}
            <div className="flex justify-end mb-4">
                <div className="flex items-center gap-4">
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        handlePageChange={setCurrentPage}
                    />
                    <SearchBar
                        onChangeValue={onSearchChange}
                        name="Search Pending"
                        placeholder="Search by borrower or item"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto h-[50vh] md:h-[60vh] border border-gray-200 rounded-lg">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200">
                            {[
                                "Serial Number",
                                "Image",
                                "Item",
                                "Borrower",
                                "Teacher",
                                "Room",
                                "Remarks",
                                "Request Date",
                                "Reserved For",
                                "Status",
                                "Action",
                            ].map((header) => (
                                <th
                                    key={header}
                                    className="sticky bg-white top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b] border-b border-gray-200"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedItems.length === 0 ? (
                            <tr>
                                <td colSpan={11} className="py-8 text-center text-gray-500">
                                    No items found.
                                </td>
                            </tr>
                        ) : (
                            paginatedItems.map((item) => {
                                // "Approved" = reservation approved and awaiting pickup
                                const isApprovedReservation = item.status === "Approved";

                                // Highlight rows whose pickup time is approaching (within 1 hour)
                                const isPickupSoon =
                                    isApprovedReservation &&
                                    item.reservedFor != null &&
                                    (() => {
                                        const diff = new Date(item.reservedFor!).getTime() - Date.now();
                                        return diff > 0 && diff <= 60 * 60 * 1000;
                                    })();

                                return (
                                    <tr
                                        key={item.id}
                                        onClick={() => onRowClick(item.id)}
                                        className={`transition-colors border-b border-gray-100 cursor-pointer ${
                                            isPickupSoon
                                                ? "bg-amber-50 hover:bg-amber-100"
                                                : "hover:bg-[#f1f5f9]"
                                        }`}
                                    >
                                        <td className="py-3 px-6">{item.item.serialNumber}</td>
                                        <td className="py-4 px-6">
                                            <img
                                                src={typeof item.item.image === "string" ? item.item.image : "-"}
                                                alt={item.borrowerFullName}
                                                className="object-cover w-10 h-10 rounded-lg"
                                                onError={(e) => (e.currentTarget.style.display = "none")}
                                            />
                                        </td>
                                        <td className="py-4 px-6">{item.item.itemName}</td>
                                        <td className="py-4 px-6">{item.borrowerFullName}</td>
                                        <td className="py-4 px-6">{item.teacherFullName || "-"}</td>
                                        <td className="py-4 px-6">{item.room || "-"}</td>
                                        <td className="py-4 px-6">{item.remarks || "-"}</td>
                                        <td className="py-4 px-6">{FormattedDateTime(item.item.createdAt)}</td>

                                        {/* Reserved For — with urgency indicator */}
                                        <td className="py-4 px-6">
                                            {item.reservedFor ? (
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {new Date(item.reservedFor).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-xs text-gray-600">
                                                        {new Date(item.reservedFor).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>
                                                    {isPickupSoon && (
                                                        <span className="mt-0.5 text-[10px] font-bold text-amber-600 animate-pulse">
                                                            ⏰ Pickup soon
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>

                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-sm ${SlugStatus(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>

                                        {/* Action buttons */}
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                {isApprovedReservation ? (
                                                    <>
                                                        <button
                                                            onClick={() => onMarkBorrowed(item)}
                                                            title="Mark as borrowed manually (use when RFID scan is unavailable)"
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 shadow-sm transition-colors"
                                                        >
                                                            <FiEdit className="h-3.5 w-3.5" /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => onDeny(item)}
                                                            title="Cancel reservation"
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 active:bg-rose-700 shadow-sm transition-colors"
                                                        >
                                                            <MdOutlineCancel className="h-3.5 w-3.5" /> Deny
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => onApprove(item)}
                                                            title="Approve reservation"
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 shadow-sm transition-colors"
                                                        >
                                                            <FiCheckCircle className="h-3.5 w-3.5" /> Approve
                                                        </button>
                                                        <button
                                                            onClick={() => onDeny(item)}
                                                            title="Deny reservation"
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 active:bg-rose-700 shadow-sm transition-colors"
                                                        >
                                                            <MdOutlineClose className="h-3.5 w-3.5" /> Deny
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <p className="mt-4 text-sm text-center text-[#64748b]">
                <span className="font-semibold">Note:</span> Use <em>Approve / Deny</em> for pending requests.
                In the Reservations tab, use <em>Mark Borrowed</em> if the RFID scan didn't trigger, or <em>Cancel</em> to cancel the reservation.
            </p>
        </div>
    );
}
