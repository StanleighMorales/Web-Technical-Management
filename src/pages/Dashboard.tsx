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

import * as signalR from "@microsoft/signalr";

type summary = {
  totalItems: number;
  totalActiveUsers: number;
  totalLentItems: number;
  totalItemsCategories: number;
}

export default function Dashboard() {
  const [dataSummary, setDataSummary] = useState<summary>({
    totalItems: 0,
    totalActiveUsers: 0,
    totalLentItems: 0,
    totalItemsCategories: 0
  })
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const badges = [
    { name: "Total Items", data: dataSummary.totalItems, link: "/home/inventory-list" },
    { name: "Categories", data: dataSummary.totalItemsCategories, link: "/home/inventory-list" },
    { name: "Active Users", data: dataSummary.totalActiveUsers, link: "/home/user-management" },
    { name: "Total Borrowed", data: dataSummary.totalLentItems, link: "/home/history-list" },
  ];


  const results = useQueries({
    queries: [useBorrowedItemsQuery(), useSummaryDataQuery()],
  });

  const borrowedItemsResult = results[0];
  const summaryData = results[1];
  useEffect(() => {
    if (summaryData.data?.data) {
      setDataSummary(summaryData.data.data);
    }
  }, [summaryData.data]);

  // FIX #2: This is the SignalR integration. It is self-contained and handles all REAL-TIME updates.
  useEffect(() => {
    const hubUrl = "http://localhost:5278/api/v1/summary"

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveOverallSummaryUpdate", (updatedSummary: summary) => {
      console.log("✅ Real-time summary update received:", updatedSummary);
      setDataSummary(updatedSummary);
    });

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("SignalR Connected successfully and listening for updates.");
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();

    return () => {
      console.log("Stopping SignalR connection.");
      connection.stop();
    };
  }, []); // Empty array is correct, so this runs only on mount/unmount.


  // All your memoized calculations below are correct
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

  // FIX #3: REMOVED the duplicate/conflicting useEffect block.
  // The logic inside it is no longer needed because the two useEffects above
  // now handle the initial data and the real-time updates separately and more cleanly.

  // FIX #4: Corrected the variable name here from summaryDataResult to your name summaryData.
  const isLoading = borrowedItemsResult.isLoading || summaryData.isLoading;
  const isError = borrowedItemsResult.error;

  if (isLoading) return <DashboardSkeletonLoader />;

// import { useCallback, useEffect, useMemo, useState } from "react";
// import SearchBar from "../components/SearchBar";
// import type { TBorrowedItems } from "../types/types";
// import { useQueries } from "@tanstack/react-query";
// import { useBorrowedItemsQuery } from "../query/get/useBorrwedItemsQuery";
// import { DashboardSkeletonLoader } from "../loader/DashboardSkeletonLoader";
// import DashboardBadges from "../components/DashboardBadges";
// import ErrorTable from "../components/ErrorTables";
// import Pagination from "../components/Pagination";
// import RecentBorrowedItemsTable from "../components/RecentBorrowedItemsTable";
// import { useSummaryDataQuery } from "../query/get/useSummaryDataQuery";

// type summary = {
//   totalItems: number;
//   totalActiveUsers: number;
//   totalLentItems: number;
//   totalItemsCategories: number;
// }

// export default function Dashboard() {
//   const [dataSummary, setDataSummary] = useState<summary>({
//     totalItems: 0,
//     totalActiveUsers: 0,
//     totalLentItems: 0,
//     totalItemsCategories: 0
//   })
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const itemsPerPage = 10;

//   const badges = [
//     { name: "Total Items", data: dataSummary.totalItems, link: "/home/inventory-list" },
//     { name: "Categories", data: dataSummary.totalItemsCategories, link: "/home/inventory-list" },
//     { name: "Active Users", data: dataSummary.totalActiveUsers, link: "/home/user-management" },
//     { name: "Total Borrowed", data: dataSummary.totalLentItems, link: "/home/history-list" },
//   ];


//   const results = useQueries({
//     queries: [useBorrowedItemsQuery(), useSummaryDataQuery()],
//   });

//   const borrowedItemsResult = results[0];
//   const summaryData = results[1];

//   const borrowedItemsData: TBorrowedItems[] = useMemo(() => {
//     return borrowedItemsResult.data ?? [];
//   }, [borrowedItemsResult]);

//   const filteredData = useMemo(
//     () =>
//       borrowedItemsData.filter((item) =>
//         item.item.toLowerCase().includes(searchTerm.toLowerCase()),
//       ),
//     [borrowedItemsData, searchTerm],
//   );

//   const paginatedData = useMemo(
//     () =>
//       filteredData.slice(
//         (currentPage - 1) * itemsPerPage,
//         currentPage * itemsPerPage,
//       ),
//     [filteredData, currentPage],
//   );

//   const totalPages = useMemo(
//     () => Math.ceil(filteredData.length / itemsPerPage),
//     [filteredData],
//   );

//   const handlePageChange = useCallback((page: number) => {
//     setCurrentPage(page);
//   }, []);

//   useEffect(() => {
//     if (!summaryData) return;

//     setDataSummary(prev => {
//       const newTotalItems = summaryData.data?.data.totalItems;
//       const newTotalActiveUsers = summaryData.data?.data.totalActiveUsers;
//       const newTotalCategories = summaryData.data?.data.totalItemsCategories;
//       const newTotalLentItems = summaryData.data?.data.totalLentItems;

//       if (
//         prev.totalItems === newTotalItems &&
//         prev.totalActiveUsers === newTotalActiveUsers &&
//         prev.totalItemsCategories === newTotalCategories &&
//         prev.totalLentItems === newTotalLentItems
//       ) {
//         return prev;
//       }

//       return {
//         ...prev,
//         totalItems: newTotalItems,
//         totalActiveUsers: newTotalActiveUsers,
//         totalItemsCategories: newTotalCategories,
//         totalLentItems: newTotalLentItems
//       };
//     });
//   }, [summaryData]);

//   const isLoading = borrowedItemsResult.isLoading;
//   const isError = borrowedItemsResult.error;

//   if (isLoading) return <DashboardSkeletonLoader />;

  return (
    <div className="animate-fadeIn min-h-screen w-full bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#c7d2fe] flex flex-col items-center py-10 px-2">
      {/* Stats Badges */}
      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
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
      <div className="w-full max-w-7xl bg-white/90 shadow-md rounded-2xl p-8 border border-[#e0e7ef]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <h1 className="font-bold text-[#1e293b] text-2xl -mt-10">
            Recently Borrowed Items
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
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
        <div className="h-[55vh] overflow-x-auto rounded-xl shadow-inner bg-white/95">
          {isError ? (
            <ErrorTable />
          ) : (
            <table className="relative w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="bg-[#f8fafc] sticky top-0 font-semibold py-4 px-6 border-b border-[#e6e6e6] text-[#2563eb]">
                    Date & Time
                  </th>
                  <th className="bg-[#f8fafc] sticky top-0 font-semibold py-4 px-6 border-b border-[#e6e6e6] text-[#2563eb]">
                    Teacher
                  </th>
                  <th className="bg-[#f8fafc] sticky top-0 font-semibold py-4 px-6 border-b border-[#e6e6e6] text-[#2563eb]">
                    Room
                  </th>
                  <th className="bg-[#f8fafc] sticky top-0 font-semibold py-4 px-6 border-b border-[#e6e6e6] text-[#2563eb]">
                    Item
                  </th>
                  <th className="bg-[#f8fafc] sticky top-0 font-semibold py-4 px-6 border-b border-[#e6e6e6] text-[#2563eb]">
                    Occupied By
                  </th>
                  <th className="bg-[#f8fafc] sticky top-0 font-semibold py-4 px-6 border-b border-[#e6e6e6] text-[#2563eb]">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#f1f5f9] transition-colors odd:bg-white even:bg-[#f8fafc]"
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
