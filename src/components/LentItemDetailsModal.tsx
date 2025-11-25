import { useQuery } from "@tanstack/react-query";
import {
    MdInventory,
    MdCategory,
    MdBuild,
    MdDescription,
    MdCode,
    MdImage,
    MdQrCode,
    MdArchive,
} from "react-icons/md";
import { FaBox, FaTag, FaCalendarAlt, FaUser, FaDoorOpen, FaCheckCircle, FaIdCard } from "react-icons/fa";
import { useViewBorrowItemCredentials } from "../query/get/useViewBorrowItemCredentials.ts";
import { FormattedDateTime } from "./FormattedDateTime.ts";
import ErrorTable from "../components/ErrorTables.tsx";
import { useEffect, useState } from "react";
import { useScanLentItemMutation } from "../query/patch/useScanLentItemMutation.ts";

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
    studentIdNumber?: string;
    barcode?: string | null;
    barcodeImage?: string | null;
    item: {
        id: string;
        serialNumber: string;
        barcode: string | null;
        barcodeImage: string | null;
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

type LentItemDetailsModalProps = {
    itemId: string;
    isOpen: boolean;
    onClose: () => void;
    fromScan?: boolean;
    onProceedToScan?: () => void;
};

export const LentItemDetailsModal = ({
    itemId,
    isOpen,
    onClose,
    fromScan = false,
    onProceedToScan,
}: LentItemDetailsModalProps) => {
    const [itemData, setItemData] = useState<LentItemData | null>(null);
    const [enlargedBarcode, setEnlargedBarcode] = useState<{ image: string; label: string; code?: string } | null>(null);
    const [showScanItemModal, setShowScanItemModal] = useState<boolean>(false);
    const [scannedItemBarcode, setScannedItemBarcode] = useState<string>("");
    const [scanItemError, setScanItemError] = useState<string>("");

    const { data, isPending, isError } = useQuery({
        ...useViewBorrowItemCredentials(itemId),
        enabled: isOpen && !!itemId,
    });

    const scanLentItemMutation = useScanLentItemMutation();

    useEffect(() => {
        if (data?.data) {
            console.log('=== LentItem Data Debug ===');
            console.log('Full Data:', data.data);
            console.log('Borrower Role:', data.data.borrowerRole);
            console.log('Front Student ID Picture (direct):', data.data.frontStudentIdPicture);
            console.log('User Object:', data.data.user);
            console.log('User Front Student ID Picture:', data.data.user?.frontStudentIdPicture);
            console.log('fromScan prop:', fromScan);
            console.log('========================');
            setItemData(data.data);
        }
    }, [data, fromScan]);

    if (!isOpen) return null;

    if (!itemId) return null;

    if (isPending) {
        return (
            <div className="flex fixed inset-0 z-50 justify-center items-center">
                <div className="absolute inset-0 bg-black/50" />
                <div className="overflow-hidden relative z-10 w-full max-w-5xl bg-white rounded-lg shadow-xl max-h-[90vh]">
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 rounded-full border-b-2 border-blue-600 animate-spin"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !data?.data) {
        return (
            <div className="flex fixed inset-0 z-50 justify-center items-center">
                <div className="absolute inset-0 bg-black/50" onClick={onClose} />
                <div className="overflow-hidden relative z-10 w-full max-w-3xl bg-white rounded-lg shadow-xl max-h-[80vh]">
                    <div className="flex justify-center items-center h-64">
                        <ErrorTable />
                    </div>
                </div>
            </div>
        );
    }

    if (!itemData || !itemData.item) return null;

    const isStudent = itemData.borrowerRole?.toLowerCase() === "student";

    const handleProceedClick = () => {
        setShowScanItemModal(true);
    };

    const handleScanItemSubmit = async () => {
        setScanItemError("");
        const barcode = scannedItemBarcode.trim();

        if (!barcode) {
            setScanItemError("Please enter an item barcode");
            return;
        }

        // Validate that the scanned barcode matches the item's barcode
        if (barcode !== itemData.item.barcode && barcode !== itemData.item.serialNumber) {
            setScanItemError("Scanned barcode does not match this item");
            return;
        }

        try {
            // Update the status to Borrowed using the lent item barcode
            await scanLentItemMutation.mutateAsync({
                barcode: itemData.barcode || "",
                lentItemsStatus: "Borrowed"
            });

            // Success - close modals and trigger callback if provided
            setShowScanItemModal(false);
            setScannedItemBarcode("");
            setScanItemError("");

            if (onProceedToScan) {
                onProceedToScan();
            }

            onClose();
        } catch (error: any) {
            setScanItemError(error.message || "Failed to update item status");
        }
    };

    return (
        <>
            <div className="flex fixed inset-0 z-50 justify-center items-center">
                <div className="absolute inset-0 bg-black/50" onClick={onClose} />
                <div className="overflow-hidden relative z-10 w-full max-w-6xl bg-white rounded-lg shadow-xl max-h-[90vh]">
                    {/* Header */}
                    <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-800">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                                    <MdArchive className="text-2xl text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Lent Item Details</h2>
                                    <p className="text-blue-100">Complete borrowing information</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className={`overflow-y-auto p-6 space-y-6 scrollbar-none ${fromScan ? 'max-h-[calc(90vh-200px)]' : 'max-h-[calc(90vh-120px)]'}`}>
                        {/* Item Information Section */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Item Image */}
                            <div className="space-y-4">
                                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                    <MdImage className="mr-2 text-blue-600" /> Item Image
                                </h3>
                                <div className="flex justify-center items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    {itemData.item.image ? (
                                        <img
                                            src={itemData.item.image}
                                            alt={itemData.item.itemName}
                                            className="object-contain max-w-full max-h-64 rounded-lg shadow-sm"
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                                const parent = e.currentTarget.parentElement;
                                                if (parent) {
                                                    parent.innerHTML = `
                                                    <div class="text-center text-gray-500">
                                                        <svg class="mx-auto mb-2 w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <p>No image available</p>
                                                    </div>
                                                `;
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className="text-center text-gray-500">
                                            <MdImage className="mx-auto mb-2 text-6xl text-gray-300" />
                                            <p>No image available</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Item Basic Info */}
                            <div className="space-y-4">
                                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                    <MdInventory className="mr-2 text-blue-600" /> Item Information
                                </h3>
                                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    {[
                                        { icon: <FaBox />, label: "Item Name", value: itemData.item.itemName },
                                        { icon: <MdCode />, label: "Serial Number", value: itemData.item.serialNumber },
                                        { icon: <MdCategory />, label: "Category", value: itemData.item.category },
                                        { icon: <MdBuild />, label: "Type", value: itemData.item.itemType },
                                        { icon: <FaTag />, label: "Model", value: itemData.item.itemModel },
                                        { icon: <MdBuild />, label: "Make", value: itemData.item.itemMake },
                                        { icon: <FaCheckCircle />, label: "Condition", value: itemData.item.condition },
                                    ].map(({ icon, label, value }, i) => (
                                        <div key={i} className="flex items-center space-x-3">
                                            <span className="text-lg text-blue-600">{icon}</span>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
                                                <p className="font-semibold text-gray-900">{value || "N/A"}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Barcodes Section */}
                            <div className="space-y-4">
                                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                    <MdQrCode className="mr-2 text-blue-600" /> Barcodes
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {/* Item Barcode */}
                                    <button
                                        onClick={() => itemData.item.barcodeImage && setEnlargedBarcode({
                                            image: itemData.item.barcodeImage,
                                            label: "Item Barcode",
                                            code: itemData.item.barcode || undefined
                                        })}
                                        disabled={!itemData.item.barcodeImage}
                                        className={`bg-gray-50 rounded-lg border border-gray-200 p-3 w-full transition-all ${itemData.item.barcodeImage
                                            ? 'hover:bg-blue-50 hover:border-blue-300 cursor-pointer'
                                            : 'cursor-not-allowed'
                                            }`}
                                    >
                                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 text-center">
                                            Item Barcode
                                        </p>
                                        <div className="flex flex-col justify-center items-center">
                                            {itemData.item.barcodeImage ? (
                                                <>
                                                    <img
                                                        src={itemData.item.barcodeImage}
                                                        alt="Item Barcode"
                                                        className="object-contain max-w-full max-h-24"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = "none";
                                                            const parent = e.currentTarget.parentElement;
                                                            if (parent) {
                                                                parent.innerHTML = `
                                                                <div class="text-center text-gray-400 py-4">
                                                                    <p class="text-xs">Not available</p>
                                                                </div>
                                                            `;
                                                            }
                                                        }}
                                                    />
                                                    {itemData.item.barcode && (
                                                        <p className="text-xs text-gray-600 font-mono mt-2">{itemData.item.barcode}</p>
                                                    )}
                                                    <p className="text-xs text-blue-600 mt-2">Click to enlarge for scanning</p>
                                                </>
                                            ) : (
                                                <div className="text-center text-gray-400 py-4">
                                                    <p className="text-xs">Not available</p>
                                                </div>
                                            )}
                                        </div>
                                    </button>

                                    {/* Lent Item Generated Code */}
                                    <button
                                        onClick={() => itemData.barcodeImage && setEnlargedBarcode({
                                            image: itemData.barcodeImage,
                                            label: "Lent Item Generated Code",
                                            code: itemData.barcode || undefined
                                        })}
                                        disabled={!itemData.barcodeImage}
                                        className={`bg-gray-50 rounded-lg border border-gray-200 p-3 w-full transition-all ${itemData.barcodeImage
                                            ? 'hover:bg-blue-50 hover:border-blue-300 cursor-pointer'
                                            : 'cursor-not-allowed'
                                            }`}
                                    >
                                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 text-center">
                                            Lent Item Generated Code
                                        </p>
                                        <div className="flex flex-col justify-center items-center">
                                            {itemData.barcodeImage ? (
                                                <>
                                                    <img
                                                        src={itemData.barcodeImage}
                                                        alt="Lent Item Barcode"
                                                        className="object-contain max-w-full max-h-24"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = "none";
                                                            const parent = e.currentTarget.parentElement;
                                                            if (parent) {
                                                                parent.innerHTML = `
                                                                <div class="text-center text-gray-400 py-4">
                                                                    <p class="text-xs">Not available</p>
                                                                </div>
                                                            `;
                                                            }
                                                        }}
                                                    />
                                                    {itemData.barcode && (
                                                        <p className="text-xs text-gray-600 font-mono mt-2">{itemData.barcode}</p>
                                                    )}
                                                    <p className="text-xs text-blue-600 mt-2">Click to enlarge for scanning</p>
                                                </>
                                            ) : (
                                                <div className="text-center text-gray-400 py-4">
                                                    <p className="text-xs">Not available</p>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Item Description */}
                        {itemData.item.description && (
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h3 className="flex items-center mb-2 text-lg font-semibold text-gray-900">
                                    <MdDescription className="mr-2 text-blue-600" /> Description
                                </h3>
                                <p className="text-gray-700">{itemData.item.description}</p>
                            </div>
                        )}

                        {/* Borrower Information */}
                        <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200">
                            <h3 className="flex items-center mb-4 text-xl font-bold text-gray-900">
                                <FaUser className="mr-2 text-orange-600" /> Borrower Information
                            </h3>

                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                {/* Borrower Details */}
                                <div className="lg:col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {[
                                        { icon: <FaUser />, label: "Borrower Name", value: itemData.borrowerFullName },
                                        { icon: <FaTag />, label: "Role", value: itemData.borrowerRole },
                                        { icon: <FaUser />, label: "Teacher", value: itemData.teacherFullName || "N/A" },
                                        { icon: <FaDoorOpen />, label: "Room", value: itemData.room || "N/A" },
                                        { icon: <FaCalendarAlt />, label: "Subject/Schedule", value: itemData.subjectTimeSchedule || "N/A" },
                                        { icon: <MdArchive />, label: "Status", value: itemData.status },
                                        { icon: <FaCalendarAlt />, label: "Lent At", value: itemData.lentAt ? FormattedDateTime(itemData.lentAt) : "N/A" },
                                        { icon: <FaCalendarAlt />, label: "Returned At", value: itemData.returnedAt ? FormattedDateTime(itemData.returnedAt) : "Not yet returned" },
                                    ].map(({ icon, label, value }, i) => (
                                        <div key={i} className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm">
                                            <span className="text-lg text-orange-600">{icon}</span>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
                                                <p className="font-semibold text-gray-900">{value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Student ID Picture - Show if student */}
                                {isStudent && (
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <h4 className="flex items-center font-semibold text-gray-900 mb-3">
                                            <FaIdCard className="mr-2 text-purple-600" /> Student ID Card
                                        </h4>
                                        <div className="flex justify-center items-center p-2 bg-gray-50 rounded-lg border border-gray-200 min-h-[200px]">
                                            {(itemData.frontStudentIdPicture || itemData.user?.frontStudentIdPicture) ? (
                                                <img
                                                    src={itemData.frontStudentIdPicture || itemData.user?.frontStudentIdPicture || ''}
                                                    alt="Student ID"
                                                    className="object-contain max-w-full max-h-56 rounded-lg shadow-sm"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                        const parent = e.currentTarget.parentElement;
                                                        if (parent) {
                                                            parent.innerHTML = `
                                                            <div class="text-center text-gray-500 py-8">
                                                                <svg class="mx-auto mb-2 w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                                                </svg>
                                                                <p class="text-sm">Failed to load ID image</p>
                                                            </div>
                                                        `;
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div className="text-center text-gray-500 py-8">
                                                    <FaIdCard className="mx-auto mb-2 text-4xl text-gray-300" />
                                                    <p className="text-sm">Student ID image not available</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Direct: {itemData.frontStudentIdPicture ? 'Yes' : 'No'} |
                                                        User: {itemData.user?.frontStudentIdPicture ? 'Yes' : 'No'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Remarks */}
                            {itemData.remarks && (
                                <div className="mt-4 p-3 bg-white rounded-lg shadow-sm">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Remarks</p>
                                    <p className="text-gray-700">{itemData.remarks}</p>
                                </div>
                            )}
                        </div>

                        {/* Additional Student Details - Only show for students with account */}
                        {isStudent && itemData.user && (
                            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200">
                                <h3 className="flex items-center mb-4 text-xl font-bold text-gray-900">
                                    <FaIdCard className="mr-2 text-purple-600" /> Student Details
                                </h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    {[
                                        { label: "Student ID", value: itemData.user.studentIdNumber },
                                        { label: "Email", value: itemData.user.email },
                                        { label: "Phone", value: itemData.user.phoneNumber },
                                        { label: "Course", value: itemData.user.course },
                                        { label: "Section", value: itemData.user.section },
                                        { label: "Year", value: itemData.user.year },
                                    ].map(({ label, value }, i) => (
                                        value && (
                                            <div key={i} className="bg-white p-3 rounded-lg shadow-sm">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
                                                <p className="font-semibold text-gray-900">{value}</p>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer with Proceed Button - Only show when opened from scan and status is Pending or Approved */}
                    {fromScan && (itemData.status.toLowerCase() === 'pending' || itemData.status.toLowerCase() === 'approved') && (
                        <div className="p-6 bg-gray-50 border-t border-gray-200">
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleProceedClick}
                                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    Proceed to Scan Item
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Enlarged Barcode Modal */}
                {enlargedBarcode && (
                    <div
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                        onClick={() => setEnlargedBarcode(null)}
                    >
                        <div
                            className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 animate-slideIn"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">{enlargedBarcode.label}</h3>
                                <button
                                    onClick={() => setEnlargedBarcode(null)}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg border-2 border-gray-200">
                                <img
                                    src={enlargedBarcode.image}
                                    alt={enlargedBarcode.label}
                                    className="object-contain max-w-full max-h-96"
                                />
                                {enlargedBarcode.code && (
                                    <p className="text-2xl font-mono font-bold text-gray-900 mt-6 tracking-wider">
                                        {enlargedBarcode.code}
                                    </p>
                                )}
                            </div>

                            <p className="text-center text-gray-600 mt-6">
                                Position your scanner over the barcode to scan
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Scan Item Modal */}
            {showScanItemModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4" onClick={() => setShowScanItemModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                            <h2 className="text-xl font-bold text-gray-900">Scan Item Barcode</h2>
                            <button
                                onClick={() => setShowScanItemModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                Scan the <strong>item barcode</strong> to verify and complete the process.
                            </p>
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs text-blue-800 font-medium">Expected Barcode:</p>
                                <p className="text-sm text-blue-900 font-mono mt-1">{itemData.item.barcode || itemData.item.serialNumber}</p>
                            </div>
                            <input
                                type="text"
                                autoFocus
                                value={scannedItemBarcode}
                                onChange={(e) => {
                                    setScannedItemBarcode(e.target.value);
                                    setScanItemError("");
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleScanItemSubmit();
                                    }
                                }}
                                placeholder="Scan or enter item barcode"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${scanItemError
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {scanItemError && (
                                <p className="text-red-500 text-sm mt-2">{scanItemError}</p>
                            )}
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowScanItemModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleScanItemSubmit}
                                    disabled={scanLentItemMutation.isPending}
                                    className={`flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors ${scanLentItemMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {scanLentItemMutation.isPending ? 'Processing...' : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
