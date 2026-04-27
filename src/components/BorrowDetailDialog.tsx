/**
 * BorrowDetailDialog — Centralized borrow/lent item detail modal.
 *
 * Supports two usage modes:
 *  1. Fetch-by-ID  → pass `itemId` + `isOpen`  (PendingReservations, Dashboard)
 *  2. Pass-data    → pass `lentItem` directly   (BorrowItem scan result)
 *
 * Optional props:
 *  - `fromScan`        show "Proceed to Scan Item" footer action
 *  - `onProceedToScan` callback when scan is confirmed
 *  - `onReturnSuccess` callback after a successful return (pass-data mode)
 */

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MdInventory,
  MdCategory,
  MdBuild,
  MdDescription,
  MdImage,
  MdArchive,
} from "react-icons/md";
import {
  FaBox,
  FaTag,
  FaCalendarAlt,
  FaUser,
  FaDoorOpen,
  FaCheckCircle,
  FaIdCard,
  FaHashtag,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useRecentlyBorrowItems } from "../hooks/itemHooks";
import { FormattedDateTime } from "./FormattedDateTime";
import { SlugStatus } from "./SlugStatus";
import ErrorTable from "./ErrorTables";
import { useScanLentItemMutation } from "../query/patch/useScanLentItemMutation";
import { getToken } from "../utils/token";
import type { TRecentBorrowItemProps } from "../@types/types";

// ─── Shared item shape ────────────────────────────────────────────────────────

type LentItemData = {
  id: string;
  userId: string | null;
  teacherId: string;
  borrowerFullName: string;
  borrowerRole: string;
  teacherFullName: string;
  room: string;
  subjectTimeSchedule: string;
  lentAt: string;
  returnedAt: string;
  status: string;
  remarks: string | null;
  isHiddenFromUser: boolean;
  frontStudentIdPicture?: string | null;
  studentIdNumber?: string | null;
  reservedFor?: string | null;
  guestImage?: string | null;
  item: {
    id: string;
    serialNumber: string;
    image: string | null;
    itemName: string;
    itemType: string;
    itemModel: string;
    itemMake: string;
    description: string;
    category: string;
    condition: string;
    createdAt: string;
    updatedAt: string;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    phoneNumber: string;
    userRole: string;
    frontStudentIdPicture?: string | null;
    backStudentIdPicture?: string | null;
    studentIdNumber?: string;
    course?: string;
    section?: string;
    year?: string;
  };
};

// ─── Props ────────────────────────────────────────────────────────────────────

type FetchByIdProps = {
  /** Fetch mode: provide the lent-item ID and open state */
  itemId: string;
  isOpen: boolean;
  lentItem?: never;
  fromScan?: boolean;
  onProceedToScan?: () => void;
  onReturnSuccess?: never;
  onClose: () => void;
};

type PassDataProps = {
  /** Pass-data mode: provide the full item object directly */
  lentItem: (TRecentBorrowItemProps & { studentIdNumber?: string | null; frontStudentIdPicture?: string | null; itemName?: string });
  itemId?: never;
  isOpen?: never;
  fromScan?: never;
  onProceedToScan?: never;
  onReturnSuccess?: () => void;
  onClose: () => void;
};

type BorrowDetailDialogProps = FetchByIdProps | PassDataProps;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
      <span className="mt-0.5 text-base text-blue-500 flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-800 break-words">{value || "N/A"}</p>
      </div>
    </div>
  );
}

function SectionHeading({ icon, title, color = "text-blue-600" }: { icon: React.ReactNode; title: string; color?: string }) {
  return (
    <div className={`flex items-center gap-2 mb-3 ${color}`}>
      <span className="text-lg">{icon}</span>
      <h3 className="text-sm font-bold uppercase tracking-wider">{title}</h3>
    </div>
  );
}

function ItemImage({ src, alt }: { src: string | null | undefined; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-40 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <MdImage className="text-4xl text-gray-300 mb-1" />
        <span className="text-xs text-gray-400">No image available</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="w-full h-40 object-contain rounded-xl bg-gray-50 border border-gray-100"
    />
  );
}

// ─── Inner dialog (receives resolved data) ────────────────────────────────────

type InnerProps = {
  data: LentItemData;
  onClose: () => void;
  fromScan?: boolean;
  onProceedToScan?: () => void;
  onReturnSuccess?: () => void;
};

function DialogContent({ data, onClose, fromScan, onProceedToScan, onReturnSuccess }: InnerProps) {
  const isStudent = data.borrowerRole?.toLowerCase() === "student";
  const canReturn = data.status?.toLowerCase() === "borrowed";

  // Scan-to-proceed state
  const [showScanModal, setShowScanModal] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [scanError, setScanError] = useState("");
  const scanMutation = useScanLentItemMutation();

  // Return state (pass-data mode)
  const [isReturning, setIsReturning] = useState(false);
  const [returnError, setReturnError] = useState("");
  const [returnSuccess, setReturnSuccess] = useState(false);

  const handleReturn = async () => {
    if (!canReturn) return;
    setIsReturning(true);
    setReturnError("");
    try {
      const encodedBarcode = encodeURIComponent((data as any).barcode ?? "");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/lentItems/scan/${encodedBarcode}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
          body: JSON.stringify({ lentItemsStatus: "Returned" }),
        },
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to return item");
      }
      setReturnSuccess(true);
      setTimeout(() => { onClose(); onReturnSuccess?.(); }, 1500);
    } catch (e: unknown) {
      setReturnError(e instanceof Error ? e.message : "Failed to return item");
    } finally {
      setIsReturning(false);
    }
  };

  const handleScanSubmit = async () => {
    setScanError("");
    const barcode = scannedBarcode.trim();
    if (!barcode) { setScanError("Please enter an item barcode"); return; }
    if (barcode !== data.item.serialNumber) {
      setScanError("Scanned barcode does not match this item");
      return;
    }
    try {
      await scanMutation.mutateAsync({ barcode: (data as any).barcode || "", lentItemsStatus: "Borrowed" });
      setShowScanModal(false);
      setScannedBarcode("");
      onProceedToScan?.();
      onClose();
    } catch (e: any) {
      setScanError(e.message || "Failed to update item status");
    }
  };

  const showProceedFooter =
    fromScan &&
    (data.status?.toLowerCase() === "pending" || data.status?.toLowerCase() === "approved");

  return (
    <>
      {/* ── Overlay ── */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <div
          className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white rounded-t-2xl flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <MdArchive className="text-blue-600 text-lg" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-gray-900 truncate leading-tight">
                  {data.item.itemName}
                </h2>
                <p className="text-xs text-gray-400 leading-tight">Borrow Item Details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-4 shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-red-500 transition-colors"
            >
              <IoMdClose className="w-5 h-5" />
            </button>
          </div>

          {/* ── Scrollable body ── */}
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

            {/* ── Item section ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Image */}
              <div className="sm:col-span-1">
                <SectionHeading icon={<MdImage />} title="Item Image" />
                <ItemImage src={data.item.image} alt={data.item.itemName} />
              </div>

              {/* Item info grid */}
              <div className="sm:col-span-2">
                <SectionHeading icon={<MdInventory />} title="Item Information" />
                <div className="grid grid-cols-2 gap-2">
                  <InfoRow icon={<FaHashtag />} label="Serial Number" value={data.item.serialNumber} />
                  <InfoRow icon={<MdCategory />} label="Category" value={data.item.category} />
                  <InfoRow icon={<MdBuild />} label="Type" value={data.item.itemType} />
                  <InfoRow icon={<FaTag />} label="Make" value={data.item.itemMake} />
                  <InfoRow icon={<FaBox />} label="Model" value={data.item.itemModel} />
                  <InfoRow
                    icon={<FaCheckCircle />}
                    label="Condition"
                    value={
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${SlugStatus(data.item.condition) || "bg-gray-100 text-gray-700"}`}>
                        {data.item.condition}
                      </span>
                    }
                  />
                </div>
              </div>
            </div>

            {/* ── Description ── */}
            {data.item.description && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <SectionHeading icon={<MdDescription />} title="Description" />
                <p className="text-sm text-gray-600 leading-relaxed">{data.item.description}</p>
              </div>
            )}

            {/* ── Borrower section ── */}
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <SectionHeading icon={<FaUser />} title="Borrower Information" color="text-orange-600" />
              <div className="grid grid-cols-2 gap-2">
                <InfoRow icon={<FaUser />} label="Borrower Name" value={data.borrowerFullName} />
                <InfoRow icon={<FaTag />} label="Role" value={data.borrowerRole} />
                <InfoRow icon={<FaUser />} label="Teacher" value={data.teacherFullName} />
                <InfoRow icon={<FaDoorOpen />} label="Room" value={data.room} />
                <InfoRow icon={<FaCalendarAlt />} label="Subject / Schedule" value={data.subjectTimeSchedule} />
                <InfoRow
                  icon={<MdArchive />}
                  label="Status"
                  value={
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${SlugStatus(data.status) || "bg-gray-100 text-gray-700"}`}>
                      {data.status}
                    </span>
                  }
                />
                <InfoRow
                  icon={<FaCalendarAlt />}
                  label="Lent At"
                  value={data.lentAt ? FormattedDateTime(data.lentAt) : "N/A"}
                />
                <InfoRow
                  icon={<FaCalendarAlt />}
                  label="Returned At"
                  value={data.returnedAt ? FormattedDateTime(data.returnedAt) : "Not yet returned"}
                />
                {data.reservedFor && (
                  <InfoRow
                    icon={<FaCalendarAlt />}
                    label="Reserved For"
                    value={FormattedDateTime(data.reservedFor)}
                  />
                )}
              </div>

              {/* Remarks */}
              {data.remarks && (
                <div className="mt-3 bg-white rounded-lg p-3 border border-orange-100">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Remarks</p>
                  <p className="text-sm text-gray-700">{data.remarks}</p>
                </div>
              )}
            </div>

            {/* ── Student ID card ── */}
            {isStudent && (
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <SectionHeading icon={<FaIdCard />} title="Student ID Card" color="text-purple-600" />
                <div className="flex justify-center">
                  {data.frontStudentIdPicture || data.user?.frontStudentIdPicture ? (
                    <img
                      src={data.frontStudentIdPicture || data.user?.frontStudentIdPicture || ""}
                      alt="Student ID"
                      className="max-h-52 object-contain rounded-xl shadow-sm border border-purple-100"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                      <FaIdCard className="text-4xl text-gray-300 mb-1" />
                      <span className="text-xs">Student ID image not available</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Guest photo ── */}
            {data.guestImage && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <SectionHeading icon={<FaUser />} title="Borrower Photo" color="text-gray-600" />
                <div className="flex justify-center">
                  <img
                    src={data.guestImage}
                    alt="Borrower"
                    className="max-h-52 object-contain rounded-xl shadow-sm border border-gray-200"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              </div>
            )}

            {/* ── Student account details ── */}
            {isStudent && data.user && (
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <SectionHeading icon={<FaIdCard />} title="Student Details" color="text-purple-600" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: "Student ID", value: data.user.studentIdNumber },
                    { label: "Email", value: data.user.email },
                    { label: "Phone", value: data.user.phoneNumber },
                    { label: "Course", value: data.user.course },
                    { label: "Section", value: data.user.section },
                    { label: "Year", value: data.user.year },
                  ]
                    .filter((f) => f.value)
                    .map(({ label, value }) => (
                      <div key={label} className="bg-white rounded-lg p-3 border border-purple-100 shadow-sm">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
                        <p className="text-sm font-semibold text-gray-800">{value}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ── Return feedback ── */}
            {returnSuccess && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm font-semibold">
                <FaCheckCircle className="text-green-600" /> Item returned successfully!
              </div>
            )}
            {returnError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm font-semibold">
                {returnError}
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          {(canReturn || showProceedFooter) && (
            <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>

              {showProceedFooter && (
                <button
                  onClick={() => setShowScanModal(true)}
                  className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Proceed to Scan Item
                </button>
              )}

              {canReturn && !showProceedFooter && (
                <button
                  onClick={handleReturn}
                  disabled={isReturning}
                  className={`px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors flex items-center gap-2 ${isReturning ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                >
                  {isReturning ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Returning…
                    </>
                  ) : (
                    <><FaCheckCircle /> Return Item</>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Scan Item sub-modal ── */}
      {showScanModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          onClick={() => setShowScanModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-base font-bold text-gray-900">Scan Item Barcode</h2>
              <button onClick={() => setShowScanModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-red-500 transition-colors">
                <IoMdClose className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Scan the <strong>item barcode</strong> to verify and complete the process.
              </p>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700 font-semibold mb-0.5">Expected Barcode</p>
                <p className="text-sm text-blue-900 font-mono">{data.item.serialNumber}</p>
              </div>
              <input
                type="text"
                autoFocus
                value={scannedBarcode}
                onChange={(e) => { setScannedBarcode(e.target.value); setScanError(""); }}
                onKeyDown={(e) => { if (e.key === "Enter") handleScanSubmit(); }}
                placeholder="Scan or enter item barcode"
                className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent ${scanError ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`}
              />
              {scanError && <p className="text-red-500 text-xs">{scanError}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowScanModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScanSubmit}
                  disabled={scanMutation.isPending}
                  className={`flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors ${scanMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {scanMutation.isPending ? "Processing…" : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export function BorrowDetailDialog(props: BorrowDetailDialogProps) {
  // ── Pass-data mode ──
  if (props.lentItem !== undefined) {
    const d = props.lentItem;
    // Normalise into LentItemData shape
    const normalised: LentItemData = {
      id: d.id,
      userId: d.userId,
      teacherId: d.teacherId,
      borrowerFullName: d.borrowerFullName,
      borrowerRole: d.borrowerRole,
      teacherFullName: d.teacherFullName,
      room: d.room,
      subjectTimeSchedule: d.subjectTimeSchedule,
      lentAt: d.lentAt,
      returnedAt: d.returnedAt,
      status: d.status,
      remarks: d.remarks,
      isHiddenFromUser: d.isHiddenFromUser,
      frontStudentIdPicture: d.frontStudentIdPicture,
      studentIdNumber: d.studentIdNumber,
      reservedFor: d.reservedFor,
      guestImage: d.guestImage,
      item: d.item,
    };
    return (
      <DialogContent
        data={normalised}
        onClose={props.onClose}
        onReturnSuccess={props.onReturnSuccess}
      />
    );
  }

  // ── Fetch-by-ID mode ──
  return (
    <FetchById
      itemId={props.itemId}
      isOpen={props.isOpen}
      onClose={props.onClose}
      fromScan={props.fromScan}
      onProceedToScan={props.onProceedToScan}
    />
  );
}

// ─── Fetch-by-ID wrapper ──────────────────────────────────────────────────────

function FetchById({
  itemId,
  isOpen,
  onClose,
  fromScan,
  onProceedToScan,
}: {
  itemId: string;
  isOpen: boolean;
  onClose: () => void;
  fromScan?: boolean;
  onProceedToScan?: () => void;
}) {
  const [itemData, setItemData] = useState<LentItemData | null>(null);

  const { data, isPending, isError } = useQuery({
    ...useRecentlyBorrowItems(itemId),
    enabled: isOpen && !!itemId,
  });

  useEffect(() => {
    if (data?.data) setItemData(data.data);
  }, [data]);

  if (!isOpen || !itemId) return null;

  if (isPending) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex items-center justify-center h-64">
          <div className="w-10 h-10 rounded-full border-b-2 border-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8" onClick={(e) => e.stopPropagation()}>
          <ErrorTable />
        </div>
      </div>
    );
  }

  if (!itemData?.item) return null;

  return (
    <DialogContent
      data={itemData}
      onClose={onClose}
      fromScan={fromScan}
      onProceedToScan={onProceedToScan}
    />
  );
}
