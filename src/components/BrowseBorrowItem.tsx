import { SlugCondition } from "./SlugCondition";
import { MdSwapHoriz } from "react-icons/md";
import box from "../assets/box.webp";
import type { TItemList } from "../types/types";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";

type IBrowseBorrowItem = {
  paginatedData: TItemList[];
  handleRowClick: (item: TItemList) => void;
  handleBorrowClick: (
    e: React.MouseEvent<HTMLButtonElement>,
    itemId: string,
    itemName: string,
  ) => void;
};

export const BrowseBorrowItem = ({
  paginatedData,
  handleRowClick,
  handleBorrowClick,
}: IBrowseBorrowItem) => {
  const columnHelper = createColumnHelper<TItemList>();
  const column = [
    columnHelper.accessor("serialNumber", { header: "Serial Number" }),
    columnHelper.accessor("image", {
      header: "Image",
      cell: ({ row }) => (
        <img
          src={
            typeof row.original.image === "string" ? row.original.image : box
          }
          alt={row.original.itemName}
          className="w-12 h-12 object-cover rounded"
        />
      ),
    }),
    columnHelper.accessor("itemName", { header: "Item" }),
    columnHelper.accessor("category", { header: "Category" }),
    columnHelper.accessor("condition", { header: "Condition" }),
    columnHelper.accessor("description", { header: "Description" }),
    columnHelper.display({
      id: "borrow",
      header: "Borrow",
      cell: ({ row }) => (
        <button
          onClick={(e) =>
            handleBorrowClick(e, row.original.id, row.original.itemName)
          }
          className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white font-medium text-xs md:text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
          title="Borrow this item"
        >
          <MdSwapHoriz className="text-sm" />
          <span className="hidden sm:inline">Borrow</span>
        </button>
      ),
    }),
  ];

  return (
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
            <td className="py-3 px-3 md:px-4 font-semibold text-sm">
              {item.serialNumber}
            </td>
            <td className="py-3 px-3 md:px-4">
              <img
                src={typeof item.image === "string" ? item.image : box}
                alt={item.itemName}
                className="w-10 h-10 rounded-xl object-cover"
              />
            </td>
            <td className="py-3 px-3 md:px-4 text-sm">{item.itemName}</td>
            <td className="hidden md:table-cell py-3 px-4 text-sm">
              {item.category}
            </td>
            <td className="hidden lg:table-cell py-3 px-4">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${SlugCondition(item.condition)}`}
              >
                {item.condition}
              </span>
            </td>
            <td className="hidden xl:table-cell py-3 px-4 text-sm max-w-xs">
              <div
                className="truncate"
                title={item.description || "No description"}
              >
                {item.description || "No description"}
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
  );
};
