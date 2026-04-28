import { useState } from "react";
import { showToast } from "../components/AppToast";
import { useReturnItem } from "../hooks/itemHooks.ts";
import { IoMdClose } from "react-icons/io";
import { GuestBorrowWizard } from "../components/GuestBorrowWizard";
import { BorrowDetailDialog } from "../components/BorrowDetailDialog";
import { useQueryClient } from "@tanstack/react-query";
import type { TRecentBorrowItemProps } from "../@types/types";

/** The lent-item detail response includes extra fields beyond TRecentBorrowItemProps */
type TLentItemDetail = TRecentBorrowItemProps & {
  studentIdNumber?: string | null;
  frontStudentIdPicture?: string | null;
  itemName?: string;
};

// ─────────────────────────────────────────────────────────────────────────────

export default function BorrowItem() {
  const [activeTab, setActiveTab] = useState<"guest" | "reserve">("guest");
  const queryClient = useQueryClient();
  const [scannedLentItem, setScannedLentItem] = useState<TLentItemDetail | null>(null);
  const [showReturnModal, setShowReturnModal] = useState<boolean>(false);
  const [returnBarcode, setReturnBarcode] = useState<string>("");
  const [returnError, setReturnError] = useState<string>("");
  const [showFloatingMenu, setShowFloatingMenu] = useState<boolean>(false);
  const [menuOpenedByClick, setMenuOpenedByClick] = useState<boolean>(false);

  const returnItemMutation = useReturnItem();

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
      showToast.success("Item Returned", "Item returned successfully!");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to return item";
      showToast.error("Return Failed", msg);
      setShowReturnModal(false);
      setReturnBarcode("");
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#f8fafc] via-[#e8eef7] to-[#dbeafe] flex flex-col overflow-hidden">

      {/* Return Item Modal */}
      {showReturnModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowReturnModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Return Item</h2>
              <button
                onClick={() => setShowReturnModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IoMdClose className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Scan the <strong>item barcode</strong> to mark it as returned.
                The system will automatically find and update the active
                borrowed record. If the scanner cannot read the barcode, you may
                manually enter it below.
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
                placeholder="Scan or enter item barcode (e.g., ITEM-SN-12345)"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${returnError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                  }`}
              />
              {returnError && (
                <p className="text-red-500 text-sm mt-2">{returnError}</p>
              )}

              {/* Modal Actions */}
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
                  {returnItemMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Confirm Return"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex-shrink-0 pt-6 md:pt-8 px-4 md:px-8 pb-4 md:pb-6 bg-white/70 backdrop-blur-md shadow-sm border-b border-[#e5e9f2] flex flex-col items-center">
        <h1 className="text-[#1e293b] text-3xl md:text-3xl mb-2 font-extrabold tracking-tight drop-shadow-lg">
          Borrow Item
        </h1>
        <p className="text-[#64748b] text-sm md:text-base lg:text-lg font-medium max-w-2xl text-center px-4">
          Browse available items or submit a borrow request for technical
          equipment.
        </p>
        <p className="text-[#64748b] text-sm md:text-base lg:text-md font-medium max-w-2xl text-center px-4">
          Note: If the item have <b>Defective</b> condition you cannot borrow
          it.
        </p>
        {/* Tabs */}
        <div className="mt-4 md:mt-6 flex gap-2 bg-white/90 p-1.5 rounded-xl shadow-md">
          <button
            onClick={() => setActiveTab("guest")}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 ${activeTab === "guest"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
          >
            Borrow as Guest
          </button>
          <button
            onClick={() => setActiveTab("reserve")}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 ${activeTab === "reserve"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
          >
            Reserve as Guest
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className={`h-full overflow-y-auto px-4 py-4 md:py-6 ${activeTab === "guest" ? "" : "hidden"}`}>
          <div className="max-w-6xl mx-auto">
            <GuestBorrowWizard
              mode="borrow"
              onSuccess={() => queryClient.invalidateQueries({ queryKey: ['lentItems'] })}
            />
          </div>
        </div>
        <div className={`h-full overflow-y-auto px-4 py-4 md:py-6 ${activeTab === "reserve" ? "" : "hidden"}`}>
          <div className="max-w-6xl mx-auto">
            <GuestBorrowWizard
              mode="reserve"
              onSuccess={() => queryClient.invalidateQueries({ queryKey: ['lentItems'] })}
            />
          </div>
        </div>
      </div>

      {/* Scanned Lent Item Details Modal */}
      {scannedLentItem && (
        <BorrowDetailDialog
          lentItem={scannedLentItem}
          onClose={() => setScannedLentItem(null)}
          onReturnSuccess={() => {
            setScannedLentItem(null);
            showToast.success("Item Returned", "Item returned successfully!");
          }}
        />
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
          {/* Return Button - Slides from right */}
          <button
            onClick={() => {
              setShowReturnModal(true);
              setShowFloatingMenu(false);
              setMenuOpenedByClick(false);
            }}
            className={`flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 overflow-hidden ${showFloatingMenu
                ? "translate-x-0 opacity-100 pointer-events-auto delay-75 pr-4 pl-3"
                : "translate-x-full opacity-0 pointer-events-none pr-0 pl-3"
              }`}
            style={{
              borderRadius: "9999px 0 0 9999px",
            }}
            title="Return Item"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            <span
              className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${showFloatingMenu ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
                }`}
            >
              Return Item
            </span>
          </button>

          {/* Main Plus Button - Reverse D Shape */}
          <div className="relative">
            <button
              onClick={() => {
                if (showFloatingMenu && menuOpenedByClick) {
                  // If menu is open by click, close it
                  setShowFloatingMenu(false);
                  setMenuOpenedByClick(false);
                } else {
                  // Open menu by click
                  setShowFloatingMenu(true);
                  setMenuOpenedByClick(true);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-2xl transition-all duration-300 p-4 md:p-5"
              style={{
                borderRadius: "50% 0 0 50%",
              }}
              title="Quick Actions"
            >
              <svg
                className={`w-7 h-7 md:w-8 md:h-8 transition-transform duration-300 ${showFloatingMenu ? "rotate-45" : "rotate-0"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Click outside to close menu when opened by click */}
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
