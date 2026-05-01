import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
    totalPages: number;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    handlePageChange: (value: number) => void;
};

export default function Pagination({
    totalPages,
    currentPage,
    totalItems,
    itemsPerPage,
    handlePageChange,
}: PaginationProps) {
    const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const rangeEnd = Math.min(currentPage * itemsPerPage, totalItems);

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((page) =>
            page === 1 ||
            page === totalPages ||
            Math.abs(page - currentPage) <= 1,
        )
        .reduce<(number | "…")[]>((acc, page, idx, arr) => {
            if (idx > 0 && (page as number) - (arr[idx - 1] as number) > 1) {
                acc.push("…");
            }
            acc.push(page);
            return acc;
        }, []);

    return (
        <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            <span className="text-slate-500 font-medium">
                Showing{" "}
                <span className="font-bold text-slate-900">
                    {rangeStart}–{rangeEnd}
                </span>
                {" of "}
                <span className="font-bold text-slate-900">{totalItems}</span>
                {" entries"}
            </span>

            {totalPages > 1 && (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl text-slate-500 font-medium hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all disabled:opacity-40 disabled:pointer-events-none"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Prev
                    </button>

                    {pages.map((page, idx) =>
                        page === "…" ? (
                            <span key={`ellipsis-${idx}`} className="px-2 text-slate-400">
                                …
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page as number)}
                                className={`min-w-9 h-9 rounded-xl text-xs font-semibold transition-all ${
                                    currentPage === page
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                        : "text-slate-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200"
                                }`}
                            >
                                {page}
                            </button>
                        ),
                    )}

                    <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl text-slate-500 font-medium hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all disabled:opacity-40 disabled:pointer-events-none"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
