import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRecentlyBorrowItems } from "../hooks/itemHooks";
import { FormattedDateTime } from "../components/FormattedDateTime.ts";
import { SlugStatus } from "../components/SlugStatus.ts";
import { ViewRecentBorrowItems } from "../components/ViewRecentBorrowItems";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import ErrorTable from "../components/ErrorTables";
import { BookOpen, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { TRecentBorrowItemProps } from "../@types/types";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper<TRecentBorrowItemProps>();

const activeBorrowColumns = [
  columnHelper.accessor("item.serialNumber", { header: "Serial No." }),
  columnHelper.accessor("item.image", {
    header: "Image",
    cell: ({ row }) => (
      <img
        src={typeof row.original.item.image === "string" ? row.original.item.image : undefined}
        alt={row.original.item.itemName}
        className="w-10 h-10 object-cover rounded-xl border border-slate-100"
      />
    ),
  }),
  columnHelper.accessor("item.itemName", { header: "Item" }),
  columnHelper.accessor("borrowerFullName", { header: "Occupied By" }),
  columnHelper.accessor("teacherFullName", { header: "Teacher" }),
  columnHelper.accessor("room", { header: "Room" }),
  columnHelper.accessor("remarks", { header: "Remarks" }),
  columnHelper.accessor("lentAt", {
    header: "Lent At",
    cell: ({ getValue }) => {
      const val = getValue();
      return val ? FormattedDateTime(val) : <span className="text-slate-300 italic text-xs">—</span>;
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => {
      const colorClass = SlugStatus(row.original.status);
      return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
          {row.original.status}
        </span>
      );
    },
  }),
];

export default function ActiveBorrowedItems() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBorrowId, setSelectedBorrowId] = useState<string | null>(null);
  const itemsPerPage = 10;

  const { data, isPending, isError } = useQuery(useRecentlyBorrowItems());
  const [allItems, setAllItems] = useState<TRecentBorrowItemProps[]>([]);

  useEffect(() => {
    if (data) setAllItems(Array.isArray(data) ? data : []);
  }, [data]);

  const filteredData = useMemo(
    () =>
      allItems.filter(
        (item) =>
          item.status === "Borrowed" &&
          (item.item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.item.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.borrowerFullName?.toLowerCase().includes(searchTerm.toLowerCase())),
      ),
    [allItems, searchTerm],
  );

  const totalPages = useMemo(() => Math.ceil(filteredData.length / itemsPerPage), [filteredData]);

  const paginatedData = useMemo(
    () => filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredData, currentPage],
  );

  const handlePageChange = useCallback((page: number) => setCurrentPage(page), []);

  const table = useReactTable({
    data: paginatedData,
    columns: activeBorrowColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-b-2 border-blue-600 animate-spin" />
        <span className="text-sm font-medium text-slate-500">Loading active borrows...</span>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col p-6 md:p-8 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

      {/* Header */}
      <div className="shrink-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">Manage Borrow Items</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Active Borrowed Items</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          All items currently borrowed and not yet returned.
        </p>
      </div>

      {/* Table card — grows to fill remaining height */}
      <div className="flex-1 min-h-0 bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="shrink-0 px-6 md:px-8 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
              Active Borrowed Items
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {filteredData.length} active borrow{filteredData.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Pagination
              totalPages={totalPages || 1}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
            <SearchBar
              onChangeValue={(value) => { setSearchTerm(value); setCurrentPage(1); }}
              name="search"
              placeholder="Search items..."
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 min-h-0 overflow-x-auto">
          <div className="h-full overflow-y-auto">
            {isError ? (
              <ErrorTable />
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="border-b border-slate-100">
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="sticky top-0 bg-slate-50/80 backdrop-blur-sm px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400"
                        >
                          {header.isPlaceholder ? null : String(header.column.columnDef.header ?? "")}
                        </th>
                      ))}
                      <th className="sticky top-0 bg-slate-50/80 backdrop-blur-sm px-6 py-4" />
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedBorrowId(row.original.id)}
                        className="group transition-all duration-200 hover:bg-indigo-50/30 cursor-pointer"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-6 py-4 text-slate-700 font-medium">
                            {cell.column.columnDef.cell
                              ? (cell.column.columnDef.cell as (ctx: ReturnType<typeof cell.getContext>) => React.ReactNode)(cell.getContext())
                              : (cell.renderValue() as React.ReactNode) ?? <span className="text-slate-300 italic text-xs">—</span>}
                          </td>
                        ))}
                        <td className="px-6 py-4">
                          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={activeBorrowColumns.length + 1} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <BookOpen className="h-10 w-10 text-slate-200" />
                          <p className="font-semibold text-slate-500">No active borrowed items</p>
                          <p className="text-xs">Items with "Borrowed" status will appear here.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBorrowId && (
        <ViewRecentBorrowItems
          itemId={selectedBorrowId}
          isOpen={!!selectedBorrowId}
          onClose={() => setSelectedBorrowId(null)}
        />
      )}
    </div>
  );
}
