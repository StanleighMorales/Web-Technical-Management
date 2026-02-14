import { Activity, useCallback, useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { DashboardSkeletonLoader } from "../loader/DashboardSkeletonLoader";
import DashboardBadges from "../components/DashboardBadges";
import ErrorTable from "../components/ErrorTables";
import type { TRecentBorrowItemProps } from "../types/types";
import Pagination from "../components/Pagination";
import { useSummaryData, useRecentlyBorrowItems } from "../hooks/itemHooks";
import { ViewRecentBorrowItems } from "../components/ViewRecentBorrowItems";
import { useReturnItem } from "../hooks/itemHooks";
import { SuccessAlert } from "../components/SuccessAlert";
import { ErrorAlert } from "../components/ErrorAlert";
import { IoMdClose } from "react-icons/io";
import { getToken } from "../utils/token";
import { LentItemDetailsModal } from "../components/LentItemDetailsModal";
import { FloatingActionButtons } from "../components/FloatingActionButtons";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import { SlugStatus } from "../components/SlugStatus";

type Summary = {
  totalItems: number | null;
  totalActiveUsers: number | null;
  totalLentItems: number | null;
  totalItemsCategories: number | null;
};

const columnHelper = createColumnHelper<TRecentBorrowItemProps>();

const columns = [
  columnHelper.accessor("item.serialNumber", { header: "Serial Number" }),
  columnHelper.accessor("item.image", {
    header: "Image",
    cell: ({ row }) => (
      <img
        src={
          typeof row.original.item.image === "string"
            ? row.original.item.image
            : undefined
        }
        alt={row.original.item.itemName}
        className="w-12 h-12 object-cover rounded"
      />
    ),
    enableResizing: true,
  }),
  columnHelper.accessor("item.itemName", {
    header: "Item",
    enableResizing: true,
  }),
  columnHelper.accessor("borrowerFullName", {
    header: "Occupied By",
    enableResizing: true,
  }),
  columnHelper.accessor("teacherFullName", {
    header: "Teacher",
    enableResizing: true,
  }),
  columnHelper.accessor("room", { header: "Room", enableResizing: true }),
  columnHelper.accessor("remarks", { header: "Remarks", enableResizing: true }),
  columnHelper.accessor("lentAt", { header: "Lent At", enableResizing: true }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => {
      const colorClass = SlugStatus(row.original.status);
      return (
        <span className={`px-3 py-1 rounded-full text-sm ${colorClass}`}>
          {row.original.status}
        </span>
      );
    },
    enableResizing: true,
  }),
];

export default function Dashboard() {
  const [dataSummary, setDataSummary] = useState<Summary>({
    totalItems: 0,
    totalActiveUsers: 0,
    totalLentItems: 0,
    totalItemsCategories: 0,
  });

  const [onViewBorrowItemOpen, setOnViewBorrowItemOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [borrowedItemData, setBorrowedItemData] = useState<
    TRecentBorrowItemProps[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Floating menu states
  const [showFloatingMenu, setShowFloatingMenu] = useState<boolean>(false);
  const [menuOpenedByClick, setMenuOpenedByClick] = useState<boolean>(false);

  // Return item states
  const [showReturnModal, setShowReturnModal] = useState<boolean>(false);
  const [returnBarcode, setReturnBarcode] = useState<string>("");
  const [returnError, setReturnError] = useState<string>("");
  const [returnSuccess, setReturnSuccess] = useState<boolean>(false);
  const [returnErrorMessage, setReturnErrorMessage] = useState<string>("");
  const [showReturnError, setShowReturnError] = useState<boolean>(false);

  // Borrow item success state
  const [borrowSuccess, setBorrowSuccess] = useState<boolean>(false);

  // Scan lent item states
  const [showScanModal, setShowScanModal] = useState<boolean>(false);
  const [scannedBarcode, setScannedBarcode] = useState<string>("");
  const [scanError, setScanError] = useState<string>("");
  const [scannedLentItemId, setScannedLentItemId] = useState<string | null>(
    null,
  );

  const {
    data: recentBorrowData,
    isLoading: isBorrowedItemLoading,
    isError: isBorrowedItemError,
  } = useQuery(useRecentlyBorrowItems());

  const { data: summaryData } = useQuery(useSummaryData());
  const returnItemMutation = useReturnItem();

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

  // Filter logic
  const filteredData = useMemo(
    () =>
      borrowedItemData.filter(
        (item) =>
          item.status === "Borrowed" &&
          (item.item.itemName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
            item.item.serialNumber
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase())),
      ),
    [borrowedItemData, searchTerm],
  );

  // Pagination logic
  const paginatedData = useMemo(
    () =>
      filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      ),
    [filteredData, currentPage],
  );

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
  });

  const totalPages = useMemo(
    () => Math.ceil(filteredData.length / itemsPerPage),
    [filteredData],
  );

  const handlePageChange = useCallback(
    (page: number) => setCurrentPage(page),
    [],
  );

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

  const handleReturnSubmit = async () => {
    setReturnError("");
    const barcode = returnBarcode.trim();

    if (!barcode) {
      setReturnError("Please enter a barcode");
      return;
    }

    try {
      // Proceed with return - backend will validate the item status
      await returnItemMutation.mutateAsync(barcode);

      setShowReturnModal(false);
      setReturnBarcode("");
      setReturnError("");
      setReturnSuccess(true);

      setTimeout(() => {
        setReturnSuccess(false);
      }, 3000);
    } catch (error: any) {
      setReturnErrorMessage(error.message || "Failed to return item");
      setShowReturnError(true);
      setShowReturnModal(false);
      setReturnBarcode("");

      setTimeout(() => {
        setShowReturnError(false);
      }, 5000);
    }
  };

  const handleScanSubmit = async () => {
    setScanError("");
    const lentItemBarcode = scannedBarcode.trim();

    if (!lentItemBarcode) {
      setScanError("Please enter a lent item barcode");
      return;
    }

    if (
      !lentItemBarcode.startsWith("LENT-") ||
      lentItemBarcode.length !== 17 ||
      !/^LENT-\d{8}-\d{3}$/.test(lentItemBarcode)
    ) {
      setScanError(
        "Invalid lent item barcode format. Expected format: LENT-YYYYMMDD-XXX",
      );
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/lentItems/barcode/${lentItemBarcode}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        },
      );

      const contentType = response.headers.get("content-type");
      const hasJsonContent =
        contentType && contentType.includes("application/json");

      if (!response.ok) {
        let errorMessage = "Lent item not found";

        if (hasJsonContent) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (jsonError) {
            console.error("Failed to parse error response:", jsonError);
          }
        } else {
          const textResponse = await response.text();
          errorMessage =
            textResponse || `HTTP ${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      if (!hasJsonContent) {
        throw new Error("Invalid response format from server");
      }

      const responseData = await response.json();

      if (!responseData || !responseData.data) {
        throw new Error("Invalid response structure from server");
      }

      const lentItem = responseData.data;

      setShowScanModal(false);
      setScannedBarcode("");
      setScanError("");
      setScannedLentItemId(lentItem.id);
    } catch (error: any) {
      console.error("Scan error:", error);
      setScanError(error.message || "Failed to fetch lent item details");
    }
  };

  if (isBorrowedItemLoading) return <DashboardSkeletonLoader />;

  return (
    <div className="flex z-40 flex-col items-center py-10 px-2 w-full min-h-screen animate-fadeIn bg-linear-to-br from-[#f8fafc] via-[#e0e7ef] to-[#c7d2fe]">
      {/* Success Alerts */}
      <Activity mode={returnSuccess ? "visible" : "hidden"}>
        <SuccessAlert message="Item returned successfully!" />
      </Activity>

      <Activity mode={borrowSuccess ? "visible" : "hidden"}>
        <SuccessAlert message="Item borrowed successfully!" />
      </Activity>

      <Activity mode={showReturnError ? "visible" : "hidden"}>
        <ErrorAlert message={returnErrorMessage} />
      </Activity>

      {/* Return Item Modal */}
      <Activity mode={showReturnModal ? "visible" : "hidden"}>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowReturnModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Return Item</h2>
              <button
                onClick={() => setShowReturnModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IoMdClose className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Scan the <strong>item barcode</strong> to mark it as returned.
                The system will automatically find and update the active
                borrowed record.
              </p>
              <input
                type="text"
                autoFocus
                value={returnBarcode}
                onChange={(e) => {
                  setReturnBarcode(e.target.value);
                  setReturnError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleReturnSubmit();
                  }
                }}
                placeholder="Scan or enter item barcode"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${returnError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                  }`}
              />
              {returnError && (
                <p className="text-red-500 text-sm mt-2">{returnError}</p>
              )}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReturnSubmit}
                  disabled={returnItemMutation.isPending}
                  className={`flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors ${returnItemMutation.isPending
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                    }`}
                >
                  {returnItemMutation.isPending
                    ? "Processing..."
                    : "Confirm Return"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Activity>

      {/* Scan Lent Item Modal */}
      <Activity mode={showScanModal ? "visible" : "hidden"}>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowScanModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">
                Scan Lent Item
              </h2>
              <button
                onClick={() => setShowScanModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IoMdClose className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Scan the lent item barcode to view its details.
              </p>
              <input
                type="text"
                autoFocus
                value={scannedBarcode}
                onChange={(e) => {
                  setScannedBarcode(e.target.value);
                  setScanError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleScanSubmit();
                  }
                }}
                placeholder="Scan or enter lent item barcode"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${scanError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                  }`}
              />
              {scanError && (
                <p className="text-red-500 text-sm mt-2">{scanError}</p>
              )}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowScanModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleScanSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </Activity>

      <div className="grid grid-cols-1 justify-items-center gap-8 mb-8 w-full max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((item, index) => (
          <DashboardBadges
            key={index}
            name={item.name}
            link={item.link}
            data={item.data}
          />
        ))}
      </div>

      <div className="p-8 w-full rounded-2xl border shadow-md bg-white/90 border-[#e0e7ef]">
        {/* Pagination & Search */}
        <div className="flex flex-wrap lg:flex-row justify-between items-center  ">
          <div>
            <h1 className="mb-4 w-full text-2xl font-bold text-left text-[#1e293b]">
              Recently Borrowed Items
            </h1>
          </div>
          <div className="flex flex-col md:flex-row lg:flex-row gap-2 ">
            <Pagination
              totalPages={totalPages || 1}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
            <SearchBar
              onChangeValue={(value) => setSearchTerm(value)}
              name="search"
              placeholder="Search items..."
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl shadow-inner h-[55vh] bg-white/95">
          {isBorrowedItemError ? (
            <ErrorTable />
          ) : (
            <table className="relative w-full text-left border-collapse">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header: any) => (
                      <th
                        key={header.id}
                        className="sticky bg-white top-0 py-4 px-6 text-sm font-semibold tracking-wider text-left uppercase text-[#64748b]"
                      >
                        {header.isPlaceholder
                          ? null
                          : header.column.columnDef.header}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors odd:bg-white even:bg-[#f8fafc] hover:bg-[#f1f5f9] cursor-pointer"
                    onClick={() => handleViewBorrowItemOpen(row.original.id)}
                  >
                    {row.getVisibleCells().map((cell: any) => (
                      <td key={cell.id} className="px-6 py-4">
                        {cell.column.columnDef.cell
                          ? cell.column.columnDef.cell(cell.getContext())
                          : cell.renderValue()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {onViewBorrowItemOpen && selectedId && (
        <Activity mode={"visible"}>
          <ViewRecentBorrowItems
            itemId={selectedId}
            isOpen={onViewBorrowItemOpen}
            onClose={handleViewBorrowItemClose}
          />
        </Activity>
      )}

      {/* Scanned Lent Item Details Modal */}
      <LentItemDetailsModal
        itemId={scannedLentItemId || ""}
        isOpen={!!scannedLentItemId}
        onClose={() => setScannedLentItemId(null)}
        fromScan={true}
        onProceedToScan={() => {
          // Show success message for borrowed item
          setBorrowSuccess(true);
          setTimeout(() => {
            setBorrowSuccess(false);
          }, 3000);
        }}
      />

      {/* Floating Action Buttons - Reverse D Shape */}
      <FloatingActionButtons
        showFloatingMenu={showFloatingMenu}
        setShowFloatingMenu={() => setShowFloatingMenu(true)}
        menuOpenedByClick={menuOpenedByClick}
        setShowScanModal={() => setShowScanModal(true)}
        setMenuOpenedByClick={() => setMenuOpenedByClick(true)}
        setShowReturnModal={() => setShowReturnModal(true)}
      />

      {/* Click outside to close menu */}
      <Activity
        mode={menuOpenedByClick && showFloatingMenu ? "visible" : "hidden"}
      >
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowFloatingMenu(false);
            setMenuOpenedByClick(false);
          }}
        />
      </Activity>
    </div>
  );
}
