import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  isLoading = false
}) => {
  if (totalPages <= 1) return null;
  
  const renderPageButtons = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }
    
    for (const i of range) {
      if (l) {
        if (i - l > 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    
    return rangeWithDots.map((page, index) => {
      if (page === '...') {
        return (
          <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
            ...
          </span>
        );
      }
      
      const pageNumber = page as number;
      return (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          disabled={isLoading || pageNumber === currentPage}
          aria-current={pageNumber === currentPage ? 'page' : undefined}
          aria-label={`Page ${pageNumber}`}
          className={`mx-1 px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            pageNumber === currentPage 
              ? 'bg-blue-600 text-white font-medium' 
              : 'bg-white border border-gray-300 hover:bg-gray-100'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {pageNumber}
        </button>
      );
    });
  };

  return (
    <nav aria-label="Pagination" className="flex flex-wrap justify-center items-center gap-1 mt-6 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        aria-label="Previous page"
        className={`mx-1 px-3 py-1 rounded-md border ${
          currentPage === 1 || isLoading
            ? 'opacity-50 cursor-not-allowed border-gray-200'
            : 'border-gray-300 hover:bg-gray-100'
        }`}
      >
        &larr; Prev
      </button>
      
      {renderPageButtons()}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        aria-label="Next page"
        className={`mx-1 px-3 py-1 rounded-md border ${
          currentPage === totalPages || isLoading
            ? 'opacity-50 cursor-not-allowed border-gray-200'
            : 'border-gray-300 hover:bg-gray-100'
        }`}
      >
        Next &rarr;
      </button>
    </nav>
  );
};

export default Pagination;