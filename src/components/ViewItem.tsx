import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { TItemList } from "../types/types";
import { useItemDetailsQuery } from "../query/get/useItemDetailsQuery";
import ViewItemSkeletonLoader from "../loader/ViewItemSkeletonLoader";
import { FaArrowCircleLeft, FaEdit } from "react-icons/fa";
import { IoMdWarning } from "react-icons/io";
import { FaHashtag, FaTools } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { BsCalendar2Date } from "react-icons/bs";
import { MdOutlineDescription } from "react-icons/md";
import { FaBarcode } from "react-icons/fa6";
import { useState } from "react";
import { EditItemForm } from "./EditItemForm";
import { FormattedDateTime } from "./FormattedDateTime";
import box from "../assets/box.webp"


export default function ViewItem() {
    const { id } = useParams<{ id: string }>();
    const itemId = String(id);
    const [isEditItemFormOpen, setIsEditItemFormOpen] = useState(false);
    const { data, isLoading, error } = useQuery(useItemDetailsQuery(itemId));

    if (isLoading) {
        return <ViewItemSkeletonLoader />;
    }

    if (error || !data) {
        return (
            <div className="flex justify-center items-center w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="p-8 mx-4 max-w-md text-center bg-white rounded-2xl border border-red-100 shadow-lg">
                    <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full">
                        <IoMdWarning className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-900">
                        Unable to Load
                    </h3>
                    <p className="text-slate-600">
                        Failed to load item details. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    const itemDetails: TItemList = data;

    return (
        <div className="py-12 px-4 min-h-screen bg-gray-50">
            <div className="relative mx-auto max-w-6xl">
                <div className="flex absolute top-0 left-0 flex-row gap-2 justify-between w-full">
                    <Link to="/home/inventory-list">
                        <FaArrowCircleLeft className="w-8 h-8 text-blue-600 cursor-pointer" />
                    </Link>
                    <button type="button" onClick={() => setIsEditItemFormOpen(true)}>
                        <FaEdit className="w-8 h-8 text-blue-600 cursor-pointer" />
                    </button>
                </div>
                {/* Header */}
                <div className="mt-10 mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">
                        {itemDetails.itemName}
                    </h1>
                    <p className={`font-bold text-center ${itemDetails.status.toLowerCase() === "available" ? "text-green-500" : "text-red-500"}`}  >{itemDetails.status}</p>
                </div>

                {/* Image Section */}
                <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
                    <div className="flex justify-center">
                        {itemDetails.image ? (
                            <img
                                src={
                                    typeof itemDetails.image === "string" ? itemDetails.image : ""
                                }
                                alt={itemDetails.itemName}
                                className="object-cover w-64 h-64 rounded-lg"
                            />
                        ) : (
                            <div className="flex flex-col justify-center items-center w-64 h-64 bg-gray-100 rounded-lg border-2 border-gray-300 border-dashed">
                                <img
                                    src={box}
                                    alt={itemDetails.itemName}
                                    className="object-cover w-64 h-64 rounded-lg"
                                />
                                <span className="text-sm text-gray-500">
                                    No Image Available
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Serial Number */}
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <div className="flex items-center mb-3">
                            <div className="flex justify-center items-center mr-3 w-8 h-8 bg-indigo-500 rounded-lg">
                                <FaHashtag className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Serial Number
                            </h3>
                        </div>
                        <p className="text-gray-600">{itemDetails.serialNumber}</p>
                    </div>

                    {/* Condition */}
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <div className="flex items-center mb-3">
                            <div className="flex justify-center items-center mr-3 w-8 h-8 bg-emerald-500 rounded-lg">
                                <FaCheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Condition</h3>
                        </div>
                        <p className="text-gray-600">{itemDetails.condition}</p>
                    </div>

                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <div className="flex items-center mb-3">
                            <div className="flex justify-center items-center mr-3 w-8 h-8 bg-emerald-500 rounded-lg">
                                <FaCheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Category</h3>
                        </div>
                        <p className="text-gray-600">{itemDetails.category}</p>
                    </div>

                    {/* Item Make */}
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <div className="flex items-center mb-3">
                            <div className="flex justify-center items-center mr-3 w-8 h-8 bg-blue-500 rounded-lg">
                                <FaTools className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Item Make</h3>
                        </div>
                        <p className="text-gray-600">{itemDetails.itemMake}</p>
                    </div>

                    {/* Item Type */}
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <div className="flex items-center mb-3">
                            <div className="flex justify-center items-center mr-3 w-8 h-8 bg-purple-500 rounded-lg">
                                <FaTools className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Item Type</h3>
                        </div>
                        <p className="text-gray-600">{itemDetails.itemType}</p>
                    </div>

                    {/* Item Model */}
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <div className="flex items-center mb-3">
                            <div className="flex justify-center items-center mr-3 w-8 h-8 bg-orange-500 rounded-lg">
                                <FaHashtag className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Item Model
                            </h3>
                        </div>
                        <p className="text-gray-600">{itemDetails.itemModel}</p>
                    </div>

                    {/* Date Added */}
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <div className="flex items-center mb-3">
                            <div className="flex justify-center items-center mr-3 w-8 h-8 bg-red-500 rounded-lg">
                                <BsCalendar2Date className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Date Added
                            </h3>
                        </div>
                        <p className="text-gray-600">
                            {FormattedDateTime(itemDetails.createdAt)}
                        </p>
                    </div>
                    <div className="flex flex-1 p-6 bg-white rounded-lg shadow-md">
                        <div className="mb-3">
                            <div className="flex flex-row items-center mb-4">
                                <div className="flex justify-center items-center mr-3 w-8 h-8 bg-red-500 rounded-lg">
                                    <MdOutlineDescription className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Description
                                </h3>
                            </div>
                            <p className="text-gray-600">{itemDetails.description}</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-row gap-4 justify-between">
                    {/* Barcode */}
                    <div className="flex flex-1 p-4 mt-6 bg-white rounded-lg shadow-md">
                        <div className="flex justify-center items-center w-full">
                            {itemDetails.barcodeImage ? (
                                (<img
                                    src={itemDetails.barcodeImage}
                                    alt={itemDetails.serialNumber}
                                    className="w-96 h-40"
                                />)
                            ) : (
                                <p className="text-gray-600/50">
                                    Don't have generated BarCode.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center mt-6 md:justify-end lg:justify-end">
                    <button
                        type="button"
                        className="float-right p-4 px-8 text-lg font-semibold text-gray-900 bg-white rounded-lg shadow-md cursor-pointer"
                    >
                        <div className="flex flex-row gap-2 justify-center items-center">
                            {itemDetails.barcode ? (
                                <>
                                    <FaBarcode />
                                    <p className="text-gray-600/50">
                                        You have generated BarCode.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <FaBarcode />
                                    <p className="text-gray-600/50">Generate BarCode ?</p>
                                </>
                            )}
                        </div>
                    </button>
                </div>
            </div>
            {isEditItemFormOpen && (
                <EditItemForm
                    onClose={() => setIsEditItemFormOpen(false)}
                    id={itemId}
                />
            )}
        </div>
    );
}
