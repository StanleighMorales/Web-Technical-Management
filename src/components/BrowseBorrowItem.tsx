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
  const columns = [
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
    columnHelper.accessor("condition", { header: "Condition", cell: ({row})=> {
      const classCondition = SlugCondition(row.original.condition)
      return (
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${classCondition}`}
              >
                {row.original.condition}
              </span>
      )
    } }),
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

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <table className="w-full border-collapse text-left">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="sticky top-0 bg-white/90 backdrop-blur-sm z-10">
            {headerGroup.headers.map((header: any) => (
              <th key={header.id} className="bg-transparent font-semibold py-3 px-3 md:px-4 border-b border-[#e6e6e6] text-[#0f172a] text-xs uppercase tracking-wider">
                {header.isPlaceholder ? null : header.column.columnDef.header}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getCoreRowModel().rows.map((row) => (
          <tr key={row.id}
          
            onClick={() => handleRowClick(row.original)}
          >
            {row.getVisibleCells().map((cell: any) => (
              <td key={cell.id}>
                {cell.column.columnDef.cell ? cell.column.columnDef.cell(cell.getContext()) : cell.renderValue()}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
