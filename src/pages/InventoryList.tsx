import { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
import { InventoryTable } from "../components/InventoryTable";
import ErrorTable from "../components/ErrorTables";
import { SuccessAlert } from "../components/SuccessAlert";
import { ErrorAlert } from "../components/ErrorAlert";
import * as XLSX from "xlsx";
import { usePostImportMutation } from "../query/post/usePostImportMutation";

export default function InventoryList() {
  const [ShowAlert, setShowAlert] = useState<boolean>(false);
  const [ShowMessage, setShowMessage] = useState<string>("");
  const [isAddItemFormOpen, setIsAddItemFormOpen] = useState(false);
  const [searchItem, setSearchItem] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'inventory' | 'pending' | 'reservation'>('inventory');
  const itemsPerPage = 10;
  const [items, setItems] = useState<TItemList[]>([]);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showAlertSuccess, setShowAlertSuccess] = useState<boolean>(false);
  const [showAlertFailed, setShowAlertFailed] = useState<boolean>(false);

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
    [items, searchItem, selectedCategory]
  );
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // check if the validCurrentPage is greater than ZERO then it will return the smaller currentPage and the totalPages if the condition is false then it return to ONE
  const validCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const paginatedData = useMemo(
    () =>
      filteredItems.slice(
        (validCurrentPage - 1) * itemsPerPage,
        validCurrentPage * itemsPerPage
      ),
    [filteredItems, itemsPerPage, validCurrentPage]
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
    [selectedCategory]
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
  // Import mutation
  const { mutate: importItem } = usePostImportMutation();

  // this Effect will automatically updated the data of the items response
  useEffect(() => {
    if (!data) return;
    setItems(data);
  }, [data]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle file import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event.target?.result;
      if (!arrayBuffer) return;

      const data = new Uint8Array(arrayBuffer as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      XLSX.utils.sheet_to_json(worksheet);
    };

    reader.readAsArrayBuffer(file);

    const form = new FormData();
    form.append("file", file);

    importItem(form, {
      onSuccess: () => {
        setShowAlertSuccess(true);
        setTimeout(() => {
          setShowAlertSuccess(false);
        }, 1500);
      },
      onError: (error) => {
        console.error(error.message);
        setShowAlertFailed(true);
        setTimeout(() => {
          setShowAlertFailed(false);
        }, 3000);
      },
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isPending) {
    return <InventoryListSkeletonLoader />;
  }

  return (
    <div className="flex flex-col w-full antialiased bg-linear-to-br animate-fadeIn inventory-list-container min-h-svh from-[#f8fafc] via-[#e8eef7] to-[#dbeafe]">
      {ShowAlert && <SuccessAlert message={ShowMessage} />}
      {showAlertSuccess && <SuccessAlert message="Excel imported successfully!" />}
      {showAlertFailed && <ErrorAlert message="Excel imported failed" />}

      {/* Hidden file input for import */}
      <input
        type="file"
        accept=".xlsx,.xls"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <header className="flex sticky top-0 z-30 flex-col items-center px-8 pt-8 pb-6 border-b shadow-sm inventory-header bg-white/70 backdrop-blur-md border-[#e5e9f2]">
        <h1 className="mb-2 text-5xl mt-10 lg:mt-0 md:mt-0 font-extrabold tracking-tight text-[#1e293b] drop-shadow-lg">
          Inventory List
        </h1>
        <p className="max-w-2xl text-base font-medium text-center md:text-lg text-[#64748b]">
          Overview of assets and availability. Track counts by category, staff
          status, and items currently borrowed.
        </p>

        {/* Tabs */}
        <div className="mt-6 flex gap-2 bg-white/90 p-1.5 rounded-xl shadow-md">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 ${activeTab === 'inventory'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
          >
            Inventory List
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 ${activeTab === 'pending'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab('reservation')}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 ${activeTab === 'reservation'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
          >
            Reservation
          </button>
        </div>
      </header>

      <div className="overflow-auto h-full">
        {activeTab === 'inventory' && (
          <>
            {/* Inventory Stats */}
            <section className="py-6 px-8 mx-auto w-full scrollbar-none">
              <div className="flex flex-row overflow-x-auto gap-3 pb-2 w-full scrollbar-none">
                {Array.from(new Set(items.map((item) => item.category))).map(
                  (category) => {
                    const itemsInCategory = items.filter(
                      (item) => item.category === category
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
                  }
                )}
              </div>
            </section>

            {/* Inventory Items Table */}
            <section className="px-8">
              <div className="overflow-x-auto p-4 rounded-2xl ring-1 shadow-xl bg-white/90 h-[60vh] ring-[#e0e7ef]/80">
                <section className="flex flex-col gap-3 justify-between mb-4 lg:flex-row md:flex-row">
                  <div className="flex flex-row gap-4">
                    <div>
                      <Button
                        onClick={() => setIsAddItemFormOpen(true)}
                        name={"New Item"}
                      />
                    </div>

                    {/* More Menu (3 dots) */}
                    <div className="relative" ref={moreMenuRef}>
                      <button
                        onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                        className="flex items-center justify-center w-10 h-10 text-gray-600 bg-white rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-md border border-gray-200"
                        aria-label="More options"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </button>

                      {isMoreMenuOpen && (
                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                fileInputRef.current?.click();
                                setIsMoreMenuOpen(false);
                              }}
                              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              Import Items
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button
                              onClick={() => {
                                // TODO: Add print barcodes functionality
                                console.log('Print Barcodes clicked');
                                setIsMoreMenuOpen(false);
                              }}
                              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                              </svg>
                              Print Barcodes
                            </button>
                            <button
                              onClick={() => {
                                // TODO: Add export items functionality
                                console.log('Export Items clicked');
                                setIsMoreMenuOpen(false);
                              }}
                              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Export Items
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-center md:flex-row lg:flex-row">
                    {/*Pagination Component*/}
                    {filteredItems.length > 0 && (
                      <div className="flex pt-2 -ml-30">
                        <Pagination
                          totalPages={totalPages}
                          currentPage={currentPage}
                          handlePageChange={handlePageChange}
                          selectedCategory={selectedCategory}
                          handleShowAll={handleShowAll}
                        />
                      </div>
                    )}
                    {/* Search Bar Component */}
                    <SearchBar
                      onChangeValue={(value) => setSearchItem(value)}
                      name={"search"}
                      placeholder={"Search your items..."}
                    />
                  </div>
                </section>
                <div className="overflow-x-auto rounded-lg shadow-inner h-[46vh] bg-white/95">
                  {/* Check if the response from the QUERY is error cause for internet connection etc, will return a ERROR TABLE COMPONENTS */}
                  {isError ? (
                    <ErrorTable />
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="sticky top-0 bg-white/90 backdrop-blur-sm">
                          <th className="py-3 px-4 text-xs font-semibold tracking-wider text-left uppercase bg-transparent border-b border-[#e6e6e6] text-[#64748b]">
                            Serial Num
                          </th>
                          <th className="py-3 px-4 text-xs font-semibold tracking-wider text-left uppercase bg-transparent border-b border-[#e6e6e6] text-[#64748b]">
                            Image
                          </th>
                          <th className="py-3 px-4 text-xs font-semibold tracking-wider text-left uppercase bg-transparent border-b border-[#e6e6e6] text-[#64748b]">
                            Name
                          </th>
                          <th className="py-3 px-4 text-xs font-semibold tracking-wider text-left uppercase bg-transparent border-b border-[#e6e6e6] text-[#64748b]">
                            Category
                          </th>
                          <th className="py-3 px-4 text-xs font-semibold tracking-wider text-left uppercase bg-transparent border-b border-[#e6e6e6] text-[#64748b]">
                            Condition
                          </th>
                          <th className="py-3 px-4 text-xs font-semibold tracking-wider text-left uppercase bg-transparent border-b border-[#e6e6e6] text-[#64748b]">
                            DateTime
                          </th>
                          <th className="py-3 px-4 text-xs font-semibold tracking-wider text-left uppercase bg-transparent border-b border-[#e6e6e6] text-[#64748b]">
                            Status
                          </th>
                          <th className="py-3 px-4 text-xs font-semibold tracking-wider text-left uppercase bg-transparent border-b border-[#e6e6e6] text-[#64748b]">
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
                              className="transition-colors cursor-pointer py-4 odd:bg-white even:bg-[#f9fbff] hover:bg-[#f8fafc]"
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
                                Status={item.status}
                                onMutate={() =>
                                  mutate(item.id, {
                                    onSuccess: (data) => {
                                      setShowAlert(true);
                                      setShowMessage(data.message);
                                      setTimeout(() => {
                                        setShowAlert(false);
                                        setShowMessage("");
                                      }, 3500);
                                    },
                                  })
                                }
                              />
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  )}
                  {paginatedData.length == 0 && (
                    <div className="flex justify-center items-center mt-16 w-full">
                      <div className="max-w-md text-center">
                        <div className="mb-3 text-5xl text-[#94a3b8]">📦</div>
                        <h3 className="mb-2 text-2xl font-semibold text-[#0f172a]">
                          No items found
                        </h3>
                        <p className="text-base text-[#64748b]">
                          Try adjusting your search or filters. New items will
                          appear here once created.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'pending' && (
          <section className="px-8 py-6">
            <div className="overflow-x-auto p-8 rounded-2xl ring-1 shadow-xl bg-white/90 h-[60vh] ring-[#e0e7ef]/80">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="mb-4 text-6xl text-[#94a3b8]">⏳</div>
                  <h3 className="mb-3 text-3xl font-semibold text-[#0f172a]">
                    Pending Items
                  </h3>
                  <p className="text-lg text-[#64748b]">
                    Items awaiting approval or processing will appear here.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'reservation' && (
          <section className="px-8 py-6">
            <div className="overflow-x-auto p-8 rounded-2xl ring-1 shadow-xl bg-white/90 h-[60vh] ring-[#e0e7ef]/80">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="mb-4 text-6xl text-[#94a3b8]">📅</div>
                  <h3 className="mb-3 text-3xl font-semibold text-[#0f172a]">
                    Reservations
                  </h3>
                  <p className="text-lg text-[#64748b]">
                    Reserved items and upcoming bookings will be displayed here.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Check if the add item form is true then it will show */}
      {isAddItemFormOpen && (
        <AddItemForm onClose={() => setIsAddItemFormOpen(false)} />
      )}
    </div>
  );
}
