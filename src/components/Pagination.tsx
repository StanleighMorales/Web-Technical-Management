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
  return (
    <div className="flex flex-row gap-2 items-center md:ml-12 md:-mt-6 lg:ml-12 lg:-mt-8">
      {/* Reset back to all items Button */}
      {selectedCategory && selectedCategory !== "" && (
        <button
          className="py-3 px-4 font-semibold rounded disabled:opacity-50 bg-gray-200 text-[#2563eb]"
          onClick={handleShowAll}
        >
          All
        </button>
      )}
      {/* Decreament the Page */}
      <button
        className="py-3 px-4 font-semibold rounded disabled:opacity-50 bg-gray-200 text-[#2563eb]"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {/* Button Pagination this will work if the item greater than 5*/}
      {[...Array(totalPages)].map((_, idx) => (
        <button
          key={idx + 1}
          className={`px-4 py-3 rounded font-semibold ${currentPage === idx + 1
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
        className="py-3 px-4 font-semibold rounded disabled:opacity-50 bg-gray-200 text-[#2563eb]"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}
