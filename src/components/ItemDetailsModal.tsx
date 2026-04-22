import type { TItemList } from "../@types/types";
import { IoMdClose } from "react-icons/io";
import { FaHashtag } from "react-icons/fa6";
import { FaCheckCircle, FaTools } from "react-icons/fa";
import { BsCalendar2Date } from "react-icons/bs";
import { MdOutlineDescription, MdSwapHoriz } from "react-icons/md";
import { FormattedDateTime } from "./FormattedDateTime";
import box from "../assets/box.webp";

type ItemDetailsModalProps = {
  item: TItemList;
  onClose: () => void;
  onBorrow: (itemId: string, itemName: string) => void;
};
export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  onClose,
  onBorrow,
}) => {
  const handleBorrowClick = () => {
    onBorrow(item.id, item.itemName);
    onClose();
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
            Item Details
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
              {item.itemName}
            </h3>
            <p className="text-gray-600 font-semibold">{item.category}</p>
          </div>

          {/* Image */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-center">
              {item.image ? (
                <img
                  src={typeof item.image === "string" ? item.image : box}
                  alt={item.itemName}
                  className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-lg shadow-md"
                />
              ) : (
                <div className="w-48 h-48 md:w-64 md:h-64 flex flex-col items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                  <svg
                    className="w-12 h-12 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-500 text-sm">
                    No Image Available
                  </span>
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
                <h4 className="font-semibold text-gray-900 text-sm">
                  Serial Number
                </h4>
              </div>
              <p className="text-gray-600 ml-11 text-sm">{item.serialNumber}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                  <FaCheckCircle className="text-white w-4 h-4" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  Condition
                </h4>
              </div>
              <p className="text-gray-600 ml-11 text-sm">{item.condition}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <FaTools className="text-white w-4 h-4" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  Item Make
                </h4>
              </div>
              <p className="text-gray-600 ml-11 text-sm">{item.itemMake}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <FaTools className="text-white w-4 h-4" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  Item Type
                </h4>
              </div>
              <p className="text-gray-600 ml-11 text-sm">{item.itemType}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <FaHashtag className="text-white w-4 h-4" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  Item Model
                </h4>
              </div>
              <p className="text-gray-600 ml-11 text-sm">
                {item.itemModel || "N/A"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                  <BsCalendar2Date className="text-white w-4 h-4" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  Date Added
                </h4>
              </div>
              <p className="text-gray-600 ml-11 text-sm">
                {FormattedDateTime(item.createdAt)}
              </p>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                  <MdOutlineDescription className="text-white w-4 h-4" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  Description
                </h4>
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
