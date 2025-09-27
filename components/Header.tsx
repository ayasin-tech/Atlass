import React from 'react';
import { DownloadIcon } from '../constants';
import { UnitPlan } from '../data';
import { PlanSelector } from './PlanSelector';

const TeachForQatarLogo: React.FC = () => (
    <div className="flex items-center gap-2">
        <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 0C44.77 0 0 44.77 0 100C0 155.23 44.77 200 100 200C155.23 200 200 155.23 200 100C200 44.77 155.23 0 100 0ZM136.67 145.83H112.5V112.5H87.5V145.83H63.33V54.17H136.67V145.83Z" fill="#A71930"/>
        </svg>
        <div className="text-left">
            <span className="text-xs font-bold text-gray-700">Teach for Qatar</span>
            <span className="block text-xs text-gray-500">علم لأجل قطر</span>
        </div>
    </div>
);


const AtlasLogo: React.FC = () => (
    <div className="flex items-center gap-2">
         <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="font-bold text-xl text-amber-600">Atlas</span>
    </div>
);

interface HeaderProps {
    plans: UnitPlan[];
    selectedPlanId: string | null;
    onSelectPlan: (id: string) => void;
    onDownload: () => void;
}

export const Header: React.FC<HeaderProps> = ({ plans, selectedPlanId, onSelectPlan, onDownload }) => {
  
  const selectedPlan = plans.find(p => p.id === selectedPlanId);
  
  return (
    <header className="border-b pb-6">
       <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
            <TeachForQatarLogo />
        </div>
        <div className="flex-1 text-center">
             <span className="text-sm text-gray-500">Unit Plan</span>
        </div>
        <div className="flex-1 flex justify-end">
            <AtlasLogo />
        </div>
      </div>

      <div className="text-center mt-6 relative">
        <div className="absolute top-0 left-0 -mt-2">
            {plans.length > 0 && (
                <PlanSelector plans={plans} selectedPlanId={selectedPlanId} onSelectPlan={onSelectPlan} />
            )}
        </div>
        <h1 className="text-4xl font-bold text-gray-800">Design Thinking Process</h1>
        <p className="text-md text-gray-600 mt-2">TFQ Fellows / Cohort 2023 / Training & Support</p>
        <p className="text-sm text-gray-500 mt-1">
          Week 6 | 24 Curriculum Developers | Last Updated: Jul 29, 2024 by {selectedPlan?.data.facilitator || '...'}
        </p>
        <button 
            onClick={onDownload}
            className="absolute top-0 right-0 -mt-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold py-2 px-4 rounded-lg shadow-sm flex items-center gap-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Download all unit plans as a single CSV file"
            disabled={plans.length === 0}
            >
            <DownloadIcon />
            Download All as CSV
        </button>
      </div>
    </header>
  );
};