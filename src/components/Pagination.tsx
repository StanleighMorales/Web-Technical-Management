type PaginationProps = {
  totalPages: number;
  currentPage: number;
  handlePageChange: (value: number) => void;
  selectedCategory?: string;
  handleShowAll?: () => void;
};

export default function Pagination({
  totalPages,
  currentPage,
  handlePageChange,
  selectedCategory,
  handleShowAll,
}: PaginationProps) {
  // Check if we're in a compact layout (no negative margins)
  const isCompact = !selectedCategory;

  return (
    <div className={`flex flex-row gap-1 sm:gap-2 items-center ${!isCompact ? 'md:ml-12 md:-mt-6 lg:ml-12 lg:-mt-8' : ''}`}>
      {/* Reset back to all items Button */}
      {selectedCategory && selectedCategory !== "" && (
        <button
          className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold rounded disabled:opacity-50 bg-gray-200 text-[#2563eb]"
          onClick={handleShowAll}
        >
          All
        </button>
      )}
      {/* Decreament the Page */}
      <button
        className="py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm font-semibold rounded disabled:opacity-50 bg-gray-200 text-[#2563eb] whitespace-nowrap"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {/* Button Pagination this will work if the item greater than 5*/}
      {[...Array(totalPages)].map((_, idx) => (
        <button
          key={idx + 1}
          className={`px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm rounded font-semibold min-w-[32px] sm:min-w-[40px] ${currentPage === idx + 1
            ? "bg-[#2563eb] text-white"
            : "bg-gray-200 text-[#2563eb]"
            }`}
          onClick={() => handlePageChange(idx + 1)}
        >
          {idx + 1}
        </button>
      ))}
      {/* Increament the Page */}
      <button
        className="py-2 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm font-semibold rounded disabled:opacity-50 bg-gray-200 text-[#2563eb] whitespace-nowrap"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}
