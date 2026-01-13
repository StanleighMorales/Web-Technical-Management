import React, { useState, Activity } from "react";
import type { TItemList } from "../types/types.ts";
import { SuccessAlert } from "../components/SuccessAlert.tsx";
import { ErrorAlert } from "../components/ErrorAlert.tsx";
import { useReturnItem } from "../hooks/itemHooks.ts";
import { getToken } from "../utils/token/index.tsx";
import { FormattedDateTime } from "../components/FormattedDateTime.ts";
import { IoMdClose } from "react-icons/io";
import { FaHashtag, FaTools, FaCheckCircle } from "react-icons/fa";
import { BsCalendar2Date } from "react-icons/bs";
import { MdOutlineDescription } from "react-icons/md";
import { SlugStatus } from "../components/SlugStatus.ts";
import { BorrowItemsTable } from "../components/BorrowItemsTable.tsx";
import { ItemDetailsModal } from "../components/ItemDetailsModal.tsx";
import { BorrowItemForm } from "../components/BorrowItemForm.tsx";

type LentItemDetailsModalProps = {
  lentItem: any;
  onClose: () => void;
  onReturnSuccess?: () => void;
};

const LentItemDetailsModal: React.FC<LentItemDetailsModalProps> = ({
  lentItem,
  onClose,
  onReturnSuccess,
}) => {
  const [isReturning, setIsReturning] = useState(false);
  const [returnError, setReturnError] = useState<string>("");
  const [showReturnSuccess, setShowReturnSuccess] = useState(false);

  // Fetch student details if borrower is a student
  const isStudent = lentItem?.borrowerRole.toLowerCase() === "student";

  // Handle both camelCase and PascalCase field names
  const studentIdNumber = lentItem?.studentIdNumber;

  // Get the front ID picture from the lent item response (already included in the API response)
  const frontStudentIdPicture = lentItem?.frontStudentIdPicture;

  // Check if item can be returned (only Borrowed status)
  const canReturn = lentItem?.status.toLowerCase() === "borrowed";

  const handleReturn = async () => {
    if (!canReturn) return;

    setIsReturning(true);
    setReturnError("");

    try {
      const encodedBarcode = encodeURIComponent(lentItem.barcode);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/lentItems/scan/${encodedBarcode}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lentItemsStatus: "Returned",
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to return item");
      }

      setShowReturnSuccess(true);
      setTimeout(() => {
        onClose();
        if (onReturnSuccess) {
          onReturnSuccess();
        }
      }, 1500);
    } catch (error: any) {
      setReturnError(error.message || "Failed to return item");
    } finally {
      setIsReturning(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Lent Item Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {/* Title */}
          <div className="text-center mb-4">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
              {lentItem?.itemName}
            </h3>
            <p className="text-gray-600 font-semibold">
              Barcode: {lentItem?.barcode}
            </p>
          </div>

          {/* Student ID Picture - Only show for students */}
          {isStudent && frontStudentIdPicture && (
            <div className="mb-6">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Student ID Picture
                </h4>
                <div className="inline-block bg-gray-50 rounded-lg p-4 shadow-md">
                  <img
                    src={frontStudentIdPicture}
                    alt={`${lentItem?.borrowerFullName} - Student ID`}
                    className="max-w-sm max-h-64 object-contain rounded-lg shadow-sm"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
                  <FaHashtag className="text-white w-4 h-4" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  Borrower
                </h4>
              </div>
              <p className="text-gray-600 ml-11 text-sm">
                {lentItem?.borrowerFullName}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                  <FaCheckCircle className="text-white w-4 h-4" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">Role</h4>
              </div>
              <p className="text-gray-600 ml-11 text-sm">
                {lentItem?.borrowerRole}
              </p>
            </div>

            {studentIdNumber && (
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <FaHashtag className="text-white w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    Student ID
                  </h4>
                </div>
                <p className="text-gray-600 ml-11 text-sm">{studentIdNumber}</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <FaTools className="text-white w-4 h-4" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">Room</h4>
              </div>
              <p className="text-gray-600 ml-11 text-sm">{lentItem?.room}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <BsCalendar2Date className="text-white w-4 h-4" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  Schedule
                </h4>
              </div>
              <p className="text-gray-600 ml-11 text-sm">
                {lentItem?.subjectTimeSchedule}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                  <BsCalendar2Date className="text-white w-4 h-4" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">Lent At</h4>
              </div>
              <p className="text-gray-600 ml-11 text-sm">
                {FormattedDateTime(lentItem?.lentAt)}
              </p>
            </div>

            {lentItem?.returnedAt && (
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                    <BsCalendar2Date className="text-white w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    Returned At
                  </h4>
                </div>
                <p className="text-gray-600 ml-11 text-sm">
                  {FormattedDateTime(lentItem?.returnedAt)}
                </p>
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
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${SlugStatus(lentItem?.status)}`}
                >
                  {lentItem?.status}
                </span>
              </p>
            </div>
          </div>

          {/* Remarks */}
          {lentItem?.remarks && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center mr-3">
                  <MdOutlineDescription className="text-white w-4 h-4" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">Remarks</h4>
              </div>
              <p className="text-gray-600 ml-11 text-sm">{lentItem?.remarks}</p>
            </div>
          )}

          {/* Return Success Message */}
          {showReturnSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <FaCheckCircle className="text-green-600" />
                <span className="font-semibold">
                  Item returned successfully!
                </span>
              </div>
            </div>
          )}

          {/* Return Error Message */}
          {returnError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-semibold">{returnError}</span>
              </div>
            </div>
          )}

          {/* Return Button - Only show for Borrowed status */}
          {canReturn && (
            <div className="flex justify-center pt-2">
              <button
                onClick={handleReturn}
                disabled={isReturning}
                className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                  isReturning
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {isReturning ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
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
                    Returning...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="text-xl" />
                    Return Item
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function BorrowItem() {
  const [activeTab, setActiveTab] = useState<"browse" | "form">("form");
  const [prefilledItemId, setPrefilledItemId] = useState<string>("");
  const [prefilledItemName, setPrefilledItemName] = useState<string>("");
  const [scannedItem, setScannedItem] = useState<TItemList | null>(null);
  const [scannedLentItem, setScannedLentItem] = useState<any>(null);
  const [showReturnModal, setShowReturnModal] = useState<boolean>(false);
  const [returnBarcode, setReturnBarcode] = useState<string>("");
  const [returnError, setReturnError] = useState<string>("");
  const [returnSuccess, setReturnSuccess] = useState<boolean>(false);
  const [returnErrorMessage, setReturnErrorMessage] = useState<string>("");
  const [showReturnError, setShowReturnError] = useState<boolean>(false);
  const [showFloatingMenu, setShowFloatingMenu] = useState<boolean>(false);
  const [menuOpenedByClick, setMenuOpenedByClick] = useState<boolean>(false);

  const returnItemMutation = useReturnItem();

  const handleBorrowClick = (itemId: string, itemName: string) => {
    setPrefilledItemId(itemId);
    setPrefilledItemName(itemName);
    setActiveTab("form");
  };

  const handleLentItemScanned = (lentItem: any) => {
    setScannedLentItem(lentItem);
  };

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

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#f8fafc] via-[#e8eef7] to-[#dbeafe] flex flex-col overflow-hidden">
      {/* Return Success Alert */}
      <Activity mode={returnSuccess ? "visible" : "hidden"}>
        <SuccessAlert message="Item returned successfully!" />
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  returnError
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
                  className={`flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors ${
                    returnItemMutation.isPending
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
      </Activity>

      {/* Header */}
      <header className="flex-shrink-0 pt-6 md:pt-8 px-4 md:px-8 pb-4 md:pb-6 bg-white/70 backdrop-blur-md shadow-sm border-b border-[#e5e9f2] flex flex-col items-center">
        <h1 className="text-[#1e293b] text-3xl md:text-5xl mb-2 font-extrabold tracking-tight drop-shadow-lg">
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
            onClick={() => setActiveTab("form")}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 ${
              activeTab === "form"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            Borrow Form
          </button>
          <button
            onClick={() => setActiveTab("browse")}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 ${
              activeTab === "browse"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            Browse Items
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "browse" ? (
          <BorrowItemsTable onBorrowClick={handleBorrowClick} />
        ) : (
          <div className="h-full overflow-y-auto px-4 py-4 md:py-6">
            <div className="max-w-6xl mx-auto">
              <BorrowItemForm
                prefilledItemId={prefilledItemId}
                prefilledItemName={prefilledItemName}
                onLentItemScanned={handleLentItemScanned}
              />
            </div>
          </div>
        )}
      </div>

      {/* Scanned Item Details Modal */}
      {scannedItem && (
        <Activity mode="visible">
          <ItemDetailsModal
            item={scannedItem}
            onClose={() => setScannedItem(null)}
            onBorrow={handleBorrowClick}
          />
        </Activity>
      )}

      {/* Scanned Lent Item Details Modal */}
      <Activity mode={scannedLentItem ? "visible" : "hidden"}>
        <LentItemDetailsModal
          lentItem={scannedLentItem}
          onClose={() => setScannedLentItem(null)}
          onReturnSuccess={() => {
            setScannedLentItem(null);
            setReturnSuccess(true);
            setTimeout(() => {
              setReturnSuccess(false);
            }, 3000);
          }}
        />
      </Activity>

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
              setActiveTab("form");
              setShowFloatingMenu(false);
              setMenuOpenedByClick(false);
              // Trigger scan modal if BorrowItemForm has scan functionality
              setTimeout(() => {
                const scanButton = document.querySelector(
                  "[data-scan-trigger]",
                ) as HTMLButtonElement;
                if (scanButton) scanButton.click();
              }, 100);
            }}
            className={`flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 overflow-hidden ${
              showFloatingMenu
                ? "translate-x-0 opacity-100 pointer-events-auto delay-75 pr-4 pl-3"
                : "translate-x-full opacity-0 pointer-events-none pr-0 pl-3"
            }`}
            style={{
              borderRadius: "9999px 0 0 9999px",
            }}
            title="Scan Item"
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
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
              />
            </svg>
            <span
              className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                showFloatingMenu ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
              }`}
            >
              Scan Item
            </span>
          </button>

          {/* Return Button - Slides from right */}
          <button
            onClick={() => {
              setShowReturnModal(true);
              setShowFloatingMenu(false);
              setMenuOpenedByClick(false);
            }}
            className={`flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 overflow-hidden ${
              showFloatingMenu
                ? "translate-x-0 opacity-100 pointer-events-auto delay-150 pr-4 pl-3"
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
              className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                showFloatingMenu ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
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
        <Activity mode="visible">
          <div
            className="fixed inset-0 z-30"
            onClick={() => {
              setShowFloatingMenu(false);
              setMenuOpenedByClick(false);
            }}
          />
        </Activity>
      )}
    </div>
  );
}
