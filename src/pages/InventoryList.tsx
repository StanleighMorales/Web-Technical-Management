import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import AddItemForm from "../components/AddItem";
import Button from "../components/Button";
import SearchBar from "../components/SearchBar";
import InventoryListSkeletonLoader from "../loader/InventoryListSkeletonLoader";
import box from "../assets/box.webp"
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
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";


export default function InventoryList() {
    const [ShowAlert, setShowAlert] = useState<boolean>(false);
    const [ShowMessage, setShowMessage] = useState<string>("");
    const [isAddItemFormOpen, setIsAddItemFormOpen] = useState(false);
    const [searchItem, setSearchItem] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;
    const [items, setItems] = useState<TItemList[]>([]);

    // Missing state variables and refs
    const [showAlertSuccess, setShowAlertSuccess] = useState<boolean>(false);
    const [showAlertFailed, setShowAlertFailed] = useState<boolean>(false);
    const [isImporting, setIsImporting] = useState<boolean>(false);
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
    const [showPrintBarcodeModal, setShowPrintBarcodeModal] = useState<boolean>(false);
    const [printCurrentPage, setPrintCurrentPage] = useState<number>(1);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
    const itemsPerPrintPage = 15; // Items per print page (3x5 grid for A4)
    const fileInputRef = useRef<HTMLInputElement>(null);
    const moreMenuRef = useRef<HTMLDivElement>(null);
    const printAreaRef = useRef<HTMLDivElement>(null);

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
            setShowAlertFailed(true);
            setTimeout(() => {
                setShowAlertFailed(false);
            }, 3000);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setShowAlertFailed(true);
            setTimeout(() => {
                setShowAlertFailed(false);
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

    // Handle PDF generation
    const handleGeneratePDF = async () => {
        if (filteredItems.length === 0) return;

        setIsGeneratingPDF(true);

        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const totalPages = Math.ceil(filteredItems.length / itemsPerPrintPage);

            for (let page = 1; page <= totalPages; page++) {
                const startIdx = (page - 1) * itemsPerPrintPage;
                const endIdx = Math.min(startIdx + itemsPerPrintPage, filteredItems.length);
                const pageItems = filteredItems.slice(startIdx, endIdx);

                // Create a temporary container with inline styles (no Tailwind)
                const tempContainer = document.createElement('div');
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
                    const card = document.createElement('div');
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
                await new Promise(resolve => setTimeout(resolve, 800));

                const canvas = await html2canvas(tempContainer, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                });

                document.body.removeChild(tempContainer);

                const imgData = canvas.toDataURL('image/png');
                const imgWidth = 210;
                const imgHeight = 297;

                if (page > 1) {
                    pdf.addPage();
                }

                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            }

            // Generate filename with current date
            const date = new Date().toISOString().split('T')[0];
            const filename = `barcodes_${date}.pdf`;

            // Save PDF
            pdf.save(filename);

            // Show success message
            setShowAlert(true);
            setShowMessage(`Successfully generated PDF with ${filteredItems.length} barcode${filteredItems.length !== 1 ? 's' : ''}`);
            setTimeout(() => {
                setShowAlert(false);
                setShowMessage("");
            }, 3000);

            // Close modal
            setShowPrintBarcodeModal(false);
        } catch (error) {
            console.error('PDF generation error:', error);
            setShowAlert(true);
            setShowMessage(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
        <div className="flex flex-col w-full antialiased bg-linear-to-br animate-fadeIn inventory-list-container min-h-svh from-[#f8fafc] via-[#e8eef7] to-[#dbeafe]">
            {ShowAlert && <SuccessAlert message={ShowMessage} />}
            {showAlertSuccess && <SuccessAlert message="Excel imported successfully!" />}
            {showAlertFailed && <ErrorAlert message="Import failed. Please check your file format and try again." />}

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
            </header>

            <div className="overflow-auto h-full">
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
                                        className={`flex items-center justify-center h-11.5 w-12 text-blue-600 bg-white rounded-lg transition-all duration-200 border border-gray-200 hover:shadow-sm hover:scale-100 active:scale-95 cursor-pointer ${isMoreMenuOpen ? 'bg-blue-50 border-blue-300 shadow-md' : 'hover:bg-gray-100'
                                            }`}
                                        aria-label="More options"
                                        title="More options"
                                    >
                                        <svg
                                            className={`w-5 h-5 transition-transform duration-300 ${isMoreMenuOpen ? 'rotate-90' : ''
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
                                        <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-blue-500 ring-opacity-5 z-50 animate-slideIn">
                                            <div className="py-1">
                                                <button
                                                    onClick={() => {
                                                        fileInputRef.current?.click();
                                                        setIsMoreMenuOpen(false);
                                                    }}
                                                    disabled={isImporting}
                                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isImporting ? (
                                                        <>
                                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Importing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                            </svg>
                                                            Import Items
                                                        </>
                                                    )}
                                                </button>
                                                <div className="border-t border-gray-100 my-1"></div>
                                                <button
                                                    onClick={() => {
                                                        setShowPrintBarcodeModal(true);
                                                        setIsMoreMenuOpen(false);
                                                    }}
                                                    disabled={filteredItems.length === 0}
                                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                                    </svg>
                                                    Print Barcodes {filteredItems.length > 0 && `(${filteredItems.length})`}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleExportItems();
                                                        setIsMoreMenuOpen(false);
                                                    }}
                                                    disabled={isExporting || filteredItems.length === 0}
                                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isExporting ? (
                                                        <>
                                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Exporting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            Export Items {filteredItems.length > 0 && `(${filteredItems.length})`}
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT: Pagination + Search with gap */}
                            <div className="flex items-center gap-2">
                                {filteredItems.length > 0 && (
                                    <Pagination
                                        totalPages={totalPages}
                                        currentPage={currentPage}
                                        handlePageChange={handlePageChange}
                                        selectedCategory={selectedCategory}
                                        handleShowAll={handleShowAll}
                                    />
                                )}
                                <div className="flex-shrink-0">
                                    <SearchBar
                                        onChangeValue={(value) => setSearchItem(value)}
                                        name={"search"}
                                        placeholder={"Search your items..."}
                                    />
                                </div>
                            </div>
                        </div>

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
                                            < InventoryTable
                                                key={item.id}
                                                id={item.id}
                                                createdAt={item.createdAt}
                                                ItemName={item.itemName}
                                                SerialNumber={item.serialNumber}
                                                Image={item.image || box}
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
            </div>

            {isAddItemFormOpen && (
                <AddItemForm onClose={() => setIsAddItemFormOpen(false)} />
            )}

            {/* Print Barcode Modal */}
            {showPrintBarcodeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-[95vw] h-[95vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Generate Barcode PDF</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} ready to export
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowPrintBarcodeModal(false);
                                    setPrintCurrentPage(1);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Print Preview Area */}
                        <div className="flex-1 overflow-auto p-6 bg-gray-50">
                            <div ref={printAreaRef} id="barcode-print-area" className="bg-white p-6 mx-auto max-w-[210mm] min-h-[297mm] shadow-lg">
                                <div className="grid grid-cols-3 gap-3">
                                    {filteredItems
                                        .slice(
                                            (printCurrentPage - 1) * itemsPerPrintPage,
                                            printCurrentPage * itemsPerPrintPage
                                        )
                                        .map((item) => (
                                            <div key={item.id} className="border border-gray-300 rounded-lg p-2 flex flex-col items-center text-center break-inside-avoid bg-white">
                                                <div className="text-[11px] font-semibold text-gray-800 mb-1.5 line-clamp-2 w-full h-8 flex items-center justify-center">
                                                    {item.itemName}
                                                </div>
                                                <div className="w-full flex items-center justify-center bg-white">
                                                    <img
                                                        src={item.barcodeImage || box}
                                                        alt={item.serialNumber}
                                                        className="max-w-full h-16 object-contain"
                                                    />
                                                </div>
                                                <div className="text-[9px] text-gray-600 mt-1.5 font-medium">
                                                    {item.serialNumber}
                                                </div>
                                                <div className="text-[8px] text-gray-500 mt-0.5">
                                                    {item.category}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
                            <div className="flex items-center gap-4">
                                {/* Pagination for print pages */}
                                {Math.ceil(filteredItems.length / itemsPerPrintPage) > 1 && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setPrintCurrentPage(Math.max(1, printCurrentPage - 1))}
                                            disabled={printCurrentPage === 1}
                                            className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-sm text-gray-600">
                                            Page {printCurrentPage} of {Math.ceil(filteredItems.length / itemsPerPrintPage)}
                                        </span>
                                        <button
                                            onClick={() => setPrintCurrentPage(Math.min(Math.ceil(filteredItems.length / itemsPerPrintPage), printCurrentPage + 1))}
                                            disabled={printCurrentPage === Math.ceil(filteredItems.length / itemsPerPrintPage)}
                                            className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleGeneratePDF}
                                    disabled={isGeneratingPDF}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isGeneratingPDF ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Generating PDF...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Download PDF
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
