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
import { useReturnItemMutation } from "../query/patch/useReturnItemMutation";
import { SuccessAlert } from "../components/SuccessAlert";
import { ErrorAlert } from "../components/ErrorAlert";
import { IoMdClose } from "react-icons/io";
import { getToken } from "../utils/token";
import { FaHashtag, FaCheckCircle } from "react-icons/fa";
import { BsCalendar2Date } from "react-icons/bs";
import { MdOutlineDescription } from "react-icons/md";
import { FormattedDateTime } from "../components/FormattedDateTime";

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

    // Scan lent item states
    const [showScanModal, setShowScanModal] = useState<boolean>(false);
    const [scannedBarcode, setScannedBarcode] = useState<string>("");
    const [scanError, setScanError] = useState<string>("");
    const [scannedLentItem, setScannedLentItem] = useState<any>(null);

    const { data: recentBorrowData, isLoading: isBorrowedItemLoading, isError: isBorrowedItemError } = useQuery(useBorrowedItemsQuery());
    const { data: summaryData } = useQuery(useSummaryDataQuery());
    const returnItemMutation = useReturnItemMutation();

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
                    item.status === "Borrowed" &&
                    (item.item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.item.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()))
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

    const handleReturnSubmit = async () => {
        setReturnError("");
        const barcode = returnBarcode.trim();

        if (!barcode) {
            setReturnError("Please enter a barcode");
            return;
        }

        try {
            // First, fetch the item to check its status
            const checkResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/lentItems/scan/${barcode}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
            });

            if (!checkResponse.ok) {
                throw new Error("Item not found or unable to fetch item details");
            }

            const itemData = await checkResponse.json();
            const itemStatus = itemData?.data?.status?.toLowerCase();

            // Validate that the item status is "borrowed"
            if (itemStatus !== 'borrowed') {
                setReturnError(`Cannot return item with status "${itemData?.data?.status || 'Unknown'}". Only items with "Borrowed" status can be returned.`);
                return;
            }

            // If status is valid, proceed with return
            await returnItemMutation.mutateAsync({ barcode });

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

        if (!lentItemBarcode.startsWith("LENT-") || lentItemBarcode.length !== 17 ||
            !/^LENT-\d{8}-\d{3}$/.test(lentItemBarcode)) {
            setScanError("Invalid lent item barcode format. Expected format: LENT-YYYYMMDD-XXX");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/lentItems/barcode/${lentItemBarcode}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
            });

            const contentType = response.headers.get("content-type");
            const hasJsonContent = contentType && contentType.includes("application/json");

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
                    errorMessage = textResponse || `HTTP ${response.status}: ${response.statusText}`;
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
            setScannedLentItem(lentItem);
        } catch (error: any) {
            console.error("Scan error:", error);
            setScanError(error.message || "Failed to fetch lent item details");
        }
    };

    if (isBorrowedItemLoading) return <DashboardSkeletonLoader />;

    return (
        <div className="flex z-40 flex-col items-center py-10 px-2 w-full min-h-screen animate-fadeIn bg-linear-to-br from-[#f8fafc] via-[#e0e7ef] to-[#c7d2fe]">
            {/* Return Success Alert */}
            {returnSuccess && <SuccessAlert message="Item returned successfully!" />}
            {showReturnError && <ErrorAlert message={returnErrorMessage} />}

            {/* Return Item Modal */}
            {showReturnModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowReturnModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
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
                                Scan the <strong>item barcode</strong> to mark it as returned. The system will automatically find and update the active borrowed record.
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
                                    if (e.key === 'Enter') {
                                        handleReturnSubmit();
                                    }
                                }}
                                placeholder="Scan or enter item barcode"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${returnError
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
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
                                    className={`flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors ${returnItemMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {returnItemMutation.isPending ? 'Processing...' : 'Confirm Return'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Scan Lent Item Modal */}
            {showScanModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowScanModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                            <h2 className="text-xl font-bold text-gray-900">Scan Lent Item</h2>
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
                                    if (e.key === 'Enter') {
                                        handleScanSubmit();
                                    }
                                }}
                                placeholder="Scan or enter lent item barcode"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${scanError
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
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
            )}

            <div className="grid grid-cols-1 justify-items-center gap-8 mb-8 w-full max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
                {badges.map((item, index) => (
                    <DashboardBadges key={index} name={item.name} link={item.link} data={item.data} />
                ))}
            </div>

            <h1 className="mb-4 w-full text-2xl font-bold text-left text-[#1e293b]">
                Recently Borrowed Items
            </h1>

            <div className="p-8 w-full rounded-2xl border shadow-md bg-white/90 border-[#e0e7ef]">

                {/* Pagination & Search */}
                <div className="flex flex-row gap-2 justify-end items-center mb-6 flex-wrap">
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
                                        "Lent At",
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
                                {paginatedData
                                    .sort((a, b) => new Date(b.lentAt).getTime() - new Date(a.lentAt).getTime())
                                    .map((item) => (
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
                                                createdAt={item.lentAt}
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

            {/* Scanned Lent Item Details Modal */}
            {scannedLentItem && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setScannedLentItem(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Lent Item Details</h2>
                            <button
                                onClick={() => setScannedLentItem(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <IoMdClose className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-4 md:p-6">
                            <div className="text-center mb-4">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{scannedLentItem.itemName}</h3>
                                <p className="text-gray-600 font-semibold">Barcode: {scannedLentItem.barcode}</p>
                            </div>
                            {scannedLentItem.borrowerRole?.toLowerCase() === 'student' && scannedLentItem.frontStudentIdPicture && (
                                <div className="mb-6">
                                    <div className="text-center">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Student ID Picture</h4>
                                        <div className="inline-block bg-gray-50 rounded-lg p-4 shadow-md">
                                            <img
                                                src={scannedLentItem.frontStudentIdPicture}
                                                alt={`${scannedLentItem.borrowerFullName} - Student ID`}
                                                className="max-w-sm max-h-64 object-contain rounded-lg shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center mb-2">
                                        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
                                            <FaHashtag className="text-white w-4 h-4" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 text-sm">Borrower</h4>
                                    </div>
                                    <p className="text-gray-600 ml-11 text-sm">{scannedLentItem.borrowerFullName}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center mb-2">
                                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                                            <FaCheckCircle className="text-white w-4 h-4" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 text-sm">Role</h4>
                                    </div>
                                    <p className="text-gray-600 ml-11 text-sm">{scannedLentItem.borrowerRole}</p>
                                </div>
                                {scannedLentItem.studentIdNumber && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center mb-2">
                                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                                                <FaHashtag className="text-white w-4 h-4" />
                                            </div>
                                            <h4 className="font-semibold text-gray-900 text-sm">Student ID</h4>
                                        </div>
                                        <p className="text-gray-600 ml-11 text-sm">{scannedLentItem.studentIdNumber}</p>
                                    </div>
                                )}
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center mb-2">
                                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                                            <FaHashtag className="text-white w-4 h-4" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 text-sm">Room</h4>
                                    </div>
                                    <p className="text-gray-600 ml-11 text-sm">{scannedLentItem.room}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center mb-2">
                                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                                            <BsCalendar2Date className="text-white w-4 h-4" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 text-sm">Schedule</h4>
                                    </div>
                                    <p className="text-gray-600 ml-11 text-sm">{scannedLentItem.subjectTimeSchedule}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center mb-2">
                                        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                                            <BsCalendar2Date className="text-white w-4 h-4" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 text-sm">Lent At</h4>
                                    </div>
                                    <p className="text-gray-600 ml-11 text-sm">{FormattedDateTime(scannedLentItem.lentAt)}</p>
                                </div>
                                {scannedLentItem.returnedAt && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center mb-2">
                                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                                                <BsCalendar2Date className="text-white w-4 h-4" />
                                            </div>
                                            <h4 className="font-semibold text-gray-900 text-sm">Returned At</h4>
                                        </div>
                                        <p className="text-gray-600 ml-11 text-sm">{FormattedDateTime(scannedLentItem.returnedAt)}</p>
                                    </div>
                                )}
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center mb-2">
                                        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
                                            <FaCheckCircle className="text-white w-4 h-4" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 text-sm">Status</h4>
                                    </div>
                                    <p className="text-gray-600 ml-11 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${scannedLentItem.status === 'Returned' ? 'bg-green-100 text-green-800' :
                                            scannedLentItem.status === 'Borrowed' ? 'bg-blue-100 text-blue-800' :
                                                scannedLentItem.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    scannedLentItem.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                                                        scannedLentItem.status === 'Canceled' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                            }`}>
                                            {scannedLentItem.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            {scannedLentItem.remarks && (
                                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                    <div className="flex items-center mb-2">
                                        <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center mr-3">
                                            <MdOutlineDescription className="text-white w-4 h-4" />
                                        </div>
                                        <h4 className="font-semibold text-gray-900 text-sm">Remarks</h4>
                                    </div>
                                    <p className="text-gray-600 ml-11 text-sm">{scannedLentItem.remarks}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Action Buttons - Reverse D Shape */}
            <div
                className="fixed right-0 bottom-12 z-40"
                onMouseEnter={() => setShowFloatingMenu(true)}
                onMouseLeave={() => {
                    if (!menuOpenedByClick) {
                        setShowFloatingMenu(false);
                    }
                }}
            >
                <div className="flex flex-col items-end gap-3">
                    {/* Scan Button - Slides from right */}
                    <button
                        onClick={() => {
                            setShowScanModal(true);
                            setShowFloatingMenu(false);
                            setMenuOpenedByClick(false);
                        }}
                        className={`flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 overflow-hidden ${showFloatingMenu
                            ? 'translate-x-0 opacity-100 pointer-events-auto delay-75 pr-4 pl-3'
                            : 'translate-x-full opacity-0 pointer-events-none pr-0 pl-3'
                            }`}
                        style={{
                            borderRadius: '9999px 0 0 9999px'
                        }}
                        title="Scan Lent Item"
                    >
                        <svg className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${showFloatingMenu ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'
                            }`}>
                            Scan Lent Item
                        </span>
                    </button>

                    {/* Return Button - Slides from right */}
                    <button
                        onClick={() => {
                            setShowReturnModal(true);
                            setShowFloatingMenu(false);
                            setMenuOpenedByClick(false);
                        }}
                        className={`flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 overflow-hidden ${showFloatingMenu
                            ? 'translate-x-0 opacity-100 pointer-events-auto delay-150 pr-4 pl-3'
                            : 'translate-x-full opacity-0 pointer-events-none pr-0 pl-3'
                            }`}
                        style={{
                            borderRadius: '9999px 0 0 9999px'
                        }}
                        title="Return Item"
                    >
                        <svg className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${showFloatingMenu ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'
                            }`}>
                            Return Item
                        </span>
                    </button>

                    {/* Main Plus Button - Reverse D Shape */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                if (showFloatingMenu && menuOpenedByClick) {
                                    setShowFloatingMenu(false);
                                    setMenuOpenedByClick(false);
                                } else {
                                    setShowFloatingMenu(true);
                                    setMenuOpenedByClick(true);
                                }
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-5"
                            style={{
                                borderRadius: '50% 0 0 50%'
                            }}
                            title="Quick Actions"
                        >
                            <svg
                                className={`w-7 h-7 md:w-8 md:h-8 transition-transform duration-300 ${showFloatingMenu ? 'rotate-45' : 'rotate-0'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Click outside to close menu */}
            {menuOpenedByClick && showFloatingMenu && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => {
                        setShowFloatingMenu(false);
                        setMenuOpenedByClick(false);
                    }}
                />
            )}
        </div>
    );
}
