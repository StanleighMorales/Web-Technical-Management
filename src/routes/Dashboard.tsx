import { useEffect, useMemo } from "react";
import box from "../assets/box.webp";
import { DashboardSkeletonLoader } from "../loader/DashboardSkeletonLoader";
import DashboardBadges from "../components/DashboardBadges";
import ErrorTable from "../components/ErrorTables";
import { ViewRecentBorrowItems } from "../components/ViewRecentBorrowItems";
import { useReturnItem } from "../hooks/itemHooks";
import { showToast } from "../components/AppToast";
import { getToken } from "../utils/token";
import { BorrowDetailDialog } from "../components/BorrowDetailDialog";
import { SlugStatus } from "../components/SlugStatus";
import { useRecentlyAllBorrowItems, useSummarriesData } from "../data/dashboard-data";
import { useDashboardStore } from "../states/dashboard-state";
import {
  Package,
  Users,
  BookOpen,
  LayoutGrid,
  ScanLine,
  RotateCcw,
  X,
  Clock,
  ChevronRight,
  Wifi,
} from "lucide-react";

const TABLE_HEADERS = [
  "Serial No.",
  "Image",
  "Item",
  "Occupied By",
  "Teacher",
  "Room",
  "Remarks",
  "Lent At",
  "Status",
  "",
];

const badgeIcons = [
  <Package className="h-5 w-5" />,
  <LayoutGrid className="h-5 w-5" />,
  <Users className="h-5 w-5" />,
  <BookOpen className="h-5 w-5" />,
];

const badgeGradients = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-500",
];

export default function Dashboard() {
  const { dataSummary } = useSummarriesData();
  const { borrowedItemData, isBorrowedItemLoading, isBorrowedItemError } =
    useRecentlyAllBorrowItems();

  const {
    selectedId,
    setSelectedId,
    scannedLentItemId,
    setScannedLentItemId,
    showReturnModal,
    setShowReturnModal,
    returnBarcode,
    setReturnBarcode,
    returnError,
    setReturnError,
    showScanModal,
    setShowScanModal,
    scannedBarcode,
    setScannedBarcode,
    scanError,
    setScanError,
  } = useDashboardStore();

  const returnItemMutation = useReturnItem();

  const badges = [
    { name: "Total Items", data: dataSummary.totalItems, link: "/home/inventory-list" },
    { name: "Categories", data: dataSummary.totalItemsCategories, link: "/home/inventory-list" },
    { name: "Active Users", data: dataSummary.totalActiveUsers, link: "/home/user-management" },
    { name: "Total Borrowed", data: dataSummary.totalLentItems, link: "/home/history-list" },
  ];

  const recentBorrows = useMemo(
    () => borrowedItemData.filter((item) => item.status === "Borrowed").slice(0, 5),
    [borrowedItemData],
  );

  // Keep store in sync with fetched data (optional — useful if other pages read it)
  const setBorrowedItemData = useDashboardStore((s) => s.setBorrowedItemData);
  useEffect(() => {
    setBorrowedItemData(borrowedItemData);
  }, [borrowedItemData, setBorrowedItemData]);

  const handleViewOpen = (id: string) => setSelectedId(id);
  const handleViewClose = () => setSelectedId(null);

  const handleReturnSubmit = async () => {
    setReturnError("");
    const barcode = returnBarcode.trim();
    if (!barcode) { setReturnError("Please enter a barcode"); return; }
    try {
      await returnItemMutation.mutateAsync(barcode);
      setShowReturnModal(false);
      setReturnBarcode("");
      setReturnError("");
      showToast.success("Item Returned", "Item returned successfully!");
    } catch (error: any) {
      showToast.error("Return Failed", error.message || "Failed to return item");
      setShowReturnModal(false);
      setReturnBarcode("");
    }
  };

  const handleScanSubmit = async () => {
    setScanError("");
    const lentItemBarcode = scannedBarcode.trim();
    if (!lentItemBarcode) { setScanError("Please enter a lent item barcode"); return; }
    if (!/^LENT-\d{8}-\d{3}$/.test(lentItemBarcode)) {
      setScanError("Invalid lent item barcode format. Expected format: LENT-YYYYMMDD-XXX");
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
      const hasJson = contentType?.includes("application/json");
      if (!response.ok) {
        let msg = "Lent item not found";
        if (hasJson) {
          try { const err = await response.json(); msg = err.message || msg; } catch { /* ignore */ }
        } else {
          msg = (await response.text()) || `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(msg);
      }
      if (!hasJson) throw new Error("Invalid response format from server");
      const { data: lentItem } = await response.json();
      if (!lentItem) throw new Error("Invalid response structure from server");
      setShowScanModal(false);
      setScannedBarcode("");
      setScanError("");
      setScannedLentItemId(lentItem.id);
    } catch (error: any) {
      setScanError(error.message || "Failed to fetch lent item details");
    }
  };

  if (isBorrowedItemLoading) return <DashboardSkeletonLoader />;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-1">Overview</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Monitor inventory, users, and borrowing activity at a glance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {new Intl.DateTimeFormat("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            }).format(new Date())}
          </div>
          <div className="flex items-center gap-2 text-xs font-medium bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl px-4 py-2.5 shadow-sm">
            <Wifi className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-slate-700">Notifications</span>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-700 font-semibold">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Badges ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {badges.map((item, index) => (
          <div key={index} className="relative group">
            <div className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-linear-to-r ${badgeGradients[index]} opacity-80`} />
            <DashboardBadges name={item.name} link={item.link} data={item.data} />
            <div className={`absolute top-4 right-4 h-9 w-9 rounded-xl bg-linear-to-tr ${badgeGradients[index]} flex items-center justify-center text-white shadow-md opacity-80 group-hover:opacity-100 transition-opacity`}>
              {badgeIcons[index]}
            </div>
          </div>
        ))}
      </div>

      {/* ── Recent Borrows Table ── */}
      <div className="bg-white rounded-4xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="px-6 md:px-8 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
              Recently Borrowed Items
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Showing the 5 most recent active borrows
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isBorrowedItemError ? (
            <ErrorTable />
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-100">
                  {TABLE_HEADERS.map((h) => (
                    <th
                      key={h}
                      className="sticky top-0 bg-slate-50/80 backdrop-blur-sm px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBorrows.length > 0 ? (
                  recentBorrows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => handleViewOpen(row.id)}
                      className="group transition-all duration-200 hover:bg-indigo-50/30 cursor-pointer"
                    >
                      <td className="px-6 py-4 text-slate-700 font-medium">
                        {row.item.serialNumber}
                      </td>
                      <td className="px-6 py-4">
                        <img
                          src={typeof row.item.image === "string" ? row.item.image : box}
                          alt={row.item.itemName}
                          className="w-10 h-10 object-cover rounded-xl border border-slate-100"
                        />
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">{row.item.itemName}</td>
                      <td className="px-6 py-4 text-slate-700 font-medium">{row.borrowerFullName}</td>
                      <td className="px-6 py-4 text-slate-700 font-medium">{row.teacherFullName}</td>
                      <td className="px-6 py-4 text-slate-700 font-medium">{row.room}</td>
                      <td className="px-6 py-4 text-slate-700 font-medium">
                        {row.remarks ?? <span className="text-slate-300 italic text-xs">—</span>}
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">{row.lentAt}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${SlugStatus(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={TABLE_HEADERS.length} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <BookOpen className="h-10 w-10 text-slate-200" />
                        <p className="font-semibold text-slate-500">No borrowed items</p>
                        <p className="text-xs">There are no active borrows at the moment.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Dialogs ── */}
      {selectedId && (
        <ViewRecentBorrowItems
          itemId={selectedId}
          isOpen={!!selectedId}
          onClose={handleViewClose}
        />
      )}

      <BorrowDetailDialog
        itemId={scannedLentItemId ?? ""}
        isOpen={!!scannedLentItemId}
        onClose={() => setScannedLentItemId(null)}
        fromScan
        onProceedToScan={() => showToast.success("Item Borrowed", "Item borrowed successfully!")}
      />

      {/* ── Return Modal ── */}
      {showReturnModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowReturnModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-orange-50 flex items-center justify-center">
                  <RotateCcw className="h-4.5 w-4.5 text-orange-500" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Return Item</h2>
              </div>
              <button
                onClick={() => setShowReturnModal(false)}
                className="h-10 w-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-500 leading-relaxed">
                Scan the <span className="font-semibold text-slate-700">item barcode</span> to mark it as returned.
              </p>
              <div>
                <input
                  type="text"
                  autoFocus
                  value={returnBarcode}
                  onChange={(e) => { setReturnBarcode(e.target.value); setReturnError(""); }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleReturnSubmit(); }}
                  placeholder="Scan or enter item barcode"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-4 transition-all ${
                    returnError
                      ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                      : "border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500"
                  }`}
                />
                {returnError && <p className="text-rose-500 text-xs mt-1.5 font-medium">{returnError}</p>}
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReturnSubmit}
                  disabled={returnItemMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {returnItemMutation.isPending ? "Processing..." : "Confirm Return"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Scan Modal ── */}
      {showScanModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowScanModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-green-50 flex items-center justify-center">
                  <ScanLine className="h-4.5 w-4.5 text-green-500" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Scan Lent Item</h2>
              </div>
              <button
                onClick={() => setShowScanModal(false)}
                className="h-10 w-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-500 leading-relaxed">
                Scan the <span className="font-semibold text-slate-700">lent item barcode</span> to view its details.
              </p>
              <div>
                <input
                  type="text"
                  autoFocus
                  value={scannedBarcode}
                  onChange={(e) => { setScannedBarcode(e.target.value); setScanError(""); }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleScanSubmit(); }}
                  placeholder="Scan or enter lent item barcode"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-4 transition-all ${
                    scanError
                      ? "border-rose-300 focus:ring-rose-500/10 focus:border-rose-500"
                      : "border-slate-200 focus:ring-indigo-500/10 focus:border-indigo-500"
                  }`}
                />
                {scanError && <p className="text-rose-500 text-xs mt-1.5 font-medium">{scanError}</p>}
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowScanModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleScanSubmit}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
