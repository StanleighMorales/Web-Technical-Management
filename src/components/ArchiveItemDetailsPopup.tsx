import { useQuery } from "@tanstack/react-query";
import { MdClose, MdInventory, MdCategory, MdBuild, MdDescription, MdCode, MdImage, MdQrCode, MdArchive } from "react-icons/md";
import { FaBox, FaTag, FaCalendarAlt } from "react-icons/fa";
import { useViewArchiveItemDetails } from "../query/get/useViewArchiveItemDetails";
import { FormattedDateTime } from "./FormatedDateTime";

type TArchiveItemDetailsPopupProps = {
    itemId: string;
    isOpen: boolean;
    onClose: () => void;
};

export default function ArchiveItemDetailsPopup({
    itemId,
    isOpen,
    onClose
}: TArchiveItemDetailsPopupProps) {

    const { data: item, isPending, isError } = useQuery(useViewArchiveItemDetails(itemId));

    if (!isOpen) return null;

    if (isPending) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !item) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="text-red-500 text-6xl mb-4">⚠️</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Item</h3>
                            <p className="text-gray-600">Failed to load archived item details</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-orange-100 p-2 rounded-full">
                                <MdArchive className="text-orange-600 text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Archived Item Details</h2>
                                <p className="text-gray-600">Complete archived item information</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Archived on</p>
                                <p className="text-sm font-medium text-gray-900">{FormattedDateTime(item.archivedAt)}</p>
                            </div>
                            <button
                                onClick={() => {
                                    onClose();
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                title="Close"
                            >
                                <MdClose className="text-2xl" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="scrollbar-none overflow-y-auto max-h-[calc(90vh-120px)] p-6 space-y-6">
                    {/* Item Image and Basic Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Item Image */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <MdImage className="mr-2 text-blue-600" />
                                Item Image
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.itemName}
                                        className="max-w-full max-h-64 object-contain rounded-lg shadow-sm"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                ) : null}
                                <div className={`text-center text-gray-500 ${item.image ? 'hidden' : ''}`}>
                                    <MdImage className="text-6xl mx-auto mb-2 text-gray-300" />
                                    <p>No image available</p>
                                </div>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <MdInventory className="mr-2 text-blue-600" />
                                Basic Information
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <FaBox className="text-gray-400 text-lg" />
                                    <div>
                                        <p className="text-sm text-gray-500">Item Name</p>
                                        <p className="font-medium text-gray-900">{item.itemName || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <MdCode className="text-gray-400 text-lg" />
                                    <div>
                                        <p className="text-sm text-gray-500">Serial Number</p>
                                        <p className="font-medium text-gray-900">{item.serialNumber || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <MdCategory className="text-gray-400 text-lg" />
                                    <div>
                                        <p className="text-sm text-gray-500">Category</p>
                                        <p className="font-medium text-gray-900">{item.category || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <MdBuild className="text-gray-400 text-lg" />
                                    <div>
                                        <p className="text-sm text-gray-500">Type</p>
                                        <p className="font-medium text-gray-900">{item.itemType || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technical Details */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <MdBuild className="mr-2 text-blue-600" />
                            Technical Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3">
                                <FaTag className="text-gray-400 text-lg" />
                                <div>
                                    <p className="text-sm text-gray-500">Model</p>
                                    <p className="font-medium text-gray-900">{item.itemModel || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MdBuild className="text-gray-400 text-lg" />
                                <div>
                                    <p className="text-sm text-gray-500">Make</p>
                                    <p className="font-medium text-gray-900">{item.itemMake || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MdCategory className="text-gray-400 text-lg" />
                                <div>
                                    <p className="text-sm text-gray-500">Condition</p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.condition === 'excellent' ? 'bg-green-100 text-green-800' :
                                        item.condition === 'good' ? 'bg-blue-100 text-blue-800' :
                                            item.condition === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                                                item.condition === 'poor' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                        {item.condition || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {item.description && (
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <MdDescription className="mr-2 text-blue-600" />
                                Description
                            </h3>
                            <p className="text-gray-700 leading-relaxed">{item.description}</p>
                        </div>
                    )}

                    {/* Barcode */}
                    {item.barcodeImage && (
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <MdQrCode className="mr-2 text-blue-600" />
                                Barcode
                            </h3>
                            <div className="bg-white rounded-lg p-4 flex items-center justify-center">
                                <img
                                    src={item.barcodeImage}
                                    alt="Item Barcode"
                                    className="max-w-full max-h-32 object-contain"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                                <div className="hidden text-center text-gray-500">
                                    <MdQrCode className="text-4xl mx-auto mb-2 text-gray-300" />
                                    <p>Barcode not available</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Archive Information */}
                    <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FaCalendarAlt className="mr-2 text-orange-600" />
                            Archive Information
                        </h3>
                        <div className="flex items-center space-x-3">
                            <div className="bg-orange-100 p-2 rounded-full">
                                <MdArchive className="text-orange-600 text-lg" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Archived Date</p>
                                <p className="font-medium text-gray-900">{FormattedDateTime(item.archivedAt)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
