import { useEffect, useMemo, useState, useCallback } from "react";
import SearchBar from "../components/SearchBar";
import HistoryListSkeletonLoader from "../loader/HistoryListSkeletonLoader";
import { useQuery } from "@tanstack/react-query";
import type { THistoryBorrwedItems } from "../@types/types";
import HistoryTable from "../components/HistoryTable";
import ErrorTable from "../components/ErrorTables";
import Pagination from "../components/Pagination";
import { useRecentlyBorrowItems } from "../hooks/itemHooks";
type StatusTab =
  | "all"
  | "pending"
  | "approved"
  | "borrowed"
  | "returned"
  | "denied"

export default function HistoryList({
  title = "Borrowing History",
  description = "This table lists item borrowing events, including the condition reported and the current status.",
}) {
  const [searchItem, setSearchItem] = useState("");
  const [borrowedItem, setBorrowedItem] = useState<THistoryBorrwedItems[]>([]);
  const [activeTab, setActiveTab] = useState<StatusTab>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const { data, isPending, isError } = useQuery(useRecentlyBorrowItems());

  useEffect(() => {
    if (data) setBorrowedItem(data);
  }, [data]);

  // Calculate counts for each status
  const statusCounts = useMemo(() => {
    return {
      all: borrowedItem.length,
      pending: borrowedItem.filter(
        (item) => item.status.toLowerCase() === "pending",
      ).length,
      approved: borrowedItem.filter(
        (item) => item.status.toLowerCase() === "approved",
      ).length,
      borrowed: borrowedItem.filter(
        (item) => item.status.toLowerCase() === "borrowed",
      ).length,
      returned: borrowedItem.filter(
        (item) => item.status.toLowerCase() === "returned",
      ).length,
      denied: borrowedItem.filter(
        (item) => item.status.toLowerCase() === "denied",
      ).length
    };
  }, [borrowedItem]);

  const filteredItems = useMemo(() => {
    return borrowedItem.filter((item) => {
      const matchesSearch = item.borrowerFullName
        ?.toLowerCase()
        .includes(searchItem.toLowerCase());
      const matchesStatus =
        activeTab === "all" || item.status.toLowerCase() === activeTab;
      return matchesSearch && matchesStatus;
    });
  }, [borrowedItem, searchItem, activeTab]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const validCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const paginatedData = useMemo(
    () =>
      filteredItems.slice(
        (validCurrentPage - 1) * itemsPerPage,
        validCurrentPage * itemsPerPage,
      ),
    [filteredItems, itemsPerPage, validCurrentPage],
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Reset to page 1 when tab or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchItem]);

  if (isPending) return <HistoryListSkeletonLoader />;

  return (
    <div className="relative flex flex-col items-center py-10 px-2 w-full min-h-screen bg-gradient-to-br animate-fadeIn from-[#f8fafc] via-[#e0e7ef] to-[#c7d2fe]">
      <div className="w-full bg-white/90 rounded-2xl p-8 relative">
        {/* Title */}
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-[#1e293b] text-3xl md:text-5xl mb-2 font-extrabold tracking-tight drop-shadow-lg">
              {title}
            </h1>
            <span className="text-lg font-medium text-[#64748b]">
              {description}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-3 font-semibold text-sm transition-all duration-200 border-b-2 whitespace-nowrap ${activeTab === "all"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            All
            {statusCounts.all > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                {statusCounts.all}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-3 font-semibold text-sm transition-all duration-200 border-b-2 whitespace-nowrap ${activeTab === "pending"
                ? "border-yellow-600 text-yellow-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            Pending
            {statusCounts.pending > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded-full">
                {statusCounts.pending}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`px-4 py-3 font-semibold text-sm transition-all duration-200 border-b-2 whitespace-nowrap ${activeTab === "approved"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            Approved
            {statusCounts.approved > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-emerald-100 text-emerald-600 rounded-full">
                {statusCounts.approved}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("borrowed")}
            className={`px-4 py-3 font-semibold text-sm transition-all duration-200 border-b-2 whitespace-nowrap ${activeTab === "borrowed"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            Borrowed
            {statusCounts.borrowed > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                {statusCounts.borrowed}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("returned")}
            className={`px-4 py-3 font-semibold text-sm transition-all duration-200 border-b-2 whitespace-nowrap ${activeTab === "returned"
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            Returned
            {statusCounts.returned > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                {statusCounts.returned}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("denied")}
            className={`px-4 py-3 font-semibold text-sm transition-all duration-200 border-b-2 whitespace-nowrap ${activeTab === "denied"
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            Denied
            {statusCounts.denied > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                {statusCounts.denied}
              </span>
            )}
          </button>
        </div>

        {/* Pagination & Search */}
        <div className="flex flex-row gap-2 justify-end items-center mb-6 flex-wrap">
          {filteredItems.length > 0 && (
            <Pagination
              totalPages={totalPages}
              currentPage={validCurrentPage}
              totalItems={filteredItems.length}
              itemsPerPage={itemsPerPage}
              handlePageChange={handlePageChange}
            />
          )}
          <SearchBar
            onChangeValue={setSearchItem}
            name="Search History"
            placeholder="Search by borrower name"
          />
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
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500">
                      No items found for this status.
                    </td>
                  </tr>
                ) : (
                  <HistoryTable items={paginatedData} />
                )}
              </tbody>
            </table>
          )}
        </div>

        <p className="mt-6 text-sm text-center text-[#64748b]">
          <span className="font-semibold">Description:</span> Each row
          represents one history event. <em>Event Date</em> shows when it
          occurred. <em>Condition</em> is the item state reported at that time.{" "}
          <em>Status</em> reflects the latest known state for that borrow
          record.
        </p>
      </div>
    </div>
  );
}
