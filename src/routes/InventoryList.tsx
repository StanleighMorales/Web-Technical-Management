import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  Activity,
} from "react";
import AddItemForm from "../components/AddItem";
import Button from "../components/Button";
import SearchBar from "../components/SearchBar";
import InventoryListSkeletonLoader from "../loader/InventoryListSkeletonLoader";
import box from "../assets/box.webp";
import { InventoryBadges } from "../components/InventoryBadges";
import Pagination from "../components/Pagination";
import ErrorTable from "../components/ErrorTables";
import { SuccessAlert } from "../components/SuccessAlert";
import { ErrorAlert } from "../components/ErrorAlert";
import * as XLSX from "xlsx";
import { useImportItem } from "../hooks/itemHooks";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import SelectItemFilters from "../components/SelectItemFilters";
import { InventoryTable } from "../components/InventoryTable";
import { useAllInventoryItems, useFilteredItems } from "../data/inventory-data";


export default function InventoryList() {
  const { items, isPending, isError } = useAllInventoryItems()
  const { filteredItems, setSearchItem, selectedCategory, setSelectedCategory, selectedCondition, setSelectedCondition, selectedStatus, setSelectedStatus } = useFilteredItems()

  const [ShowAlert, setShowAlert] = useState<boolean>(false);
  const [ShowMessage, setShowMessage] = useState<string>("");
  const [isAddItemFormOpen, setIsAddItemFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const [showAlertSuccess, setShowAlertSuccess] = useState<boolean>(false);
  const [showAlertFailed, setShowAlertFailed] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [showPrintBarcodeModal, setShowPrintBarcodeModal] =
    useState<boolean>(false);
  const [printCurrentPage, setPrintCurrentPage] = useState<number>(1);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const itemsPerPrintPage = 15; // Items per print page (3x5 grid for A4)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Calculate status counts
  const statusCounts = useMemo(() => {
    return {
      all: items.length,
      available: items.filter((item) => item.status === "Available").length,
      borrowed: items.filter((item) => item.status === "Borrowed").length,
    };
  }, [items]);

  const { mutate: importItem } = useImportItem();
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
    setSelectedCondition("");
    setSelectedStatus("");
    setCurrentPage(1);
  }, []);

  // Handle condition filter change
  const handleConditionChange = useCallback((condition: string) => {
    setSelectedCondition(condition);
    setCurrentPage(1);
  }, []);

  // Handle status filter change
  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  }, []);

  // Close print modal and reset page when data changes
  useEffect(() => {
    if (showPrintBarcodeModal && items) {
      // If items were added/removed while modal is open, close it
      const currentFilteredCount = filteredItems.length;
      const maxPage = Math.ceil(currentFilteredCount / itemsPerPrintPage);

      // Reset to page 1 if current page is now out of bounds
      if (printCurrentPage > maxPage && maxPage > 0) {
        setPrintCurrentPage(1);
      }
    }
  }, [
    items,
    showPrintBarcodeModal,
    filteredItems.length,
    printCurrentPage,
    itemsPerPrintPage,
  ]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setIsMoreMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle file import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!validTypes.includes(file.type)) {
      setShowAlertFailed(true);
      setTimeout(() => {
        setShowAlertFailed(false);
      }, 3000);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setShowAlertFailed(true);
      setTimeout(() => {
        setShowAlertFailed(false);
      }, 3000);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
        }, 3500);
      },
      onError: (error) => {
        setIsImporting(false);
        console.error(error.message);
        setShowAlertFailed(true);
        setTimeout(() => {
          setShowAlertFailed(false);
        }, 3500);
      },
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle export items to Excel
  const handleExportItems = async () => {
    // Check if there are items to export
    if (filteredItems.length === 0) {
      setShowAlert(true);
      setShowMessage(
        "No items to export. Please add items to your inventory first.",
      );
      setTimeout(() => {
        setShowAlert(false);
        setShowMessage("");
      }, 3000);
      return;
    }

    setIsExporting(true);

    try {
      // Small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Prepare data for export using exact column names that match import format
      const exportData = filteredItems.map((item) => ({
        SerialNumber: item.serialNumber,
        ItemName: item.itemName,
        ItemType: item.itemType,
        ItemMake: item.itemMake,
        ItemModel: item.itemModel || "",
        Description: item.description || "",
        Category: item.category,
        Condition: item.condition,
        Image: "", // Empty - images not exported
        CreatedDate: new Date(item.createdAt).toLocaleDateString(), // For reference only, ignored on import
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
        { wch: 20 }, // Image
        { wch: 15 }, // CreatedDate
      ];
      worksheet["!cols"] = columnWidths;

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Items");

      // Generate filename with current date
      const date = new Date().toISOString().split("T")[0];
      const filename = `inventory_export_${date}.xlsx`;

      // Download file
      XLSX.writeFile(workbook, filename);

      // Show success message
      setShowAlert(true);
      setShowMessage(
        `Successfully exported ${exportData.length} item${exportData.length !== 1 ? "s" : ""} to ${filename}`,
      );
      setTimeout(() => {
        setShowAlert(false);
        setShowMessage("");
      }, 3500);
    } catch (error) {
      console.error("Export error:", error);
      setShowAlert(true);
      setShowMessage(
        `Export failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setTimeout(() => {
        setShowAlert(false);
        setShowMessage("");
      }, 3500);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle PDF generation
  const handleGeneratePDF = async () => {
    if (filteredItems.length === 0) return;

    setIsGeneratingPDF(true);

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const totalPages = Math.ceil(filteredItems.length / itemsPerPrintPage);

      for (let page = 1; page <= totalPages; page++) {
        const startIdx = (page - 1) * itemsPerPrintPage;
        const endIdx = Math.min(
          startIdx + itemsPerPrintPage,
          filteredItems.length,
        );
        const pageItems = filteredItems.slice(startIdx, endIdx);

        // Create a temporary container with inline styles (no Tailwind)
        const tempContainer = document.createElement("div");
        tempContainer.style.cssText = `
                    width: 210mm;
                    height: 297mm;
                    background: white;
                    padding: 6mm;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-template-rows: repeat(5, 1fr);
                    gap: 4mm;
                    position: absolute;
                    left: -9999px;
                    top: 0;
                `;

        pageItems.forEach((item) => {
          const card = document.createElement("div");
          card.style.cssText = `
                        border: 1px solid #d1d5db;
                        border-radius: 2mm;
                        padding: 3mm;
                        background: white;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: space-between;
                        text-align: center;
                    `;

          card.innerHTML = `
                        <div style="font-size: 10px; font-weight: 600; line-height: 1.3; margin-bottom: 2mm; color: #1f2937; min-height: 8mm; max-height: 8mm; overflow: hidden; word-wrap: break-word; display: flex; align-items: center; justify-content: center;">
                            ${item.itemName}
                        </div>
                        <div style="flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; margin: 2mm 0;">
                            <img src="${item.barcodeImage || box}" alt="${item.serialNumber}" style="max-width: 100%; max-height: 30mm; object-fit: contain;" crossorigin="anonymous" />
                        </div>
                        <div style="font-size: 9px; line-height: 1.2; margin-top: 1mm; color: #4b5563; font-weight: 500;">
                            ${item.serialNumber}
                        </div>
                        <div style="font-size: 8px; line-height: 1.2; margin-top: 1mm; color: #6b7280;">
                            ${item.category}
                        </div>
                    `;

          tempContainer.appendChild(card);
        });

        document.body.appendChild(tempContainer);

        // Wait for images to load
        await new Promise((resolve) => setTimeout(resolve, 800));

        const canvas = await html2canvas(tempContainer, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
        });

        document.body.removeChild(tempContainer);

        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210;
        const imgHeight = 297;

        if (page > 1) {
          pdf.addPage();
        }

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      }

      // Generate filename with current date
      const date = new Date().toISOString().split("T")[0];
      const filename = `barcodes_${date}.pdf`;

      // Save PDF
      pdf.save(filename);

      // Show success message
      setShowAlert(true);
      setShowMessage(
        `Successfully generated PDF with ${filteredItems.length} barcode${filteredItems.length !== 1 ? "s" : ""}`,
      );
      setTimeout(() => {
        setShowAlert(false);
        setShowMessage("");
      }, 3000);

      // Close modal
      setShowPrintBarcodeModal(false);
    } catch (error) {
      console.error("PDF generation error:", error);
      setShowAlert(true);
      setShowMessage(
        `PDF generation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setTimeout(() => {
        setShowAlert(false);
        setShowMessage("");
      }, 3000);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isPending) {
    return <InventoryListSkeletonLoader />;
  }

  return (
    <div className="flex flex-col w-full antialiased bg-gradient-to-br animate-fadeIn inventory-list-container min-h-svh from-[#f8fafc] via-[#eef2ff] to-[#e0e7ff]">
      <Activity mode={ShowAlert ? "visible" : "hidden"}>
        <SuccessAlert message={ShowMessage} />
      </Activity>

      <Activity mode={showAlertSuccess ? "visible" : "hidden"}>
        <SuccessAlert message="Excel imported successfully!" />
      </Activity>

      <Activity mode={showAlertFailed ? "visible" : "hidden"}>
        {showAlertFailed && (
          <ErrorAlert message="Import failed. Please check your file format and try again." />
        )}
      </Activity>

      {/* Hidden file input for import */}
      <input
        type="file"
        accept=".xlsx,.xls"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <header className="flex sticky top-0 z-30 flex-col items-center px-8 pt-8 pb-6 border-b border-slate-200/80 shadow-sm inventory-header bg-white/80 backdrop-blur-md">
        <h1 className="mb-2 text-5xl mt-10 lg:mt-0 md:mt-0 font-extrabold tracking-tight text-slate-800">
          Inventory List
        </h1>
        <p className="max-w-2xl text-base font-medium text-center md:text-lg text-slate-500">
          Overview of assets and availability. Track counts by category, staff
          status, and items currently borrowed.
        </p>
      </header>

      <div className="overflow-auto h-full">
        {/* Inventory Stats with Filter */}
        <section className="py-6 px-8 mx-auto w-full">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full">
            {/* Categories - Scrollable */}
            <div className="flex-1 overflow-x-auto scrollbar-none">
              <div className="flex flex-row gap-3 pb-2">
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
            </div>

            {/* Filters - Fixed on Right */}
            <div className="flex-shrink-0">
              <SelectItemFilters
                onStatusChange={handleStatusChange}
                onConditionChange={handleConditionChange}
                selectedStatus={selectedStatus}
                selectedCondition={selectedCondition}
                statusCounts={statusCounts}
              />
            </div>
          </div>
        </section>

        {/* Inventory Table Section */}
        <section className="px-8">
          <div className="overflow-x-auto p-4 rounded-2xl border border-slate-200/90 shadow-lg bg-white/95 h-[60vh]">
            {/* Unified Top Controls Row */}
            <div className="w-full flex items-center justify-between mb-6 flex-wrap gap-3">
              {/* LEFT: New Item + More Menu */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setIsAddItemFormOpen(true)}
                  name={"New Item"}
                />
                {/* More Menu Button */}
                <div className="relative" ref={moreMenuRef}>
                  <button
                    onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                    className={`flex items-center justify-center h-11.5 w-12 rounded-lg transition-all duration-200 border cursor-pointer ${isMoreMenuOpen
                      ? "bg-indigo-50 border-indigo-300 text-indigo-600 shadow-md"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm active:scale-95"
                      }`}
                    aria-label="More options"
                    title="More options"
                  >
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${isMoreMenuOpen ? "rotate-90" : ""
                        }`}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <circle cx="6" cy="12" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="18" cy="12" r="2" />
                    </svg>
                  </button>
                  {isMoreMenuOpen && (
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50 z-50 animate-slideIn">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            fileInputRef.current?.click();
                            setIsMoreMenuOpen(false);
                          }}
                          disabled={isImporting}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed first:rounded-t-xl"
                        >
                          {isImporting ? (
                            <>
                              <svg
                                className="w-4 h-4 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Importing...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              Import Items
                            </>
                          )}
                        </button>
                        <div className="border-t border-slate-100 my-1"></div>
                        <button
                          onClick={() => {
                            setShowPrintBarcodeModal(true);
                            setIsMoreMenuOpen(false);
                          }}
                          disabled={filteredItems.length === 0}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                            />
                          </svg>
                          Print Barcodes{" "}
                          {filteredItems.length > 0 &&
                            `(${filteredItems.length})`}
                        </button>
                        <button
                          onClick={() => {
                            handleExportItems();
                            setIsMoreMenuOpen(false);
                          }}
                          disabled={isExporting || filteredItems.length === 0}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isExporting ? (
                            <>
                              <svg
                                className="w-4 h-4 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Exporting...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              Export Items{" "}
                              {filteredItems.length > 0 &&
                                `(${filteredItems.length})`}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Pagination + Search with gap */}
              <div className="flex flex-col md:flex-row lg:flex-row lg:items-center gap-2">
                {filteredItems.length > 0 && (
                  <div className="lg:order-1 md:order-1 order-2">
                    <Pagination
                      totalPages={totalPages}
                      currentPage={currentPage}
                      handlePageChange={handlePageChange}
                      selectedCategory={selectedCategory}
                      handleShowAll={handleShowAll}
                    />
                  </div>
                )}
                <div className="order-1 lg:order-2 flex-shrink-0">
                  <SearchBar
                    onChangeValue={(value) => setSearchItem(value)}
                    name={"search"}
                    placeholder={"Search your items..."}
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-100 h-[46vh] bg-white">
              {isError ? (
                <ErrorTable />
              ) : (
                <InventoryTable
                  item={paginatedData}
                  ShowAlert={ShowAlert}
                  ShowMessage={ShowMessage}
                  ShowAlertSuccess={showAlertSuccess}
                  ShowAlertFailed={showAlertFailed}
                />
              )}
              {paginatedData.length === 0 && (
                <div className="flex justify-center items-center mt-16 w-full">
                  <div className="max-w-md text-center">
                    <div className="mb-3 text-5xl text-slate-300">📦</div>
                    <h3 className="mb-2 text-2xl font-semibold text-slate-800">
                      No items found
                    </h3>
                    <p className="text-base text-slate-500">
                      Try adjusting your search or filters. New items will
                      appear here once created.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <Activity mode={isAddItemFormOpen ? "visible" : "hidden"}>
        <AddItemForm onClose={() => setIsAddItemFormOpen(false)} />
      </Activity>

      {/* Print Barcode Modal */}
      <Activity mode={showPrintBarcodeModal ? "visible" : "hidden"}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-300/30 w-[95vw] h-[95vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Generate Barcode PDF
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {filteredItems.length} item
                  {filteredItems.length !== 1 ? "s" : ""} ready to export
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPrintBarcodeModal(false);
                  setPrintCurrentPage(1);
                }}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Print Preview Area */}
            <div className="flex-1 overflow-auto p-6 bg-slate-50/80">
              <div
                id="barcode-print-area"
                className="bg-white p-6 mx-auto max-w-[210mm] min-h-[297mm] rounded-lg border border-slate-200 shadow-inner"
              >
                <div className="grid grid-cols-3 gap-3">
                  {filteredItems
                    .slice(
                      (printCurrentPage - 1) * itemsPerPrintPage,
                      printCurrentPage * itemsPerPrintPage,
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        className="border border-slate-200 rounded-lg p-2 flex flex-col items-center text-center break-inside-avoid bg-white"
                      >
                        <div className="text-[11px] font-semibold text-slate-800 mb-1.5 line-clamp-2 w-full h-8 flex items-center justify-center">
                          {item.itemName}
                        </div>
                        <div className="w-full flex items-center justify-center bg-white">
                          <img
                            src={item.barcodeImage || box}
                            alt={item.serialNumber}
                            className="max-w-full h-16 object-contain"
                          />
                        </div>
                        <div className="text-[9px] text-slate-600 mt-1.5 font-medium">
                          {item.serialNumber}
                        </div>
                        <div className="text-[8px] text-slate-500 mt-0.5">
                          {item.category}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-4">
                {/* Pagination for print pages */}
                {Math.ceil(filteredItems.length / itemsPerPrintPage) > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setPrintCurrentPage(Math.max(1, printCurrentPage - 1))
                      }
                      disabled={printCurrentPage === 1}
                      className="px-3 py-1 text-sm border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-slate-600">
                      Page {printCurrentPage} of{" "}
                      {Math.ceil(filteredItems.length / itemsPerPrintPage)}
                    </span>
                    <button
                      onClick={() =>
                        setPrintCurrentPage(
                          Math.min(
                            Math.ceil(filteredItems.length / itemsPerPrintPage),
                            printCurrentPage + 1,
                          ),
                        )
                      }
                      disabled={
                        printCurrentPage ===
                        Math.ceil(filteredItems.length / itemsPerPrintPage)
                      }
                      className="px-3 py-1 text-sm border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPrintBarcodeModal(false);
                    setPrintCurrentPage(1);
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPDF}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {isGeneratingPDF ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Activity>
    </div>
  );
}
