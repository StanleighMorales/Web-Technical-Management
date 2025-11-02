import { useState, useEffect, useMemo, useCallback } from "react";
import AddItemForm from "../components/AddItem";
import Button from "../components/Button";
import SearchBar from "../components/SearchBar";
import InventoryListSkeletonLoader from "../loader/InventoryListSkeletonLoader";
import logo from "../assets/img/aclcLogo.webp";
import { useQuery } from "@tanstack/react-query";
import { useArchiveItemMutation } from "../query/delete/useArchiveItemMutation";
import type { TItemList } from "../types/types";
import { useAllItemsQuery } from "../query/get/useAllItemsQuery";
import { InventoryBadges } from "../components/InventoryBadges";
import Pagination from "../components/Pagination";
import InventoryTable from "../components/InventoryTable";
import ErrorTable from "../components/ErrorTables";

export default function InventoryList() {
  const [isAddItemFormOpen, setIsAddItemFormOpen] = useState(false);
  const [searchItem, setSearchItem] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [items, setItems] = useState<TItemList[]>([]);


  // this func use a useMemo to filtered item either its itemName or the Category and also for the Matches Category and return items,searchItem and selectedCategory
  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesSearch =
          item.itemName.toLowerCase().includes(searchItem.toLowerCase()) ||
          item.category.toLowerCase().includes(searchItem.toLowerCase()) ||
          item.serialNumber.toLowerCase().includes(searchItem.toLowerCase());

        const matchesCategory =
          selectedCategory === "" || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
      }),
    [items, searchItem, selectedCategory],
  );
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // check if the validCurrentPage is greater than ZERO then it will return the smaller currentPage and the totalPages if the condition is false then it return to ONE
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

  // this func will handle all the page triggered in the button to set either to 1 to 2 or 3 etc
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // this func check if the category is selected is true then it will return all the item matches on this category selected
  const handleCategoryClick = useCallback(
    (category: string) => {
      setSelectedCategory(selectedCategory === category ? "" : category);
      setCurrentPage(1);
    },
    [selectedCategory],
  );

  // this func return to display all the items when the selectedCategory is executed
  const handleShowAll = useCallback(() => {
    setSelectedCategory("");
    setCurrentPage(1);
  }, []);

  // get the response from useQuery
  const { data, isPending, isError } = useQuery(useAllItemsQuery());
  // this mutate func will return the ID of the item and to to deleted
  const { mutate } = useArchiveItemMutation();

  // this Effect will automatically updated the data of the items response
  useEffect(() => {
    if (!data) return;
    setItems(data);
  }, [data]);

  if (isPending) {
    return <InventoryListSkeletonLoader />;
  }

  return (
    <div className="animate-fadeIn inventory-list-container min-h-svh w-full bg-gradient-to-br from-[#f8fafc] via-[#e8eef7] to-[#dbeafe] flex flex-col antialiased">
      <header className="inventory-header sticky top-0 pt-8 px-8 pb-6 bg-white/70 backdrop-blur-md shadow-sm border-b border-[#e5e9f2] flex flex-col items-center z-50">
        <h1 className="text-[#1e293b] text-5xl mb-2 font-extrabold tracking-tight drop-shadow-lg">
          Inventory List
        </h1>
        <p className="text-[#64748b] text-base md:text-lg font-medium max-w-2xl text-center">
          Overview of assets and availability. Track counts by category, staff
          status, and items currently borrowed.
        </p>
      </header>

      <div className="h-full overflow-auto">
        {/* Inventory Stats */}
        <section className="scrollbar-none mx-auto w-full px-8 py-6">
          <div className="inline-flex gap-3 overflow-x-auto w-full pb-2">
            {Array.from(new Set(items.map((item) => item.category))).map(
              (category) => {
                const itemsInCategory = items.filter(
                  (item) => item.category === category,
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

        {/* Inventory Items Table */}
        <section className="px-8">
          <div className="bg-white/90 h-[60vh] p-4 rounded-2xl shadow-xl ring-1 ring-[#e0e7ef]/80 overflow-x-auto">
            <section className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <Button
                  onClick={() => setIsAddItemFormOpen(true)}
                  name={"New Item"}
                />
              </div>
              <div className="flex flex-row gap-2 items-center">
                {/*Pagination Component*/}
                {filteredItems.length > 0 && (
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    selectedCategory={selectedCategory}
                    handleShowAll={handleShowAll}
                  />
                )}
                {/* Search Bar Component */}
                <SearchBar
                  onChangeValue={(value) => setSearchItem(value)}
                  name={"search"}
                  placeholder={"Search your items..."}
                />
              </div>
            </section>
            <div className="h-[46vh] overflow-x-auto rounded-lg shadow-inner bg-white/95">
              {/* Check if the response from the QUERY is error cause for internet connection etc, will return a ERROR TABLE COMPONENTS */}
              {isError ? (
                <ErrorTable />
              ) : (
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="sticky top-0 bg-white/90 backdrop-blur-sm">
                      <th className="bg-transparent font-semibold py-3 px-4 border-b border-[#e6e6e6] text-[#0f172a] text-xs uppercase tracking-wider">
                        Serial Num
                      </th>
                      <th className="bg-transparent font-semibold py-3 px-4 border-b border-[#e6e6e6] text-[#0f172a] text-xs uppercase tracking-wider">
                        Image
                      </th>
                      <th className="bg-transparent font-semibold py-3 px-4 border-b border-[#e6e6e6] text-[#0f172a] text-xs uppercase tracking-wider">
                        Name
                      </th>
                      <th className="bg-transparent font-semibold py-3 px-4 border-b border-[#e6e6e6] text-[#0f172a] text-xs uppercase tracking-wider">
                        Category
                      </th>
                      <th className="bg-transparent font-semibold py-3 px-4 border-b border-[#e6e6e6] text-[#0f172a] text-xs uppercase tracking-wider">
                        Condition
                      </th>
                      <th className="bg-transparent font-semibold py-3 px-4 border-b border-[#e6e6e6] text-[#0f172a] text-xs uppercase tracking-wider">
                        DateTime
                      </th>
                      <th className="bg-transparent font-semibold py-3 px-4 border-b border-[#e6e6e6] text-[#0f172a] text-xs uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Check if the paginated item is equal to ZERO  */}
                    {
                      // Mapping all the items created
                      paginatedData.map((item) => (
                        <tr
                          key={item.serialNumber}
                          className="hover:bg-[#f8fafc] transition-colors odd:bg-white even:bg-[#f9fbff] cursor-pointer"
                        >
                          <InventoryTable
                            id={item.id}
                            createdAt={item.createdAt}
                            ItemName={item.itemName}
                            SerialNumber={item.serialNumber}
                            Image={item.image || logo}
                            ItemType={item.itemType}
                            Category={item.category}
                            Condition={item.condition}
                            onMutate={() => mutate(item.id)}
                          />
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              )}
              {paginatedData.length == 0 && (
                <div className="w-full mt-16 flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <div className="text-5xl mb-3 text-[#94a3b8]">📦</div>
                    <h3 className="text-2xl font-semibold text-[#0f172a] mb-2">
                      No items found
                    </h3>
                    <p className="text-[#64748b] text-base">
                      Try adjusting your search or filters. New items will appear here once created.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Check if the add item form is true then it will show */}
      {isAddItemFormOpen && (
        <AddItemForm onClose={() => setIsAddItemFormOpen(false)} />
      )}
    </div>
  );
}
