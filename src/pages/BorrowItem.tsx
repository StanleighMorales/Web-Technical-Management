import React, { useEffect, useState, useMemo, useCallback } from 'react';
import type { TBorrowItemForm, TItemList } from '../types/types';
import { SuccessAlert } from '../components/SuccessAlert';
import { ErrorAlert } from '../components/ErrorAlert';
import { useQuery } from '@tanstack/react-query';
import { useAllItemsQuery } from '../query/get/useAllItemsQuery';
import { usePostBorrowItemMutation } from '../query/post/usePostBorrowItemMutation';
import { useReturnItemMutation } from '../query/patch/useReturnItemMutation';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import { InventoryBadges } from '../components/InventoryBadges';
import logo from '../assets/img/aclcLogo.webp';
import { FormattedDateTime } from '../components/FormatedDateTime';
import { SlugCondition } from '../components/SlugCondition';
import InventoryListSkeletonLoader from '../loader/InventoryListSkeletonLoader';
import ErrorTable from '../components/ErrorTables';
import { MdSwapHoriz } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import { FaHashtag, FaTools, FaCheckCircle } from 'react-icons/fa';
import { BsCalendar2Date } from 'react-icons/bs';
import { MdOutlineDescription } from 'react-icons/md';

type ItemDetailsModalProps = {
    item: TItemList;
    onClose: () => void;
    onBorrow: (itemId: string, itemName: string) => void;
};

const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({ item, onClose, onBorrow }) => {
    const handleBorrowClick = () => {
        onBorrow(item.id, item.itemName);
        onClose();
    };
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Item Details</h2>
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
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{item.itemName}</h3>
                        <p className="text-gray-600 font-semibold">{item.category}</p>
                    </div>

                    {/* Image */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex justify-center">
                            {item.image ? (
                                <img
                                    src={typeof item.image === 'string' ? item.image : logo}
                                    alt={item.itemName}
                                    className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-lg shadow-md"
                                />
                            ) : (
                                <div className="w-48 h-48 md:w-64 md:h-64 flex flex-col items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                                    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-500 text-sm">No Image Available</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
                                    <FaHashtag className="text-white w-4 h-4" />
                                </div>
                                <h4 className="font-semibold text-gray-900 text-sm">Serial Number</h4>
                            </div>
                            <p className="text-gray-600 ml-11 text-sm">{item.serialNumber}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                                    <FaCheckCircle className="text-white w-4 h-4" />
                                </div>
                                <h4 className="font-semibold text-gray-900 text-sm">Condition</h4>
                            </div>
                            <p className="text-gray-600 ml-11 text-sm">{item.condition}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                                    <FaTools className="text-white w-4 h-4" />
                                </div>
                                <h4 className="font-semibold text-gray-900 text-sm">Item Make</h4>
                            </div>
                            <p className="text-gray-600 ml-11 text-sm">{item.itemMake}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                                    <FaTools className="text-white w-4 h-4" />
                                </div>
                                <h4 className="font-semibold text-gray-900 text-sm">Item Type</h4>
                            </div>
                            <p className="text-gray-600 ml-11 text-sm">{item.itemType}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                                    <FaHashtag className="text-white w-4 h-4" />
                                </div>
                                <h4 className="font-semibold text-gray-900 text-sm">Item Model</h4>
                            </div>
                            <p className="text-gray-600 ml-11 text-sm">{item.itemModel || 'N/A'}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                                    <BsCalendar2Date className="text-white w-4 h-4" />
                                </div>
                                <h4 className="font-semibold text-gray-900 text-sm">Date Added</h4>
                            </div>
                            <p className="text-gray-600 ml-11 text-sm">{FormattedDateTime(item.createdAt)}</p>
                        </div>
                    </div>

                    {/* Description */}
                    {item.description && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                                    <MdOutlineDescription className="text-white w-4 h-4" />
                                </div>
                                <h4 className="font-semibold text-gray-900 text-sm">Description</h4>
                            </div>
                            <p className="text-gray-600 ml-11 text-sm">{item.description}</p>
                        </div>
                    )}

                    {/* Borrow Button */}
                    <div className="flex justify-center pt-2">
                        <button
                            onClick={handleBorrowClick}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <MdSwapHoriz className="text-xl" />
                            Borrow This Item
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BorrowItemForm = ({ prefilledItemId, prefilledItemName, onItemScanned }: { prefilledItemId?: string; prefilledItemName?: string; onItemScanned?: (item: TItemList) => void }) => {
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showScanModal, setShowScanModal] = useState<boolean>(false);
    const [scannedBarcode, setScannedBarcode] = useState<string>("");
    const [scanError, setScanError] = useState<string>("");
    const [itemIdError, setItemIdError] = useState<string>("");
    const [borrowerFirstNameError, setBorrowerFirstNameError] = useState<string>("");
    const [borrowerLastNameError, setBorrowerLastNameError] = useState<string>("");
    const [borrowerTeacherFirstNameError, setBorrowerTeacherFirstNameError] = useState<string>("");
    const [borrowerTeacherLastNameError, setBorrowerTeacherLastNameError] = useState<string>("");
    const [borrowerStudentIdNumberError, setBorrowerStudentIdNumberError] = useState<string>("");
    const [borrowerRoleError, setBorrowerRoleError] = useState<string>("");
    const [roomError, setRoomError] = useState<string>("");
    const [subjectTimeScheduleError, setSubjectTimeScheduleError] = useState<string>("");
    const [itemName, setItemName] = useState<TItemList[]>([]);
    const [formData, setFormData] = useState<TBorrowItemForm>({
        itemId: prefilledItemId || "",
        itemName: prefilledItemName || "",
        borrowerFirstName: "",
        borrowerLastName: "",
        borrowerRole: "",
        teacherFirstName: "",
        teacherLastName: "",
        room: "",
        subjectTimeSchedule: "",
        remarks: "",
        studentIdNumber: "",
    });

    const borrowItemMutation = usePostBorrowItemMutation();

    const { data } = useQuery(useAllItemsQuery());

    useEffect(() => {
        if (!data) return;
        if (data) {
            setItemName(data)
        }
    }, [data])

    useEffect(() => {
        if (prefilledItemId) {
            setFormData(prev => ({
                ...prev,
                itemId: prefilledItemId,
                itemName: prefilledItemName || ""
            }));
        }
    }, [prefilledItemId, prefilledItemName]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value === "" ? null : value,
        }));

        if (name === "itemId") setItemIdError("");
        if (name === "borrowerFirstName") setBorrowerFirstNameError("");
        if (name === "borrowerLastName") setBorrowerLastNameError("");
        if (name === "teacherFirstName") setBorrowerTeacherFirstNameError("")
        if (name === "teacherLastName") setBorrowerTeacherLastNameError("")
        if (name === "borrowerRole") setBorrowerRoleError("");
        if (name === "studentIdNumber") setBorrowerStudentIdNumberError("");
        if (name === "room") setRoomError("");
        if (name === "subjectTimeSchedule") setSubjectTimeScheduleError("");
    };

    const handleScanSubmit = () => {
        setScanError("");
        const itemCode = scannedBarcode.trim();

        if (!itemCode) {
            setScanError("Please enter an item code");
            return;
        }

        // Look up the item by barcode (item code)
        const foundItem = itemName.find(item =>
            item.barcode?.toLowerCase() === itemCode.toLowerCase() ||
            item.serialNumber?.toLowerCase() === itemCode.toLowerCase()
        );

        if (!foundItem) {
            setScanError("Item not found. Please check the code and try again.");
            return;
        }

        // Close modal and trigger item detail view
        setShowScanModal(false);
        setScannedBarcode("");
        setScanError("");

        // Call the callback to show item details
        if (onItemScanned) {
            onItemScanned(foundItem);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let hasError = false;

        if (!formData.itemId) {
            setItemIdError("Item ID is required");
            hasError = true;
        }

        if (!formData.borrowerFirstName) {
            setBorrowerFirstNameError("First name is required");
            hasError = true;
        }

        if (!formData.borrowerLastName) {
            setBorrowerLastNameError("Last name is required");
            hasError = true;
        }

        if (!formData.borrowerRole) {
            setBorrowerRoleError("Borrower role is required");
            hasError = true;
        }

        if (!formData.teacherFirstName) {
            setBorrowerTeacherFirstNameError("Teacher first name is required");
            hasError = true;
        }

        if (!formData.teacherLastName) {
            setBorrowerTeacherLastNameError("Teacher last name is required");
            hasError = true;
        }

        if (!formData.studentIdNumber) {
            setBorrowerStudentIdNumberError("Student ID is required");
            hasError = true;
        }

        if (!formData.room) {
            setRoomError("Room is required");
            hasError = true;
        }

        if (!formData.subjectTimeSchedule) {
            setSubjectTimeScheduleError("Subject/Time/Schedule is required");
            hasError = true;
        }

        if (hasError) return;

        try {
            await borrowItemMutation.mutateAsync({
                itemId: formData.itemId,
                borrowerFirstName: formData.borrowerFirstName,
                borrowerLastName: formData.borrowerLastName,
                borrowerRole: formData.borrowerRole,
                teacherFirstName: formData.teacherFirstName || null,
                teacherLastName: formData.teacherLastName || null,
                room: formData.room,
                subjectTimeSchedule: formData.subjectTimeSchedule,
                remarks: formData.remarks || null,
                studentIdNumber: formData.studentIdNumber || null,
            });

            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);

            // Reset form
            setFormData({
                itemId: "",
                itemName: "",
                borrowerFirstName: "",
                borrowerLastName: "",
                borrowerRole: "",
                teacherFirstName: "",
                teacherLastName: "",
                room: "",
                subjectTimeSchedule: "",
                remarks: "",
                studentIdNumber: "",
            });
        } catch (error: any) {
            setErrorMessage(error.message || "Failed to submit borrow request");
            setShowErrorAlert(true);
            setTimeout(() => {
                setShowErrorAlert(false);
            }, 5000);
        }
    };

    return (
        <>
            {showAlert && <SuccessAlert message={"Borrow Request Submitted Successfully"} />}
            {showErrorAlert && <ErrorAlert message={errorMessage} />}

            {/* Scan Item Modal */}
            {showScanModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowScanModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                            <h2 className="text-xl font-bold text-gray-900">Scan Item</h2>
                            <button
                                onClick={() => setShowScanModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <IoMdClose className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                If the scanner cannot read the barcode, you may manually enter the item code below.
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
                                placeholder="Scan or enter item code (e.g., ITEM-SN-12345)"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${scanError
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                            {scanError && (
                                <p className="text-red-500 text-sm mt-2">{scanError}</p>
                            )}

                            {/* Modal Actions */}
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

            <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-4 md:p-8 ring-1 ring-gray-100">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                            Borrow Item
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">Fill out the form below to request equipment. Fields marked with an asterisk are required.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowScanModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        Scan Item
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {/* Item ID */}
                        <div className="md:col-span-2">
                            <label htmlFor="itemId" className="block text-sm font-medium text-gray-700 mb-2">
                                Item ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${itemIdError ? "border-red-500" : "border-gray-300"}`}
                                type="text"
                                id="itemId"
                                name="itemId"
                                placeholder="Enter item ID"
                                value={formData.itemId}
                                onChange={handleChange}
                                data-testid="itemId"
                            />
                            {itemIdError && <p className="text-red-500 text-sm mt-1">{itemIdError}</p>}
                        </div>

                        {/* Item Name */}
                        <div>
                            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-2">
                                Item Name<span className="text-red-500">*</span>
                            </label>
                            <select
                                id="itemName"
                                name='itemName'
                                value={formData.itemName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg border transition shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 border-gray-200 bg-gray-50"
                            >
                                <option value="">Select an item</option>
                                {Array.from(new Set(itemName.map(item => item.itemName))).map((name) => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Borrower First Name */}
                        <div>
                            <label htmlFor="borrowerFirstName" className="block text-sm font-medium text-gray-700 mb-2">
                                Borrower First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                className={`w-full px-3 py-2 rounded-lg border transition shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${borrowerFirstNameError ? "border-red-500 focus:ring-red-500/30" : "border-gray-200 bg-gray-50"}`}
                                type="text"
                                id="borrowerFirstName"
                                name="borrowerFirstName"
                                placeholder="Enter borrower's first name"
                                value={formData.borrowerFirstName}
                                onChange={handleChange}
                                data-testid="borrowerFirstName"
                            />
                            {borrowerFirstNameError && <p className="text-red-500 text-sm mt-1">{borrowerFirstNameError}</p>}
                        </div>

                        {/* Borrower Last Name */}
                        <div>
                            <label htmlFor="borrowerLastName" className="block text-sm font-medium text-gray-700 mb-2">
                                Borrower Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                className={`w-full px-3 py-2 rounded-lg border transition shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${borrowerLastNameError ? "border-red-500 focus:ring-red-500/30" : "border-gray-200 bg-gray-50"}`}
                                type="text"
                                id="borrowerLastName"
                                name="borrowerLastName"
                                placeholder="Enter borrower's last name"
                                value={formData.borrowerLastName}
                                onChange={handleChange}
                                data-testid="borrowerLastName"
                            />
                            {borrowerLastNameError && <p className="text-red-500 text-sm mt-1">{borrowerLastNameError}</p>}
                        </div>

                        {/* Student ID Number */}
                        <div>
                            <label htmlFor="studentIdNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                Student ID Number
                            </label>
                            <input
                                className={`w-full px-3 py-2 rounded-lg border transition shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${borrowerStudentIdNumberError ? "border-red-500 focus:ring-red-500/30" : "border-gray-200 bg-gray-50"}`}
                                type="text"
                                id="studentIdNumber"
                                name="studentIdNumber"
                                placeholder="Enter student ID number"
                                value={formData.studentIdNumber || ""}
                                onChange={handleChange}
                                data-testid="studentIdNumber"
                            />
                            {borrowerStudentIdNumberError && <p className="text-red-500 text-sm mt-1">{borrowerStudentIdNumberError}</p>}
                        </div>

                        {/* Borrower Role */}
                        <div>
                            <label htmlFor="borrowerRole" className="block text-sm font-medium text-gray-700 mb-2">
                                Borrower Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                className={`w-full px-3 py-2 rounded-lg border transition shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${borrowerRoleError ? "border-red-500 focus:ring-red-500/30" : "border-gray-200 bg-gray-50"}`}
                                id="borrowerRole"
                                name="borrowerRole"
                                value={formData.borrowerRole}
                                onChange={handleChange}
                                data-testid="borrowerRole"
                            >
                                <option value="">Select Role</option>
                                <option value="Student">Student</option>
                                <option value="Teacher">Teacher</option>
                            </select>
                            {borrowerRoleError && <p className="text-red-500 text-sm mt-1">{borrowerRoleError}</p>}
                        </div>

                        {/* Teacher First Name */}
                        <div>
                            <label htmlFor="teacherFirstName" className="block text-sm font-medium text-gray-700 mb-2">
                                Teacher First Name
                            </label>
                            <input
                                className={`w-full px-3 py-2 rounded-lg border transition shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${borrowerTeacherFirstNameError ? "border-red-500 focus:ring-red-500/30" : "border-gray-200 bg-gray-50"}`}
                                type="text"
                                id="teacherFirstName"
                                name="teacherFirstName"
                                placeholder="Enter teacher's first name"
                                value={formData.teacherFirstName || ""}
                                onChange={handleChange}
                                data-testid="teacherFirstName"
                            />
                            {borrowerTeacherFirstNameError && <p className="text-red-500 text-sm mt-1">{borrowerTeacherFirstNameError}</p>}
                        </div>

                        {/* Teacher Last Name */}
                        <div>
                            <label htmlFor="teacherLastName" className="block text-sm font-medium text-gray-700 mb-2">
                                Teacher Last Name
                            </label>
                            <input
                                className={`w-full px-3 py-2 rounded-lg border transition shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${borrowerTeacherLastNameError ? "border-red-500 focus:ring-red-500/30" : "border-gray-200 bg-gray-50"}`}
                                type="text"
                                id="teacherLastName"
                                name="teacherLastName"
                                placeholder="Enter teacher's last name"
                                value={formData.teacherLastName || ""}
                                onChange={handleChange}
                                data-testid="teacherLastName"
                            />
                            {borrowerTeacherLastNameError && <p className="text-red-500 text-sm mt-1">{borrowerTeacherLastNameError}</p>}
                        </div>

                        {/* Room */}
                        <div>
                            <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-2">
                                Room <span className="text-red-500">*</span>
                            </label>
                            <input
                                className={`w-full px-3 py-2 rounded-lg border transition shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${roomError ? "border-red-500 focus:ring-red-500/30" : "border-gray-200 bg-gray-50"}`}
                                type="text"
                                id="room"
                                name="room"
                                placeholder="Enter room"
                                value={formData.room}
                                onChange={handleChange}
                                data-testid="room"
                            />
                            {roomError && <p className="text-red-500 text-sm mt-1">{roomError}</p>}
                        </div>

                        {/* Subject/Time/Schedule */}
                        <div>
                            <label htmlFor="subjectTimeSchedule" className="block text-sm font-medium text-gray-700 mb-2">
                                Subject/Time/Schedule <span className="text-red-500">*</span>
                            </label>
                            <input
                                className={`w-full px-3 py-2 rounded-lg border transition shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${subjectTimeScheduleError ? "border-red-500 focus:ring-red-500/30" : "border-gray-200 bg-gray-50"}`}
                                type="text"
                                id="subjectTimeSchedule"
                                name="subjectTimeSchedule"
                                placeholder="e.g., Math 101 - 9:00 AM - 10:00 AM"
                                value={formData.subjectTimeSchedule}
                                onChange={handleChange}
                                data-testid="subjectTimeSchedule"
                            />
                            {subjectTimeScheduleError && <p className="text-red-500 text-sm mt-1">{subjectTimeScheduleError}</p>}
                        </div>

                        {/* Remarks */}
                        <div className="md:col-span-2">
                            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-2">
                                Remarks <span className="text-gray-400">(Optional)</span>
                            </label>
                            <textarea
                                className="w-full px-3 py-2 rounded-lg border transition shadow-sm border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none placeholder:text-gray-400"
                                id="remarks"
                                name="remarks"
                                rows={3}
                                placeholder="Enter any additional remarks or notes"
                                value={formData.remarks || ""}
                                onChange={handleChange}
                                data-testid="remarks"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-2">
                        <button
                            type="submit"
                            disabled={borrowItemMutation.isPending}
                            className={`px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ${borrowItemMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            data-testid="submit-borrow-button"
                        >
                            {borrowItemMutation.isPending ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </span>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

const BorrowItemsTable = ({ onBorrowClick }: { onBorrowClick: (itemId: string, itemName: string) => void }) => {
    const [searchItem, setSearchItem] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [items, setItems] = useState<TItemList[]>([]);
    const [selectedItem, setSelectedItem] = useState<TItemList | null>(null);
    const itemsPerPage = 10;

    const { data, isPending, isError } = useQuery(useAllItemsQuery());

    useEffect(() => {
        if (!data) return;
        setItems(data);
    }, [data]);

    const filteredItems = useMemo(
        () =>
            items.filter((item) => {
                const matchesSearch =
                    item.itemName.toLowerCase().includes(searchItem.toLowerCase()) ||
                    item.category.toLowerCase().includes(searchItem.toLowerCase());
                const matchesCategory = selectedCategory === "" || item.category === selectedCategory;
                return matchesSearch && matchesCategory;
            }),
        [items, searchItem, selectedCategory]
    );

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const validCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

    const paginatedData = useMemo(
        () =>
            filteredItems.slice(
                (validCurrentPage - 1) * itemsPerPage,
                validCurrentPage * itemsPerPage
            ),
        [filteredItems, itemsPerPage, validCurrentPage]
    );

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleCategoryClick = useCallback(
        (category: string) => {
            setSelectedCategory(selectedCategory === category ? "" : category);
            setCurrentPage(1);
        },
        [selectedCategory]
    );

    const handleShowAll = useCallback(() => {
        setSelectedCategory("");
        setCurrentPage(1);
    }, []);

    const handleRowClick = (item: TItemList) => {
        setSelectedItem(item);
    };

    const handleBorrowClick = (e: React.MouseEvent, itemId: string, itemName: string) => {
        e.stopPropagation();
        onBorrowClick(itemId, itemName);
    };

    if (isPending) {
        return <InventoryListSkeletonLoader />;
    }

    return (
        <div className="animate-fadeIn w-full h-full flex flex-col">
            {/* Category Badges */}
            <section className="px-4 md:px-8 py-3">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                    {Array.from(new Set(items.map((item) => item.category))).map((category) => {
                        const itemsInCategory = items.filter((item) => item.category === category);
                        return (
                            <InventoryBadges
                                key={category}
                                name={category}
                                total={itemsInCategory.length}
                                onClick={() => handleCategoryClick(category)}
                                isSelected={selectedCategory === category}
                            />
                        );
                    })}
                </div>
            </section>

            {/* Table Section */}
            <section className="flex-1 px-4 md:px-8 pb-4 overflow-hidden">
                <div className="bg-white/90 h-full p-3 md:p-4 rounded-2xl shadow-xl ring-1 ring-[#e0e7ef]/80 flex flex-col">
                    {/* Controls */}
                    <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex flex-row gap-2 items-center sm:ml-auto">
                            {filteredItems.length > 0 && (
                                <Pagination
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                    handlePageChange={handlePageChange}
                                    selectedCategory={selectedCategory}
                                    handleShowAll={handleShowAll}
                                />
                            )}
                            <SearchBar
                                onChangeValue={(value) => setSearchItem(value)}
                                name={"search"}
                                placeholder={"Search items..."}
                            />
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="flex-1 overflow-auto rounded-lg shadow-inner bg-white/95">
                        {isError ? (
                            <ErrorTable />
                        ) : (
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="sticky top-0 bg-white/90 backdrop-blur-sm z-10">
                                        <th className="bg-transparent font-semibold py-3 px-3 md:px-4 border-b border-[#e6e6e6] text-[#0f172a] text-xs uppercase tracking-wider">
                                            Serial Num
                                        </th>
                                        <th className="bg-transparent font-semibold py-3 px-3 md:px-4 border-b border-[#e6e6e6] text-[#0f172a] text-xs uppercase tracking-wider">
                                            Image
                                        </th>
                                        <th className="bg-transparent font-semibold py-3 px-3 md:px-4 border-b border-[#e6e6e6] text-[#0f172a] text-xs uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="hidden md:table-cell bg-transparent font-semibold py-3 px-4 border-b border-[#e6e6e6] text-[#0f172a] text-xs uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="hidden lg:table-cell bg-transparent font-semibold py-3 px-4 border-b border-[#e6e6e6] text-[#0f172a] text-xs uppercase tracking-wider">
                                            Condition
                                        </th>
                                        <th className="hidden xl:table-cell bg-transparent font-semibold py-3 px-4 border-b border-[#e6e6e6] text-[#0f172a] text-xs uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="bg-transparent font-semibold py-3 px-3 md:px-4 border-b border-[#e6e6e6] text-[#0f172a] text-xs uppercase tracking-wider">
                                            Borrow
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.map((item) => (
                                        <tr
                                            key={item.serialNumber}
                                            onClick={() => handleRowClick(item)}
                                            className="hover:bg-[#f8fafc] transition-colors odd:bg-white even:bg-[#f9fbff] cursor-pointer"
                                        >
                                            <td className="py-3 px-3 md:px-4 font-semibold text-sm">{item.serialNumber}</td>
                                            <td className="py-3 px-3 md:px-4">
                                                <img
                                                    src={typeof item.image === "string" ? item.image : logo}
                                                    alt={item.itemName}
                                                    className="w-10 h-10 rounded-xl object-cover"
                                                />
                                            </td>
                                            <td className="py-3 px-3 md:px-4 text-sm">{item.itemName}</td>
                                            <td className="hidden md:table-cell py-3 px-4 text-sm">{item.category}</td>
                                            <td className="hidden lg:table-cell py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${SlugCondition(item.condition)}`}>
                                                    {item.condition}
                                                </span>
                                            </td>
                                            <td className="hidden xl:table-cell py-3 px-4 text-sm max-w-xs">
                                                <div className="truncate" title={item.description || 'No description'}>
                                                    {item.description || 'No description'}
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 md:px-4">
                                                <button
                                                    onClick={(e) => handleBorrowClick(e, item.id, item.itemName)}
                                                    className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white font-medium text-xs md:text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
                                                    title="Borrow this item"
                                                >
                                                    <MdSwapHoriz className="text-sm" />
                                                    <span className="hidden sm:inline">Borrow</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {paginatedData.length === 0 && !isError && (
                            <div className="w-full h-full flex items-center justify-center p-8">
                                <div className="text-center max-w-md">
                                    <div className="text-5xl mb-3 text-[#94a3b8]">📦</div>
                                    <h3 className="text-xl md:text-2xl font-semibold text-[#0f172a] mb-2">No items found</h3>
                                    <p className="text-[#64748b] text-sm md:text-base">
                                        Try adjusting your search or filters. Items available for borrowing will appear here.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Item Details Modal */}
            {selectedItem && (
                <ItemDetailsModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onBorrow={onBorrowClick}
                />
            )}
        </div>
    );
};

export default function BorrowItem() {
    const [activeTab, setActiveTab] = useState<'browse' | 'form'>('form');
    const [prefilledItemId, setPrefilledItemId] = useState<string>("");
    const [prefilledItemName, setPrefilledItemName] = useState<string>("");
    const [scannedItem, setScannedItem] = useState<TItemList | null>(null);
    const [showReturnModal, setShowReturnModal] = useState<boolean>(false);
    const [returnBarcode, setReturnBarcode] = useState<string>("");
    const [returnError, setReturnError] = useState<string>("");
    const [returnSuccess, setReturnSuccess] = useState<boolean>(false);
    const [returnErrorMessage, setReturnErrorMessage] = useState<string>("");
    const [showReturnError, setShowReturnError] = useState<boolean>(false);

    const returnItemMutation = useReturnItemMutation();

    const handleBorrowClick = (itemId: string, itemName: string) => {
        setPrefilledItemId(itemId);
        setPrefilledItemName(itemName);
        setActiveTab('form');
    };

    const handleItemScanned = (item: TItemList) => {
        setScannedItem(item);
    };

    const handleReturnSubmit = async () => {
        setReturnError("");
        const barcode = returnBarcode.trim();

        if (!barcode) {
            setReturnError("Please enter a barcode");
            return;
        }

        try {
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

    return (
        <div className="h-screen w-full bg-gradient-to-br from-[#f8fafc] via-[#e8eef7] to-[#dbeafe] flex flex-col overflow-hidden">
            {/* Return Success Alert */}
            {returnSuccess && <SuccessAlert message="Item returned successfully!" />}
            {showReturnError && <ErrorAlert message={returnErrorMessage} />}

            {/* Return Item Modal */}
            {showReturnModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowReturnModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
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
                                Scan the <strong>item barcode</strong> to mark it as returned. The system will automatically find and update the active borrowed record. If the scanner cannot read the barcode, you may manually enter it below.
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
                                placeholder="Scan or enter item barcode (e.g., ITEM-SN-12345)"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${returnError
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
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
                                    className={`flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors ${returnItemMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {returnItemMutation.isPending ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        'Confirm Return'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="flex-shrink-0 pt-6 md:pt-8 px-4 md:px-8 pb-4 md:pb-6 bg-white/70 backdrop-blur-md shadow-sm border-b border-[#e5e9f2] flex flex-col items-center">
                <h1 className="text-[#1e293b] text-3xl md:text-5xl mb-2 font-extrabold tracking-tight drop-shadow-lg">
                    Borrow Item
                </h1>
                <p className="text-[#64748b] text-sm md:text-base lg:text-lg font-medium max-w-2xl text-center px-4">
                    Browse available items or submit a borrow request for technical equipment.
                </p>

                {/* Tabs */}
                <div className="mt-4 md:mt-6 flex gap-2 bg-white/90 p-1.5 rounded-xl shadow-md">
                    <button
                        onClick={() => setActiveTab('form')}
                        className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 ${activeTab === 'form'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                            }`}
                    >
                        Borrow Form
                    </button>
                    <button
                        onClick={() => setActiveTab('browse')}
                        className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 ${activeTab === 'browse'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                            }`}
                    >
                        Browse Items
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                {activeTab === 'browse' ? (
                    <BorrowItemsTable onBorrowClick={handleBorrowClick} />
                ) : (
                    <div className="h-full overflow-y-auto px-4 py-4 md:py-6">
                        <div className="max-w-6xl mx-auto">
                            <BorrowItemForm
                                prefilledItemId={prefilledItemId}
                                prefilledItemName={prefilledItemName}
                                onItemScanned={handleItemScanned}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Scanned Item Details Modal */}
            {scannedItem && (
                <ItemDetailsModal
                    item={scannedItem}
                    onClose={() => setScannedItem(null)}
                    onBorrow={handleBorrowClick}
                />
            )}

            {/* Floating Return Button */}
            <button
                onClick={() => setShowReturnModal(true)}
                className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 group"
                title="Return Item"
            >
                <div className="relative">
                    <div className={`flex items-center gap-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${activeTab === 'browse'
                        ? 'p-3 md:p-4'
                        : 'px-4 py-3 md:px-5 md:py-4'
                        }`}>
                        <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        {activeTab === 'form' && (
                            <span className="hidden md:inline font-semibold text-sm md:text-base whitespace-nowrap">
                                Return Item
                            </span>
                        )}
                    </div>

                    <div className={`absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 pointer-events-none whitespace-nowrap ${activeTab === 'browse'
                        ? 'opacity-0 group-hover:opacity-100'
                        : 'hidden'
                        }`}>
                        Return Item
                    </div>
                </div>
            </button>
        </div>
    );
}
