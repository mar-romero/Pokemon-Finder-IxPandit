import React, { memo } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}
    </header>
  );
};

export default memo(PageHeader);