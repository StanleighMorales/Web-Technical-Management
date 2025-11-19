import { useQuery } from "@tanstack/react-query";
import {
  MdClose,
  MdInventory,
  MdCategory,
  MdBuild,
  MdDescription,
  MdCode,
  MdImage,
  MdQrCode,
  MdArchive,
} from "react-icons/md";
import { FaBox, FaTag, FaCalendarAlt, FaUser, FaDoorOpen, FaCheckCircle } from "react-icons/fa";
import { useViewBorrowItemCredentials } from "../query/get/useViewBorrowItemCredentials.ts";
import { FormattedDateTime } from "./FormatedDateTime";
import CloseButton from "./CloseButton.tsx";
import type { TRecentBorrowItemProps } from "../types/types.ts";
import ErrorTable from "../components/ErrorTables.tsx";
import { useEffect, useState } from "react";



type TArchiveItemDetailsPopupProps = {
  itemId: string;
  isOpen: boolean;
  onClose: () => void;
};

export const ViewRecentBorrowItems = ({
  itemId,
  isOpen,
  onClose,
}: TArchiveItemDetailsPopupProps) => {
  const [itemData, setItemData] = useState<TRecentBorrowItemProps | null>(null);

  const { data, isPending, isError } = useQuery(useViewBorrowItemCredentials(itemId));

  useEffect(() => {
    if (data?.data) setItemData(data.data);
  }, [data]);

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

  if (!itemData) return null;

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
                <h2 className="text-2xl font-bold text-gray-900">Borrow Item Details</h2>
                <p className="text-gray-600">Complete borrow item information</p>
              </div>
            </div>
            <CloseButton onClick={onClose} />
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 scrollbar-none max-h-[calc(90vh-120px)]">
          {/* Item Image and Info */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Image */}
            <div className="space-y-4">
              <h3 className="flex items-center text-lg font-semibold text-gray-900">
                <MdImage className="mr-2 text-blue-600" /> Item Image
              </h3>
              <div className="flex justify-center items-center p-4 bg-gray-50 rounded-lg">
                {itemData.item.image ? (
                  <img
                    src={itemData.item.image}
                    alt={itemData.item.itemName}
                    className="object-contain max-w-full max-h-64 rounded-lg shadow-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.remove("hidden");
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

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="flex items-center text-lg font-semibold text-gray-900">
                <MdInventory className="mr-2 text-blue-600" /> Basic Information
              </h3>
              <div className="space-y-3">
                {[
                  { icon: <FaBox />, label: "Item Name", value: itemData.item.itemName },
                  { icon: <MdCode />, label: "Serial Number", value: itemData.item.serialNumber },
                  { icon: <MdCategory />, label: "Category", value: itemData.item.category },
                  { icon: <MdBuild />, label: "Type", value: itemData.item.itemType },
                  { icon: <FaTag />, label: "Model", value: itemData.item.itemModel },
                  { icon: <MdBuild />, label: "Make", value: itemData.item.itemMake },
                  { icon: <MdDescription />, label: "Description", value: itemData.item.description },
                  { icon: <FaCheckCircle />, label: "Condition", value: itemData.item.condition },
                ].map(({ icon, label, value }, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <span className="text-lg text-gray-400">{icon}</span>
                    <div>
                      <p className="text-sm text-gray-500">{label}</p>
                      <p className="font-medium text-gray-900">{value || "N/A"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Borrow Details */}
          <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
              <FaCalendarAlt className="mr-2 text-orange-600" /> Borrow Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                { icon: <FaUser />, label: "Borrower", value: itemData.borrowerFullName },
                { icon: <FaTag />, label: "Role", value: itemData.borrowerRole },
                { icon: <FaDoorOpen />, label: "Room", value: itemData.room || "N/A" },
                { icon: <MdArchive />, label: "Status", value: itemData.status },
                { icon: <FaCalendarAlt />, label: "Lent At", value: itemData.lentAt ? FormattedDateTime(itemData.lentAt) : "N/A" },
                { icon: <FaCalendarAlt />, label: "Returned At", value: itemData.returnedAt ? FormattedDateTime(itemData.returnedAt) : "N/A" },
                { icon: <MdDescription />, label: "Remarks", value: itemData.remarks || "No remarks" },
              ].map(({ icon, label, value }, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <span className="text-lg text-gray-400">{icon}</span>
                  <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="font-medium text-gray-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Barcode */}
          {itemData.item.barcodeImage && (
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <MdQrCode className="mr-2 text-blue-600" /> Barcode
              </h3>
              <div className="flex justify-center items-center p-4 bg-white rounded-lg">
                <img
                  src={itemData.item.barcodeImage}
                  alt="Item Barcode"
                  className="object-contain max-w-full max-h-32"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling?.classList.remove("hidden");
                  }}
                />
                <div className="hidden text-center text-gray-500">
                  <MdQrCode className="mx-auto mb-2 text-4xl text-gray-300" />
                  <p>Barcode not available</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
