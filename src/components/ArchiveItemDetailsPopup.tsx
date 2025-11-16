import { useQuery } from "@tanstack/react-query";
import { MdClose, MdInventory, MdCategory, MdBuild, MdDescription, MdCode, MdImage, MdQrCode, MdArchive } from "react-icons/md";
import { FaBox, FaTag, FaCalendarAlt } from "react-icons/fa";
import { useViewArchiveItemDetails } from "../query/get/useViewArchiveItemDetails";
import { FormattedDateTime } from "./FormatedDateTime";
import ErrorTable from "../components/ErrorTables.tsx"
import CloseButton from "./CloseButton.tsx";

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
            <div className="flex fixed inset-0 z-50 justify-center items-center">
                <div className="absolute inset-0 bg-black/50" />
                <div className="overflow-hidden relative z-10 w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[90vh]">
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 rounded-full border-b-2 border-blue-600 animate-spin"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !item) {
        <ErrorTable />
        // return (
        //     <div className="flex fixed inset-0 z-50 justify-center items-center">
        //         <div className="absolute inset-0 bg-black/50" />
        //         <div className="overflow-hidden relative z-10 w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[90vh]">
        //             <div className="flex justify-center items-center h-64">
        //                 <div className="text-center">
        //                     <div className="mb-4 text-6xl text-red-500">⚠️</div>
        //                     <h3 className="mb-2 text-xl font-semibold text-gray-900">Error Loading Item</h3>
        //                     <p className="text-gray-600">Failed to load archived item details</p>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // );
    }

    return (
        <div className="flex fixed inset-0 z-50 justify-center items-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="overflow-hidden relative z-10 w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[90vh]">
                {/* Header */}
                <div className="p-6 bg-white border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-100 rounded-full">
                                <MdArchive className="text-2xl text-orange-600" />
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
                            <CloseButton onClick={onClose} />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 space-y-6 scrollbar-none max-h-[calc(90vh-120px)]">
                    {/* Item Image and Basic Info */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Item Image */}
                        <div className="space-y-4">
                            <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                <MdImage className="mr-2 text-blue-600" />
                                Item Image
                            </h3>
                            <div className="flex justify-center items-center p-4 bg-gray-50 rounded-lg">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.itemName}
                                        className="object-contain max-w-full max-h-64 rounded-lg shadow-sm"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                ) : null}
                                <div className={`text-center text-gray-500 ${item.image ? 'hidden' : ''}`}>
                                    <MdImage className="mx-auto mb-2 text-6xl text-gray-300" />
                                    <p>No image available</p>
                                </div>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="flex items-center text-lg font-semibold text-gray-900">
                                <MdInventory className="mr-2 text-blue-600" />
                                Basic Information
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <FaBox className="text-lg text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Item Name</p>
                                        <p className="font-medium text-gray-900">{item.itemName || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <MdCode className="text-lg text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Serial Number</p>
                                        <p className="font-medium text-gray-900">{item.serialNumber || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <MdCategory className="text-lg text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Category</p>
                                        <p className="font-medium text-gray-900">{item.category || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <MdBuild className="text-lg text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Type</p>
                                        <p className="font-medium text-gray-900">{item.itemType || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technical Details */}
                    <div className="p-6 bg-gray-50 rounded-lg">
                        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                            <MdBuild className="mr-2 text-blue-600" />
                            Technical Details
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex items-center space-x-3">
                                <FaTag className="text-lg text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Model</p>
                                    <p className="font-medium text-gray-900">{item.itemModel || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MdBuild className="text-lg text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Make</p>
                                    <p className="font-medium text-gray-900">{item.itemMake || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MdCategory className="text-lg text-gray-400" />
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
                        <div className="p-6 bg-gray-50 rounded-lg">
                            <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                                <MdDescription className="mr-2 text-blue-600" />
                                Description
                            </h3>
                            <p className="leading-relaxed text-gray-700">{item.description}</p>
                        </div>
                    )}

                    {/* Barcode */}
                    {item.barcodeImage && (
                        <div className="p-6 bg-gray-50 rounded-lg">
                            <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                                <MdQrCode className="mr-2 text-blue-600" />
                                Barcode
                            </h3>
                            <div className="flex justify-center items-center p-4 bg-white rounded-lg">
                                <img
                                    src={item.barcodeImage}
                                    alt="Item Barcode"
                                    className="object-contain max-w-full max-h-32"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                                <div className="hidden text-center text-gray-500">
                                    <MdQrCode className="mx-auto mb-2 text-4xl text-gray-300" />
                                    <p>Barcode not available</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Archive Information */}
                    <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
                        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                            <FaCalendarAlt className="mr-2 text-orange-600" />
                            Archive Information
                        </h3>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-100 rounded-full">
                                <MdArchive className="text-lg text-orange-600" />
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
