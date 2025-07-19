import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const pageNumbers = [];
  const maxPagesToShow = 7;
  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1);
    if (currentPage > 3) {
      pageNumbers.push("...");
    }
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pageNumbers.push(i);
    }
    if (currentPage < totalPages - 2) {
      pageNumbers.push("...");
    }
    pageNumbers.push(totalPages);
  }
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <ChevronLeft size={20} />
      </button>
      {pageNumbers.map((num, i) => (
        <button
          key={i}
          onClick={() => typeof num === "number" && onPageChange(num)}
          disabled={typeof num !== "number"}
          className={`px-4 py-2 rounded-md ${
            currentPage === num
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          {num}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
