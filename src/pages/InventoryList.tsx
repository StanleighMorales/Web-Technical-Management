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
import ExcelImportItemButton from "../components/ExcelImportItemButton";
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
  const [activeTab, setActiveTab] = useState<
    "inventory" | "pending" | "reservation"
  >("inventory");
  const itemsPerPage = 10;
  const [items, setItems] = useState<TItemList[]>([]);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showAlertSuccess, setShowAlertSuccess] = useState<boolean>(false);
  const [showAlertFailed, setShowAlertFailed] = useState<boolean>(false);
  const [showPrintBarcodeModal, setShowPrintBarcodeModal] = useState<boolean>(false);
  const [printCurrentPage, setPrintCurrentPage] = useState<number>(1);
  const itemsPerPrintPage = 15; // 5x3 grid optimized for A4 paper printing
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);

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
  // Import mutation
  const { mutate: importItem } = usePostImportMutation();

  // this Effect will automatically updated the data of the items response
  useEffect(() => {
    if (!data) return;
    setItems(data);
  }, [data]);

  // Close print modal and reset page when data changes
  useEffect(() => {
    if (showPrintBarcodeModal && data) {
      // If items were added/removed while modal is open, close it
      const currentFilteredCount = filteredItems.length;
      const maxPage = Math.ceil(currentFilteredCount / itemsPerPrintPage);

      // Reset to page 1 if current page is now out of bounds
      if (printCurrentPage > maxPage && maxPage > 0) {
        setPrintCurrentPage(1);
      }
    }
  }, [data, showPrintBarcodeModal, filteredItems.length, printCurrentPage, itemsPerPrintPage]);

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

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    if (!validTypes.includes(file.type)) {
      setShowAlert(true);
      setShowMessage("Invalid file type. Please upload an Excel file (.xlsx or .xls)");
      setTimeout(() => {
        setShowAlert(false);
        setShowMessage("");
      }, 3000);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setShowAlert(true);
      setShowMessage("File size exceeds 5MB limit. Please upload a smaller file.");
      setTimeout(() => {
        setShowAlert(false);
        setShowMessage("");
      }, 3000);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsImporting(true);

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
        setIsImporting(false);
        setShowAlertSuccess(true);
        setTimeout(() => {
          setShowAlertSuccess(false);
        }, 1500);
      },
      onError: (error) => {
        setIsImporting(false);
        console.error(error.message);
        setShowAlert(true);
        setShowMessage(`Import failed: ${error.message || 'Unknown error'}`);
        setTimeout(() => {
          setShowAlert(false);
          setShowMessage("");
        }, 3000);
      },
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle export items to Excel
  const handleExportItems = async () => {
    // Check if there are items to export
    if (filteredItems.length === 0) {
      setShowAlert(true);
      setShowMessage("No items to export. Please add items to your inventory first.");
      setTimeout(() => {
        setShowAlert(false);
        setShowMessage("");
      }, 3000);
      return;
    }

    setIsExporting(true);

    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));

      // Prepare data for export using exact column names that match import format
      const exportData = filteredItems.map((item) => ({
        'SerialNumber': item.serialNumber,
        'ItemName': item.itemName,
        'ItemType': item.itemType,
        'ItemMake': item.itemMake,
        'ItemModel': item.itemModel || '',
        'Description': item.description || '',
        'Category': item.category,
        'Condition': item.condition,
        'Status': item.status,
        'Image': '', // Empty - images not exported
        'CreatedDate': new Date(item.createdAt).toLocaleDateString(), // For reference only, ignored on import
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths for better readability
      const columnWidths = [
        { wch: 15 }, // SerialNumber
        { wch: 25 }, // ItemName
        { wch: 15 }, // ItemType
        { wch: 15 }, // ItemMake
        { wch: 15 }, // ItemModel
        { wch: 30 }, // Description
        { wch: 15 }, // Category
        { wch: 15 }, // Condition
        { wch: 12 }, // Status
        { wch: 20 }, // Image
        { wch: 15 }, // CreatedDate
      ];
      worksheet['!cols'] = columnWidths;

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Items');

      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      const filename = `inventory_export_${date}.xlsx`;

      // Download file
      XLSX.writeFile(workbook, filename);

      // Show success message
      setShowAlert(true);
      setShowMessage(`Successfully exported ${exportData.length} item${exportData.length !== 1 ? 's' : ''} to ${filename}`);
      setTimeout(() => {
        setShowAlert(false);
        setShowMessage("");
      }, 3000);
    } catch (error) {
      console.error('Export error:', error);
      setShowAlert(true);
      setShowMessage(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => {
        setShowAlert(false);
        setShowMessage("");
      }, 3000);
    } finally {
      setIsExporting(false);
    }
  };

  if (isPending) {
    return <InventoryListSkeletonLoader />;
  }

  return (
    <div className="flex flex-col w-full antialiased bg-linear-to-br animate-fadeIn inventory-list-container min-h-svh from-[#f8fafc] via-[#e8eef7] to-[#dbeafe]">
      {ShowAlert && <SuccessAlert message={ShowMessage} />}

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
            onClick={() => setActiveTab("inventory")}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 ${activeTab === "inventory"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
          >
            Inventory List
          </button>

          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 ${activeTab === "pending"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
          >
            Pending
          </button>

          <button
            onClick={() => setActiveTab("reservation")}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 ${activeTab === "reservation"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
          >
            Reservation
          </button>
        </div>
      </header>

      <div className="overflow-auto h-full">
        {activeTab === "inventory" && (
          <>
            {/* Inventory Stats */}
            <section className="py-6 px-8 mx-auto w-full scrollbar-none">
              <div className="flex flex-row overflow-x-auto gap-3 pb-2 w-full scrollbar-none">
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

            {/* Inventory Table Section */}
            <section className="px-8">
              <div className="overflow-x-auto p-4 rounded-2xl ring-1 shadow-xl bg-white/90 h-[60vh] ring-[#e0e7ef]/80">
                {/* Top Controls */}
                <section className="flex flex-col gap-3 justify-between mb-4 lg:flex-row md:flex-row">
                  <div className="flex flex-row gap-4">
                    <div>
                      <Button
                        onClick={() => setIsAddItemFormOpen(true)}
                        name={"New Item"}
                      />
                    </div>
                    <ExcelImportItemButton />
                  </div>

                  <div className="flex flex-col gap-2 items-center md:flex-row lg:flex-row">
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

                    <SearchBar
                      onChangeValue={(value) => setSearchItem(value)}
                      name={"search"}
                      placeholder={"Search your items..."}
                    />
                  </div>
                </section>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg shadow-inner h-[46vh] bg-white/95">
                  {isError ? (
                    <ErrorTable />
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="sticky top-0 bg-white/90 backdrop-blur-sm">
                          <th className="py-3 px-4 text-xs font-semibold uppercase border-b text-[#64748b]">
                            Serial Num
                          </th>
                          <th className="py-3 px-4 text-xs font-semibold uppercase border-b text-[#64748b]">
                            Image
                          </th>
                          <th className="py-3 px-4 text-xs font-semibold uppercase border-b text-[#64748b]">
                            Name
                          </th>
                          <th className="py-3 px-4 text-xs font-semibold uppercase border-b text-[#64748b]">
                            Category
                          </th>
                          <th className="py-3 px-4 text-xs font-semibold uppercase border-b text-[#64748b]">
                            Condition
                          </th>
                          <th className="py-3 px-4 text-xs font-semibold uppercase border-b text-[#64748b]">
                            DateTime
                          </th>
                          <th className="py-3 px-4 text-xs font-semibold uppercase border-b text-[#64748b]">
                            Status
                          </th>
                          <th className="py-3 px-4 text-xs font-semibold uppercase border-b text-[#64748b]">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {paginatedData.map((item) => (
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
                        ))}
                      </tbody>
                    </table>
                  )}

                  {paginatedData.length === 0 && (
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
      </div>

      {isAddItemFormOpen && (
        <AddItemForm onClose={() => setIsAddItemFormOpen(false)} />
      )}
    </div>
  );
}
