
import React from 'react';

interface SectionCardProps {
  title: string;
  arabicTitle?: string;
  className?: string;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, arabicTitle, className, children }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="flex justify-between items-baseline border-b border-gray-200 pb-3 mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {arabicTitle && <h3 className="text-lg font-semibold text-gray-500" dir="rtl">{arabicTitle}</h3>}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};
