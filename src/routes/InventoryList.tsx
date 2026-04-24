import {
  useEffect,
  useMemo,
  useCallback,
  useRef,
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
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";
import SelectItemFilters from "../components/SelectItemFilters";
import { InventoryTable } from "../components/InventoryTable";
import { useAllInventoryItems, useFilteredItems } from "../data/inventory-data";
import { useInventoryListState } from "../states/inventory-list-state";
import { useCommonState } from "../states/index-state";
import {
  Package,
  Upload,
  Download,
  Printer,
  MoreHorizontal,
  X,
  Sparkles,
  // FileDown,
  Loader2,
} from "lucide-react";

export default function InventoryList() {
  const { items, isPending, isError } = useAllInventoryItems();
  const {
    filteredItems,
    setSearchItem,
    selectedCategory,
    setSelectedCategory,
    selectedCondition,
    setSelectedCondition,
    selectedStatus,
    setSelectedStatus,
  } = useFilteredItems();

  const {
    showSuccessAlert,
    setShowSuccessAlert,
    showErrorAlert,
    setShowErrorAlert,
    showSuccessMessage,
    setShowSuccessMessage,
    showErrorMessage,
    setShowErrorMessage,
  } = useCommonState();

  const {
    currentPage,
    setCurrentPage,
    isAddItemFormOpen,
    setIsAddItemFormOpen,
    isImporting,
    isExporting,
    setIsImporting,
    setIsExporting,
    isMoreMenuOpen,
    setIsMoreMenuOpen,
    showPrintBarcodeModal,
    setShowPrintBarcodeModal,
    printCurrentPage,
    setPrintCurrentPage,
    // isGeneratingPDF,
    // setIsGeneratingPDF,
  } = useInventoryListState();

  const itemsPerPage = 10;
  const itemsPerPrintPage = 15;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const statusCounts = useMemo(() => ({
    all: items.length,
    available: items.filter((item) => item.status === "Available").length,
    borrowed: items.filter((item) => item.status === "Borrowed").length,
  }), [items]);

  const { mutate: importItem } = useImportItem();
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const validCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const paginatedData = useMemo(
    () => filteredItems.slice(
      (validCurrentPage - 1) * itemsPerPage,
      validCurrentPage * itemsPerPage,
    ),
    [filteredItems, itemsPerPage, validCurrentPage],
  );

  const handlePageChange = useCallback((page: number) => setCurrentPage(page), []);

  const handleCategoryClick = useCallback((category: string) => {
    setSelectedCategory(selectedCategory === category ? "" : category);
    setCurrentPage(1);
  }, [selectedCategory]);

  const handleShowAll = useCallback(() => {
    setSelectedCategory("");
    setSelectedCondition("");
    setSelectedStatus("");
    setCurrentPage(1);
  }, []);

  const handleConditionChange = useCallback((condition: string) => {
    setSelectedCondition(condition);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    if (showPrintBarcodeModal && items) {
      const maxPage = Math.ceil(filteredItems.length / itemsPerPrintPage);
      if (printCurrentPage > maxPage && maxPage > 0) setPrintCurrentPage(1);
    }
  }, [items, showPrintBarcodeModal, filteredItems.length, printCurrentPage, itemsPerPrintPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!validTypes.includes(file.type)) {
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 3000);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 3000);
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
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3500);
      },
      onError: (error) => {
        setIsImporting(false);
        console.error(error.message);
        setShowErrorAlert(true);
        setTimeout(() => setShowErrorAlert(false), 3500);
      },
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleExportItems = async () => {
    if (filteredItems.length === 0) {
      setShowSuccessAlert(true);
      setShowErrorMessage("No items to export. Please add items to your inventory first.");
      setTimeout(() => { setShowSuccessAlert(false); setShowErrorMessage(""); }, 3000);
      return;
    }

    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const exportData = filteredItems.map((item) => ({
        SerialNumber: item.serialNumber,
        ItemName: item.itemName,
        ItemType: item.itemType,
        ItemMake: item.itemMake,
        ItemModel: item.itemModel || "",
        Description: item.description || "",
        Category: item.category,
        Condition: item.condition,
        Image: "",
        CreatedDate: new Date(item.createdAt).toLocaleDateString(),
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      worksheet["!cols"] = [
        { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
        { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 15 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Items");

      const date = new Date().toISOString().split("T")[0];
      const filename = `inventory_export_${date}.xlsx`;
      XLSX.writeFile(workbook, filename);

      setShowSuccessAlert(true);
      setShowSuccessMessage(`Successfully exported ${exportData.length} item${exportData.length !== 1 ? "s" : ""} to ${filename}`);
      setTimeout(() => { setShowSuccessAlert(false); setShowSuccessMessage(""); }, 3500);
    } catch (error) {
      console.error("Export error:", error);
      setShowSuccessAlert(true);
      setShowSuccessMessage(`Export failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      setTimeout(() => { setShowSuccessAlert(false); setShowSuccessMessage(""); }, 3500);
    } finally {
      setIsExporting(false);
    }
  };

  // const handleGeneratePDF = async () => {
  //   if (filteredItems.length === 0) return;
  //   setIsGeneratingPDF(true);

  //   try {
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const totalPdfPages = Math.ceil(filteredItems.length / itemsPerPrintPage);

  //     for (let page = 1; page <= totalPdfPages; page++) {
  //       const startIdx = (page - 1) * itemsPerPrintPage;
  //       const endIdx = Math.min(startIdx + itemsPerPrintPage, filteredItems.length);
  //       const pageItems = filteredItems.slice(startIdx, endIdx);

  //       const tempContainer = document.createElement("div");
  //       tempContainer.style.cssText = `
  //         width: 210mm; height: 297mm; background: white; padding: 6mm;
  //         display: grid; grid-template-columns: repeat(3, 1fr);
  //         grid-template-rows: repeat(5, 1fr); gap: 4mm;
  //         position: absolute; left: -9999px; top: 0;
  //       `;

  //       pageItems.forEach((item) => {
  //         const card = document.createElement("div");
  //         card.style.cssText = `
  //           border: 1px solid #d1d5db; border-radius: 2mm; padding: 3mm;
  //           background: white; display: flex; flex-direction: column;
  //           align-items: center; justify-content: space-between; text-align: center;
  //         `;
  //         card.innerHTML = `
  //           <div style="font-size:10px;font-weight:600;line-height:1.3;margin-bottom:2mm;color:#1f2937;min-height:8mm;max-height:8mm;overflow:hidden;word-wrap:break-word;display:flex;align-items:center;justify-content:center;">
  //             ${item.itemName}
  //           </div>
  //           <div style="flex:1;width:100%;display:flex;align-items:center;justify-content:center;margin:2mm 0;">
  //             <img src="${item.image || box}" alt="${item.serialNumber}" style="max-width:100%;max-height:30mm;object-fit:contain;" crossorigin="anonymous" />
  //           </div>
  //           <div style="font-size:9px;line-height:1.2;margin-top:1mm;color:#4b5563;font-weight:500;">${item.serialNumber}</div>
  //           <div style="font-size:8px;line-height:1.2;margin-top:1mm;color:#6b7280;">${item.category}</div>
  //         `;
  //         tempContainer.appendChild(card);
  //       });

  //       document.body.appendChild(tempContainer);
  //       await new Promise((resolve) => setTimeout(resolve, 800));

  //       const canvas = await html2canvas(tempContainer, {
  //         scale: 2, useCORS: true, allowTaint: true, logging: false, backgroundColor: "#ffffff",
  //       });

  //       document.body.removeChild(tempContainer);

  //       const imgData = canvas.toDataURL("image/png");
  //       if (page > 1) pdf.addPage();
  //       pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
  //     }

  //     const date = new Date().toISOString().split("T")[0];
  //     pdf.save(`barcodes_${date}.pdf`);

  //     setShowSuccessAlert(true);
  //     setShowSuccessMessage(`Successfully generated PDF with ${filteredItems.length} barcode${filteredItems.length !== 1 ? "s" : ""}`);
  //     setTimeout(() => { setShowSuccessAlert(false); setShowSuccessMessage(""); }, 3000);
  //     setShowPrintBarcodeModal(false);
  //   } catch (error) {
  //     console.error("PDF generation error:", error);
  //     setShowSuccessAlert(true);
  //     setShowSuccessMessage(`PDF generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  //     setTimeout(() => { setShowSuccessAlert(false); setShowSuccessMessage(""); }, 3000);
  //   } finally {
  //     setIsGeneratingPDF(false);
  //   }
  // };

  if (isPending) return <InventoryListSkeletonLoader />;

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

      {/* Alerts */}
      {showSuccessAlert && <SuccessAlert message={showSuccessMessage} />}
      {showErrorAlert && showErrorMessage && (
        <ErrorAlert message="Import failed. Please check your file format and try again." />
      )}

      {/* Hidden file input */}
      <input
        type="file"
        accept=".xlsx,.xls"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="p-6 md:p-8 space-y-6 max-w-[100rem] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Asset management</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
              Inventory List
            </h1>
            <p className="text-slate-500 font-medium text-base max-w-xl leading-relaxed">
              Overview of assets and availability. Track counts by category, condition, and borrow status.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button onClick={() => setIsAddItemFormOpen(true)} name="New Item" />

            {/* More menu */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className={`flex items-center justify-center h-10 w-10 rounded-xl border transition-all duration-200 ${
                  isMoreMenuOpen
                    ? "bg-indigo-50 border-indigo-300 text-indigo-600 shadow-sm"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                }`}
                aria-label="More options"
              >
                <MoreHorizontal className={`h-4.5 w-4.5 transition-transform duration-200 ${isMoreMenuOpen ? "rotate-90" : ""}`} />
              </button>

              {isMoreMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-1.5 space-y-0.5">
                    {/* Import */}
                    <button
                      onClick={() => { fileInputRef.current?.click(); setIsMoreMenuOpen(false); }}
                      disabled={isImporting}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isImporting
                        ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                        : <Upload className="h-4 w-4 text-slate-400" />
                      }
                      <span className="font-medium">{isImporting ? "Importing..." : "Import Items"}</span>
                    </button>

                    <div className="h-px bg-slate-100 mx-1" />

                    {/* Print barcodes */}
                    {/* <button
                      onClick={() => { setShowPrintBarcodeModal(true); setIsMoreMenuOpen(false); }}
                      disabled={filteredItems.length === 0}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Printer className="h-4 w-4 text-slate-400" />
                      <span className="font-medium">
                        Print Barcodes{filteredItems.length > 0 && ` (${filteredItems.length})`}
                      </span>
                    </button> */}

                    {/* Export */}
                    <button
                      onClick={() => { handleExportItems(); setIsMoreMenuOpen(false); }}
                      disabled={isExporting || filteredItems.length === 0}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isExporting
                        ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                        : <Download className="h-4 w-4 text-slate-400" />
                      }
                      <span className="font-medium">
                        {isExporting ? "Exporting..." : `Export Items${filteredItems.length > 0 ? ` (${filteredItems.length})` : ""}`}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category badges + filters row */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 overflow-x-auto scrollbar-none">
            <div className="flex flex-row gap-2.5 pb-1">
              {Array.from(new Set(items.map((item) => item.category))).map((category) => {
                const itemsInCategory = items.filter((item) => item.category === category);
                return (
                  <InventoryBadges
                    key={category}
                    name={category}
                    total={itemsInCategory.length}
                    onClick={() => handleCategoryClick(category)}
                    isSelected={selectedCategory === category}
                  />
                );
              })}
            </div>
          </div>
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

        {/* Table card */}
        <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">

          {/* Table toolbar */}
          <div className="px-6 md:px-8 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Package className="h-4 w-4 text-indigo-500" />
                Items
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
                {selectedCategory && ` in ${selectedCategory}`}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {filteredItems.length > 0 && (
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  handlePageChange={handlePageChange}
                  selectedCategory={selectedCategory}
                  handleShowAll={handleShowAll}
                />
              )}
              <SearchBar
                onChangeValue={(value) => setSearchItem(value)}
                name="search"
                placeholder="Search items..."
              />
            </div>
          </div>

          {/* Table body */}
          <div className="overflow-x-auto">
            <div className="min-h-[55vh] max-h-[55vh] overflow-y-auto">
              {isError ? (
                <ErrorTable />
              ) : paginatedData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center px-8">
                  <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                    <Package className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">No items found</h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                    Try adjusting your search or filters. New items will appear here once created.
                  </p>
                  {(selectedCategory || selectedStatus || selectedCondition) && (
                    <button
                      onClick={handleShowAll}
                      className="mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              ) : (
                <InventoryTable
                  item={paginatedData}
                  ShowAlert={showSuccessAlert}
                  ShowMessage={showSuccessMessage}
                  ShowAlertSuccess={showSuccessAlert}
                  ShowAlertFailed={showErrorAlert}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add item form */}
      {isAddItemFormOpen && (
        <AddItemForm onClose={() => setIsAddItemFormOpen(false)} />
      )}

      {showPrintBarcodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            {/* Modal header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-2">
                  <Printer className="h-3 w-3" />
                  <span>Barcode export</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">Generate Barcode PDF</h2>
                <p className="text-sm text-slate-400 font-medium mt-0.5">
                  {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} ready to export
                </p>
              </div>
              <button
                onClick={() => { setShowPrintBarcodeModal(false); setPrintCurrentPage(1); }}
                className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Preview area */}
            <div className="flex-1 overflow-auto p-6 bg-slate-50/60">
              <div
                id="barcode-print-area"
                className="bg-white p-6 mx-auto max-w-[210mm] min-h-[297mm] rounded-2xl border border-slate-200 shadow-sm"
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
                        className="border border-slate-200 rounded-xl p-3 flex flex-col items-center text-center bg-white"
                      >
                        <div className="text-[11px] font-semibold text-slate-800 mb-1.5 line-clamp-2 w-full h-8 flex items-center justify-center">
                          {item.itemName}
                        </div>
                        <div className="w-full flex items-center justify-center">
                          <img
                            src={item.image || box}
                            alt={item.serialNumber}
                            className="max-w-full h-16 object-contain"
                          />
                        </div>
                        <div className="text-[9px] text-slate-600 mt-1.5 font-medium font-mono">
                          {item.serialNumber}
                        </div>
                        <div className="text-[8px] text-slate-400 mt-0.5">
                          {item.category}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100 bg-slate-50/60">
              {/* Print page pagination */}
              <div>
                {Math.ceil(filteredItems.length / itemsPerPrintPage) > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPrintCurrentPage(Math.max(1, printCurrentPage - 1))}
                      disabled={printCurrentPage === 1}
                      className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-xs text-slate-500 font-medium px-1">
                      Page {printCurrentPage} of {Math.ceil(filteredItems.length / itemsPerPrintPage)}
                    </span>
                    <button
                      onClick={() => setPrintCurrentPage(Math.min(Math.ceil(filteredItems.length / itemsPerPrintPage), printCurrentPage + 1))}
                      disabled={printCurrentPage === Math.ceil(filteredItems.length / itemsPerPrintPage)}
                      className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setShowPrintBarcodeModal(false); setPrintCurrentPage(1); }}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                {/* <button
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPDF}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-200"
                >
                  {isGeneratingPDF
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
                    : <><FileDown className="h-4 w-4" /> Download PDF</>
                  }
                </button> */}
              
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
