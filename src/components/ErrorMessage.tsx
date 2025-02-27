import React, { memo } from 'react';

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg" role="alert">
      <p>{message}</p>
    </div>
  );
};

export default memo(ErrorMessage);