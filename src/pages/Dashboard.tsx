import { useCallback, useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import type { TBorrowedItems } from "../types/types";
import { useQueries } from "@tanstack/react-query";
import { useBorrowedItemsQuery } from "../query/get/useBorrwedItemsQuery";
import { DashboardSkeletonLoader } from "../loader/DashboardSkeletonLoader";
import DashboardBadges from "../components/DashboardBadges";
import ErrorTable from "../components/ErrorTables";
import Pagination from "../components/Pagination";
import RecentBorrowedItemsTable from "../components/RecentBorrowedItemsTable";
import { useSummaryDataQuery } from "../query/get/useSummaryDataQuery";

type summary = {
  totalItems: number;
  totalActiveUsers: number;
  totalLentItems: number;
  totalItemsCategories: number;
};

export default function Dashboard() {
  const [dataSummary, setDataSummary] = useState<summary>({
    totalItems: 0,
    totalActiveUsers: 0,
    totalLentItems: 0,
    totalItemsCategories: 0,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const badges = [
    {
      name: "Total Items",
      data: dataSummary.totalItems,
      link: "/home/inventory-list",
    },
    {
      name: "Categories",
      data: dataSummary.totalItemsCategories,
      link: "/home/inventory-list",
    },
    {
      name: "Active Users",
      data: dataSummary.totalActiveUsers,
      link: "/home/user-management",
    },
    {
      name: "Total Borrowed",
      data: dataSummary.totalLentItems,
      link: "/home/history-list",
    },
  ];

  const results = useQueries({
    queries: [useBorrowedItemsQuery(), useSummaryDataQuery()],
  });

  const borrowedItemsResult = results[0];
  const summaryData = results[1];

  const borrowedItemsData: TBorrowedItems[] = useMemo(() => {
    return borrowedItemsResult.data ?? [];
  }, [borrowedItemsResult]);

  const filteredData = useMemo(
    () =>
      borrowedItemsData.filter((item) =>
        item.item.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [borrowedItemsData, searchTerm],
  );

  const paginatedData = useMemo(
    () =>
      filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      ),
    [filteredData, currentPage],
  );

  const totalPages = useMemo(
    () => Math.ceil(filteredData.length / itemsPerPage),
    [filteredData],
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    if (!summaryData) return;

    setDataSummary((prev) => {
      const newTotalItems = summaryData.data?.data.totalItems;
      const newTotalActiveUsers = summaryData.data?.data.totalActiveUsers;
      const newTotalCategories = summaryData.data?.data.totalItemsCategories;
      const newTotalLentItems = summaryData.data?.data.totalLentItems;

      if (
        prev.totalItems === newTotalItems &&
        prev.totalActiveUsers === newTotalActiveUsers &&
        prev.totalItemsCategories === newTotalCategories &&
        prev.totalLentItems === newTotalLentItems
      ) {
        return prev;
      }

      return {
        ...prev,
        totalItems: newTotalItems,
        totalActiveUsers: newTotalActiveUsers,
        totalItemsCategories: newTotalCategories,
        totalLentItems: newTotalLentItems,
      };
    });
  }, [summaryData]);

  const isLoading = borrowedItemsResult.isLoading;
  const isError = borrowedItemsResult.error;

  if (isLoading) return <DashboardSkeletonLoader />;

  return (
    <div className="flex flex-col items-center py-10 px-2 w-full min-h-screen animate-fadeIn bg-linear-to-br from-[#f8fafc] via-[#e0e7ef] to-[#c7d2fe]">
      {/* Stats Badges */}
      <div className="grid grid-cols-1 gap-8 mb-8 w-full max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((item, index) => (
          <div key={index}>
            <DashboardBadges
              name={item.name}
              link={item.link}
              data={item.data}
            />
          </div>
        ))}
      </div>

      {/* Table Borrowed Section */}
      <div className="p-8 w-full max-w-7xl rounded-2xl border shadow-md bg-white/90 border-[#e0e7ef]">
        <div className="flex flex-col gap-4 mb-4 md:flex-row md:justify-between md:items-center">
          <h1 className="-mt-10 text-2xl font-bold max-sm:-mt-1 text-[#1e293b]">
            Recently Borrowed Items
          </h1>
          <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center">
            {totalPages > 1 && (
              // Pagination Component
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
              />
            )}
            {/* Search Bar Component */}
            <SearchBar
              onChangeValue={(value) => setSearchTerm(value)}
              name={"search"}
              placeholder={"Search items..."}
            />
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl shadow-inner h-[55vh] bg-white/95">
          {isError ? (
            <ErrorTable />
          ) : (
            <table className="relative w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="sticky top-0 py-4 px-6 font-semibold border-b bg-[#f8fafc] border-[#e6e6e6] text-[#2563eb]">
                    Date & Time
                  </th>
                  <th className="sticky top-0 py-4 px-6 font-semibold border-b bg-[#f8fafc] border-[#e6e6e6] text-[#2563eb]">
                    Teacher
                  </th>
                  <th className="sticky top-0 py-4 px-6 font-semibold border-b bg-[#f8fafc] border-[#e6e6e6] text-[#2563eb]">
                    Room
                  </th>
                  <th className="sticky top-0 py-4 px-6 font-semibold border-b bg-[#f8fafc] border-[#e6e6e6] text-[#2563eb]">
                    Item
                  </th>
                  <th className="sticky top-0 py-4 px-6 font-semibold border-b bg-[#f8fafc] border-[#e6e6e6] text-[#2563eb]">
                    Occupied By
                  </th>
                  <th className="sticky top-0 py-4 px-6 font-semibold border-b bg-[#f8fafc] border-[#e6e6e6] text-[#2563eb]">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors odd:bg-white even:bg-[#f8fafc] hover:bg-[#f1f5f9]"
                  >
                    {/* Borrowers Table Component */}
                    <RecentBorrowedItemsTable
                      id={item.id}
                      datetime={item.datetime}
                      teacher={item.teacher}
                      room={item.room}
                      item={item.item}
                      occupied={item.occupied}
                      status={item.status}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
