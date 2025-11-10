import { useCallback, useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { DashboardSkeletonLoader } from "../loader/DashboardSkeletonLoader";
import DashboardBadges from "../components/DashboardBadges";
import ErrorTable from "../components/ErrorTables";
import Pagination from "../components/Pagination";
import { RecentBorrowedItemsTable } from "../components/RecentBorrowedItemsTable";
import { useSummaryDataQuery } from "../query/get/useSummaryDataQuery";
import { useBorrowedItemsQuery } from "../query/get/useBorrwedItemsQuery";

type recentBorrowItemProps = {
  id: string;
  userId: null,
  teacherId: string,
  borrowerFullName: string,
  borrowerRole: string,
  teacherFullName: string,
  room: string,
  subjectTimeSchedule: string,
  lentAt: string,
  returnedAt: string,
  status: string,
  remarks: null,
  isHiddenFromUser: boolean,
  item: {
    id: string;
    serialNumber: string;
    barcode: null;
    barcodeImage: null;
    image: null;
    itemName: string;
    itemType: string;
    itemModel: string;
    itemMake: string;
    description: string;
    category: string;
    condition: string;
    createdAt: string;
    updatedAt: string;
  }
}

type summary = {
  totalItems: number | null;
  totalActiveUsers: number | null;
  totalLentItems: number | null;
  totalItemsCategories: number | null;
};

export default function Dashboard() {
  const [dataSummary, setDataSummary] = useState<summary>({
    totalItems: 0,
    totalActiveUsers: 0,
    totalLentItems: 0,
    totalItemsCategories: 0
  });

  const [onViewBorrowItemOpen, setOnViewBorrowItemOpen] = useState<boolean>();
  const [selectedId, setSelectedId] = useState<string>("");
  const [borrowedItemData, setBorrowedItemData] = useState<recentBorrowItemProps[]>([]);
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

  const { data: recentBorrowData, isLoading: isborrowedItemLoading, isError: isBorrowItemError } = useQuery(useBorrowedItemsQuery());
  const { data: summaryData } = useQuery(useSummaryDataQuery());

  const filteredData = useMemo(
    () =>
      borrowedItemData.filter((item) =>
        item.item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.item.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [borrowedItemData, searchTerm],
  );

  const findByItemID = useMemo(() => {
    return filteredData.find((item) => item.item.serialNumber === selectedId);
  }, [filteredData])

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
      const newTotalItems = summaryData?.totalItems;
      const newTotalActiveUsers = summaryData?.totalActiveUsers;
      const newTotalCategories = summaryData?.totalItemsCategories;
      const newTotalLentItems = summaryData?.totalLentItems;

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

  // const isError = borrowedItemsResult.error;

  useEffect(() => {
    if (!recentBorrowData) return;
    setBorrowedItemData(recentBorrowData);
  }, [recentBorrowData])

  if (isborrowedItemLoading) return <DashboardSkeletonLoader />;

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
      <div className="p-8 w-full rounded-2xl border shadow-md bg-white/90 border-[#e0e7ef]">
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
          {isBorrowItemError ? (
            <ErrorTable />
          ) :
            <table className="relative w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="sticky top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                    Serial Number
                  </th>
                  <th className="sticky top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                    Image
                  </th>
                  <th className="sticky top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                    Item
                  </th>
                  <th className="sticky top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                    Occupied By
                  </th>
                  <th className="sticky top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                    Teacher
                  </th>
                  <th className="sticky top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                    Room
                  </th>
                  <th className="sticky top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                    Remarks
                  </th>
                  <th className="sticky top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                    DateTime
                  </th>
                  <th className="sticky top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr
                    key={item.item.serialNumber}
                    className="transition-colors odd:bg-white even:bg-[#f8fafc] hover:bg-[#f1f5f9]"
                  >
                    {/* Borrowers Table Component */}
                    <RecentBorrowedItemsTable
                      image={item.item.image}
                      itemName={item.item.itemName}
                      serialNumber={item.item.serialNumber}
                      borrowerFullName={item.borrowerFullName}
                      room={item.room}
                      teacherFullName={item.teacherFullName}
                      remarks={item.remarks}
                      createdAt={item.item.createdAt}
                      onSetSelectedId={() => setSelectedId(item.item.serialNumber)}
                      onView={setOnViewBorrowItemOpen}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          }
        </div>
      </div>
      {selectedId && onViewBorrowItemOpen && <h1 className="p-10 bg-amber-200">Hello World</h1>}
    </div>
  );
}
