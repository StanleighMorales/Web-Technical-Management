import { useState, useEffect, useMemo, useCallback } from "react";
import { useAllItems } from "../hooks/itemHooks";
import { useQuery } from "@tanstack/react-query";
import type { TItemList } from "../@types/types.ts";
import InventoryListSkeletonLoader from "../loader/InventoryListSkeletonLoader";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import { InventoryBadges } from "../components/InventoryBadges";
import ErrorTable from "../components/ErrorTables";
import { BrowseBorrowItem } from "../components/BrowseBorrowItem.tsx";
import { ItemDetailsModal } from "./ItemDetailsModal.tsx";

export const BorrowItemsTable = ({
  onBorrowClick,
}: {
  onBorrowClick: (itemId: string, itemName: string) => void;
}) => {
  const [searchItem, setSearchItem] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [items, setItems] = useState<TItemList[]>([]);
  const [selectedItem, setSelectedItem] = useState<TItemList | null>(null);
  const itemsPerPage = 10;

  const { data, isPending, isError } = useQuery(useAllItems());

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
        const matchesCategory =
          selectedCategory === "" || item.category === selectedCategory;
        const isAvailable = item.status === "Available";
        return matchesSearch && matchesCategory && isAvailable;
      }),
    [items, searchItem, selectedCategory],
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const validCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const paginatedData = useMemo(
    () =>
      filteredItems.slice(
        (validCurrentPage - 1) * itemsPerPage,
        validCurrentPage * itemsPerPage,
      ),
    [filteredItems, itemsPerPage, validCurrentPage],
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleCategoryClick = useCallback(
    (category: string) => {
      setSelectedCategory(selectedCategory === category ? "" : category);
      setCurrentPage(1);
    },
    [selectedCategory],
  );
  
  const handleRowClick = (item: TItemList) => {
    setSelectedItem(item);
  };

  const handleBorrowClick = (
    e: React.MouseEvent,
    itemId: string,
    itemName: string,
  ) => {
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
          {Array.from(new Set(items.map((item) => item.category))).map(
            (category) => {
              const itemsInCategory = items.filter(
                (item) =>
                  item.category === category && item.status === "Available",
              );
              return (
                <InventoryBadges
                  key={category}
                  name={category}
                  total={itemsInCategory.length}
                  onClick={() => handleCategoryClick(category)}
                  isSelected={selectedCategory === category}
                />
              );
            },
          )}
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
                  totalItems={filteredItems.length}
                  itemsPerPage={itemsPerPage}
                  handlePageChange={handlePageChange}
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
              <BrowseBorrowItem
                paginatedData={items}
                handleRowClick={handleRowClick}
                handleBorrowClick={handleBorrowClick}
              />
            )}
            {paginatedData.length === 0 && !isError && (
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                  <div className="text-5xl mb-3 text-[#94a3b8]">📦</div>
                  <h3 className="text-xl md:text-2xl font-semibold text-[#0f172a] mb-2">
                    No items found
                  </h3>
                  <p className="text-[#64748b] text-sm md:text-base">
                    Try adjusting your search or filters. Items available for
                    borrowing will appear here.
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
