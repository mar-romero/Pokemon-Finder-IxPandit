import { HabitatName } from '@/types/pokemon';
import React, { memo } from 'react';

interface ResultsSummaryProps {
  totalResults: number;
  searchQuery?: string;
  selectedHabitat?: HabitatName | null;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ 
  totalResults, 
  searchQuery,
  selectedHabitat 
}) => {
  return (
    <div className="text-gray-600 mb-4">
      {totalResults > 0 ? (
        <p>
          Found {totalResults} Pokemon
          {searchQuery && ` matching "${searchQuery}"`}
          {selectedHabitat && ` in ${selectedHabitat.replace('-', ' ')} habitat`}
        </p>
      ) : (
        <p>No Pokemon found{searchQuery && ` matching "${searchQuery}"`}</p>
      )}
    </div>
  );
};

export default memo(ResultsSummary);